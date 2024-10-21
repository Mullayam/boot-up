import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Send } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useFetcher } from '@/hooks/useFetcher'


const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    serviceType: z.enum(["API", "REDIS", "PGSQL", "MYSQL", "MONGODB"], {
        required_error: "Please select a service type",
    }),
    interval: z.number().default(30),
    urls: z.array(z.object({ path: z.string().url({ message: "Invalid URL" }) }))
})

type FormValues = z.infer<typeof formSchema> 
export function EnhancedLandingPage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            serviceType: "API",
            interval: 30,
            urls: [ { path: ''} ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "urls",
        rules: {
            required: {
                value: true,
                message: "At least one is required",
            },
            validate: {
                noEmpty: (value) => value.length > 0,
            },
        }
    })


    const onSubmit = async (data: FormValues) => {
        try {
            const response = await useFetcher('/api/collect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
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
                description: "Your URLs have been collected successfully",
                variant: "default"
            })
            return form.reset()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        }
    }





    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-4">Welcome to BootUP</h1>
            <p className="text-xl text-center text-gray-600 mb-8">BootUp is an application that keeps your server running, preventing cold starts and reducing boot times. It ensures consistent uptime and fast execution by maintaining server readiness, optimizing performance for critical services.</p>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Start Collecting URLs</CardTitle>
                    <CardDescription>Enter your email, select a service type, and add as many URLs as you'd like</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="your@email.com" {...field} />
                                        </FormControl>
                                        <FormDescription>We'll use this to save your collection</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="serviceType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a service type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="API">API</SelectItem>
                                                <SelectItem value="REDIS">REDIS</SelectItem>
                                                <SelectItem value="PGSQL">PGSQL</SelectItem>
                                                <SelectItem value="MYSQL">MYSQL</SelectItem>
                                                <SelectItem value="MONGODB">MONGODB</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Choose the type of service you're collecting URLs for</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="interval"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Interval (seconds)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} readOnly />
                                        </FormControl>
                                        <FormDescription>Default interval set to 30 seconds</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {fields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`urls.${index}.path`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{index === 0 ? 'URL' : `URL ${index + 1}`}</FormLabel>
                                            <div className="flex space-x-2">
                                                <FormControl>
                                                    <Input placeholder="https://example.com" {...field} />
                                                </FormControl>
                                                {index > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        className="shrink-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append({ path: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Another URL
                            </Button>

                            <Button type="submit" className="w-full">
                                <Send className="mr-2 h-4 w-4" /> Submit Collection
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Use URL Collector?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Centralized Data</h3>
                        <p className="text-gray-600">Keep all your important URLs in one place, neatly organized and easy to access.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Share Collections</h3>
                        <p className="text-gray-600">Create and share URL collections with friends, family, or colleagues effortlessly.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Access Anywhere</h3>
                        <p className="text-gray-600">Your URL collections are stored securely in the cloud, accessible from any device.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}