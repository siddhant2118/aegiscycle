
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import RiskGauge from '../components/RiskGauge';
import { Bot, FileWarning } from '../components/Icons';
import { Intake, RiskResult, Plan, Escalation, PlanAction } from '../types';
import { SAMPLE_INTAKE, SAMPLE_MENO, mockRisk, mockPlan, mockEscalation } from '../lib/mock';
import { postJSON, getApiBase } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

const formatJSON = (data: object) => JSON.stringify(data, null, 2);

const TechnicalDemoPage: React.FC = () => {
    const [intakeJson, setIntakeJson] = useState<string>('');
    const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [escalation, setEscalation] = useState<Escalation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMockMode, setIsMockMode] = useState(true);
    const [currentSampleType, setCurrentSampleType] = useState<'pcos' | 'meno' | null>(null);

    const { showToast } = useToast();
    const isApiConfigured = !!getApiBase();
    const location = useLocation();

    const loadPcosSample = () => {
        setIntakeJson(formatJSON(SAMPLE_INTAKE));
        setCurrentSampleType('pcos');
        resetOutputs();
    };

    const loadMenoSample = () => {
        setIntakeJson(formatJSON(SAMPLE_MENO));
        setCurrentSampleType('meno');
        resetOutputs();
    };

    const resetOutputs = () => {
        setRiskResult(null);
        setPlan(null);
        setEscalation(null);
        setError(null);
    };

    useEffect(() => {
        if (!isApiConfigured) setIsMockMode(true);

        const preset = location.state?.preset;
        if (preset === 'meno') {
            loadMenoSample();
        } else {
            loadPcosSample();
        }
    }, [isApiConfigured, location.state]);

    const handleRunAnalysis = async (data?: Intake) => {
        setIsLoading(true);
        setError(null);
        let intakeData: Intake;

        try {
            intakeData = data || JSON.parse(intakeJson);
        } catch (e) {
            setError('Invalid JSON format in intake data.');
            showToast('Invalid JSON format in intake data.', 'error');
            setIsLoading(false);
            return;
        }

        try {
            if (isMockMode) {
                await new Promise(res => setTimeout(res, 500));
                setRiskResult(mockRisk(intakeData));
                setPlan(mockPlan(intakeData));
                setEscalation(mockEscalation(intakeData));
                showToast('Analysis complete (mock mode).', 'success');
            } else {
                const [risk, planRes, escalationResult] = await Promise.all([
                    postJSON<RiskResult>('/risk/score', { intake: intakeData }),
                    postJSON<Plan>('/plan/generate', { intake: intakeData }),
                    postJSON<Escalation>('/escalate/check', { intake: intakeData }),
                ]);
                setRiskResult(risk);
                setPlan(planRes);
                setEscalation(escalationResult);
                showToast('Analysis complete (live API).', 'success');
            }
        } catch (apiError: any) {
            setError(`API Error: ${apiError.message}`);
            showToast(`API Error: ${apiError.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSimulate = async () => {
        showToast('Simulating data for next week...');
        resetOutputs();
        try {
            const currentData: Intake = JSON.parse(intakeJson);
            if(currentSampleType === 'pcos') {
                if(currentData.labs[0].fasting_insulin) currentData.labs[0].fasting_insulin *= (1 + (Math.random() - 0.5) * 0.1);
                if(currentData.labs[0].tg) currentData.labs[0].tg *= (1 + (Math.random() - 0.5) * 0.1);
                if(currentData.vitals[0].sleep_eff) currentData.vitals[0].sleep_eff *= (1 + (Math.random() - 0.5) * 0.05);
            } else if (currentSampleType === 'meno' && currentData.menopause) {
                if(currentData.menopause.vms_per_day) currentData.menopause.vms_per_day += (Math.random() > 0.5 ? 1 : -1);
                if(currentData.menopause.vms_per_day < 0) currentData.menopause.vms_per_day = 0;
            }
            setIntakeJson(formatJSON(currentData));
            await new Promise(res => setTimeout(res, 300));
            handleRunAnalysis(currentData);

        } catch(e) {
            setError('Could not simulate: Invalid JSON.');
            showToast('Could not simulate: Invalid JSON.', 'error');
        }
    }


    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">AegisCycle Technical Demo</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Interact with the agentic pipeline. Load a sample, edit the data, and run the analysis to see the outputs.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Intake Data (JSON)</CardTitle>
                            <CardDescription>Load a sample or provide your own (non-PHI) data in JSON format.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-4">
                                <Button variant="outline" size="sm" onClick={loadPcosSample}>Load Sample (PCOS/Endo)</Button>
                                <Button variant="outline" size="sm" onClick={loadMenoSample}>Load Sample (Menopause)</Button>
                            </div>
                            <Textarea value={intakeJson} onChange={(e) => setIntakeJson(e.target.value)} rows={20} className="font-mono text-xs" />
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>2. Agent Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2 items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Switch id="mock-mode-switch" checked={isMockMode} onCheckedChange={setIsMockMode} disabled={!isApiConfigured} />
                                <label htmlFor="mock-mode-switch" className="text-sm font-medium">Mock Mode</label>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={handleSimulate} disabled={isLoading}>Simulate Next Week</Button>
                                <Button onClick={() => handleRunAnalysis()} disabled={isLoading}>
                                    {isLoading ? 'Analyzing...' : 'Run Analysis'}
                                </Button>
                            </div>
                        </CardContent>
                         {!isApiConfigured && <p className="text-xs text-muted-foreground text-center pb-4">Live API mode disabled. Configure `API_BASE` to enable.</p>}
                    </Card>
                     {error && <Alert variant="destructive" className="mt-4"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                </div>

                {/* Output Column */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle>3. Risk Scoring & Drivers</CardTitle></CardHeader>
                        <CardContent>
                            {!riskResult && <p className="text-sm text-muted-foreground">Run analysis to see risk scores.</p>}
                            {riskResult && currentSampleType === 'pcos' && (
                                <div className="space-y-4">
                                    <div className="flex justify-around items-center"><RiskGauge value={riskResult.pcos_risk} label="PCOS Risk" /><RiskGauge value={riskResult.endo_risk} label="Endo Risk" /></div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Key Drivers Identified:</h4>
                                        <div className="flex flex-wrap gap-2">{riskResult.drivers.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}</div>
                                    </div>
                                </div>
                            )}
                            {riskResult && currentSampleType === 'meno' && (
                                 <div className="space-y-4">
                                    <div className="flex justify-around items-center">
                                        <RiskGauge value={riskResult.menopause_transition_risk || 0} label="Transition" size="small" />
                                        <RiskGauge value={riskResult.bone_risk || 0} label="Bone Risk" size="small" />
                                        <RiskGauge value={riskResult.vms_burden || 0} label="VMS Burden" size="small" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Key Drivers Identified:</h4>
                                        <div className="flex flex-wrap gap-2">{riskResult.drivers.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>4. Personalized Plan</CardTitle></CardHeader>
                        <CardContent>
                            {!plan && <p className="text-sm text-muted-foreground">Run analysis to generate a plan.</p>}
                            {plan && (
                                <div>
                                    <p className="text-sm mb-4">Next review in <strong>{plan.next_review_days} days</strong>.</p>
                                    <div className="space-y-3">
                                        {plan.actions.map((action: PlanAction) => (
                                            <div key={action.name} className="p-3 border rounded-md bg-slate-50 dark:bg-slate-900/50">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="font-semibold">{action.name}</h5>
                                                    <Badge variant={action.burden === 'Low' ? 'default' : action.burden === 'Medium' ? 'secondary' : 'destructive'} className={action.burden === 'Low' ? 'bg-emerald-500' : action.burden === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}>{action.burden} Burden</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{action.rationale}</p>
                                                <p className="text-xs mt-2"><strong>Expected Delta:</strong> <span className="font-mono">{action.expected_delta}</span></p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader><CardTitle>5. Clinician Escalation</CardTitle></CardHeader>
                         <CardContent>
                            {!escalation && <p className="text-sm text-muted-foreground">Run analysis to check for escalation.</p>}
                            {escalation && (escalation.triggered ? (
                                    <Alert variant="destructive">
                                        <FileWarning className="h-4 w-4" />
                                        <AlertTitle>Escalation Triggered!</AlertTitle>
                                        <AlertDescription>
                                            <p>The following thresholds were met:</p>
                                            <ul className="mt-2 list-disc list-inside text-sm">{escalation.reasons.map(r => <li key={r}>{r}</li>)}</ul>
                                             {escalation.pack_url && <a href={escalation.pack_url} className="font-semibold underline mt-3 inline-block" download>Download Clinician Pack</a>}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="flex items-center text-emerald-700 dark:text-emerald-300">
                                        <Bot className="w-5 h-5 mr-2"/><p className="font-medium">No clinical escalation thresholds met.</p>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
             <div className="text-center mt-8 text-sm text-muted-foreground">
                Demo only — not medical advice.
            </div>
        </div>
    );
};

export default TechnicalDemoPage;
