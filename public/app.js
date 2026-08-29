/**
 * The Cybersecurity Trade Project - 3-Track Grandfathering Estimator
 * 100% Schema-Driven. Zero external telemetry. In-Browser Privacy.
 */

let currentTrack = "TRACK_ENTRY";
let selectedCertsB = new Set();

const BENCHMARK_CERTS = [
  { code: "CISSP", label: "CISSP (ISC2 Multi-Domain Generalist)" },
  { code: "CISM", label: "CISM (ISACA Security Management)" },
  { code: "CISA", label: "CISA (ISACA Audit & Controls)" },
  { code: "CCSP", label: "CCSP (ISC2 Cloud Architecture)" },
  { code: "GSLC", label: "GSLC (GIAC Security Leadership)" }
];

const PRACTICAL_CERTS = [
  { code: "OSCP", label: "OSCP (+1,000 hrs PLA)", pla: 1000 },
  { code: "PNPT", label: "PNPT (+1,000 hrs PLA)", pla: 1000 },
  { code: "GCFA", label: "GCFA (+1,000 hrs PLA)", pla: 1000 },
  { code: "GCIH", label: "GCIH (+500 hrs PLA)", pla: 500 },
  { code: "Security+", label: "Security+ (+500 hrs PLA)", pla: 500 },
  { code: "Network+", label: "Network+ (+500 hrs PLA)", pla: 500 },
  { code: "CySA+", label: "CySA+ (+500 hrs PLA)", pla: 500 }
];

function formatYearsMonths(decimalYears) {
  const years = Math.floor(decimalYears);
  const months = Math.round((decimalYears - years) * 12);
  let text = "";
  if (years === 0 && months === 0) return "0 Months";
  if (years > 0) text += `${years} ${years === 1 ? "Year" : "Years"}`;
  if (months > 0) {
    if (text) text += ", ";
    text += `${months} ${months === 1 ? "Month" : "Months"}`;
  }
  return text;
}

