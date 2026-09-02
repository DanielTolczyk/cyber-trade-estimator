"""The Cybersecurity Trade Project - Grandfathering & Prior Learning Assessment (PLA) Estimator Engine.

Evaluates practitioner credentials, operational runtime hours, military cyber MOS/AFSC credits,
and specialty domain experience against published trade specifications (v1.6.1).
"""

import json
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any


def get_default_spec_path() -> Path:
    return Path(__file__).parent / "data" / "trade_specifications.json"


def load_trade_specifications(path: Optional[Path] = None) -> Dict[str, Any]:
    target = path or get_default_spec_path()
    if target.exists():
        with open(target, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}



@dataclass
class PractitionerProfile:
    cyber_experience_years: float = 0.0
    sysadmin_experience_years: float = 0.0
    has_military_cyber_mos: bool = False
    military_cyber_years: float = 0.0
    military_branch_and_code: str = ""
    certifications: List[str] = field(default_factory=list)
    degrees: List[str] = field(default_factory=list)
    specialty_domains: List[str] = field(default_factory=list)
    has_cve_or_bug_bounties: bool = False
    has_peer_affidavits: bool = False
    has_engineering_artifacts: bool = False
    has_passed_range_exam: bool = False
    has_bootcamp_certificate: bool = False
    is_mid_program_enrolled: bool = False
    has_passed_pre_apprentice_benchmark: bool = False
    track: str = "TRACK_A"


@dataclass
class SpecialtyEndorsementResult:
    code: str
    title: str
    tier: str  # "Tier 1: Discipline" or "Tier 2: Statutory Life-Safety"
    base_adder_min: float
    base_adder_max: float
    is_primary: bool = False
    applied_adder_min: float = 0.0
    applied_adder_max: float = 0.0
    description: str = ""


@dataclass
class TradeStandingResult:
    standing_title: str
    tier_code: str
    total_runtime_hours: int
    pla_credited_hours: int
    total_accredited_hours: int
    wage_floor_percentage: str
    hours_to_journeyman: int
    hours_to_master: int
    qualified_endorsements: List[SpecialtyEndorsementResult]
    combined_wage_adder_min: float
    combined_wage_adder_max: float
    total_compensation_floor_min: str
    total_compensation_floor_max: str
    statutory_authorities: List[str]
    disclaimer: str


# Grandfathering Generalist Benchmark Certs (Transition Plan Table 3)
JOURNEYMAN_BENCHMARK_CERTS = {
    "CISSP", "CISM", "GSLC", "CISA", "CCSP"
}

PRACTICAL_LAB_CERTS = {
    "OSCP": 1000,
    "PNPT": 1000,
    "CCNA Cyber Ops": 500,
    "GCFA": 1000,
    "GNFA": 1000,
    "GREM": 1000,
    "GCIH": 500,
    "Security+": 500,
    "Network+": 500,
    "CySA+": 500,
}

DEGREE_PLA_HOURS = {
    "Associate": 1000,
    "Bachelor": 2000,
    "Master": 3000,
}

