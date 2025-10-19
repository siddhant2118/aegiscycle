
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Bot, Shield } from '../components/Icons';

const HowItWorksPage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">How AegisCycle Works</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    An inside look at our agentic architecture, designed for safety, autonomy, and clinical relevance.
                </p>
            </div>

            <section className="mt-16">
                <h2 className="text-3xl font-bold text-center">Agentic Architecture</h2>
                <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto">
                    AegisCycle is composed of five specialized agents working in a coordinated pipeline to transform raw data into actionable, personalized insights.
                </p>
                <div className="mt-12 space-y-4">
                  {/* Diagram could be more complex with SVG lines connecting them */}
                  <Card className="bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader>
                      <CardTitle>1. Ingestion Agent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Normalizes and validates incoming data from sources like Oura, Apple Health, and manual CSV uploads. Ensures data quality and consistency before processing.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader>
                      <CardTitle>2. Risk Scoring Agent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Calculates key biomarkers (e.g., HOMA-IR, TG:HDL ratio) and analyzes patterns in cycle data and wearables (HRV, sleep efficiency) to quantify risk drivers for PCOS and Endometriosis.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader>
                      <CardTitle>3. Planner Agent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Functions as a multi-armed bandit, selecting and prioritizing lifestyle interventions (e.g., Low-GI/DASH, Mediterranean diet, exercise protocols) based on the individual's risk drivers and stated preferences.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader>
                      <CardTitle>4. Coach Agent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Determines the optimal cadence and content for nudges and check-ins to support adherence to the generated plan, adjusting based on user engagement and progress.</p>
                    </CardContent>
                  </Card>
                   <Card className="bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader>
                      <CardTitle>5. Clinician Escalation Agent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Monitors key biomarkers against pre-defined clinical red-flag thresholds. If a threshold is crossed, it autonomously compiles a comprehensive data pack for review by a human clinician.</p>
                    </CardContent>
                  </Card>
                </div>
            </section>
            
            <section className="mt-20 grid md:grid-cols-2 gap-12 items-center">
              <div>
                  <h2 className="text-3xl font-bold">Autonomy & Safety</h2>
                   <p className="mt-4 text-muted-foreground">
                    Our system is built on the principle of "autonomy within guardrails."
                    The agent operates independently on a scheduled basis to analyze data and adapt plans, but all actions are constrained by strict, evidence-based rules.
                  </p>
                  <ul className="mt-6 space-y-4 text-muted-foreground">
                    <li className="flex items-start">
                      <Shield className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0"/>
                      <span><strong>Clinical Guardrails:</strong> All recommendations and escalations are based on established clinical guidelines. The system never provides dosing advice or makes a formal diagnosis.</span>
                    </li>
                     <li className="flex items-start">
                      <Shield className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0"/>
                      <span><strong>Scheduled Checks:</strong> The agent runs checks automatically, ensuring continuous monitoring without requiring constant user interaction.</span>
                    </li>
                     <li className="flex items-start">
                      <Shield className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0"/>
                      <span><strong>Audit Trail:</strong> Every decision made by the agent is logged and traceable, providing full transparency for both the user and their clinician.</span>
                    </li>
                  </ul>
              </div>
              <div>
                 <Card className="p-8">
                     <Bot className="w-16 h-16 text-primary mx-auto"/>
                     <h3 className="text-xl font-semibold text-center mt-4">What's NOT in Scope</h3>
                     <p className="text-center text-muted-foreground mt-2">To ensure safety and regulatory compliance, AegisCycle does <strong>not</strong>:</p>
                     <ul className="mt-4 space-y-2 list-disc list-inside text-sm text-muted-foreground">
                        <li>Provide medical diagnoses.</li>
                        <li>Give advice on medication dosage or timing.</li>
                        <li>Replace the role of a qualified healthcare professional.</li>
                        <li>Handle acute medical emergencies.</li>
                     </ul>
                 </Card>
              </div>
            </section>
        </div>
    );
};

export default HowItWorksPage;
