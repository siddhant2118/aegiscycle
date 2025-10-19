import React, { useState, useEffect } from 'react';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Progress } from '../components/ui/Progress';
import RiskGauge from '../components/RiskGauge';
import { Bot, FileWarning } from '../components/Icons';
import { Intake, RiskResult, Plan, Escalation, PlanAction } from '../types';
import { SAMPLE_INTAKE, mockRisk, mockPlan, mockEscalation } from '../lib/mock';
import { postJSON, getApiBase } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

// A utility to format JSON string
const formatJSON = (data: object) => JSON.stringify(data, null, 2);

const DemoPage: React.FC = () => {
    const [intakeJson, setIntakeJson] = useState<string>(formatJSON(SAMPLE_INTAKE));
    const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [escalation, setEscalation] = useState<Escalation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMockMode, setIsMockMode] = useState(true);

    const { showToast } = useToast();
    const isApiConfigured = !!getApiBase();

    useEffect(() => {
        if (!isApiConfigured) {
            setIsMockMode(true);
        }
    }, [isApiConfigured]);

    const handleRunAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setRiskResult(null);
        setPlan(null);
        setEscalation(null);

        let intakeData: Intake;
        try {
            intakeData = JSON.parse(intakeJson);
        } catch (e) {
            setError('Invalid JSON format in intake data.');
            showToast('Invalid JSON format in intake data.', 'error');
            setIsLoading(false);
            return;
        }

        try {
            if (isMockMode) {
                await new Promise(res => setTimeout(res, 500)); // Simulate network delay
                setRiskResult(mockRisk(intakeData));
                setPlan(mockPlan(intakeData));
                setEscalation(mockEscalation(intakeData));
                showToast('Analysis complete (mock mode).', 'success');
            } else {
                const [risk, plan, escalationResult] = await Promise.all([
                    postJSON<RiskResult>('/risk/score', { intake: intakeData }),
                    postJSON<Plan>('/plan/generate', { intake: intakeData }),
                    postJSON<Escalation>('/escalate/check', { intake: intakeData }),
                ]);
                setRiskResult(risk);
                setPlan(plan);
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

    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">AegisCycle Demo</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Interact with the AegisCycle agentic pipeline. Edit the intake data below and run the analysis to see the risk scoring, planning, and escalation outputs.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Intake Data</CardTitle>
                            <CardDescription>Provide patient data in JSON format. Start with our sample or enter your own (non-PHI) data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={intakeJson}
                                onChange={(e) => setIntakeJson(e.target.value)}
                                rows={20}
                                className="font-mono text-xs"
                                placeholder="Enter Intake JSON here..."
                            />
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="mock-mode-switch"
                                checked={isMockMode}
                                onCheckedChange={setIsMockMode}
                                disabled={!isApiConfigured}
                            />
                            <label htmlFor="mock-mode-switch" className="font-medium">
                                Mock Mode
                            </label>
                        </div>
                        <Button onClick={handleRunAnalysis} disabled={isLoading}>
                            {isLoading ? 'Analyzing...' : 'Run Analysis'}
                        </Button>
                    </div>
                     {!isApiConfigured && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Live API mode is disabled. Configure `API_BASE` in `lib/api.ts` to enable it.
                        </p>
                    )}
                    {isLoading && <Progress className="mt-4 animate-pulse" />}
                     {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Output Column */}
                <div className="space-y-8">
                    {/* Risk Scoring */}
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Risk Scoring & Drivers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!riskResult && !isLoading && <p className="text-sm text-muted-foreground">Run analysis to see risk scores.</p>}
                            {isLoading && <p className="text-sm text-muted-foreground">Calculating...</p>}
                            {riskResult && (
                                <div className="space-y-4">
                                    <div className="flex justify-around items-center">
                                        <RiskGauge value={riskResult.pcos_risk} label="PCOS Risk" />
                                        <RiskGauge value={riskResult.endo_risk} label="Endo Risk" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Key Drivers Identified:</h4>
                                        <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                                            {riskResult.drivers.length > 0 ? riskResult.drivers.map(d => <li key={d}>{d}</li>) : <li>No significant drivers detected.</li>}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Uncertainty Score: <span className="font-mono text-primary">{Math.round(riskResult.uncertainty * 100)}%</span></h4>
                                        <p className="text-xs text-muted-foreground">Reflects confidence based on available data points.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Planning */}
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Personalized Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!plan && !isLoading && <p className="text-sm text-muted-foreground">Run analysis to generate a plan.</p>}
                            {isLoading && <p className="text-sm text-muted-foreground">Generating...</p>}
                            {plan && (
                                <div>
                                    <p className="text-sm mb-4">Next review in <strong>{plan.next_review_days} days</strong>.</p>
                                    <div className="space-y-3">
                                        {plan.actions.map((action: PlanAction) => (
                                            <div key={action.name} className="p-3 border rounded-md">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="font-semibold">{action.name}</h5>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${action.burden === 'Low' ? 'bg-emerald-100 text-emerald-800' : action.burden === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{action.burden} Burden</span>
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

                    {/* Escalation */}
                    <Card>
                         <CardHeader>
                            <CardTitle>4. Clinician Escalation</CardTitle>
                        </CardHeader>
                         <CardContent>
                            {!escalation && !isLoading && <p className="text-sm text-muted-foreground">Run analysis to check for escalation.</p>}
                            {isLoading && <p className="text-sm text-muted-foreground">Checking...</p>}
                            {escalation && (
                                escalation.triggered ? (
                                    <Alert variant="destructive">
                                        <FileWarning className="h-4 w-4" />
                                        <AlertTitle>Escalation Triggered!</AlertTitle>
                                        <AlertDescription>
                                            <p>The following thresholds were met, warranting clinician review:</p>
                                            <ul className="mt-2 list-disc list-inside text-sm">
                                                {escalation.reasons.map(reason => <li key={reason}>{reason}</li>)}
                                            </ul>
                                             {escalation.pack_url && <a href={escalation.pack_url} className="text-destructive-foreground font-semibold underline mt-3 inline-block" download>Download Clinician Pack</a>}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="flex items-center text-emerald-700 dark:text-emerald-300">
                                        <Bot className="w-5 h-5 mr-2"/>
                                        <p className="font-medium">No clinical escalation thresholds met. Plan continues autonomously.</p>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DemoPage;
