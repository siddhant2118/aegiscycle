
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';

const evidenceData = [
    {
        domain: "PCOS & CVD Risk",
        finding: "PCOS is an independent risk factor for cardiovascular disease, with signals for increased composite CVD events and stroke.",
        metric: "↑ Composite CVD, ↑ Stroke Signal",
        why: "Motivates the need for early, proactive metabolic screening beyond just reproductive health concerns."
    },
    {
        domain: "Dietary Patterns",
        finding: "Low-GI, DASH, Mediterranean, and higher-protein diets consistently show improvements in insulin sensitivity and metabolic markers in PCOS populations.",
        metric: "↓ HOMA-IR, ↓ Insulin AUC",
        why: "Forms the basis of our 'planner' agent's primary intervention arms, allowing personalized dietary strategy selection."
    },
    {
        domain: "Time-Restricted Eating",
        finding: "Intermittent fasting (IF) and time-restricted eating (TRE) show promise, but studies are often small and heterogeneous. Effects on reproductive hormones are still debated.",
        metric: "Variable effects on HOMA-IR",
        why: "Included as an optional, opt-in intervention arm with stricter monitoring and guardrails due to the evolving evidence base."
    },
    {
        domain: "Metformin & Inositols",
        finding: "Myo-inositol and D-chiro-inositol have demonstrated effects on insulin sensitivity comparable to metformin in some studies, with a potentially better side-effect profile.",
        metric: "Comparable ↓ HOMA-IR",
        why: "While we don't recommend supplements, this evidence highlights the central role of insulin resistance, reinforcing our focus on lifestyle interventions that target the same pathway."
    },
    {
        domain: "Wearables & AI Gap",
        finding: "While consumer wearables generate vast amounts of longitudinal data, there is a significant gap in translating this data into clinically relevant, personalized interventions for chronic conditions.",
        metric: "Data-rich, insight-poor",
        why: "This is our primary wedge. AegisCycle is designed to bridge this gap, creating a closed-loop system where data continuously informs and refines the user's plan."
    },
];


const EvidencePage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Evidence Base</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                   Key findings from recent literature (2020–2025) that back our agentic design and intervention choices.
                </p>
            </div>

            <div className="mt-12 grid gap-6">
                {evidenceData.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{item.domain}</CardTitle>
                            <CardDescription>{item.finding}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <h4 className="font-semibold text-sm text-muted-foreground">Metric/Effect</h4>
                                <p className="font-mono text-primary">{item.metric}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <h4 className="font-semibold text-sm text-muted-foreground">Why It Matters for AegisCycle</h4>
                                <p>{item.why}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-16">
                <h2 className="text-2xl font-bold">Compact Citations (Placeholder)</h2>
                <Card className="mt-4">
                    <CardContent className="pt-6 text-sm text-muted-foreground">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>A. Smith et al. (2023). "Cardiovascular Risk in Polycystic Ovary Syndrome: A Meta-Analysis." <i>The Lancet Diabetes & Endocrinology</i>.</li>
                            <li>B. Jones et al. (2022). "Dietary Intervention Strategies for Insulin Resistance in PCOS." <i>Journal of Clinical Endocrinology & Metabolism</i>.</li>
                             <li>C. Lee et al. (2024). "Time-Restricted Eating and Hormonal Profiles in Women with PCOS: A Randomized Controlled Trial." <i>Cell Metabolism</i>.</li>
                            <li>D. Patel et al. (2021). "Myo-inositol versus Metformin in the Treatment of PCOS." <i>Human Reproduction Update</i>.</li>
                             <li>E. Williams et al. (2023). "Closing the Insight Gap: A Review of AI Applications for Wearable Health Data." <i>Nature Digital Medicine</i>.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EvidencePage;