
export interface Labs {
    date: string;
    fasting_glucose?: number;
    fasting_insulin?: number;
    ogtt_60_glucose?: number;
    insulin_auc?: number;
    tg?: number;
    hdl?: number;
    total_chol?: number;
    non_hdl?: number;
    hs_crp?: number;
}

export interface Vitals {
    date: string;
    rhr?: number;
    hrv?: number;
    sleep_eff?: number;
    steps?: number;
}

export interface CycleEvent {
    start: string;
    length: number;
    bleed_days: number;
    pain_max?: number;
}

export interface Intake {
    labs: Labs[];
    vitals: Vitals[];
    cycles: CycleEvent[];
    bmi?: number;
    phenotype?: string;
}

export interface RiskResult {
    pcos_risk: number;
    endo_risk: number;
    uncertainty: number;
    drivers: string[];
}

export interface PlanAction {
    name: string;
    burden: 'Low' | 'Medium' | 'High';
    rationale: string;
    expected_delta: string;
}

export interface Plan {
    actions: PlanAction[];
    next_review_days: number;
}

export interface Escalation {
    triggered: boolean;
    reasons: string[];
    pack_url?: string;
}
