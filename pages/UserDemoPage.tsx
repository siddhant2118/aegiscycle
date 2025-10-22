
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import RiskGauge from '../components/RiskGauge';
import { Bot, FileWarning, ArrowRight, CheckCircle, Activity, Moon } from '../components/Icons';
import { RiskResult, Plan, Escalation, PlanAction } from '../types';
import { SAMPLE_INTAKE, SAMPLE_MENO, mockRisk, mockPlan, mockEscalation } from '../lib/mock';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../lib/utils';

const ActionItem: React.FC<{ action: PlanAction }> = ({ action }) => {
    const goalMap: { [key: string]: string } = {
        "-10% HOMA-IR": "Improve Insulin Sensitivity",
        "-8% HOMA-IR, -5% TG/HDL": "Improve Insulin & Lipid Balance",
        "Improved body composition": "Enhance Body Composition",
        "-15% HOMA-IR": "Boost Insulin Sensitivity",
        "+5% Sleep Efficiency, -5% hs-CRP": "Improve Sleep & Reduce Inflammation",
        "Variable, monitor closely": "Support Metabolic Health",
        "Maintain/improve T-score": "Strengthen Bones",
        "-15% VMS frequency": "Reduce Hot Flashes",
        "Reduced GSM symptoms": "Improve Pelvic Health",
    };

    return (
        <div className="p-4 border rounded-lg mb-3 bg-background shadow-sm">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-sm pr-2">{action.name}</h4>
                <Badge variant={action.burden === 'Low' ? 'default' : action.burden === 'Medium' ? 'secondary' : 'destructive'} className={cn('text-xs', action.burden === 'Low' ? 'bg-emerald-500' : action.burden === 'Medium' ? 'bg-amber-500' : 'bg-rose-500')}>{action.burden}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{action.rationale}</p>
            <div className="mt-3 text-xs flex items-center text-primary font-medium">
                <CheckCircle className="w-3 h-3 mr-1.5" />
                <span>Goal: {goalMap[action.expected_delta] || action.expected_delta}</span>
            </div>
        </div>
    );
};

const UserDemoPage: React.FC = () => {
    const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [escalation, setEscalation] = useState<Escalation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentSampleType, setCurrentSampleType] = useState<'pcos' | 'meno'>('pcos');
    
    const location = useLocation();
    const { showToast } = useToast();

    const runAnalysis = useCallback((sampleType: 'pcos' | 'meno') => {
        setIsLoading(true);
        setProgress(0);

        const intake = sampleType === 'pcos' ? SAMPLE_INTAKE : SAMPLE_MENO;
        
        const timer = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return Math.min(oldProgress + Math.random() * 40, 100);
            });
        }, 200);

        setTimeout(() => {
            setRiskResult(mockRisk(intake));
            setPlan(mockPlan(intake));
            setEscalation(mockEscalation(intake));
            setIsLoading(false);
            clearInterval(timer);
            showToast(`Switched to ${sampleType === 'pcos' ? 'PCOS/Endo' : 'Menopause'} view.`, 'info');
        }, 1000);

    }, [showToast]);

    useEffect(() => {
        const preset = location.state?.preset === 'meno' ? 'meno' : 'pcos';
        setCurrentSampleType(preset);
        runAnalysis(preset);
    }, [location.state, runAnalysis]);

    const handleSwitchSample = (type: 'pcos' | 'meno') => {
        if (type !== currentSampleType) {
            setCurrentSampleType(type);
            runAnalysis(type);
        }
    };
    
    if (isLoading) {
        return (
            <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
                <Bot className="w-12 h-12 mx-auto text-primary" />
                <h1 className="text-2xl font-bold mt-4">Analyzing Your Health Data...</h1>
                <p className="text-muted-foreground mt-2">Our agent is reviewing your latest inputs to personalize your dashboard.</p>
                <Progress value={progress} className="mt-8" />
            </div>
        );
    }

    const PcosInsights = () => riskResult && (
         <div className="space-y-4">
            <div className="flex justify-around items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <RiskGauge value={riskResult.pcos_risk} label="PCOS Risk" />
                <RiskGauge value={riskResult.endo_risk} label="Endo Risk" />
            </div>
        </div>
    );
    
    const MenoInsights = () => riskResult && (
        <div className="space-y-4">
            <div className="flex justify-around items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <RiskGauge value={riskResult.menopause_transition_risk || 0} label="Transition" size="small" />
                <RiskGauge value={riskResult.bone_risk || 0} label="Bone Risk" size="small" />
                <RiskGauge value={riskResult.vms_burden || 0} label="VMS Burden" size="small" />
            </div>
        </div>
    );

    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Your AegisCycle Dashboard</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">This is a simulated view of your personalized health copilot.</p>
                <div className="flex justify-center gap-2 mt-4">
                    <Button onClick={() => handleSwitchSample('pcos')} variant={currentSampleType === 'pcos' ? 'default' : 'outline'}>PCOS/Endo View</Button>
                    <Button onClick={() => handleSwitchSample('meno')} variant={currentSampleType === 'meno' ? 'default' : 'outline'}>Menopause View</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                 {/* Middle Column: Snapshot */}
                <div className="lg:col-span-2 space-y-6">
                     <Card className="bg-gradient-to-br from-primary/10 to-transparent">
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                            <CardDescription>Here's your insight for today.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center">
                            {currentSampleType === 'pcos' ? 
                                <><Activity className="w-8 h-8 mr-4 text-primary" /><p className="text-sm">Your data shows a slight increase in inflammation. Your plan includes actions like the Mediterranean diet to help manage this.</p></> :
                                <><Moon className="w-8 h-8 mr-4 text-primary" /><p className="text-sm">Your sleep was a bit fragmented last night. Your plan includes cooling strategies and a wind-down routine to help improve sleep quality.</p></>
                            }
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Health Snapshot</CardTitle>
                            <CardDescription>Here's what our agent has identified from your latest data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {currentSampleType === 'pcos' ? <PcosInsights /> : <MenoInsights />}
                             <div className="mt-6">
                                <h4 className="font-semibold mb-3 text-sm">Key Focus Areas:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {riskResult && riskResult.drivers.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Side Column: Plan & Escalation */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Action Plan</CardTitle>
                            <CardDescription>Next review in {plan?.next_review_days} days.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {plan && plan.actions.map((action, i) => <ActionItem key={i} action={action} />)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Clinician Connection</CardTitle></CardHeader>
                        <CardContent>
                           {escalation && (escalation.triggered ? (
                                <Alert variant="destructive">
                                    <FileWarning className="h-4 w-4" />
                                    <AlertTitle>Action Recommended</AlertTitle>
                                    <AlertDescription>
                                        <p className="mb-3">Our agent flagged key data points for your clinician to review. A report has been prepared.</p>
                                        <Button asChild variant="destructive" size="sm" className="w-full">
                                            <a href="/docs/clinician_pack_demo.pdf" download>View Clinician Pack</a>
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert>
                                    <Bot className="h-4 w-4" />
                                    <AlertTitle>All Clear</AlertTitle>
                                    <AlertDescription>Your data is within a healthy range. Your plan is on track!</AlertDescription>
                                </Alert>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
             <div className="text-center mt-12">
                 <Link to="/technical-demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Curious about the data? View the Technical Demo <ArrowRight className="inline w-4 h-4" />
                 </Link>
            </div>
        </div>
    );
};

export default UserDemoPage;
