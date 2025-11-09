
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle } from '../components/Icons';

const PricingPage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Pricing Plans</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Choose the plan that fits your journey. Simple, transparent pricing to help you take control.
                </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8 items-start">
                {/* Starter Plan */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Starter (B2C)</CardTitle>
                        <CardDescription>For individuals getting started on their health journey.</CardDescription>
                        <div className="pt-4">
                            <span className="text-4xl font-bold">$9</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-3">
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Core Risk Scoring</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Adaptive Lifestyle Plan</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Wearable & Lab Integration</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Basic Progress Tracking</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" disabled>Coming Soon</Button>
                    </CardFooter>
                </Card>

                {/* Coach+ Plan */}
                <Card className="border-primary flex flex-col shadow-lg">
                     <CardHeader>
                        <CardTitle>Coach+</CardTitle>
                        <CardDescription>For coaches and small practices to manage clients.</CardDescription>
                        <div className="pt-4">
                            <span className="text-4xl font-bold">Contact Us</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <ul className="space-y-3">
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> <strong>Everything in Starter, plus:</strong></li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Client Dashboard</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Escalation Notifications</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> White-label Reporting</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" asChild>
                            <a href="mailto:sales@aegiscycle.dev">Contact Sales</a>
                        </Button>
                    </CardFooter>
                </Card>

                {/* SDK Plan */}
                 <Card className="flex flex-col">
                     <CardHeader>
                        <CardTitle>SDK (B2B2C)</CardTitle>
                        <CardDescription>For digital health platforms and providers.</CardDescription>
                        <div className="pt-4">
                            <span className="text-4xl font-bold">Contact Us</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <ul className="space-y-3">
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Headless API Access</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Full Agentic Pipeline</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Custom Guardrails & Triggers</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Dedicated Engineering Support</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" variant="outline" asChild>
                            <a href="mailto:sdk@aegiscycle.dev">Contact Sales</a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PricingPage;
