
import { Intake, RiskResult, Plan, Escalation, PlanAction } from '../types';

export const SAMPLE_INTAKE: Intake = {
    labs: [{
        date: "2024-07-15",
        fasting_glucose: 99,
        fasting_insulin: 18,
        tg: 180,
        hdl: 45,
        total_chol: 220,
        hs_crp: 3.4
    }],
    vitals: [{
        date: "2024-07-15",
        sleep_eff: 0.82
    }],
    cycles: [{
        start: "2024-06-01",
        length: 45,
        bleed_days: 5,
        pain_max: 7
    }],
    bmi: 28.5
};

const ALL_ACTIONS: PlanAction[] = [
    { name: "Low-GI / DASH meal plan", burden: "Medium", rationale: "Improves glycemic control and insulin sensitivity.", expected_delta: "-10% HOMA-IR" },
    { name: "Mediterranean + lower-carb", burden: "Medium", rationale: "Reduces inflammation and improves lipid profiles.", expected_delta: "-8% HOMA-IR, -5% TG/HDL" },
    { name: "Higher-protein (isocaloric)", burden: "Low", rationale: "Enhances satiety and preserves lean mass during metabolic improvement.", expected_delta: "Improved body composition" },
    { name: "Aerobic 180 min/wk + 2–3× resistance", burden: "High", rationale: "Maximizes insulin sensitivity and cardiovascular health benefits.", expected_delta: "-15% HOMA-IR" },
    { name: "Sleep regularity + wind-down routine", burden: "Low", rationale: "Improves hormonal regulation and reduces cortisol levels.", expected_delta: "+5% Sleep Efficiency, -5% hs-CRP" },
    { name: "Time-restricted eating (8–10h window)", burden: "Medium", rationale: "May improve circadian rhythm and insulin sensitivity. Opt-in.", expected_delta: "Variable, monitor closely" }
];

const calculateDrivers = (intake: Intake): string[] => {
    const drivers: string[] = [];
    const latestLabs = intake.labs[0];
    const latestVitals = intake.vitals[0];

    if (latestLabs) {
        if (latestLabs.fasting_glucose && latestLabs.fasting_insulin) {
            const homa_ir = (latestLabs.fasting_glucose * latestLabs.fasting_insulin) / 405;
            if (homa_ir >= 2.5) drivers.push(`Insulin Resistance (HOMA-IR: ${homa_ir.toFixed(2)})`);
        }
        if (latestLabs.tg && latestLabs.hdl) {
            const tg_hdl = latestLabs.tg / latestLabs.hdl;
            if (tg_hdl >= 3.0) drivers.push(`Dyslipidemia (TG/HDL Ratio: ${tg_hdl.toFixed(2)})`);
        }
        if (latestLabs.total_chol && latestLabs.hdl) {
            const non_hdl = latestLabs.total_chol - latestLabs.hdl;
            if (non_hdl >= 160) drivers.push(`High Non-HDL Cholesterol (${non_hdl} mg/dL)`);
        }
        if (latestLabs.hs_crp && latestLabs.hs_crp >= 3.0) drivers.push(`Systemic Inflammation (hs-CRP: ${latestLabs.hs_crp} mg/L)`);
    }
    if (latestVitals && latestVitals.sleep_eff && latestVitals.sleep_eff < 0.85) drivers.push(`Poor Sleep Efficiency (${(latestVitals.sleep_eff * 100).toFixed(0)}%)`);
    
    return drivers;
};

export const mockRisk = (intake: Intake): RiskResult => {
    const drivers = calculateDrivers(intake);
    const pcos_risk = 0.65 + (drivers.length * 0.05);
    const endo_risk = 0.30 + ((intake.cycles[0]?.pain_max || 0) > 6 ? 0.15 : 0);
    
    const available_inputs = Object.values(intake.labs[0] || {}).filter(v => v !== undefined).length -1
      + Object.values(intake.vitals[0] || {}).filter(v => v !== undefined).length -1;
    const uncertainty = Math.max(0, Math.min(1, 1 - (available_inputs / 5)));

    return {
        pcos_risk: Math.min(0.95, pcos_risk),
        endo_risk: Math.min(0.9, endo_risk),
        uncertainty,
        drivers
    };
};

export const mockPlan = (intake: Intake): Plan => {
    const drivers = calculateDrivers(intake);
    const actions: PlanAction[] = [];

    if (drivers.some(d => d.includes("Insulin Resistance"))) {
        actions.push(ALL_ACTIONS[0]); // Low-GI
    }
    if (drivers.some(d => d.includes("Dyslipidemia"))) {
        actions.push(ALL_ACTIONS[1]); // Mediterranean
    }
    if (drivers.some(d => d.includes("Inflammation"))) {
        actions.push(ALL_ACTIONS[3]); // Exercise
    }
    if (drivers.some(d => d.includes("Sleep"))) {
        actions.push(ALL_ACTIONS[4]); // Sleep
    }

    if (actions.length === 0) {
        actions.push(ALL_ACTIONS[0], ALL_ACTIONS[3]);
    }

    return {
        actions: actions.slice(0, 3),
        next_review_days: 28
    };
};

export const mockEscalation = (intake: Intake): Escalation => {
    const reasons: string[] = [];
    const latestLabs = intake.labs[0];
    const latestCycle = intake.cycles[0];

    if (latestLabs) {
        if (latestLabs.fasting_glucose && latestLabs.fasting_insulin) {
            const homa_ir = (latestLabs.fasting_glucose * latestLabs.fasting_insulin) / 405;
            if (homa_ir >= 3.0) reasons.push(`Severe Insulin Resistance (HOMA-IR ≥ 3.0)`);
        }
        if (latestLabs.total_chol && latestLabs.hdl) {
            const non_hdl = latestLabs.total_chol - latestLabs.hdl;
            if (non_hdl >= 160) reasons.push(`High Atherogenic Risk (non-HDL-C ≥ 160 mg/dL)`);
        }
        if (latestLabs.hs_crp && latestLabs.hs_crp >= 3.0) reasons.push(`High Systemic Inflammation (hs-CRP ≥ 3.0 mg/L)`);
    }
    if (latestCycle && latestCycle.pain_max && latestCycle.pain_max >= 7) {
        reasons.push(`Severe Dysmenorrhea (Pain ≥ 7/10)`);
    }

    if (reasons.length > 0) {
        return {
            triggered: true,
            reasons,
            pack_url: "/docs/clinician_pack_demo.pdf"
        };
    }

    return { triggered: false, reasons: [] };
};
