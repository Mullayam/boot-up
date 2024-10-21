import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'
import { useFetcher } from '@/hooks/useFetcher'
import { useToast } from '@/hooks/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
const mockData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    url: `https://example${i + 1}.com`
}))

const urlSchema = z.object({
    url: z.string().url({ message: "Invalid URL" })
})

type URLData = z.infer<typeof urlSchema> & { id: number }

export default function Dashboard() {
    const { email } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState<URLData[]>(mockData)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const { toast } = useToast()
    const itemsPerPage = 10
    const totalPages = Math.ceil(data.length / itemsPerPage)

    const form = useForm<URLData>({
        resolver: zodResolver(urlSchema)
    })

    const onDelete = async (id: number) => {
        try {
            const response = await useFetcher(`/api/delete/${id}`, {  method: 'DELETE'})
            const res = await response.json()
            if (!res.success) {

                toast({
                    title: "Error",
                    description: res.data.message,
                    variant: "destructive"
                })
            }
            toast({
                title: "Success",
                description: `URL with ID ${id} has been removed.`,
                variant: "default"
            })
           
            return  setData(data.filter(item => item.id !== id))
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        }

    }

    const onEdit = (id: number) => {
        setEditingId(id)
        const urlToEdit = data.find(item => item.id === id)
        if (urlToEdit) {
            form.setValue('url', urlToEdit.url)
        }
    }

    const onSave = async (id: number) => {
        setIsLoading(true)
        form.handleSubmit((formData) => {
            setData(data.map(item => item.id === id ? { ...item, ...formData } : item))
            setEditingId(null)
            toast({
                title: "URL Updated",
                description: `URL with ID ${id} has been updated.`,
            })
        })()

        try {
            const response = await useFetcher(`/api/update/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: form.getValues('url')
                }),
            })
            const res = await response.json()
            if (!res.success) {
                setIsLoading(false)

                toast({
                    title: "Error",
                    description: res.data.message,
                    variant: "destructive"
                })
            }
            toast({
                title: "Success",
                description: "Your URLs have been collected successfully",
                variant: "default"
            })
            setIsLoading(false)
            return form.reset()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
            setIsLoading(false)

        }

    }

    const onCancel = () => {
        setEditingId(null)
        form.reset()
    }
    const onFetch = async () => {
        try {
            const response = await useFetcher(`/api/fetch/${email}`, {
                method: 'GET',
            })
            const res = await response.json()
            setData(res.result)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        }
    }
    React.useEffect(() => {
        if (email) onFetch()
        else navigate(-1)

    }, [])
    const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="container mx-auto py-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>
                                {editingId === item.id ? (
                                    <form onSubmit={(e) => { e.preventDefault(); onSave(item.id); }}>
                                        <Input
                                            {...form.register('url')}
                                            defaultValue={item.url}
                                        />
                                        {form.formState.errors.url && (
                                            <p className="text-sm text-red-500 mt-1">{form.formState.errors.url.message}</p>
                                        )}
                                    </form>
                                ) : (
                                    item.url
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                {editingId === item.id ? (
                                    <>
                                        <Button variant="ghost" size="sm" onClick={() => onSave(item.id)}>
                                            {!isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}

                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={onCancel}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="ghost" size="sm" onClick={() => onEdit(item.id)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <Button
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
