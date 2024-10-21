import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom'; // Use this for React Router
import { useToast } from '@/hooks/use-toast';
 // Adjust the import based on your toast implementation

export function UrlTabs() {
    const [email, setEmail] = useState("");
    const { toast } = useToast();
    const history = useNavigate(); // Use history for redirection

    const validateEmail = (email:string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = () => {
        if (!validateEmail(email)) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
                variant: "destructive", // Customize based on your toast variant
            });
            return;
        }
        // Redirect to /list/{email}
        history(`/list/${email.split("@")[0]}`);
    };

    return (
        <div className="container py-4 w-[400px]">
            <Card>
                <CardHeader>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>
                        Enter your email address to load all your URLs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="current">Enter Your Email Address</Label>
                        <Input
                            id="current"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit}>Next</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
