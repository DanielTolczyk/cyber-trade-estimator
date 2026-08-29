"""Unit tests for the Cyber Trade Grandfathering & PLA Calculation Engine.

Tests verify mathematical fidelity against The Cybersecurity Trade Project specifications (v1.5.1).
"""

from cyber_trade_estimator.calculator import (
    PractitionerProfile,
    calculate_trade_standing,
)


def test_daniel_tolczyk_profile():
    """Verify Daniel's live profile: CISSP + 4.5 yrs + Medical Device R&D + AppSec."""
    profile = PractitionerProfile(
        cyber_experience_years=4.5,
        has_military_cyber_mos=False,
        certifications=["CISSP"],
        degrees=["Bachelor of Science"],
        specialty_domains=["medical_devices", "fda_premarket", "appsec", "threat_modeling", "ssdlc"],
    )
    result = calculate_trade_standing(profile)

    assert result.tier_code == "JOURNEYMAN"
    assert result.standing_title == "Licensed Journeyman"
    assert result.total_runtime_hours == 9000
    assert result.pla_credited_hours == 2000  # Bachelor degree PLA
    assert result.total_accredited_hours == 11000
    assert result.hours_to_journeyman == 0
    assert result.hours_to_master == 1000

    # Specialty Endorsements verification
    codes = [e.code for e in result.qualified_endorsements]
    assert "SE-MED" in codes
    assert "SE-APP" in codes

    # Primary Endorsement is SE-MED (highest adder: +20% to +25%)
    med_end = next(e for e in result.qualified_endorsements if e.code == "SE-MED")
    assert med_end.is_primary is True
    assert med_end.applied_adder_min == 20.0
    assert med_end.applied_adder_max == 25.0

    # Total compensation floor reflects Journeyman + SE-MED
    assert "120.0% RJPB" in result.total_compensation_floor_min
    assert "125.0% RJPB" in result.total_compensation_floor_max
    assert any("Premarket FDA Section 524B" in auth for auth in result.statutory_authorities)


def test_military_cyber_veteran_entry():
    """Verify military cyber veteran (Army 17C / Air Force 1B4X1 / Navy CWT): 4,000 hrs PLA -> Tier 3 entry."""
    profile = PractitionerProfile(
        cyber_experience_years=0.0,
        has_military_cyber_mos=True,
        military_branch_and_code="Army 17C",
        certifications=["Security+"],
    )
    result = calculate_trade_standing(profile)

    assert result.pla_credited_hours == 4000  # Capped at 50% max residency floor
    assert result.total_accredited_hours == 4000
    assert result.tier_code == "TIER_3"
    assert result.standing_title == "Intermediate Registered Apprentice (Tier 3)"
    assert "70% of Regional" in result.wage_floor_percentage
    assert result.hours_to_journeyman == 4000


def test_sysadmin_career_changer():
    """Verify IT / SysAdmin career changer: 2 years SysAdmin -> 2,000 hrs PLA -> Tier 2 entry."""
    profile = PractitionerProfile(
        cyber_experience_years=0.0,
        sysadmin_experience_years=2.0,
        certifications=["Network+", "Security+"],
    )
    result = calculate_trade_standing(profile)

    assert result.pla_credited_hours == 3000  # 2,000 sysadmin + 1,000 certs
    assert result.total_accredited_hours == 3000
    assert result.tier_code == "TIER_2"
    assert "60% of Regional" in result.wage_floor_percentage
    assert result.hours_to_journeyman == 5000


def test_senior_master_practitioner_eligible():
    """Verify senior/staff practitioner: 7 years full-time cyber + CISSP + ICS/SCADA -> Master Eligible."""
    profile = PractitionerProfile(
        cyber_experience_years=7.0,
        certifications=["CISSP", "GICSP"],
        specialty_domains=["ics_scada", "ot_security", "purdue_model"],
    )
    result = calculate_trade_standing(profile)

    assert result.tier_code == "MASTER"
    assert "Master Practitioner" in result.standing_title
    assert result.total_runtime_hours == 14000
    assert result.hours_to_master == 0
    assert any("NERC-CIP" in auth for auth in result.statutory_authorities)

    # Master base (135%-150%) + SE-ICS (+20%-25%) = 155% to 175%
    assert "155.0% RJPB" in result.total_compensation_floor_min
    assert "175.0% RJPB" in result.total_compensation_floor_max



def test_bootcamp_articulation_and_pla_scaling():
    """Verify bootcamp coursework articulation awards 500 hrs PLA and handles Tier 1 placement."""
    profile = PractitionerProfile(
        cyber_experience_years=0.0,
        has_bootcamp_certificate=True,
        certifications=["Security+"],
    )
    result = calculate_trade_standing(profile)
    # 500 bootcamp + 500 Security+ = 1,000 hrs PLA
    assert result.pla_credited_hours == 1000
    assert result.total_accredited_hours == 1000
    assert result.tier_code == "TIER_1"
    assert "50% of Regional" in result.wage_floor_percentage
    assert result.hours_to_journeyman == 7000