function calculateStanding() {
  let runtimeHours = 0;
  let plaHours = 0;
  let tierCode = "TIER_1";
  let standingTitle = "Entry Registered Apprentice (Tier 1)";
  let badgeText = "TIER 1 UNLOCKED";
  let nextMilestoneText = "";
  let progressPct = 0;
  let submissionChecklist = [];

  if (currentTrack === "TRACK_A") {
    const cyberYears = parseFloat(document.getElementById("cyberYearsA").value) || 0;
    const sysadminYears = parseFloat(document.getElementById("sysadminYearsA").value) || 0;
    const militaryYears = parseFloat(document.getElementById("militaryCyberYearsA").value) || 0;
    const hasBach = document.getElementById("degBachelorA").checked;
    const hasMast = document.getElementById("degMasterA").checked;
    const hasBootcampA = document.getElementById("hasBootcampA") ? document.getElementById("hasBootcampA").checked : false;
    const hasBounty = document.getElementById("hasBugBountyA").checked;

    runtimeHours = Math.round(cyberYears * 2000);
    if (militaryYears > 0) plaHours += Math.min(4000, Math.round(militaryYears * 2000));
    if (sysadminYears > 0) plaHours += Math.min(2000, Math.round(sysadminYears * 1000));
    if (hasBach) plaHours += 2000;
    if (hasMast) plaHours += 3000;
    if (hasBootcampA) plaHours += 500;
    if (hasBounty) plaHours += 1500;
    plaHours = Math.min(4000, plaHours);

    const totalAccredited = runtimeHours + plaHours;

    const canHaveAffidavits = totalAccredited >= 8000 || cyberYears >= 4.0;
    const canHaveArtifacts = totalAccredited >= 16000 || cyberYears >= 8.0;

    const elAff = document.getElementById("hasAffidavitsA");
    const itemAff = document.getElementById("itemAffidavitsA");
    const hintAff = document.getElementById("hintAffidavitsA");
    if (elAff && itemAff) {
      elAff.disabled = !canHaveAffidavits;
      itemAff.classList.toggle("disabled", !canHaveAffidavits);
      if (hintAff) {
        hintAff.textContent = canHaveAffidavits 
          ? "Runtime Prerequisite Met: Check to confirm two peer reference affidavits." 
          : "Requires 4+ Years (8,000 hrs) Runtime to Enable.";
      }
      if (!canHaveAffidavits) elAff.checked = false;
    }

    const elArt = document.getElementById("hasArtifactsA");
    const itemArt = document.getElementById("itemArtifactsA");
    const hintArt = document.getElementById("hintArtifactsA");
    if (elArt && itemArt) {
      elArt.disabled = !canHaveArtifacts;
      itemArt.classList.toggle("disabled", !canHaveArtifacts);
      if (hintArt) {
        hintArt.textContent = canHaveArtifacts 
          ? "Runtime Prerequisite Met: Check to verify three sanitized engineering artifacts." 
          : "Requires 8+ Years (16,000 hrs) Runtime to Enable.";
      }
      if (!canHaveArtifacts) elArt.checked = false;
    }

    const hasAffidavits = elAff ? elAff.checked : false;
    const hasArtifacts = elArt ? elArt.checked : false;

    if (cyberYears > 0) submissionChecklist.push(`W-2 / 1099 / DD-214 Operational Runtime Verification (${cyberYears} Yrs / ${runtimeHours.toLocaleString()} hrs)`);
    if (sysadminYears > 0) submissionChecklist.push(`Documented IT / SysAdmin Production Work (${sysadminYears} Yrs / ${Math.min(2000, sysadminYears * 1000).toLocaleString()} hrs PLA)`);
    if (militaryYears > 0) submissionChecklist.push(`DD-214 Military Cyber MOS Record (${militaryYears} Yrs / ${Math.min(4000, militaryYears * 2000).toLocaleString()} hrs PLA)`);
    if (hasBach) submissionChecklist.push("Accredited Bachelor's Degree Transcript (+2,000 hrs PLA)");
    if (hasMast) submissionChecklist.push("Accredited Master's Degree Transcript (+3,000 hrs PLA)");
    if (hasBootcampA) submissionChecklist.push("Bootcamp Certificate & Coursework Portfolio (144 hr RTI Articulation Waiver)");
    if (hasBounty) submissionChecklist.push("Verified Vulnerability Disclosures / Published CVEs (+1,500 hrs Domain 4)");
    if (hasAffidavits) submissionChecklist.push("Two (2) Sworn Professional Peer Reference Affidavits");
    if (hasArtifacts) submissionChecklist.push("Three (3) Sanitized Technical Engineering Artifacts");

    if (totalAccredited >= 16000 || cyberYears >= 8.0) {
      if (hasAffidavits && hasArtifacts) {
        tierCode = "MASTER";
        standingTitle = "Legacy Master Practitioner";
        badgeText = "TRACK A • MASTER UNLOCKED";
        progressPct = 100;
        nextMilestoneText = "Track A Senior Portfolio Complete: 8+ years runtime + 2 peer affidavits + 3 engineering artifacts verified. Master Practitioner standing awarded.";
      } else if (hasAffidavits) {
        tierCode = "JOURNEYMAN";
        standingTitle = "Master Candidate (Oral Board Defense Pending)";
        badgeText = "TRACK A • ORAL BOARD PENDING";
        progressPct = 96; // Stops right short of 100% Master dot!
        nextMilestoneText = "Journeyman Licensure Unlocked: 16,000+ accredited runtime hours met. Submit Three (3) Sanitized Engineering Artifacts and complete your Master Oral Board Defense to unlock full Master Practitioner standing.";
      } else {
        tierCode = "TIER_4";
        standingTitle = "Apprentice Tier 4 (Affidavits Required)";
        badgeText = "TRACK A • AFFIDAVITS REQUIRED";
        progressPct = 78;
        nextMilestoneText = "Runtime Threshold Met (8+ Yrs): Track A Day-1 Journeyman Grandfathering requires Two (2) Peer Reference Affidavits confirming core operational execution. Check the box above to verify.";
      }
    } else if (totalAccredited >= 8000 || cyberYears >= 4.0) {
      if (hasAffidavits) {
        tierCode = "JOURNEYMAN";
        standingTitle = "Legacy Licensed Journeyman";
        badgeText = "TRACK A • JOURNEYMAN UNLOCKED";
        const remHours = Math.max(0, 16000 - totalAccredited);
        const remYrs = (remHours / 2000).toFixed(1);
        progressPct = 80 + Math.min(20, ((totalAccredited - 8000) / 8000) * 20);
        nextMilestoneText = `Track A Grandfathering Qualified (Zero Certs Required): Direct Day-1 Journeyman Licensure. You are ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) and 3 artifacts from Master Practitioner standing.`;
      } else {
        tierCode = "TIER_4";
        standingTitle = "Apprentice Tier 4 (Affidavits Required)";
        badgeText = "TRACK A • AFFIDAVITS REQUIRED";
        progressPct = 78;
        nextMilestoneText = "Runtime Threshold Met (4+ Yrs): Track A Day-1 Journeyman Grandfathering requires Two (2) Peer Reference Affidavits confirming core operational execution. Check the box above to verify.";
      }
    } else if (totalAccredited >= 6000) {
      tierCode = "TIER_4";
      standingTitle = "Advanced Registered Apprentice (Tier 4)";
      badgeText = "TIER 4 UNLOCKED";
      progressPct = 60 + ((totalAccredited - 6000) / 2000) * 20;
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Day 1 Transition Placement: You slot directly into Tier 4. Only ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else if (totalAccredited >= 4000) {
      tierCode = "TIER_3";
      standingTitle = "Intermediate Registered Apprentice (Tier 3)";
      badgeText = "TIER 3 UNLOCKED";
      progressPct = 40 + ((totalAccredited - 4000) / 2000) * 20;
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Day 1 Transition Placement: You slot directly into Tier 3. ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else if (totalAccredited >= 2000) {
      tierCode = "TIER_2";
      standingTitle = "Progressing Registered Apprentice (Tier 2)";
      badgeText = "TIER 2 UNLOCKED";
      progressPct = 20 + ((totalAccredited - 2000) / 2000) * 20;
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Day 1 Transition Placement: You slot directly into Tier 2. ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else {
      tierCode = "TIER_1";
      standingTitle = "Entry Registered Apprentice (Tier 1)";
      badgeText = "TIER 1 UNLOCKED";
      progressPct = (totalAccredited / 2000) * 20;
      nextMilestoneText = "Day 1 Entry Apprentice: Complete 8,000 operational hours of structured paid rotations with zero student debt.";
    }
  } else if (currentTrack === "TRACK_B") {
    const cyberYears = parseFloat(document.getElementById("cyberYearsB").value) || 0;
    const sysadminYears = parseFloat(document.getElementById("sysadminYearsB").value) || 0;
    const militaryYears = parseFloat(document.getElementById("militaryCyberYearsB").value) || 0;
    const hasBach = document.getElementById("degBachelorB").checked;
    const hasMast = document.getElementById("degMasterB").checked;
    const hasBootcampB = document.getElementById("hasBootcampB") ? document.getElementById("hasBootcampB").checked : false;
    const hasBounty = document.getElementById("hasBugBountyB").checked;

    runtimeHours = Math.round(cyberYears * 2000);
    if (militaryYears > 0) plaHours += Math.min(4000, Math.round(militaryYears * 2000));
    if (sysadminYears > 0) plaHours += Math.min(2000, Math.round(sysadminYears * 1000));
    if (hasBach) plaHours += 2000;
    if (hasMast) plaHours += 3000;
    if (hasBootcampB) plaHours += 500;
    if (hasBounty) plaHours += 1500;

    PRACTICAL_CERTS.forEach(c => {
      if (selectedCertsB.has(c.code)) plaHours += c.pla;
    });
    plaHours = Math.min(4000, plaHours);

    const totalAccredited = runtimeHours + plaHours;
    const hasBenchmark = BENCHMARK_CERTS.some(c => selectedCertsB.has(c.code));
    
    const canHaveOralBoard = hasBenchmark && (totalAccredited >= 12000 || cyberYears >= 6.0);
    const elOral = document.getElementById("hasOralBoardB");
    const itemOral = document.getElementById("itemOralBoardB");
    const hintOral = document.getElementById("hintOralBoardB");
    if (elOral && itemOral) {
      elOral.disabled = !canHaveOralBoard;
      itemOral.classList.toggle("disabled", !canHaveOralBoard);
      if (hintOral) {
        hintOral.textContent = canHaveOralBoard 
          ? "Senior Fast-Track Met: Check to confirm successful Master Oral Board defense." 
          : "Requires 6+ Years Runtime + Benchmark Cert to Enable.";
      }
      if (!canHaveOralBoard) elOral.checked = false;
    }

    const hasOralBoardB = elOral ? elOral.checked : false;

    if (hasBenchmark && (totalAccredited >= 12000 || cyberYears >= 6.0)) {
      if (hasOralBoardB) {
        tierCode = "MASTER";
        standingTitle = "Legacy Master Practitioner";
        badgeText = "TRACK B • MASTER UNLOCKED";
        progressPct = 100;
        nextMilestoneText = "Track B Senior Fast-Track Complete: Benchmark RTI + 6+ years verified runtime + Master Oral Board defense passed.";
      } else {
        tierCode = "JOURNEYMAN";
        standingTitle = "Master Candidate (Oral Board Defense Pending)";
        badgeText = "TRACK B • ORAL BOARD PENDING";
        progressPct = 96; // Stops right short of 100% Master dot!
        nextMilestoneText = "Journeyman Fast-Track Unlocked: Senior 6+ year runtime and Benchmark RTI met. Complete your Master Oral Board Defense to unlock full Master Practitioner standing.";
      }
    } else if (hasBenchmark && (totalAccredited >= 8000 || cyberYears >= 4.0)) {
      tierCode = "JOURNEYMAN";
      standingTitle = "Legacy Licensed Journeyman";
      badgeText = "TRACK B • JOURNEYMAN UNLOCKED";
      const remHours = Math.max(0, 12000 - totalAccredited);
      const remYrs = (remHours / 2000).toFixed(1);
      progressPct = 80 + Math.min(20, ((totalAccredited - 8000) / 4000) * 20);
      nextMilestoneText = `Track B Benchmark Fast-Track Qualified: Direct Day-1 Journeyman Licensure. You are ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) from Master Practitioner standing.`;
    } else if (totalAccredited >= 8000 || cyberYears >= 4.0) {
      // 4+ Years runtime in Track B but missing Benchmark Cert
      tierCode = "TIER_4";
      standingTitle = "Apprentice Tier 4 (Benchmark Credential Required)";
      badgeText = "TRACK B • BENCHMARK CERT REQUIRED";
      progressPct = 78;
      nextMilestoneText = "Runtime Threshold Met (4+ Yrs): Track B Fast-Track requires selecting a recognized benchmark credential (CISSP, CISM, CISA, CCSP, GSLC) for RTI credit. Alternatively, switch to Track A to qualify via Peer Reference Affidavits with zero certs.";
    } else if (totalAccredited >= 6000) {
      tierCode = "TIER_4";
      standingTitle = "Advanced Registered Apprentice (Tier 4)";
      badgeText = "TIER 4 UNLOCKED";
      progressPct = 60 + Math.min(18, ((totalAccredited - 6000) / 2000) * 20);
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Day 1 Transition Placement: You slot directly into Tier 4. Only ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else if (totalAccredited >= 4000) {
      tierCode = "TIER_3";
      standingTitle = "Intermediate Registered Apprentice (Tier 3)";
      badgeText = "TIER 3 UNLOCKED";
      progressPct = 40 + Math.min(18, ((totalAccredited - 4000) / 2000) * 20);
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Day 1 Transition Placement: You slot directly into Tier 3. ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else if (totalAccredited >= 2000) {
      tierCode = "TIER_2";
      standingTitle = "Progressing Registered Apprentice (Tier 2)";
      badgeText = "TIER 2 UNLOCKED";
      progressPct = 20 + Math.min(18, ((totalAccredited - 2000) / 2000) * 20);
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Day 1 Transition Placement: You slot directly into Tier 2. ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else {
      tierCode = "TIER_1";
      standingTitle = "Entry Registered Apprentice (Tier 1)";
      badgeText = "TIER 1 UNLOCKED";
      progressPct = Math.min(18, (totalAccredited / 2000) * 20);
      nextMilestoneText = "Day 1 Entry Apprentice: Complete paid rotational program to Journeyman Licensure.";
    }
    if (cyberYears > 0) submissionChecklist.push(`W-2 / 1099 / DD-214 Operational Runtime Verification (${cyberYears} Yrs / ${runtimeHours.toLocaleString()} hrs)`);
    selectedCertsB.forEach(c => submissionChecklist.push(`Certified Credential Record: ${c} (Permanent RTI Credit)`));
    if (sysadminYears > 0) submissionChecklist.push(`Documented IT / SysAdmin Production Work (${sysadminYears} Yrs / ${Math.min(2000, sysadminYears * 1000).toLocaleString()} hrs PLA)`);
    if (militaryYears > 0) submissionChecklist.push(`DD-214 Military Cyber MOS Record (${militaryYears} Yrs / ${Math.min(4000, militaryYears * 2000).toLocaleString()} hrs PLA)`);
    if (hasBach) submissionChecklist.push("Accredited Bachelor's Degree Transcript (+2,000 hrs PLA)");
    if (hasMast) submissionChecklist.push("Accredited Master's Degree Transcript (+3,000 hrs PLA)");
    if (hasBootcampB) submissionChecklist.push("Bootcamp Certificate & Coursework Portfolio (144 hr RTI Articulation Waiver)");
    if (hasBounty) submissionChecklist.push("Verified Vulnerability Disclosures / Published CVEs (+1,500 hrs Domain 4)");
    if (hasOralBoardB) submissionChecklist.push("Master Oral Board Defense Examination Verification");
  } else if (currentTrack === "TRACK_C") {
    const passedRangeExam = document.getElementById("rangeExamPassed").checked;
    const cyberYearsC = parseFloat(document.getElementById("cyberYearsC").value) || 0;
    const hasBootcampGradC = document.getElementById("hasBootcampGradC") ? document.getElementById("hasBootcampGradC").checked : false;
    const hasMidProgramEnrolledC = document.getElementById("hasMidProgramEnrolledC") ? document.getElementById("hasMidProgramEnrolledC").checked : false;
    const passedPreApprenticeExamC = document.getElementById("passedPreApprenticeExamC") ? document.getElementById("passedPreApprenticeExamC").checked : false;
    const hasBounty = document.getElementById("hasBugBountyC").checked;
    const hasBach = document.getElementById("degBachelorC").checked;

    const canHaveArtifactsC = passedRangeExam && cyberYearsC >= 8.0;
    const elArtC = document.getElementById("hasArtifactsC");
    const itemArtC = document.getElementById("itemArtifactsC");
    const hintArtC = document.getElementById("hintArtifactsC");
    if (elArtC && itemArtC) {
      elArtC.disabled = !canHaveArtifactsC;
      itemArtC.classList.toggle("disabled", !canHaveArtifactsC);
      if (hintArtC) {
        hintArtC.textContent = canHaveArtifactsC
          ? "Senior Fast-Track Met: Check to confirm 3 sanitized artifacts (or CVEs / research) for Master Oral Board."
          : "Requires Range Exam Passed + 8+ Years Runtime to Enable.";
      }
      if (!canHaveArtifactsC) elArtC.checked = false;
    }
    const hasArtifactsC = elArtC ? elArtC.checked : false;

    if (hasBounty) plaHours += 1500;
    if (hasBach) plaHours += 2000;
    plaHours = Math.min(4000, plaHours);

    if (passedRangeExam) {
      runtimeHours = 8000 + Math.round(cyberYearsC * 2000);
      if (cyberYearsC >= 8.0) {
        if (hasArtifactsC) {
          tierCode = "MASTER";
          standingTitle = "Legacy Master Practitioner";
          badgeText = "TRACK C • MASTER UNLOCKED";
          progressPct = 100;
          nextMilestoneText = "Track C Senior Fast-Track Complete: Range Challenge Passed + 8+ years runtime + 3 engineering artifacts verified. Master Practitioner standing awarded.";
        } else {
          tierCode = "JOURNEYMAN";
          standingTitle = "Master Candidate (Senior Range Challenge Winner)";
          badgeText = "TRACK C • ORAL BOARD PENDING";
          progressPct = 96;
          nextMilestoneText = "Senior Range Challenge Winner (8+ Yrs Runtime): Day-1 Journeyman Licensure awarded. Check 'Three (3) Sanitized Engineering Artifacts' to unlock Master Oral Board defense standing.";
        }
      } else {
        tierCode = "JOURNEYMAN";
        standingTitle = "Licensed Journeyman (Range Certified)";
        badgeText = "TRACK C • JOURNEYMAN UNLOCKED";
        progressPct = 80;
        nextMilestoneText = "Track C Practical Challenge Passed: Immediate Day-1 Licensed Journeyman standing (8,000 hr legal baseline). You are 4,000 operational hours (approx. 2.0 yrs) from standard Master elevation.";
      }
      submissionChecklist.push("JATC 4-Hour Practical Challenge Examination Passing Score Report (8,000 hr Baseline)");
      if (cyberYearsC > 0) submissionChecklist.push(`Operational Runtime Verification Records (${cyberYearsC} Yrs)`);
      if (hasArtifactsC) submissionChecklist.push("Three (3) Sanitized Technical Engineering Artifacts / CVE Disclosures");
    } else {
      tierCode = plaHours >= 2000 ? "TIER_2" : "TIER_1";
      standingTitle = plaHours >= 2000 ? "Progressing Registered Apprentice (Tier 2)" : "Candidate for Practical Range Challenge";
      badgeText = "TRACK C • READY FOR RANGE EXAM";
      progressPct = (plaHours / 2000) * 20;
      nextMilestoneText = "Practical Range Track: Pass the proctored 4-hour hands-on challenge examination to receive immediate Day-1 Journeyman Licensure (8,000 hr baseline).";
      submissionChecklist.push("Pre-Registration for JATC Practical Challenge Examination");
    }

    if (hasBach) submissionChecklist.push("Technical Degree Transcript (+2,000 hrs PLA / CTD Credit)");
    if (hasBounty) submissionChecklist.push("Verified Vulnerability Disclosures / Published CVEs (+1,500 hrs / Master Defense Artifact)");
  } else if (currentTrack === "TRACK_ENTRY") {
    const sysadminYears = parseFloat(document.getElementById("sysadminYearsEntry").value) || 0;
    const militaryYears = parseFloat(document.getElementById("militaryCyberYearsEntry").value) || 0;
    const hasBootcampGrad = document.getElementById("hasBootcampGradEntry").checked;
    const hasMidProgram = document.getElementById("hasMidProgramEnrolledEntry").checked;
    const passedBenchmark = document.getElementById("passedPreApprenticeExamEntry").checked;
    const hasBach = document.getElementById("degBachelorEntry").checked;
    const hasBounty = document.getElementById("hasBugBountyEntry").checked;

    if (militaryYears > 0) plaHours += Math.min(4000, Math.round(militaryYears * 2000));
    if (sysadminYears > 0) plaHours += Math.min(2000, Math.round(sysadminYears * 1000));
    if (hasBootcampGrad) plaHours += 500;
    if (hasBach) plaHours += 2000;
    if (hasBounty) plaHours += 1500;
    plaHours = Math.min(4000, plaHours);

    if (passedBenchmark) {
      tierCode = plaHours >= 2000 ? "TIER_2" : "TIER_1";
      standingTitle = plaHours >= 2000 ? "Progressing Registered Apprentice (Tier 2 - Articulated)" : "Registered Apprentice Tier 1 (JATC Dispatch Ready)";
      badgeText = "STUDENT INTAKE • JATC DISPATCH READY";
      progressPct = plaHours >= 2000 ? 20 : 10;
      nextMilestoneText = "Benchmark Practical Filter Passed: Direct placement on the JATC paid W-2 employer dispatch roster ($25–$32/hr base). 100% employer-paid Related Technical Instruction (RTI) rotations.";

      if (hasBootcampGrad) submissionChecklist.push("Bootcamp Certificate & Coursework Syllabus (144 hr RTI Articulation Waiver)");
      if (hasMidProgram) submissionChecklist.push("Current Program Enrollment Verification (Challenge-Out Intake)");
      submissionChecklist.push("JATC Pre-Apprenticeship Practical Benchmark Score Report");
      submissionChecklist.push("Guild Member Welfare Registration & Anti-TRAP Legal Review");
    } else {
      tierCode = "TIER_1";
      standingTitle = "Apprentice Candidate (Benchmark Practical Pending)";
      badgeText = "ENTRY • BENCHMARK CHALLENGE PENDING";
      progressPct = plaHours >= 2000 ? 15 : (plaHours > 0 ? 8 : 2);

      if (hasBootcampGrad || hasMidProgram || hasBach || plaHours > 0) {
        nextMilestoneText = "Coursework Articulation & PLA Logged: You have coursework and PLA credits accredited. Pass the free proctored Pre-Apprenticeship Practical Benchmark Challenge below to unlock Tier 1 Paid Apprentice Dispatch ($25–$32/hr base).";
      } else {
        nextMilestoneText = "Entry Candidate: Take the free Pre-Apprenticeship Practical Benchmark Challenge to demonstrate foundational aptitude and enter the paid earn-while-you-learn apprenticeship.";
      }

      if (hasBootcampGrad) submissionChecklist.push("Bootcamp Coursework Syllabus (Evaluation for 144 hr RTI Waiver)");
      if (hasMidProgram) submissionChecklist.push("Current Program Enrollment Verification (Challenge-Out Intake)");
      submissionChecklist.push("Registration for Free JATC Practical Benchmark Challenge");
      submissionChecklist.push("Guild Intake Registration & Anti-TRAP Consumer Protection Review");
    }

    if (sysadminYears > 0) submissionChecklist.push(`Documented IT / SysAdmin Production Work (${sysadminYears} Yrs / ${Math.min(2000, sysadminYears * 1000).toLocaleString()} hrs PLA)`);
    if (militaryYears > 0) submissionChecklist.push(`DD-214 Military Cyber MOS Record (${militaryYears} Yrs / ${Math.min(4000, militaryYears * 2000).toLocaleString()} hrs PLA)`);
    if (hasBach) submissionChecklist.push("Technical Degree Transcript (+2,000 hrs PLA)");
    if (hasBounty) submissionChecklist.push("Verified Vulnerability Disclosures / Published CVEs (+1,500 hrs Domain 4)");
  }

  const clampedPct = Math.min(100, Math.max(0, progressPct));
  const trackFill = document.getElementById("stepperTrackFill");
  if (trackFill) trackFill.style.width = `${clampedPct}%`;

  const steps = ["TIER_1", "TIER_2", "TIER_3", "TIER_4", "JOURNEYMAN", "MASTER"];
  const currentIdx = steps.indexOf(tierCode);
  document.querySelectorAll(".step-item").forEach((el, idx) => {
    el.classList.toggle("completed", idx < currentIdx);
    el.classList.toggle("active", idx === currentIdx);
  });

  const milestoneBadge = document.getElementById("milestoneBadge");
  const milestoneNextText = document.getElementById("milestoneNextText");
  document.getElementById("standingTitle").textContent = standingTitle;
  milestoneBadge.textContent = badgeText;
  milestoneNextText.textContent = nextMilestoneText;

  let authorities = [];
  if (currentTrack === "TRACK_ENTRY") {
    const passedBenchmark = document.getElementById("passedPreApprenticeExamEntry").checked;
    if (passedBenchmark) {
      authorities.push("<strong>[JATC Priority Dispatch]</strong> Direct Placement on Paid W-2 Employer Dispatch Roster ($25–$32/hr Base)");
      authorities.push("<strong>[RTI Articulation Credit]</strong> 144 Hours Year 1 Classroom Mandate Waived from Completed Coursework");
      authorities.push("<strong>[Debt Cessation Standing]</strong> Fee-Free Challenge-Out Intake to Halt Tuition / ISA Accrual");
      authorities.push("<strong>[Supervised Production]</strong> Mandatory 2:1 Line-of-Sight Journeyman Mentorship Ratio");
      authorities.push("<strong>[Zero Student Debt]</strong> 100% Employer-Paid Rotational Training with Zero Added Student Debt");
      authorities.push("<strong>[Guild Defense Shield]</strong> Zero-Cost Community College Remediation & Anti-TRAP Legal Protection");
    } else {
      authorities.push("<strong>[RTI Articulation Standing]</strong> Completed Coursework Eligible for 144 Hours Classroom Bypass");
      authorities.push("<strong>[Free Benchmark Testing]</strong> 100% Fee-Free JATC Practical Benchmark Challenge ($0 Exam Fee)");
      authorities.push("<strong>[Tuition Debt Release]</strong> Challenge-Out Pathway to Halt Ongoing Tuition & ISA Debt Accrual");
      authorities.push("<strong>[Free Remediation]</strong> Access to Free Modular Public Community College Labs for Skills Gaps");
      authorities.push("<strong>[Guild Consumer Defense]</strong> Access to Craft Guild Anti-TRAP Legal Guidance & Consumer Protection");
    }
  } else if (tierCode === "MASTER") {
    authorities.push("<strong>[Architectural Oversight]</strong> Multi-Domain System Review, Blueprint Sign-Off & Attestation Authority");
    authorities.push("<strong>[Master of Record (MoR)]</strong> Eligible for Designated MoR Appointment & Statutory Sign-Off Standing");
    authorities.push("<strong>[Right of Technical Refusal]</strong> Exclusive Legal Standing to Issue Safety Non-Concurrence Notices (FORM-001)");
    authorities.push("<strong>[Statutory Wage Floor]</strong> 135% to 150% Regional Journeyman Prevailing Benchmark Floor + MoR Adder");
    authorities.push("<strong>[Workforce Leadership]</strong> Authorized to Lead Regional JATC Apprentice Training Trust Committees");
    authorities.push("<strong>[Collective Defense]</strong> Full Access to Craft Guild Legal Defense Fund & Professional Indemnity Shield");
  } else if (tierCode === "JOURNEYMAN") {
    authorities.push("<strong>[Independent Execution]</strong> Practice Independently on Live Production Systems Without Oversight");
    authorities.push("<strong>[Apprentice Supervision]</strong> Supervise up to Two (2) Registered Apprentices On-Shift (Mandatory 2:1 Ratio)");
    authorities.push("<strong>[Production Autonomy]</strong> Direct Deployment Authority for Firewall Rules, ACLs & Defense Hardening");
    authorities.push("<strong>[Operational Refusal]</strong> Issue Protected Internal Operational Exception Flags (FORM-003)");
    authorities.push("<strong>[Statutory Wage Floor]</strong> Guaranteed 100% Regional Journeyman Prevailing Benchmark (RJPB) Base");
    authorities.push("<strong>[Portable Benefits]</strong> Multi-Employer Health, Pension & Continuous Technical Development (CTD) Trust");
  } else if (tierCode === "TIER_4") {
    authorities.push("<strong>[Advanced Apprentice]</strong> Supervised Live Production Practice (2:1 Journeyman Oversight Ratio)");
    authorities.push("<strong>[Advanced Scope]</strong> Automated Script Authoring, Systems Hardening & Elective Specialization");
    authorities.push("<strong>[Wage Stepping Floor]</strong> Statutory Tier 4 Wage Floor (80% of Regional Journeyman Prevailing Benchmark)");
    authorities.push("<strong>[Zero Student Debt]</strong> 100% Employer-Funded Related Technical Instruction (RTI) Classroom Training");
    authorities.push("<strong>[Guild Defense Shield]</strong> Anti-TRAP Consumer Protection & Collective Defense Against Employer Clawbacks");
  } else if (tierCode === "TIER_3") {
    authorities.push("<strong>[Intermediate Apprentice]</strong> Supervised Live Production Practice (2:1 Journeyman Oversight Ratio)");
    authorities.push("<strong>[Intermediate Scope]</strong> Threat Hunting, Telemetry Correlation & Assisted Patch Verification");
    authorities.push("<strong>[Wage Stepping Floor]</strong> Statutory Tier 3 Wage Floor (70% of Regional Journeyman Prevailing Benchmark)");
    authorities.push("<strong>[Rotational Pipeline]</strong> Enforced Multi-Domain Rotation Across Defensive Engineering Functions");
    authorities.push("<strong>[Guild Defense Shield]</strong> Anti-TRAP Consumer Protection & Collective Defense Against Employer Clawbacks");
  } else if (tierCode === "TIER_2") {
    authorities.push("<strong>[Progressing Apprentice]</strong> Supervised Live Production Practice (2:1 Journeyman Oversight Ratio)");
    authorities.push("<strong>[Guided Triage]</strong> Alert Triage, CI/CD Pipeline Scanning & Defensive Hygiene");
    authorities.push("<strong>[Wage Stepping Floor]</strong> Statutory Tier 2 Wage Floor (60% of Regional Journeyman Prevailing Benchmark)");
    authorities.push("<strong>[Zero Student Debt]</strong> 100% Employer-Paid Related Technical Instruction (RTI)");
    authorities.push("<strong>[Guild Defense Shield]</strong> Anti-TRAP Consumer Protection & Collective Defense Against Employer Clawbacks");
  } else {
    authorities.push("<strong>[Entry Apprentice]</strong> Supervised Live Production Practice (1:1 Mentor-Apprentice Ratio)");
    authorities.push("<strong>[Wage Stepping Floor]</strong> Statutory Tier 1 Wage Floor (50% of Regional Journeyman Prevailing Benchmark)");
    authorities.push("<strong>[Zero Student Debt]</strong> 100% Employer-Paid Rotational Training with Zero Added Student Debt");
    authorities.push("<strong>[Guild Defense Shield]</strong> Anti-TRAP Consumer Protection & Collective Defense Against Employer Clawbacks");
  }

  const totalAccredited = runtimeHours + plaHours;
  document.getElementById("runtimeHours").textContent = `${runtimeHours.toLocaleString()} hrs`;
  
  const plaAuditRow = document.getElementById("plaAuditRow");
  const isPlaCapped = plaHours >= 4000;
  if (plaAuditRow) plaAuditRow.classList.toggle("pla-capped", isPlaCapped);
  
  document.getElementById("plaHours").textContent = isPlaCapped 
    ? "4,000 hrs (50% Statutory Cap Reached)" 
    : `${plaHours.toLocaleString()} hrs (Max 4,000 hrs / 50% cap)`;
  document.getElementById("totalHours").textContent = `${totalAccredited.toLocaleString()} hrs`;

  const plaNoticeA = document.getElementById("plaNoticeA");
  if (plaNoticeA) plaNoticeA.style.display = (currentTrack === "TRACK_A" && isPlaCapped) ? "block" : "none";
  
  const plaNoticeB = document.getElementById("plaNoticeB");
  if (plaNoticeB) plaNoticeB.style.display = (currentTrack === "TRACK_B" && isPlaCapped) ? "block" : "none";

  const plaNoticeEntry = document.getElementById("plaNoticeEntry");
  if (plaNoticeEntry) plaNoticeEntry.style.display = (currentTrack === "TRACK_ENTRY" && isPlaCapped) ? "block" : "none";

  // Render Authorities
  const authList = document.getElementById("authoritiesList");
  authList.innerHTML = "";
  authorities.forEach(auth => {
    const li = document.createElement("li");
    li.innerHTML = auth;
    authList.appendChild(li);
  });

  // Render Day 1 Submission Checklist
  const subList = document.getElementById("submissionList");
  if (subList) {
    subList.innerHTML = "";
    if (submissionChecklist.length === 0) {
      submissionChecklist.push("Standard JATC Apprenticeship Registration Portfolio");
    }
    submissionChecklist.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      subList.appendChild(li);
    });
  }

  const linksGrid = document.getElementById("specLinksGrid");
  linksGrid.innerHTML = "";
  const baseUrl = "https://github.com/DanielTolczyk/the-cyber-trade-project/blob/main";
  const specLinks = [];

  specLinks.push({
    title: "10-Year Industry Transition Roadmap & Grandfathering Windows",
    url: `${baseUrl}/governance/transition-plan.md`,
    tag: "Transition Plan"
  });

  if (tierCode === "JOURNEYMAN" || tierCode === "MASTER") {
    specLinks.push({
      title: "Licensure Standards & Career Progression",
      url: `${baseUrl}/framework/licensure-and-progression.md`,
      tag: "Progression Guide"
    });
  } else {
    specLinks.push({
      title: "Apprenticeship Standards & 8,000-Hour Rotations",
      url: `${baseUrl}/framework/apprenticeship-standards.md`,
      tag: "Training Standard"
    });
  }

  specLinks.push({
    title: "Standardized Wage Scales & Hourly Prevailing Benchmark (RJPB)",
    url: `${baseUrl}/framework/wage-scales.md`,
    tag: "Compensation"
  });

  specLinks.push({
    title: "Pillar V: Personal Liability & The Right of Technical Refusal",
    url: `${baseUrl}/pillars/05_personal-liability-and-refusal.md`,
    tag: "Worker Protection"
  });

  specLinks.forEach(item => {
    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "spec-link-item";
    a.innerHTML = `
      <span>${item.title}</span>
      <span class="spec-link-tag">${item.tag} &rarr;</span>
    `;
    linksGrid.appendChild(a);
  });
}

function initChips() {
  const benchmarkContainer = document.getElementById("benchmarkChipsB");
  if (benchmarkContainer) {
    benchmarkContainer.innerHTML = "";
    BENCHMARK_CERTS.forEach(cert => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `chip-btn benchmark ${selectedCertsB.has(cert.code) ? "selected" : ""}`;
      btn.textContent = cert.code;
      btn.title = cert.label;
      btn.addEventListener("click", () => {
        if (selectedCertsB.has(cert.code)) selectedCertsB.delete(cert.code);
        else selectedCertsB.add(cert.code);
        btn.classList.toggle("selected");
        calculateStanding();
      });
      benchmarkContainer.appendChild(btn);
    });
  }

  const practicalContainer = document.getElementById("practicalChipsB");
  if (practicalContainer) {
    practicalContainer.innerHTML = "";
    PRACTICAL_CERTS.forEach(cert => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `chip-btn ${selectedCertsB.has(cert.code) ? "selected" : ""}`;
      btn.textContent = cert.label;
      btn.addEventListener("click", () => {
        if (selectedCertsB.has(cert.code)) selectedCertsB.delete(cert.code);
        else selectedCertsB.add(cert.code);
        btn.classList.toggle("selected");
        calculateStanding();
      });
      practicalContainer.appendChild(btn);
    });
  }
}

document.querySelectorAll(".track-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".track-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".track-panel").forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    currentTrack = tab.getAttribute("data-track");

    if (currentTrack === "TRACK_A") document.getElementById("panelTrackA").classList.add("active");
    else if (currentTrack === "TRACK_B") document.getElementById("panelTrackB").classList.add("active");
    else if (currentTrack === "TRACK_C") document.getElementById("panelTrackC").classList.add("active");
    else if (currentTrack === "TRACK_ENTRY") document.getElementById("panelTrackEntry").classList.add("active");

    calculateStanding();
  });
});

