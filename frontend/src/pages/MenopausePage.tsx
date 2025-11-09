
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import RiskGauge from '../components/RiskGauge';
import { Button } from '../components/ui/Button';

const Section: React.FC<{title: string, description: string, children: React.ReactNode}> = ({title, description, children}) => (
    <section className="mt-16">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="mt-2 text-muted-foreground max-w-3xl">{description}</p>
        <div className="mt-6">{children}</div>
    </section>
);

const MenopausePage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Menopause & Ovarian Aging</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Navigating the transition with data-driven insights for long-term health.
                </p>
            </div>

            <Section title="Transition Detection" description="Our agent uses STRAW+ criteria signals from your cycle and wearable data to estimate your transition stage, helping you prepare for upcoming changes.">
                <Card>
                    <CardContent className="pt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <h3 className="font-semibold">Cycle Variability</h3>
                            <p className="text-xs text-muted-foreground">Tracking changes in cycle length (e.g., gaps ≥60 days).</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <h3 className="font-semibold">Night Temp Spikes</h3>
                            <p className="text-xs text-muted-foreground">Using wearable data to detect vasomotor symptoms.</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <h3 className="font-semibold">Sleep Fragmentation</h3>
                            <p className="text-xs text-muted-foreground">Monitoring changes in sleep efficiency and restlessness.</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <h3 className="font-semibold">Optional Labs</h3>
                            <p className="text-xs text-muted-foreground">Tracking trends in FSH (↑), Estradiol (↓), and AMH.</p>
                        </div>
                    </CardContent>
                </Card>
            </Section>

            <Section title="Bone Health Preservation" description="Menopause accelerates bone density loss. Our agent plans proactive, evidence-based lifestyle changes to mitigate this risk.">
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader><CardTitle className="text-xl">Resistance Training</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Recommends 2-3 sessions per week, with impact if safe, to stimulate bone remodeling.</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-xl">Protein Intake</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Guides towards ~1.2 g/kg of body weight to support bone matrix and muscle mass.</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-xl">Calcium & Vitamin D</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Provides educational content on dietary sources and supplementation guidelines.</p></CardContent>
                    </Card>
                </div>
                 <p className="text-sm text-muted-foreground mt-4"><strong>Escalation Trigger:</strong> The agent will flag for clinician review if a DEXA scan shows a T-score of ≤ -2.5 (osteoporosis).</p>
            </Section>
            
            <Section title="VMS & Sleep Management" description="Managing vasomotor symptoms (hot flashes, night sweats) and related sleep disruption is key to quality of life.">
                 <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader><CardTitle className="text-xl">Sleep Window</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Applies CBT-I principles to establish a consistent sleep/wake schedule.</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-xl">Cooling Strategies</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Suggests environmental and behavioral changes to manage night sweats.</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-xl">Paced Breathing</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Introduces simple breathing exercises shown to reduce VMS frequency and severity.</p></CardContent>
                    </Card>
                </div>
            </Section>

            <Card className="mt-16 bg-slate-50 dark:bg-slate-900/50">
                <CardHeader>
                    <CardTitle>HRT Navigator (Education Only)</CardTitle>
                    <CardDescription>
                        AegisCycle does <strong>not</strong> provide medical advice or prescriptions. This educational tool helps you understand the conversation to have with your clinician about Hormone Replacement Therapy (HRT).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">The agent can help organize your data to discuss key factors with your doctor, such as your age, years since last period, and risk factors (like cardiovascular history), to determine if you are a candidate for HRT.</p>
                    <Button variant="secondary" className="mt-4">Discuss with Clinician</Button>
                </CardContent>
            </Card>

        </div>
    );
};

export default MenopausePage;
