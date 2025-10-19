import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const teamMembers = [
    { name: "Siddhant Narayan Singh", role: "Computer Engineering at NUS" },
    { name: "Manya Gupta", role: "Electrical Engineering at NUS" },
    { name: "Soham Bhar", role: "Physics at NUS" },
    { name: "Shambhavi Mehra", role: "Biomedical Engineering at NUS" },
    { name: "Sananda Srikanth", role: "Biomedical Engineering at NUS" },
];

const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">About AegisCycle</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Our mission is to empower individuals and clinicians with autonomous, evidence-based tools to proactively manage reproductive and metabolic health.
                </p>
            </div>

            <section className="mt-16">
                <h2 className="text-3xl font-bold text-center">Our Mission</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                    We believe that the future of chronic care management lies in systems that can continuously learn and adapt to an individual's unique physiology. For conditions like PCOS and Endometriosis, which sit at the complex intersection of metabolic, inflammatory, and reproductive health, a static, one-size-fits-all approach is insufficient. AegisCycle was born from the conviction that by safely automating the analysis of longitudinal health data, we can provide a level of personalized, proactive care that was previously impossible. We are not building another wellness app; we are building a clinical-grade copilot to help navigate the complexities of long-term health.
                </p>
            </section>

            <section className="mt-16">
                <h2 className="text-3xl font-bold text-center">Meet the Team</h2>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {teamMembers.map(member => (
                        <Card key={member.name} className="text-center">
                            <CardHeader>
                                <CardTitle>{member.name}</CardTitle>
                                <p className="text-sm text-primary pt-1">{member.role}</p>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

             <section className="mt-20 text-center">
                <h2 className="text-3xl font-bold">Get in Touch</h2>
                <p className="mt-4 text-muted-foreground">
                    Have questions or interested in partnering with us? We'd love to hear from you.
                </p>
                <Button size="lg" className="mt-6" asChild>
                    <a href="mailto:contact@aegiscycle.dev">Contact Us</a>
                </Button>
            </section>
        </div>
    );
};

export default AboutPage;