document.getElementById("cyberYearsA").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const hrs = Math.round(yrs * 2000);
  const suffix = yrs >= 8 ? "8+ Years (16,000+ hrs)" : `${formatYearsMonths(yrs)} (${hrs.toLocaleString()} hrs)`;
  document.getElementById("cyberYearsValA").textContent = suffix;
  calculateStanding();
});

document.getElementById("sysadminYearsA").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const pla = Math.min(2000, Math.round(yrs * 1000));
  const capText = yrs >= 2 ? " - Max Cap" : "";
  document.getElementById("sysadminYearsValA").textContent = `${formatYearsMonths(yrs)} (${pla.toLocaleString()} hrs PLA${capText})`;
  calculateStanding();
});

document.getElementById("militaryCyberYearsA").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const pla = Math.min(4000, Math.round(yrs * 2000));
  const capText = yrs >= 2 ? " - Max Cap" : "";
  document.getElementById("militaryCyberYearsValA").textContent = `${formatYearsMonths(yrs)} (${pla.toLocaleString()} hrs PLA${capText})`;
  calculateStanding();
});

document.getElementById("cyberYearsB").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const hrs = Math.round(yrs * 2000);
  const suffix = yrs >= 8 ? "8+ Years (16,000+ hrs)" : `${formatYearsMonths(yrs)} (${hrs.toLocaleString()} hrs)`;
  document.getElementById("cyberYearsValB").textContent = suffix;
  calculateStanding();
});