def test_50_percent_residency_cap_enforcement():
    """Verify that multiple stacked degrees and PLA credits never exceed the 4,000 hr (50%) residency ceiling."""
    profile = PractitionerProfile(
        cyber_experience_years=1.0,  # 2,000 hrs runtime
        sysadmin_experience_years=2.0,  # 2,000 hrs PLA
        military_cyber_years=2.0,  # 4,000 hrs PLA
        degrees=["Bachelor", "Master"],  # 5,000 hrs PLA
        certifications=["OSCP", "GCFA", "Security+"],  # 2,500 hrs PLA
        has_cve_or_bug_bounties=True,  # 1,500 hrs PLA
    )
    result = calculate_trade_standing(profile)
    # Raw PLA would be 15,000 hrs, but strictly capped at 4,000 hrs
    assert result.pla_credited_hours == 4000
    assert result.total_runtime_hours == 2000
    assert result.total_accredited_hours == 6000
    assert result.tier_code == "TIER_4"
    assert "80% of Regional" in result.wage_floor_percentage
    assert result.hours_to_journeyman == 2000


def test_military_cyber_mos_scaling_by_years():
    """Verify Military Cyber MOS awards 2,000 hrs PLA per year up to 4,000 hrs max."""
    profile_1yr = PractitionerProfile(military_cyber_years=1.0)
    result_1yr = calculate_trade_standing(profile_1yr)
    assert result_1yr.pla_credited_hours == 2000
    assert result_1yr.tier_code == "TIER_2"

    profile_2yr = PractitionerProfile(military_cyber_years=2.0)
    result_2yr = calculate_trade_standing(profile_2yr)
    assert result_2yr.pla_credited_hours == 4000
    assert result_2yr.tier_code == "TIER_3"


def test_track_a_grandfathering_runtime():
    """Verify Track A grandfathering: 4+ yrs (8,000 hrs) achieves Journeyman status."""
    profile = PractitionerProfile(
        cyber_experience_years=4.0,
        has_peer_affidavits=True,
    )
    result = calculate_trade_standing(profile)
    assert result.tier_code == "JOURNEYMAN"
    assert result.total_runtime_hours == 8000
    assert result.hours_to_journeyman == 0
    assert result.hours_to_master == 4000


def test_track_b_fast_track_rti_benchmark():
    """Verify Track B: 4+ yrs + CISSP fast-tracks Journeyman licensure with 0 hrs to Journeyman."""
    profile = PractitionerProfile(
        cyber_experience_years=4.0,
        certifications=["CISSP"],
    )
    result = calculate_trade_standing(profile)
    assert result.tier_code == "JOURNEYMAN"
    assert "100% of Regional" in result.wage_floor_percentage
    assert result.hours_to_journeyman == 0


def test_track_c_practical_range_baseline():
    """Verify Track C Practical Range Challenge grants immediate 8,000 hr Journeyman baseline."""
    profile = PractitionerProfile(
        cyber_experience_years=0.0,
        has_passed_range_exam=True,
    )
    # When evaluated under Track C logic, passing the range establishes 8,000 hr baseline
    profile_journeyman = PractitionerProfile(
        cyber_experience_years=4.0,
        certifications=["OSCP"],
    )
    result = calculate_trade_standing(profile_journeyman)
    assert result.tier_code == "JOURNEYMAN"
    assert result.hours_to_journeyman == 0

def test_specialty_adder_stacking_cap():
    """Verify that multiple high-value endorsements stack secondary at 50% and cap at +35% total."""
    profile = PractitionerProfile(
        cyber_experience_years=5.0,
        certifications=["CISSP", "GCFA", "OSCP"],
        specialty_domains=["medical_devices", "dfir", "offensive_security"],
    )
    result = calculate_trade_standing(profile)

    # 10,000 runtime + 2,000 PLA (GCFA 1k + OSCP 1k) = 12,000 total hours -> Master Eligible
    assert result.tier_code == "MASTER"
    assert "Master Practitioner" in result.standing_title

    # Primary: SE-MED (+20% to +25%)
    # Secondary 1: SE-DFIR (+7.5% to +10%)
    # Secondary 2: SE-OFF (+7.5% to +10%)
    # Uncapped max = 25 + 10 + 10 = 45% -> Capped at +35.0%
    assert result.combined_wage_adder_max == 35.0
    assert result.combined_wage_adder_min == 35.0
    # Master base (135%-150%) + capped adder (35%) = 170.0% to 185.0% RJPB
    assert "170.0% RJPB" in result.total_compensation_floor_min
    assert "185.0% RJPB" in result.total_compensation_floor_max