# Specialty Endorsement Rules
SPECIALTY_CATALOG = {
    "SE-MED": {
        "title": "Medical Device & Clinical Technology Security",
        "tier": "Tier 2: Statutory Life-Safety",
        "adder_min": 20.0,
        "adder_max": 25.0,
        "domains": ["medical_devices", "clinical_tech", "fda_premarket", "samd", "simd"],
        "certs": ["AAMI TIR57", "Biomedical Security"],
        "statutory_authority": "Premarket FDA Section 524B Cybersecurity Readiness Sign-Off",
        "description": "FDA Section 524B compliance, AAMI TIR57 / ISO 14971 patient safety harm integration."
    },
    "SE-ICS": {
        "title": "Industrial Control Systems & Operational Technology",
        "tier": "Tier 2: Statutory Life-Safety",
        "adder_min": 20.0,
        "adder_max": 25.0,
        "domains": ["ics_scada", "ot_security", "purdue_model", "nerc_cip", "iec_62443"],
        "certs": ["GICSP", "GRID", "ISA/IEC 62443"],
        "statutory_authority": "NERC-CIP Substation Authorization & Industrial Safety Sign-Off",
        "description": "IEC 62443, NERC CIP, Purdue Model boundary isolation."
    },
    "SE-DFIR": {
        "title": "Digital Forensics & Incident Response",
        "tier": "Tier 2: Statutory Life-Safety",
        "adder_min": 15.0,
        "adder_max": 20.0,
        "domains": ["dfir", "digital_forensics", "incident_response", "memory_forensics"],
        "certs": ["GCFA", "GNFA", "GREM", "EnCE", "CFCE"],
        "statutory_authority": "Chain-of-Custody Expert Attestation & Surge Lead",
        "description": "ISO/IEC 27037 forensic imaging, volatility analysis, adversary timeline reconstruction."
    },
    "SE-OFF": {
        "title": "Offensive Security & Adversary Emulation",
        "tier": "Tier 2: Statutory Life-Safety",
        "adder_min": 15.0,
        "adder_max": 20.0,
        "domains": ["offensive_security", "red_teaming", "penetration_testing", "exploit_development"],
        "certs": ["OSCP", "OSWE", "OSEP", "GXPN", "PNPT"],
        "statutory_authority": "Penetration Testing Exemption & Zero-Day Disclosure Sign-Off",
        "description": "NIST NICE AN-EXP adversary emulation and proof-of-concept validation."
    },
    "SE-AIML": {
        "title": "AI / ML Security Assurance",
        "tier": "Tier 2: Statutory Life-Safety",
        "adder_min": 15.0,
        "adder_max": 20.0,
        "domains": ["ai_ml_security", "llm_security", "adversarial_ml", "model_governance"],
        "certs": ["NIST AI RMF", "Machine Learning Security"],
        "statutory_authority": "Autonomous System Safety & Algorithmic Defensibility Sign-Off",
        "description": "NIST AI RMF (AI 100-1), OWASP Top 10 for LLMs, model weight integrity."
    },
    "SE-CLD": {
        "title": "Cloud Security & Infrastructure Architecture",
        "tier": "Tier 1: Discipline Tracking",
        "adder_min": 10.0,
        "adder_max": 15.0,
        "domains": ["cloud_security", "aws_security", "azure_security", "gcp_security", "kubernetes"],
        "certs": ["CCSP", "AWS Certified Security", "Azure Security Engineer", "CKS"],
        "statutory_authority": "Multi-Tenant Cloud Control Plane Baseline Verification",
        "description": "CIS Cloud Benchmarks, IaC security gating, IAM boundary isolation."
    },
    "SE-APP": {
        "title": "Application & Software Product Security",
        "tier": "Tier 1: Discipline Tracking",
        "adder_min": 0.0,
        "adder_max": 0.0,
        "domains": ["appsec", "product_security", "ssdlc", "threat_modeling", "sbom_lifecycle", "psirt"],
        "certs": ["CSSLP", "GWAPT", "CASE", "CASS"],
        "statutory_authority": "Software Supply Chain SBOM & Product Release Clearance",
        "description": "OWASP SAMM, automated SAST/DAST CI/CD gating, SBOM lifecycle, and PSIRT triage."
    },
    "SE-ICAM": {
        "title": "Identity, Credential & Access Management",
        "tier": "Tier 1: Discipline Tracking",
        "adder_min": 0.0,
        "adder_max": 0.0,
        "domains": ["icam", "identity_security", "pam", "zero_trust_identity", "saml_oidc"],
        "certs": ["CIAM", "CIMP"],
        "statutory_authority": "Enterprise Identity Authority & Zero-Trust Control Attestation",
        "description": "NIST SP 800-63 Digital Identity Guidelines, PAM, and federation protocols."
    },
    "SE-PKI": {
        "title": "Cryptographic Infrastructure & Key Management",
        "tier": "Tier 1: Discipline Tracking",
        "adder_min": 0.0,
        "adder_max": 0.0,
        "domains": ["pki", "cryptography", "key_management", "post_quantum", "hsm"],
        "certs": ["Certified Cryptographer", "FIPS 140 Lead"],
        "statutory_authority": "Root CA Generation & Post-Quantum Cryptographic Attestation",
        "description": "FIPS 140-3 HSM administration, certificate lifecycle, and PQC migration."
    }
}