document.getElementById("sysadminYearsB").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const pla = Math.min(2000, Math.round(yrs * 1000));
  const capText = yrs >= 2 ? " - Max Cap" : "";
  document.getElementById("sysadminYearsValB").textContent = `${formatYearsMonths(yrs)} (${pla.toLocaleString()} hrs PLA${capText})`;
  calculateStanding();
});

document.getElementById("militaryCyberYearsB").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const pla = Math.min(4000, Math.round(yrs * 2000));
  const capText = yrs >= 2 ? " - Max Cap" : "";
  document.getElementById("militaryCyberYearsValB").textContent = `${formatYearsMonths(yrs)} (${pla.toLocaleString()} hrs PLA${capText})`;
  calculateStanding();
});

document.getElementById("cyberYearsC").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const hrs = Math.round(yrs * 2000);
  const suffix = yrs >= 8 ? "8+ Years (16,000+ hrs)" : `${formatYearsMonths(yrs)} (${hrs.toLocaleString()} hrs)`;
  document.getElementById("cyberYearsValC").textContent = suffix;
  calculateStanding();
});

document.getElementById("sysadminYearsEntry").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const pla = Math.min(2000, Math.round(yrs * 1000));
  const capText = yrs >= 2 ? " - Max Cap" : "";
  document.getElementById("sysadminYearsValEntry").textContent = `${formatYearsMonths(yrs)} (${pla.toLocaleString()} hrs PLA${capText})`;
  calculateStanding();
});

