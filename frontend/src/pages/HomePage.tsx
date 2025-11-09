import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ArrowRight, Bot, FileWarning, Shield, Apple } from '../components/Icons';

const PageWrapper = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
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
                    Agentic AI for Reproductive Longevity
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Early detection & adaptive management for PCOS, Endometriosis, and Menopause. It's not a chatbot—it's your lifelong health copilot.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4">
                    <Button asChild size="lg">
                        <Link to="/demo">Try the User Demo</Link>
                    </Button>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                        <Button size="default" variant="outline" disabled title="Coming Soon!">
                            <Apple className="w-5 h-5 mr-2" /> Connect Apple Health
                        </Button>
                         <Button asChild size="default" variant="ghost">
                            <Link to="/technical-demo">See Technical Demo</Link>
                        </Button>
                    </div>
                </div>
            </PageWrapper>
            
            {/* Who is this for? */}
            <div className="bg-slate-50 dark:bg-slate-900/50">
                <PageWrapper>
                    <h2 className="text-3xl font-bold text-center">Proactive, Personalized Care For Your Stage of Life</h2>
                    <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="text-center">
                            <CardHeader>
                                <CardTitle>PCOS & Endometriosis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Go beyond symptom tracking. Our agent identifies underlying metabolic drivers and patterns to build a plan that reduces long-term risk.</p>
                                <Button variant="link" asChild className="mt-4">
                                    <Link to="/pcos-endometriosis">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                             <CardHeader>
                                <CardTitle>Menopause & Perimenopause</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Navigate the transition with clarity. We focus on proactive strategies for bone health, sleep, and managing vasomotor symptoms.</p>
                                 <Button variant="link" asChild className="mt-4">
                                    <Link to="/menopause">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </PageWrapper>
            </div>


            {/* Agentic Loop Section */}
            <PageWrapper>
                <h2 className="text-3xl font-bold text-center">An Agentic AI that Works for You, 24/7</h2>
                <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">AegisCycle's specialized agents continuously ingest, analyze, and act on your health data, creating a dynamic plan that evolves with you to safeguard your long-term reproductive health.</p>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-5 items-center gap-4 md:gap-8 text-center font-semibold text-primary">
                   <div>1. Ingest</div>
                   <ArrowRight className="hidden md:block w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto"/>
                   <div>2. Risk</div>
                   <ArrowRight className="hidden md:block w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto"/>
                   <div>3. Plan</div>
                   <ArrowRight className="hidden md:block w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto"/>
                   <div>4. Coach</div>
                   <ArrowRight className="hidden md:block w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto"/>
                   <div>5. Escalate</div>
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
                 <h2 className="text-3xl font-bold">Invest in Your Reproductive Longevity</h2>
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