def calculate_trade_standing(profile: PractitionerProfile) -> TradeStandingResult:
    """Calculates trade tier placement, PLA hours, wage benchmarks, and specialty adders."""
    runtime_hours = int(profile.cyber_experience_years * 2000)
    pla_hours = 0

    if profile.military_cyber_years > 0:
        pla_hours += min(4000, int(profile.military_cyber_years * 2000))
    elif profile.has_military_cyber_mos:
        pla_hours += 4000

    if profile.sysadmin_experience_years > 0:
        sysadmin_credit = min(2000, int(profile.sysadmin_experience_years * 1000))
        pla_hours += sysadmin_credit

    if profile.has_bootcamp_certificate:
        pla_hours += 500

    for cert in profile.certifications:
        for known_cert, hours in PRACTICAL_LAB_CERTS.items():
            if known_cert.lower() in cert.lower():
                pla_hours += hours
                break

    for deg in profile.degrees:
        for deg_type, hours in DEGREE_PLA_HOURS.items():
            if deg_type.lower() in deg.lower():
                pla_hours += hours
                break

    if profile.has_cve_or_bug_bounties:
        pla_hours += 1500

    # Enforce Mandatory 50% Residency Floor (PLA credit strictly capped at 4,000 hours)
    pla_hours = min(4000, pla_hours)
    total_accredited_hours = runtime_hours + pla_hours

    # Check for Generalist Benchmark Grandfathering (CISSP, CISM, etc.)
    has_benchmark_cert = any(
        any(bench.lower() == c.strip().lower() or bench.lower() in c.strip().lower() 
            for bench in JOURNEYMAN_BENCHMARK_CERTS)
        for c in profile.certifications
    )

    is_journeyman = False
    is_master_eligible = False

    if has_benchmark_cert and profile.cyber_experience_years >= 4.0:
        is_journeyman = True
        if total_accredited_hours >= 12000 or profile.cyber_experience_years >= 6.0:
            is_master_eligible = True
    elif total_accredited_hours >= 12000:
        is_journeyman = True
        is_master_eligible = True
    elif total_accredited_hours >= 8000:
        is_journeyman = True

    if is_master_eligible:
        standing_title = "Master Practitioner (Board Evaluation Eligible)"
        tier_code = "MASTER"
        wage_floor = "135% to 150% of Regional Journeyman Prevailing Benchmark"
        hours_to_journeyman = 0
        hours_to_master = 0
    elif is_journeyman:
        standing_title = "Licensed Journeyman"
        tier_code = "JOURNEYMAN"
        wage_floor = "100% of Regional Journeyman Prevailing Benchmark"
        hours_to_journeyman = 0
        hours_to_master = max(0, 12000 - total_accredited_hours)
    elif total_accredited_hours >= 6000:
        standing_title = "Advanced Registered Apprentice (Tier 4)"
        tier_code = "TIER_4"
        wage_floor = "80% of Regional Journeyman Prevailing Benchmark"
        hours_to_journeyman = max(0, 8000 - total_accredited_hours)
        hours_to_master = max(0, 12000 - total_accredited_hours)
    elif total_accredited_hours >= 4000:
        standing_title = "Intermediate Registered Apprentice (Tier 3)"
        tier_code = "TIER_3"
        wage_floor = "70% of Regional Journeyman Prevailing Benchmark"
        hours_to_journeyman = max(0, 8000 - total_accredited_hours)
        hours_to_master = max(0, 12000 - total_accredited_hours)
    elif total_accredited_hours >= 2000:
        standing_title = "Progressing Registered Apprentice (Tier 2)"
        tier_code = "TIER_2"
        wage_floor = "60% of Regional Journeyman Prevailing Benchmark"
        hours_to_journeyman = max(0, 8000 - total_accredited_hours)
        hours_to_master = max(0, 12000 - total_accredited_hours)
    else:
        standing_title = "Entry Registered Apprentice (Tier 1)"
        tier_code = "TIER_1"
        wage_floor = "50% of Regional Journeyman Prevailing Benchmark"
        hours_to_journeyman = max(0, 8000 - total_accredited_hours)
        hours_to_master = max(0, 12000 - total_accredited_hours)

    # Evaluate Specialty Endorsements
    qualified_endorsements: List[SpecialtyEndorsementResult] = []
    statutory_authorities: List[str] = []

    user_domains_lower = [d.lower() for d in profile.specialty_domains]
    user_certs_lower = [c.lower() for c in profile.certifications]

    for code, spec in SPECIALTY_CATALOG.items():
        matched = False
        for d in spec["domains"]:
            if any(d in ud for ud in user_domains_lower):
                matched = True
                break
        
        if not matched:
            for c in spec["certs"]:
                if any(c.lower() in uc for uc in user_certs_lower):
                    matched = True
                    break

        if matched:
            endorsement = SpecialtyEndorsementResult(
                code=code,
                title=spec["title"],
                tier=spec["tier"],
                base_adder_min=spec["adder_min"],
                base_adder_max=spec["adder_max"],
                description=spec["description"]
            )
            qualified_endorsements.append(endorsement)
            if is_journeyman and spec["statutory_authority"]:
                statutory_authorities.append(f"[{code}] {spec['statutory_authority']}")

    if is_journeyman and not is_master_eligible:
        statutory_authorities.append("[NCTB-MASTER-REQ] 500 Verified Instructional / Mentorship Runtime Hours Required for Master Elevation")

    # Calculate Specialty Wage Stacking
    combined_wage_adder_min = 0.0
    combined_wage_adder_max = 0.0

    if is_journeyman and qualified_endorsements:
        sorted_endorsements = sorted(qualified_endorsements, key=lambda e: e.base_adder_max, reverse=True)
        for idx, end in enumerate(sorted_endorsements):
            if idx == 0:
                end.is_primary = True
                end.applied_adder_min = end.base_adder_min
                end.applied_adder_max = end.base_adder_max
            else:
                end.is_primary = False
                end.applied_adder_min = end.base_adder_min * 0.5
                end.applied_adder_max = end.base_adder_max * 0.5

            combined_wage_adder_min += end.applied_adder_min
            combined_wage_adder_max += end.applied_adder_max

        combined_wage_adder_min = min(35.0, combined_wage_adder_min)
        combined_wage_adder_max = min(35.0, combined_wage_adder_max)

    if is_master_eligible:
        total_comp_min = f"{135 + combined_wage_adder_min:.1f}% RJPB"
        total_comp_max = f"{150 + combined_wage_adder_max:.1f}% RJPB"
    elif is_journeyman:
        total_comp_min = f"{100 + combined_wage_adder_min:.1f}% RJPB"
        total_comp_max = f"{100 + combined_wage_adder_max:.1f}% RJPB"
    else:
        step_val = int(wage_floor.split("%")[0])
        total_comp_min = f"{step_val}% RJPB"
        total_comp_max = f"{step_val}% RJPB"

    disclaimer = (
        "Important Notice: This tool is an open-source, community-built estimation model provided for career planning "
        "and illustrative purposes. It does not constitute official professional licensure, legal certification, or guaranteed "
        "employment standing. Official licensure, credential verification, and statutory sign-off authorities are determined "
        "exclusively by the National Cybersecurity Trade Board (NCTB) following formal JATC logbook audits and practical examination defenses."
    )

    return TradeStandingResult(
        standing_title=standing_title,
        tier_code=tier_code,
        total_runtime_hours=runtime_hours,
        pla_credited_hours=pla_hours,
        total_accredited_hours=total_accredited_hours,
        wage_floor_percentage=wage_floor,
        hours_to_journeyman=hours_to_journeyman,
        hours_to_master=hours_to_master,
        qualified_endorsements=qualified_endorsements,
        combined_wage_adder_min=combined_wage_adder_min,
        combined_wage_adder_max=combined_wage_adder_max,
        total_compensation_floor_min=total_comp_min,
        total_compensation_floor_max=total_comp_max,
        statutory_authorities=statutory_authorities,
        disclaimer=disclaimer
    )