document.getElementById("militaryCyberYearsEntry").addEventListener("input", (e) => {
  const yrs = parseFloat(e.target.value);
  const pla = Math.min(4000, Math.round(yrs * 2000));
  const capText = yrs >= 2 ? " - Max Cap" : "";
  document.getElementById("militaryCyberYearsValEntry").textContent = `${formatYearsMonths(yrs)} (${pla.toLocaleString()} hrs PLA${capText})`;
  calculateStanding();
});

[
  "degBachelorA", "degMasterA", "hasBootcampA", "hasBugBountyA", "hasAffidavitsA", "hasArtifactsA",
  "degBachelorB", "degMasterB", "hasBootcampB", "hasBugBountyB", "hasOralBoardB",
  "rangeExamPassed", "hasArtifactsC", "hasBugBountyC", "degBachelorC",
  "hasBootcampGradEntry", "hasMidProgramEnrolledEntry", "passedPreApprenticeExamEntry", "hasBugBountyEntry", "degBachelorEntry"
].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", calculateStanding);
});

document.getElementById("btnCopySummary").addEventListener("click", () => {
  const title = document.getElementById("standingTitle").textContent;
  const totalHrs = document.getElementById("totalHours").textContent;
  const trackLabel = currentTrack === "TRACK_A" ? "Track A (Career Runtime & Peer Review)" :
                     currentTrack === "TRACK_B" ? "Track B (Benchmark Fast-Track)" :
                     currentTrack === "TRACK_C" ? "Track C (Practical Range Challenge)" :
                     "Entry Pipeline (Students & Stranded Learners)";

  const appUrl = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "https://danieltolczyk.github.io/cyber-trade-estimator/"
    : window.location.href.split("#")[0];

  const summary = `[TRADE EVALUATION] ${title} (${totalHrs})\n\n` +
    `If cybersecurity transitioned to an accredited skilled trade today, what tier would you place in on Day 1?\n\n` +
    `• Standing: ${title}\n` +
    `• Accredited Runtime: ${totalHrs}\n` +
    `• Transition Pathway: ${trackLabel}\n` +
    `• Key Protections: Statutory Prevailing Wage Floors, 2:1 Line-of-Sight Mentorship & Legal Right of Technical Refusal\n\n` +
    `Discover your trade standing, Prior Learning credits, and milestone path:\n` +
    `${appUrl}\n\n` +
    `#Cybersecurity #InfoSec #Apprenticeship #WorkforceDevelopment #CyberTradeProject`;

  navigator.clipboard.writeText(summary).then(() => {
    const btn = document.getElementById("btnCopySummary");
    const orig = btn.textContent;
    btn.textContent = "✓ Copied to Clipboard!";
    btn.style.backgroundColor = "#059669";
    btn.style.borderColor = "#10b981";
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.backgroundColor = "";
      btn.style.borderColor = "";
    }, 2500);
  });
});

