
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

export const SAMPLE_MENO: Intake = {
    labs: [{
        date: "2024-07-15",
        fsh: 28,
        estradiol: 25,
        amh: 0.4,
    }],
    vitals: [{
        date: "2024-07-15",
        sleep_eff: 0.78,
    }],
    cycles: [{
        start: "2024-05-01",
        length: 65,
        bleed_days: 3,
    }],
    menopause: {
        vms_per_day: 6,
        night_temp_spikes: 3,
        dexas: [{ date: "2024-06-01", t_score_spine: -2.1 }],
        postmenopausal_bleeding: false,
    }
};

const ALL_ACTIONS: PlanAction[] = [
    { name: "Low-GI / DASH meal plan", burden: "Medium", rationale: "Improves glycemic control and insulin sensitivity.", expected_delta: "-10% HOMA-IR" },
    { name: "Mediterranean + lower-carb", burden: "Medium", rationale: "Reduces inflammation and improves lipid profiles.", expected_delta: "-8% HOMA-IR, -5% TG/HDL" },
    { name: "Higher-protein (isocaloric)", burden: "Low", rationale: "Enhances satiety and preserves lean mass during metabolic improvement.", expected_delta: "Improved body composition" },
    { name: "Aerobic 180 min/wk + 2–3× resistance", burden: "High", rationale: "Maximizes insulin sensitivity and cardiovascular health benefits.", expected_delta: "-15% HOMA-IR" },
    { name: "Sleep regularity + wind-down routine", burden: "Low", rationale: "Improves hormonal regulation and reduces cortisol levels.", expected_delta: "+5% Sleep Efficiency, -5% hs-CRP" },
    { name: "Time-restricted eating (8–10h window)", burden: "Medium", rationale: "May improve circadian rhythm and insulin sensitivity. Opt-in.", expected_delta: "Variable, monitor closely" }
];

const ALL_MENO_ACTIONS: PlanAction[] = [
    { name: "Resistance training (2-3x/wk)", burden: "Medium", rationale: "Stimulates bone density and preserves lean muscle mass.", expected_delta: "Maintain/improve T-score" },
    { name: "Increase Protein Intake (~1.2g/kg)", burden: "Low", rationale: "Supports muscle protein synthesis and bone health.", expected_delta: "Improved body composition" },
    { name: "Cooling strategies & paced breathing", burden: "Low", rationale: "Manages vasomotor symptoms (VMS) and improves sleep onset.", expected_delta: "-15% VMS frequency" },
    { name: "Pelvic floor exercise program", burden: "Medium", rationale: "Improves genitourinary symptoms of menopause (GSM) and supports core stability.", expected_delta: "Reduced GSM symptoms" }
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
            const non_hdl = (latestLabs.total_chol - latestLabs.hdl);
            if (non_hdl >= 160) drivers.push(`High Non-HDL Cholesterol (${non_hdl} mg/dL)`);
        }
        if (latestLabs.hs_crp && latestLabs.hs_crp >= 3.0) drivers.push(`Systemic Inflammation (hs-CRP: ${latestLabs.hs_crp} mg/L)`);
    }
    if (latestVitals && latestVitals.sleep_eff && latestVitals.sleep_eff < 0.85) drivers.push(`Poor Sleep Efficiency (${(latestVitals.sleep_eff * 100).toFixed(0)}%)`);
    
    return drivers;
};

const calculateMenopauseDrivers = (intake: Intake): string[] => {
    const drivers: string[] = [];
    if (intake.cycles[0]?.length > 60) drivers.push("Cycle Variability ↑");
    if (intake.menopause?.night_temp_spikes && intake.menopause.night_temp_spikes > 1) drivers.push("Temp Spikes ↑");
    if (intake.vitals[0]?.sleep_eff && intake.vitals[0].sleep_eff < 0.8) drivers.push("Sleep Fragmentation");
    if (intake.menopause?.dexas?.[0]?.t_score_spine && intake.menopause.dexas[0].t_score_spine <= -2.0) drivers.push("Osteopenia/Bone Risk");
    return drivers;
};

export const mockRisk = (intake: Intake): RiskResult => {
    if (intake.menopause) {
        const latestDexa = intake.menopause.dexas?.[0];
        const bone_risk = latestDexa?.t_score_spine ? (Math.abs(latestDexa.t_score_spine) / 2.5) * 0.85 : 0.4;
        const vms_burden = intake.menopause.vms_per_day ? (intake.menopause.vms_per_day / 10) * 0.75 : 0.2;
        const transition_risk = (intake.cycles[0]?.length > 45 ? 0.4 : 0) + (intake.menopause.night_temp_spikes ? 0.3 : 0) + (intake.labs[0]?.fsh && intake.labs[0].fsh > 25 ? 0.25 : 0);

        return {
            pcos_risk: 0,
            endo_risk: 0,
            uncertainty: 0.2,
            drivers: calculateMenopauseDrivers(intake),
            menopause_transition_risk: Math.min(1, transition_risk),
            bone_risk: Math.min(1, bone_risk),
            vms_burden: Math.min(1, vms_burden),
        };
    }

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
    if (intake.menopause) {
        const actions: PlanAction[] = [];
        if (intake.menopause.dexas?.[0]?.t_score_spine && intake.menopause.dexas[0].t_score_spine <= -2.0) {
            actions.push(ALL_MENO_ACTIONS[0], ALL_MENO_ACTIONS[1]);
        }
        if (intake.menopause.vms_per_day && intake.menopause.vms_per_day > 5) {
            actions.push(ALL_MENO_ACTIONS[2]);
        }
        actions.push(ALL_MENO_ACTIONS[3]); // Pelvic floor is always relevant
        return { actions: actions.slice(0, 3), next_review_days: 45 };
    }

    const drivers = calculateDrivers(intake);
    const actions: PlanAction[] = [];

    if (drivers.some(d => d.includes("Insulin Resistance"))) actions.push(ALL_ACTIONS[0]);
    if (drivers.some(d => d.includes("Dyslipidemia"))) actions.push(ALL_ACTIONS[1]);
    if (drivers.some(d => d.includes("Inflammation"))) actions.push(ALL_ACTIONS[3]);
    if (drivers.some(d => d.includes("Sleep"))) actions.push(ALL_ACTIONS[4]);
    if (actions.length === 0) actions.push(ALL_ACTIONS[0], ALL_ACTIONS[3]);

    return { actions: actions.slice(0, 3), next_review_days: 28 };
};

export const mockEscalation = (intake: Intake): Escalation => {
    if (intake.menopause) {
        const reasons: string[] = [];
        if (intake.menopause.postmenopausal_bleeding) reasons.push("Postmenopausal bleeding requires investigation.");
        if (intake.menopause.dexas?.[0]?.t_score_spine && intake.menopause.dexas[0].t_score_spine <= -2.5) reasons.push("DEXA T-score indicates osteoporosis (T ≤ -2.5).");
        if (intake.menopause.vms_per_day && intake.menopause.vms_per_day >= 8) reasons.push("Severe VMS / insomnia impacting quality of life.");
        
        return { triggered: reasons.length > 0, reasons, pack_url: "/docs/clinician_pack_demo.pdf" };
    }

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

    return { triggered: reasons.length > 0, reasons, pack_url: "/docs/clinician_pack_demo.pdf" };
};
