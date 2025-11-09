
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { cn } from '../lib/utils';

// Fix: Defined props with a type alias. The original inline type definition may have caused a type inference issue leading to the "missing children" error.
type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors",
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </button>
);

const PcosContent = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold">Understanding PCOS Risk Drivers</h2>
            <p className="mt-2 text-muted-foreground">PCOS is a complex endocrine disorder with a strong metabolic component. Our agent focuses on quantifying and managing these key underlying drivers, which are often overlooked in early stages.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <Card><CardHeader><CardTitle className="text-lg">Insulin Resistance</CardTitle><CardDescription>Measured via HOMA-IR, this is a core driver of hormonal imbalance.</CardDescription></CardHeader></Card>
                <Card><CardHeader><CardTitle className="text-lg">Dyslipidemia</CardTitle><CardDescription>An unhealthy lipid profile (e.g., high TG:HDL ratio) increases long-term cardiovascular risk.</CardDescription></CardHeader></Card>
                <Card><CardHeader><CardTitle className="text-lg">Inflammation</CardTitle><CardDescription>Low-grade chronic inflammation, measured by hs-CRP, contributes to metabolic dysfunction.</CardDescription></CardHeader></Card>
                <Card><CardHeader><CardTitle className="text-lg">Sleep & Stress</CardTitle><CardDescription>Poor sleep efficiency and low HRV from wearables data signal dysregulation of the HPA axis.</CardDescription></CardHeader></Card>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold">Supported Lifestyle Actions</h2>
            <p className="mt-2 text-muted-foreground">The Planner Agent selects from a library of evidence-based interventions tailored to your specific drivers.</p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Low-GI/DASH Meal Plan:</strong> To improve glycemic control.</li>
                <li><strong>Mediterranean + Lower-Carb:</strong> To reduce inflammation and improve lipids.</li>
                <li><strong>Higher-Protein (isocaloric):</strong> To enhance satiety and body composition.</li>
                <li><strong>Structured Exercise:</strong> A mix of aerobic and resistance training to maximize insulin sensitivity.</li>
                <li><strong>Sleep Hygiene:</strong> Regular schedules and wind-down routines to regulate cortisol.</li>
                <li><strong>Time-Restricted Eating (Optional):</strong> An opt-in strategy to improve circadian rhythm.</li>
            </ul>
        </div>
    </div>
);

const EndoContent = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold">Symptom-First Detection Signals</h2>
            <p className="mt-2 text-muted-foreground">Endometriosis diagnosis is notoriously delayed. Our agent focuses on tracking longitudinal symptom patterns that can provide early warning signals for clinician review.</p>
             <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <Card><CardHeader><CardTitle className="text-lg">Pain Patterns</CardTitle><CardDescription>Tracking severity and timing of dysmenorrhea (period pain) and dyspareunia (pain with sex).</CardDescription></CardHeader></Card>
                <Card><CardHeader><CardTitle className="text-lg">Cyclic Symptoms</CardTitle><CardDescription>Logging GI or urinary issues that correlate with the menstrual cycle.</CardDescription></CardHeader></Card>
                <Card><CardHeader><CardTitle className="text-lg">Wearable Data Dips</CardTitle><CardDescription>Identifying significant dips in HRV and sleep efficiency during suspected inflammatory flares.</CardDescription></CardHeader></Card>
                <Card><CardHeader><CardTitle className="text-lg">Flare Timelines</CardTitle><CardDescription>Correlating symptom flare-ups with cycle phases to establish clear patterns.</CardDescription></CardHeader></Card>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold">Supported Management Actions</h2>
            <p className="mt-2 text-muted-foreground">While definitive treatment is clinical, the agent can recommend evidence-based actions to manage symptoms and improve quality of life between appointments.</p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Flare Heat Therapy:</strong> Timely reminders for heat application during high-pain periods.</li>
                <li><strong>Activity Pacing:</strong> Adjusting exercise intensity based on cycle phase and symptoms.</li>
                <li><strong>Sleep Micro-Habits:</strong> Small, actionable steps to protect sleep during periods of high pain.</li>
                <li><strong>Clinician Check-In Prompt:</strong> Automated prompts to seek medical advice for new or worsening symptoms.</li>
            </ul>
            <p className="mt-4 text-sm font-semibold text-amber-600 dark:text-amber-400">Note: A formal diagnosis of Endometriosis requires clinical evaluation, often involving imaging or laparoscopy. AegisCycle serves to organize data and flag patterns for your clinician.</p>
        </div>
    </div>
);


const PcosEndoPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pcos' | 'endo'>('pcos');
    return (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">PCOS & Endometriosis</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Proactive management for two of the most common drivers of subfertility and long-term health risk.
                </p>
            </div>

            <div className="mt-12">
                <div className="border-b mb-8">
                    <TabButton active={activeTab === 'pcos'} onClick={() => setActiveTab('pcos')}>PCOS</TabButton>
                    <TabButton active={activeTab === 'endo'} onClick={() => setActiveTab('endo')}>Endometriosis</TabButton>
                </div>
                <div>
                    {activeTab === 'pcos' ? <PcosContent /> : <EndoContent />}
                </div>
            </div>
        </div>
    );
};

export default PcosEndoPage;