document.getElementById("btnReset").addEventListener("click", () => {
  selectedCertsB.clear();

  document.getElementById("cyberYearsA").value = 0.0;
  document.getElementById("cyberYearsValA").textContent = "0 Months (0 hrs)";
  document.getElementById("sysadminYearsA").value = 0.0;
  document.getElementById("sysadminYearsValA").textContent = "0 Months (0 hrs PLA)";
  document.getElementById("militaryCyberYearsA").value = 0.0;
  document.getElementById("militaryCyberYearsValA").textContent = "0 Months (0 hrs PLA)";
  document.getElementById("degBachelorA").checked = false;
  document.getElementById("degMasterA").checked = false;
  if (document.getElementById("hasBootcampA")) document.getElementById("hasBootcampA").checked = false;
  document.getElementById("hasBugBountyA").checked = false;
  document.getElementById("hasAffidavitsA").checked = false;
  document.getElementById("hasArtifactsA").checked = false;

  document.getElementById("cyberYearsB").value = 0.0;
  document.getElementById("cyberYearsValB").textContent = "0 Months (0 hrs)";
  document.getElementById("sysadminYearsB").value = 0.0;
  document.getElementById("sysadminYearsValB").textContent = "0 Months (0 hrs PLA)";
  document.getElementById("militaryCyberYearsB").value = 0.0;
  document.getElementById("militaryCyberYearsValB").textContent = "0 Months (0 hrs PLA)";
  document.getElementById("degBachelorB").checked = false;
  document.getElementById("degMasterB").checked = false;
  if (document.getElementById("hasBootcampB")) document.getElementById("hasBootcampB").checked = false;
  document.getElementById("hasBugBountyB").checked = false;
  if (document.getElementById("hasOralBoardB")) document.getElementById("hasOralBoardB").checked = false;

  document.getElementById("rangeExamPassed").checked = false;
  document.getElementById("cyberYearsC").value = 0.0;
  document.getElementById("cyberYearsValC").textContent = "0 Months (0 hrs)";
  if (document.getElementById("hasArtifactsC")) document.getElementById("hasArtifactsC").checked = false;
  document.getElementById("hasBugBountyC").checked = false;
  document.getElementById("degBachelorC").checked = false;

  document.getElementById("sysadminYearsEntry").value = 0.0;
  document.getElementById("sysadminYearsValEntry").textContent = "0 Months (0 hrs PLA)";
  document.getElementById("militaryCyberYearsEntry").value = 0.0;
  document.getElementById("militaryCyberYearsValEntry").textContent = "0 Months (0 hrs PLA)";
  if (document.getElementById("hasBootcampGradEntry")) document.getElementById("hasBootcampGradEntry").checked = false;
  if (document.getElementById("hasMidProgramEnrolledEntry")) document.getElementById("hasMidProgramEnrolledEntry").checked = false;
  if (document.getElementById("passedPreApprenticeExamEntry")) document.getElementById("passedPreApprenticeExamEntry").checked = false;
  document.getElementById("hasBugBountyEntry").checked = false;
  document.getElementById("degBachelorEntry").checked = false;

  initChips();
  calculateStanding();
});

