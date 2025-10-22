
import React from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { FileWarning, CheckCircle } from '../components/Icons';

const CliniciansPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">For Clinicians</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Streamlining your workflow with clear, concise, and clinically relevant data when it matters most.
        </p>
      </div>

      <Card className="mt-12">
        <CardContent className="p-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">The Clinician Pack</h2>
            <p className="mt-2 text-muted-foreground">
              When the AegisCycle agent detects that a patient has crossed a pre-defined clinical threshold, it generates a comprehensive "Clinician Pack." This report is designed to be reviewed in under 60 seconds, providing everything you need to make an informed decision.
            </p>
            <Button className="mt-6" asChild>
                <a href="/docs/clinician_pack_demo.pdf" download>Download Sample Pack</a>
            </Button>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <h3 className="font-semibold">Pack Contents:</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" /><span><strong>Timeline View:</strong> A longitudinal chart showing key biomarkers and their trends over time.</span></li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" /><span><strong>Risk Drivers:</strong> A clear summary of the primary metabolic or inflammatory drivers that triggered the escalation.</span></li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" /><span><strong>Relevant Labs:</strong> The specific lab values (with reference ranges) that crossed thresholds.</span></li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" /><span><strong>Attempted Actions:</strong> A log of the lifestyle interventions the patient has been following, providing context on what has been tried.</span></li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" /><span><strong>Key References:</strong> Links to the clinical guidelines that informed the escalation threshold.</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center">Escalation Triggers</h2>
        <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto">
          Escalations are triggered by conservative, evidence-based thresholds to ensure a high signal-to-noise ratio.
        </p>
        <div className="mt-10 grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">PCOS / Endometriosis Triggers</h3>
                <div className="space-y-3">
                    <div className="flex items-center p-3 border rounded-lg"><FileWarning className="w-5 h-5 mr-3 text-destructive flex-shrink-0"/><div><h4 className="font-semibold text-sm">Severe Insulin Resistance</h4><p className="text-xs text-muted-foreground">HOMA-IR ≥ 3.0</p></div></div>
                    <div className="flex items-center p-3 border rounded-lg"><FileWarning className="w-5 h-5 mr-3 text-destructive flex-shrink-0"/><div><h4 className="font-semibold text-sm">High Atherogenic Risk</h4><p className="text-xs text-muted-foreground">non-HDL Cholesterol ≥ 160 mg/dL</p></div></div>
                    <div className="flex items-center p-3 border rounded-lg"><FileWarning className="w-5 h-5 mr-3 text-destructive flex-shrink-0"/><div><h4 className="font-semibold text-sm">High Systemic Inflammation</h4><p className="text-xs text-muted-foreground">hs-CRP ≥ 3.0 mg/L</p></div></div>
                    <div className="flex items-center p-3 border rounded-lg"><FileWarning className="w-5 h-5 mr-3 text-destructive flex-shrink-0"/><div><h4 className="font-semibold text-sm">Severe Dysmenorrhea</h4><p className="text-xs text-muted-foreground">Pain score ≥ 7/10 across ≥ 2 consecutive cycles</p></div></div>
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-3">Menopause Triggers</h3>
                <div className="space-y-3">
                    <div className="flex items-center p-3 border rounded-lg"><FileWarning className="w-5 h-5 mr-3 text-destructive flex-shrink-0"/><div><h4 className="font-semibold text-sm">Postmenopausal Bleeding</h4><p className="text-xs text-muted-foreground">Any bleeding after 12 months of amenorrhea.</p></div></div>
                    <div className="flex items-center p-3 border rounded-lg"><FileWarning className="w-5 h-5 mr-3 text-destructive flex-shrink-0"/><div><h4 className="font-semibold text-sm">Osteoporosis Indication</h4><p className="text-xs text-muted-foreground">DEXA T-score ≤ -2.5</p></div></div>
                    <div className="flex items-center p-3 border rounded-lg"><FileWarning className="w-5 h-5 mr-3 text-destructive flex-shrink-0"/><div><h4 className="font-semibold text-sm">Severe VMS / Insomnia</h4><p className="text-xs text-muted-foreground">High frequency of vasomotor symptoms impacting quality of life.</p></div></div>
                    <div className="flex items-center p-3 border rounded-lg"><FileWarning className="w-5 h-5 mr-3 text-destructive flex-shrink-0"/><div><h4 className="font-semibold text-sm">Positive Mood Screen</h4><p className="text-xs text-muted-foreground">Indication of significant mood changes warranting review.</p></div></div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default CliniciansPage;