
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Activity, Brain, FileWarning, Heart, Shield, Bot, ArrowRight } from '../components/Icons';

const PageWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 ${className}`}>
        {children}
    </div>
);

const HomePage: React.FC = () => {
    return (
        <div className="bg-background">
            {/* Hero Section */}
            <PageWrapper className="text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-slate-50">
                    Agentic AI for reproductive longevity
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Early detection & adaptive lifestyle planning for PCOS and Endometriosis. Not a chatbot — a closed-loop copilot.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button asChild size="lg">
                        <Link to="/demo">Try the Demo</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link to="/how-it-works">How It Works</Link>
                    </Button>
                </div>
            </PageWrapper>

            {/* Problem Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50">
                <PageWrapper>
                    <h2 className="text-3xl font-bold text-center">A Silent Epidemic, A Systemic Challenge</h2>
                    <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">PCOS and Endometriosis affect 1 in 10 women, driving significant long-term health risks that are often missed until it's too late.</p>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Heart className="h-8 w-8 text-primary mb-2"/>
                                <CardTitle>Underdetected & Undertreated</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">Diagnostic delays average 7-10 years. Early, sub-clinical signs in lab work and wearables data are often overlooked.</CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <Activity className="h-8 w-8 text-primary mb-2"/>
                                <CardTitle>Metabolic & Inflammatory Risk</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">Insulin resistance, dyslipidemia, and chronic inflammation are core drivers, elevating future risk for T2D, CVD, and certain cancers.</CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <FileWarning className="h-8 w-8 text-primary mb-2"/>
                                <CardTitle>Fragmented Data, Actionable Gaps</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">Lab results, cycle tracking, and wearable data live in silos. Patients receive generic advice, not personalized, adaptive plans.</CardContent>
                        </Card>
                    </div>
                </PageWrapper>
            </div>

            {/* Solution Section */}
            <PageWrapper>
                <h2 className="text-3xl font-bold text-center">A Closed-Loop Copilot for Your Health</h2>
                <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">AegisCycle continuously integrates your data to create a dynamic, evidence-based plan that adapts with you.</p>
                <div className="mt-12 grid md:grid-cols-4 items-center gap-4 md:gap-8 text-center">
                    <div className="flex flex-col items-center p-4">
                        <div className="text-4xl font-bold text-primary">1. Ingest</div>
                        <p className="mt-2 text-muted-foreground">Connect labs, wearables, and cycle data.</p>
                    </div>
                     <ArrowRight className="hidden md:block w-12 h-12 text-slate-300 dark:text-slate-700"/>
                    <div className="flex flex-col items-center p-4">
                         <div className="text-4xl font-bold text-primary">2. Risk</div>
                        <p className="mt-2 text-muted-foreground">Quantify risk drivers and uncertainty.</p>
                    </div>
                     <ArrowRight className="hidden md:block w-12 h-12 text-slate-300 dark:text-slate-700"/>
                    <div className="flex flex-col items-center p-4">
                         <div className="text-4xl font-bold text-primary">3. Plan</div>
                        <p className="mt-2 text-muted-foreground">Generate a personalized, adaptive lifestyle plan.</p>
                    </div>
                     <ArrowRight className="hidden md:block w-12 h-12 text-slate-300 dark:text-slate-700"/>
                    <div className="flex flex-col items-center p-4">
                         <div className="text-4xl font-bold text-primary">4. Escalate</div>
                        <p className="mt-2 text-muted-foreground">Flag clinical thresholds for clinician review.</p>
                    </div>
                </div>
            </PageWrapper>

             {/* Value Props Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50">
                <PageWrapper>
                     <div className="grid gap-10 md:grid-cols-3">
                        <div className="text-center">
                           <Shield className="h-10 w-10 text-primary mx-auto mb-4"/>
                           <h3 className="text-xl font-semibold">Evidence-Based</h3>
                           <p className="mt-2 text-muted-foreground">Our risk models and planning interventions are grounded in the latest clinical guidelines and research.</p>
                        </div>
                        <div className="text-center">
                           <Bot className="h-10 w-10 text-primary mx-auto mb-4"/>
                           <h3 className="text-xl font-semibold">Autonomous & Safe</h3>
                           <p className="mt-2 text-muted-foreground">Operates within strict clinical guardrails, with transparent logic and automated checks before escalating to your care team.</p>
                        </div>
                        <div className="text-center">
                           <FileWarning className="h-10 w-10 text-primary mx-auto mb-4"/>
                           <h3 className="text-xl font-semibold">Clinician-Ready</h3>
                           <p className="mt-2 text-muted-foreground">Escalations generate a comprehensive "Clinician Pack" with all relevant data, saving time and focusing appointments.</p>
                        </div>
                    </div>
                </PageWrapper>
            </div>
            
            {/* CTA Band */}
            <PageWrapper className="text-center bg-primary/5 dark:bg-primary/10 rounded-2xl my-16">
                 <h2 className="text-3xl font-bold">Take Control of Your Reproductive Health</h2>
                 <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Explore the agentic AI platform and see how personalized, adaptive planning can make a difference.</p>
                 <div className="mt-8">
                    <Button asChild size="lg">
                        <Link to="/demo">Try the Demo</Link>
                    </Button>
                </div>
            </PageWrapper>
        </div>
    );
};

export default HomePage;