document.getElementById("btnSample").addEventListener("click", () => {
  if (currentTrack === "TRACK_A") {
    document.getElementById("cyberYearsA").value = 4.5;
    document.getElementById("cyberYearsValA").textContent = "4 Years, 6 Months (9,000 hrs)";
    document.getElementById("sysadminYearsA").value = 1.0;
    document.getElementById("sysadminYearsValA").textContent = "1 Year (1,000 hrs PLA)";
    document.getElementById("degBachelorA").checked = true;
    document.getElementById("hasAffidavitsA").checked = true;
  } else if (currentTrack === "TRACK_B") {
    selectedCertsB = new Set(["CISSP", "OSCP"]);
    document.getElementById("cyberYearsB").value = 4.0;
    document.getElementById("cyberYearsValB").textContent = "4 Years (8,000 hrs)";
    document.getElementById("degBachelorB").checked = true;
  } else if (currentTrack === "TRACK_C") {
    document.getElementById("rangeExamPassed").checked = true;
  } else if (currentTrack === "TRACK_ENTRY") {
    document.getElementById("hasBootcampGradEntry").checked = true;
    document.getElementById("passedPreApprenticeExamEntry").checked = true;
  }
  initChips();
  calculateStanding();
});

function init() {
  initChips();
  calculateStanding();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
