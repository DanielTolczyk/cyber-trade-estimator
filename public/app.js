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
          ? "Prerequisite Met: Check to confirm two peer reference affidavits." 
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
          ? "Senior Prerequisite Met: Check to verify three defense artifacts." 
          : "Requires 8+ Years (16,000 hrs) Runtime to Enable.";
      }
      if (!canHaveArtifacts) elArt.checked = false;
    }

    const hasAffidavits = elAff ? elAff.checked : false;
    const hasArtifacts = elArt ? elArt.checked : false;

    const canHaveOral = canHaveArtifacts && hasArtifacts;
    const elOralA = document.getElementById("hasOralBoardA");
    const itemOralA = document.getElementById("itemOralBoardA");
    const hintOralA = document.getElementById("hintOralBoardA");
    if (elOralA && itemOralA) {
      elOralA.disabled = !canHaveOral;
      itemOralA.classList.toggle("disabled", !canHaveOral);
      if (hintOralA) {
        hintOralA.textContent = canHaveOral
          ? "Oral Board Defense Ready: Check if portfolio defense has been completed."
          : "Requires 8+ Years Runtime + 3 Artifacts to Enable.";
      }
      if (!canHaveOral) elOralA.checked = false;
    }
    const hasOralBoardA = elOralA ? elOralA.checked : false;

    if (cyberYears > 0) submissionChecklist.push(`W-2 / 1099 / DD-214 Operational Runtime Verification (${cyberYears} Yrs / ${runtimeHours.toLocaleString()} hrs)`);
    if (sysadminYears > 0) submissionChecklist.push(`Documented IT / SysAdmin Production Work (${sysadminYears} Yrs / ${Math.min(2000, sysadminYears * 1000).toLocaleString()} hrs PLA)`);
    if (militaryYears > 0) submissionChecklist.push(`DD-214 Military Cyber MOS Record (${militaryYears} Yrs / ${Math.min(4000, militaryYears * 2000).toLocaleString()} hrs PLA)`);
    if (hasBach) submissionChecklist.push("Accredited Bachelor's Degree Transcript (+2,000 hrs PLA)");
    if (hasMast) submissionChecklist.push("Accredited Master's Degree Transcript (+3,000 hrs PLA)");
    if (hasBootcampA) submissionChecklist.push("Bootcamp Certificate & Coursework Portfolio (144 hr RTI Articulation Waiver)");
    if (hasBounty) submissionChecklist.push("Verified Vulnerability Disclosures / Published CVEs (+1,500 hrs Domain 4)");
    if (hasAffidavits) submissionChecklist.push("Two (2) Sworn Professional Peer Reference Affidavits");
    if (hasArtifacts) submissionChecklist.push("Three (3) Sanitized Technical Defense Artifacts");
    if (hasOralBoardA) submissionChecklist.push("Master Oral Board Defense Examination Verification");

    if (totalAccredited >= 16000 || cyberYears >= 8.0) {
      if (hasAffidavits && hasArtifacts && hasOralBoardA) {
        tierCode = "MASTER";
        standingTitle = "Conferred Master Practitioner";
        badgeText = "TRACK A • MASTER CONFERRED";
        progressPct = 100;
        nextMilestoneText = "Track A Senior Portfolio Finalized: 8+ years runtime + 2 peer affidavits + 3 defense artifacts + Oral Board defense completed. Master Practitioner standing awarded.";
      } else if (hasAffidavits && hasArtifacts) {
        tierCode = "JOURNEYMAN";
        standingTitle = "Master Candidate (Oral Board Ready)";
        badgeText = "TRACK A • MASTER DEFENSE READY";
        progressPct = 96; // Stops right short of 100% Master dot!
        nextMilestoneText = "Senior Portfolio Ready: 16,000+ accredited runtime hours and 3 defense artifacts verified. Schedule and complete your Master Oral Board Defense to finalize full Master Practitioner licensure.";
      } else if (hasAffidavits) {
        tierCode = "JOURNEYMAN";
        standingTitle = "Licensed Journeyman (Senior Runtime Met)";
        badgeText = "TRACK A • JOURNEYMAN UNLOCKED";
        progressPct = 85;
        nextMilestoneText = "Journeyman Licensure Unlocked: 16,000+ accredited runtime hours met. Assemble Three (3) Sanitized Defense Artifacts to qualify for Master Oral Board Defense.";
      } else {
        tierCode = "TIER_4";
        standingTitle = "Apprentice Tier 4 (Affidavits Required)";
        badgeText = "TRACK A • AFFIDAVITS REQUIRED";
        progressPct = 78;
        nextMilestoneText = "Runtime Threshold Met (8+ Yrs): Track A Journeyman Grandfathering requires Two (2) Peer Reference Affidavits confirming core operational execution. Check the box above to verify.";
      }
    } else if (totalAccredited >= 8000 || cyberYears >= 4.0) {
      if (hasAffidavits) {
        tierCode = "JOURNEYMAN";
        standingTitle = "Licensed Journeyman";
        badgeText = "TRACK A • JOURNEYMAN UNLOCKED";
        const remHours = Math.max(0, 16000 - totalAccredited);
        const remYrs = (remHours / 2000).toFixed(1);
        progressPct = 80 + Math.min(15, ((totalAccredited - 8000) / 8000) * 15);
        nextMilestoneText = `Track A Grandfathering Qualified (Zero Certs Required): Direct Journeyman Licensure. You are ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) and 3 artifacts from Master Practitioner standing.`;
      } else {
        tierCode = "TIER_4";
        standingTitle = "Apprentice Tier 4 (Affidavits Required)";
        badgeText = "TRACK A • AFFIDAVITS REQUIRED";
        progressPct = 78;
        nextMilestoneText = "Runtime Threshold Met (4+ Yrs): Track A Journeyman Grandfathering requires Two (2) Peer Reference Affidavits confirming core operational execution. Check the box above to verify.";
      }
    } else if (totalAccredited >= 6000) {
      tierCode = "TIER_4";
      standingTitle = "Advanced Registered Apprentice (Tier 4)";
      badgeText = "TIER 4 UNLOCKED";
      progressPct = 60 + ((totalAccredited - 6000) / 2000) * 20;
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Grandfathering Placement: You qualify for Tier 4. Only ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else if (totalAccredited >= 4000) {
      tierCode = "TIER_3";
      standingTitle = "Intermediate Registered Apprentice (Tier 3)";
      badgeText = "TIER 3 UNLOCKED";
      progressPct = 40 + ((totalAccredited - 4000) / 2000) * 20;
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Grandfathering Placement: You qualify for Tier 3. ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else if (totalAccredited >= 2000) {
      tierCode = "TIER_2";
      standingTitle = "Progressing Registered Apprentice (Tier 2)";
      badgeText = "TIER 2 UNLOCKED";
      progressPct = 20 + ((totalAccredited - 2000) / 2000) * 20;
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Grandfathering Placement: You qualify for Tier 2. ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else {
      tierCode = "TIER_1";
      standingTitle = "Entry Registered Apprentice (Tier 1)";
      badgeText = "TIER 1 UNLOCKED";
      progressPct = (totalAccredited / 2000) * 20;
      nextMilestoneText = "Entry Registered Apprentice: Complete 8,000 operational hours of structured paid rotations with zero student debt.";
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
    
    const canHaveArtifactsB = hasBenchmark && (totalAccredited >= 12000 || cyberYears >= 6.0);
    const elArtB = document.getElementById("hasArtifactsB");
    const itemArtB = document.getElementById("itemArtifactsB");
    const hintArtB = document.getElementById("hintArtifactsB");
    if (elArtB && itemArtB) {
      elArtB.disabled = !canHaveArtifactsB;
      itemArtB.classList.toggle("disabled", !canHaveArtifactsB);
      if (hintArtB) {
        hintArtB.textContent = canHaveArtifactsB 
          ? "Senior Fast-Track Met: Check to verify three defense artifacts." 
          : "Requires 6+ Years Runtime + Benchmark Cert to Enable.";
      }
      if (!canHaveArtifactsB) elArtB.checked = false;
    }
    const hasArtifactsB = elArtB ? elArtB.checked : false;

    const canHaveOralBoardB = canHaveArtifactsB && hasArtifactsB;
    const elOral = document.getElementById("hasOralBoardB");
    const itemOral = document.getElementById("itemOralBoardB");
    const hintOral = document.getElementById("hintOralBoardB");
    if (elOral && itemOral) {
      elOral.disabled = !canHaveOralBoardB;
      itemOral.classList.toggle("disabled", !canHaveOralBoardB);
      if (hintOral) {
        hintOral.textContent = canHaveOralBoardB 
          ? "Oral Board Defense Ready: Check if portfolio defense has been completed." 
          : "Requires 6+ Years Runtime + Benchmark Cert + 3 Artifacts to Enable.";
      }
      if (!canHaveOralBoardB) elOral.checked = false;
    }
    const hasOralBoardB = elOral ? elOral.checked : false;

    if (cyberYears > 0) submissionChecklist.push(`W-2 / 1099 / DD-214 Operational Runtime Verification (${cyberYears} Yrs / ${runtimeHours.toLocaleString()} hrs)`);
    selectedCertsB.forEach(c => submissionChecklist.push(`Certified Credential Record: ${c} (Permanent RTI Credit)`));
    if (sysadminYears > 0) submissionChecklist.push(`Documented IT / SysAdmin Production Work (${sysadminYears} Yrs / ${Math.min(2000, sysadminYears * 1000).toLocaleString()} hrs PLA)`);
    if (militaryYears > 0) submissionChecklist.push(`DD-214 Military Cyber MOS Record (${militaryYears} Yrs / ${Math.min(4000, militaryYears * 2000).toLocaleString()} hrs PLA)`);
    if (hasBach) submissionChecklist.push("Accredited Bachelor's Degree Transcript (+2,000 hrs PLA)");
    if (hasMast) submissionChecklist.push("Accredited Master's Degree Transcript (+3,000 hrs PLA)");
    if (hasBootcampB) submissionChecklist.push("Bootcamp Certificate & Coursework Portfolio (144 hr RTI Articulation Waiver)");
    if (hasBounty) submissionChecklist.push("Verified Vulnerability Disclosures / Published CVEs (+1,500 hrs Domain 4)");
    if (hasArtifactsB) submissionChecklist.push("Three (3) Sanitized Technical Defense Artifacts");
    if (hasOralBoardB) submissionChecklist.push("Master Oral Board Defense Examination Verification");

    if (hasBenchmark && (totalAccredited >= 12000 || cyberYears >= 6.0)) {
      if (hasArtifactsB && hasOralBoardB) {
        tierCode = "MASTER";
        standingTitle = "Conferred Master Practitioner";
        badgeText = "TRACK B • MASTER CONFERRED";
        progressPct = 100;
        nextMilestoneText = "Track B Senior Fast-Track Finalized: Benchmark RTI + 6+ years verified runtime + 3 defense artifacts + Master Oral Board defense completed. Master Practitioner standing awarded.";
      } else if (hasArtifactsB) {
        tierCode = "JOURNEYMAN";
        standingTitle = "Master Candidate (Oral Board Ready)";
        badgeText = "TRACK B • MASTER DEFENSE READY";
        progressPct = 96; // Stops right short of 100% Master dot!
        nextMilestoneText = "Senior Fast-Track Ready: 12,000+ accredited runtime hours, Benchmark RTI, and 3 defense artifacts verified. Schedule and complete your Master Oral Board Defense to finalize full Master Practitioner licensure.";
      } else {
        tierCode = "JOURNEYMAN";
        standingTitle = "Licensed Journeyman (Senior Fast-Track Met)";
        badgeText = "TRACK B • JOURNEYMAN UNLOCKED";
        progressPct = 85;
        nextMilestoneText = "Journeyman Fast-Track Unlocked: Senior 6+ year runtime and Benchmark RTI met. Assemble Three (3) Sanitized Defense Artifacts to qualify for Master Oral Board Defense.";
      }
    } else if (hasBenchmark && (totalAccredited >= 8000 || cyberYears >= 4.0)) {
      tierCode = "JOURNEYMAN";
      standingTitle = "Licensed Journeyman";
      badgeText = "TRACK B • JOURNEYMAN UNLOCKED";
      const remHours = Math.max(0, 12000 - totalAccredited);
      const remYrs = (remHours / 2000).toFixed(1);
      progressPct = 80 + Math.min(15, ((totalAccredited - 8000) / 4000) * 15);
      nextMilestoneText = `Track B Benchmark Fast-Track Qualified: Direct Journeyman Licensure. You are ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) from Master Practitioner standing.`;
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
      nextMilestoneText = `Grandfathering Placement: You qualify for Tier 4. Only ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else if (totalAccredited >= 4000) {
      tierCode = "TIER_3";
      standingTitle = "Intermediate Registered Apprentice (Tier 3)";
      badgeText = "TIER 3 UNLOCKED";
      progressPct = 40 + Math.min(18, ((totalAccredited - 4000) / 2000) * 20);
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Grandfathering Placement: You qualify for Tier 3. ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else if (totalAccredited >= 2000) {
      tierCode = "TIER_2";
      standingTitle = "Progressing Registered Apprentice (Tier 2)";
      badgeText = "TIER 2 UNLOCKED";
      progressPct = 20 + Math.min(18, ((totalAccredited - 2000) / 2000) * 20);
      const remHours = 8000 - totalAccredited;
      const remYrs = (remHours / 2000).toFixed(1);
      nextMilestoneText = `Grandfathering Placement: You qualify for Tier 2. ${remHours.toLocaleString()} operational hours (approx. ${remYrs} yrs) remaining to Journeyman Licensure.`;
    } else {
      tierCode = "TIER_1";
      standingTitle = "Entry Registered Apprentice (Tier 1)";
      badgeText = "TIER 1 UNLOCKED";
      progressPct = Math.min(18, (totalAccredited / 2000) * 20);
      nextMilestoneText = "Entry Registered Apprentice: Complete paid rotational program to Journeyman Licensure.";
    }
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

    const canHaveOralBoardC = canHaveArtifactsC && hasArtifactsC;
    const elOralC = document.getElementById("hasOralBoardC");
    const itemOralC = document.getElementById("itemOralBoardC");
    const hintOralC = document.getElementById("hintOralBoardC");
    if (elOralC && itemOralC) {
      elOralC.disabled = !canHaveOralBoardC;
      itemOralC.classList.toggle("disabled", !canHaveOralBoardC);
      if (hintOralC) {
        hintOralC.textContent = canHaveOralBoardC
          ? "Oral Board Defense Ready: Check if portfolio defense has been completed."
          : "Requires Range Exam + 8+ Years Runtime + 3 Artifacts to Enable.";
      }
      if (!canHaveOralBoardC) elOralC.checked = false;
    }
    const hasOralBoardC = elOralC ? elOralC.checked : false;

    if (hasBounty) plaHours += 1500;
    if (hasBach) plaHours += 2000;
    plaHours = Math.min(4000, plaHours);

    if (passedRangeExam) {
      runtimeHours = 8000 + Math.round(cyberYearsC * 2000);
      if (cyberYearsC >= 8.0) {
        if (hasArtifactsC && hasOralBoardC) {
          tierCode = "MASTER";
          standingTitle = "Conferred Master Practitioner";
          badgeText = "TRACK C • MASTER CONFERRED";
          progressPct = 100;
          nextMilestoneText = "Track C Senior Fast-Track Finalized: Range Challenge Passed + 8+ years runtime + 3 defense artifacts + Master Oral Board defense completed. Master Practitioner standing awarded.";
        } else if (hasArtifactsC) {
          tierCode = "JOURNEYMAN";
          standingTitle = "Master Candidate (Senior Range Challenge Winner)";
          badgeText = "TRACK C • MASTER DEFENSE READY";
          progressPct = 96;
          nextMilestoneText = "Senior Range Challenge Winner (8+ Yrs Runtime): Journeyman Licensure awarded and 3 defense artifacts verified. Schedule and complete your Master Oral Board Defense to finalize full Master Practitioner standing.";
        } else {
          tierCode = "JOURNEYMAN";
          standingTitle = "Licensed Journeyman (Senior Range Certified)";
          badgeText = "TRACK C • JOURNEYMAN UNLOCKED";
          progressPct = 85;
          nextMilestoneText = "Senior Range Winner (8+ Yrs Runtime): Journeyman Licensure awarded. Assemble Three (3) Sanitized Defense Artifacts to qualify for Master Oral Board Defense.";
        }
      } else {
        tierCode = "JOURNEYMAN";
        standingTitle = "Licensed Journeyman (Range Certified)";
        badgeText = "TRACK C • JOURNEYMAN UNLOCKED";
        progressPct = 80;
        nextMilestoneText = "Track C Practical Challenge Passed: Direct Licensed Journeyman standing (8,000 hr legal baseline). You are 4,000 operational hours (approx. 2.0 yrs) from standard Master elevation.";
      }
      submissionChecklist.push("JATC 4-Hour Practical Challenge Examination Passing Score Report (8,000 hr Baseline)");
      if (cyberYearsC > 0) submissionChecklist.push(`Operational Runtime Verification Records (${cyberYearsC} Yrs)`);
      if (hasArtifactsC) submissionChecklist.push("Three (3) Sanitized Technical Defense Artifacts / CVE Disclosures");
      if (hasOralBoardC) submissionChecklist.push("Master Oral Board Defense Examination Verification");
    } else {
      tierCode = plaHours >= 2000 ? "TIER_2" : "TIER_1";
      standingTitle = plaHours >= 2000 ? "Progressing Registered Apprentice (Tier 2)" : "Candidate for Practical Range Challenge";
      badgeText = "TRACK C • READY FOR RANGE EXAM";
      progressPct = (plaHours / 2000) * 20;
      nextMilestoneText = "Practical Range Track: Pass the proctored 4-hour hands-on challenge examination to receive direct Journeyman Licensure (8,000 hr baseline).";
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

  // Render Dynamic Path to Next Milestone Roadmap
  let advancementTarget = "Path to Next Milestone";
  let advancementItems = [];

  if (tierCode === "MASTER") {
    advancementTarget = "Pinnacle Standing Achieved: Master Practitioner";
    advancementItems.push("<strong>Grandfathering Licensure:</strong> Full Master standing awarded upon Board charter.");
    advancementItems.push("<strong>Statutory Authority:</strong> Eligible for Designated Master of Record (MoR) appointments.");
    advancementItems.push("<strong>Triennial CTD Maintenance:</strong> Complete 120 hours Continuing Technical Development every 3 years ($0 fee).");
  } else if (tierCode === "JOURNEYMAN") {
    const remHours = Math.max(0, (currentTrack === "TRACK_A" ? 16000 : 12000) - totalAccredited);
    const remYrs = (remHours / 2000).toFixed(1);
    advancementTarget = "Next Milestone: Master Practitioner (12k–16k hrs)";
    if (remHours > 0) {
      advancementItems.push(`<strong>Operational Runtime:</strong> Log ${remHours.toLocaleString()} additional verified runtime hours (~${remYrs} years).`);
    } else {
      advancementItems.push("<strong>Operational Runtime Met:</strong> Senior runtime thresholds satisfied.");
    }
    advancementItems.push("<strong>Defense Portfolio:</strong> Assemble Three (3) Sanitized Technical Defense Artifacts (blueprints, post-mortems, CVEs).");
    advancementItems.push("<strong>Oral Board Defense:</strong> Successfully defend architectural portfolio before 3-member Master Board panel.");
    advancementItems.push("<strong>Specialty Endorsement:</strong> Earn at least one Board Specialty Endorsement (e.g. SE-MED, SE-ICS, SE-DFIR).");
  } else if (currentTrack === "TRACK_ENTRY" && !document.getElementById("passedPreApprenticeExamEntry").checked) {
    advancementTarget = "Next Milestone: Registered Apprentice Tier 1 (Dispatch Ready)";
    advancementItems.push("<strong>Practical Benchmark Exam:</strong> Pass the free proctored hands-on Pre-Apprenticeship Practical Benchmark Challenge (Linux, networking & defensive Python).");
    advancementItems.push("<strong>Coursework Articulation:</strong> Submit bootcamp syllabus or transcripts for up to 144 hours Year 1 RTI classroom credit.");
    advancementItems.push("<strong>Paid Dispatch Placement:</strong> Enter the JATC Dispatch Clearinghouse for direct placement with an employer sponsor ($25–$32/hr base).");
  } else {
    // Apprentice Tiers 1 through 4
    const remHours = Math.max(0, 8000 - totalAccredited);
    const remYrs = (remHours / 2000).toFixed(1);
    advancementTarget = "Next Milestone: Licensed Journeyman (8,000 hrs)";
    advancementItems.push(`<strong>Operational Runtime:</strong> Complete ${remHours.toLocaleString()} additional verified rotational runtime hours (~${remYrs} years).`);
    advancementItems.push("<strong>Rotational Domains:</strong> Complete mandatory runtime distribution across 5 core defensive engineering domains.");
    advancementItems.push("<strong>Classroom Instruction (RTI):</strong> Complete remaining 144 hr/yr Related Technical Instruction modules (100% employer-funded).");
    if (currentTrack === "TRACK_A") {
      advancementItems.push("<strong>Grandfathering Fast-Track:</strong> Alternatively, submit Two (2) Sworn Peer Reference Affidavits once 8,000 total hours are reached.");
    } else if (currentTrack === "TRACK_B") {
      advancementItems.push("<strong>Benchmark Fast-Track:</strong> Select a recognized benchmark credential (CISSP, CISM, CISA, CCSP) to unlock direct grandfathered licensure once 8,000 hours are reached.");
    } else {
      advancementItems.push("<strong>Licensure Examination:</strong> Pass the proctored NCTB Hands-On Practical Challenge Examination.");
    }
  }

  const advHeader = document.getElementById("advancementHeader");
  const advList = document.getElementById("advancementList");
  if (advHeader && advList) {
    advHeader.textContent = advancementTarget;
    advList.innerHTML = "";
    advancementItems.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = item;
      advList.appendChild(li);
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
  "degBachelorA", "degMasterA", "hasBootcampA", "hasBugBountyA", "hasAffidavitsA", "hasArtifactsA", "hasOralBoardA",
  "degBachelorB", "degMasterB", "hasBootcampB", "hasBugBountyB", "hasArtifactsB", "hasOralBoardB",
  "rangeExamPassed", "hasArtifactsC", "hasOralBoardC", "hasBugBountyC", "degBachelorC",
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

  const plainText = [
    `[TRADE EVALUATION] ${title} (${totalHrs})`,
    "",
    "If cybersecurity transitioned to an accredited skilled trade today, what tier would you qualify for?",
    "",
    `• Standing: ${title}\n• Accredited Runtime: ${totalHrs}\n• Transition Pathway: ${trackLabel}\n• Key Protections: Statutory Prevailing Wage Floors, 2:1 Line-of-Sight Mentorship & Legal Right of Technical Refusal`,
    "",
    `Discover your trade standing, Prior Learning credits, and milestone path:\n${appUrl}`,
    "",
    "#Cybersecurity #InfoSec #Apprenticeship #WorkforceDevelopment #CyberTradeProject"
  ].join("\n");

  const htmlText = [
    `<p><strong>[TRADE EVALUATION] ${title} (${totalHrs})</strong></p>`,
    "<p>If cybersecurity transitioned to an accredited skilled trade today, what tier would you qualify for?</p>",
    `<p>• Standing: ${title}<br>• Accredited Runtime: ${totalHrs}<br>• Transition Pathway: ${trackLabel}<br>• Key Protections: Statutory Prevailing Wage Floors, 2:1 Line-of-Sight Mentorship &amp; Legal Right of Technical Refusal</p>`,
    `<p>Discover your trade standing, Prior Learning credits, and milestone path:<br><a href="${appUrl}">${appUrl}</a></p>`,
    "<p>#Cybersecurity #InfoSec #Apprenticeship #WorkforceDevelopment #CyberTradeProject</p>"
  ].join("\n");

  const showCopiedFeedback = () => {
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
  };

  if (navigator.clipboard && window.ClipboardItem) {
    const blobPlain = new Blob([plainText], { type: "text/plain" });
    const blobHtml = new Blob([htmlText], { type: "text/html" });
    navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": blobPlain,
        "text/html": blobHtml
      })
    ]).then(showCopiedFeedback).catch(() => {
      navigator.clipboard.writeText(plainText).then(showCopiedFeedback);
    });
  } else {
    navigator.clipboard.writeText(plainText).then(showCopiedFeedback);
  }
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
  if (document.getElementById("hasOralBoardA")) document.getElementById("hasOralBoardA").checked = false;

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
  if (document.getElementById("hasArtifactsB")) document.getElementById("hasArtifactsB").checked = false;
  if (document.getElementById("hasOralBoardB")) document.getElementById("hasOralBoardB").checked = false;

  document.getElementById("rangeExamPassed").checked = false;
  document.getElementById("cyberYearsC").value = 0.0;
  document.getElementById("cyberYearsValC").textContent = "0 Months (0 hrs)";
  if (document.getElementById("hasArtifactsC")) document.getElementById("hasArtifactsC").checked = false;
  if (document.getElementById("hasOralBoardC")) document.getElementById("hasOralBoardC").checked = false;
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


// Interactive Hover Tooltip Engine for Estimator
const ESTIMATOR_GLOSSARY = {
  "Taft-Hartley": {
    title: "Taft-Hartley Act (LMRA § 302(c))",
    category: "Labor Statute",
    def: "Federal labor statute permitting jointly trusteed multi-employer training funds co-governed by equal labor and employer trustees to fund $0 tuition apprenticeships.",
    citation: "29 U.S.C. § 186(c)"
  },
  "ERISA": {
    title: "ERISA (§ 403 Fiduciary Shield)",
    category: "Federal Law",
    def: "Employee Retirement Income Security Act. Insulates worker health hour-banks and pension funds from corporate bankruptcy, creditors, and lawsuits.",
    citation: "29 U.S.C. § 1103"
  },
  "JATC": {
    title: "Joint Apprenticeship & Training Committee",
    category: "Skilled Trade",
    def: "Bipartisan training trust body that funds community college labs, pays instructors, and certifies apprentice logbook milestones.",
    citation: "Pillar VI / 29 CFR Part 29"
  },
  "DOL": {
    title: "U.S. Department of Labor (29 CFR 29)",
    category: "Regulatory Body",
    def: "Federal agency governing Registered Apprenticeships, unlocking WIOA workforce grants and tax credits immediately on Day 1.",
    citation: "National Apprenticeship Act"
  },
  "Master of Record": {
    title: "Master of Record (MoR)",
    category: "Licensure Tier",
    def: "A licensed Master Practitioner holding statutory sign-off authority for enterprise security baselines and standing to file formal Notices of Safety Non-Concurrence.",
    citation: "Pillar IV & Pillar V"
  },
  "MoR": {
    title: "Master of Record (MoR)",
    category: "Licensure Tier",
    def: "A licensed Master Practitioner holding statutory sign-off authority for enterprise security baselines and standing to file formal Notices of Safety Non-Concurrence.",
    citation: "Pillar IV & Pillar V"
  },
  "Journeyman": {
    title: "Licensed Journeyman",
    category: "Licensure Tier",
    def: "A licensed practitioner who has completed 8,000 verified operational logbook hours, passed the practical challenge examination, and holds autonomous practice rights.",
    citation: "Pillar IV / 100% RJPB"
  },
  "RJPB": {
    title: "Regional Journeyman Prevailing Baseline",
    category: "Labor Economics",
    def: "The local prevailing hourly wage baseline for Journeymen, upon which apprentice wage steps (50% Tier 1 to 80% Tier 4) are strictly indexed.",
    citation: "Wage Scales Standard"
  },
  "PLA": {
    title: "Prior Learning Assessment (PLA)",
    category: "Grandfathering",
    def: "Standardized evaluation granting runtime hours and RTI credits for documented career experience, military cyber MOS, and accredited coursework (up to 50% cap).",
    citation: "Pillar I & Transition Plan"
  },
  "RTI": {
    title: "Related Technical Instruction (RTI)",
    category: "Workforce Training",
    def: "Mandatory, paid 20% classroom, lab, and simulation instruction (minimum 144 hours/year) completed alongside on-the-job training.",
    citation: "Pillar II & 29 CFR Part 29"
  },
  "AMF": {
    title: "Annual Maintenance Fee (AMF)",
    category: "Credentialism",
    def: "Recurring commercial certification vendor subscription fees, strictly prohibited from trade licensure renewals ($0 renewal via runtime).",
    citation: "Pillar IV / Anti-Credentialism"
  },
  "Career Runtime": {
    title: "Career Runtime Hours",
    category: "Trade Telemetry",
    def: "Total verified hands-on operational hours logged in active defensive, administrative, engineering, or incident triage roles.",
    citation: "Pillar III & Logbook Standards"
  },
  "W-2": {
    title: "W-2 Direct Employment",
    category: "Labor Classification",
    def: "Direct salaried or hourly employment with statutory worker protections, mandatory overtime rules, and employer tax withholding, distinct from 1099 gigs.",
    citation: "Pillar II"
  },
  "CCDR": {
    title: "Cyber Civil Defense Reserve (CCDR)",
    category: "Workforce Buffer",
    def: "A counter-cyclical public workforce mechanism deploying unabsorbed apprentices during economic downturns to protect municipal infrastructure and schools funded by public grants.",
    citation: "Governance / Guild Charter"
  },
  "FOIA": {
    title: "Final-Offer Interest Arbitration (FOIA)",
    category: "Labor Dispute",
    def: "Compulsory, binding tripartite arbitration resolving contract deadlocks at Tier-I Critical Infrastructure facilities within 14 days, with zero strike risk or defensive standdowns.",
    citation: "Governance / Guild Charter"
  },
  "FORM-005": {
    title: "Targeted OSS Exemption (FORM-005)",
    category: "Procedural Form",
    def: "Standardized instrument executed by a Master of Record certifying an internal security fork and active compensating controls for an unpatched open-source dependency (90-day grace period).",
    citation: "Templates / FORM-005"
  },
  "OOB-HMS": {
    title: "Out-of-Band Hardware Enclave Multi-Sig",
    category: "Supply Chain",
    def: "Threshold multi-signature release gate for Tier-I infrastructure held across isolated hardware security keys operated by Master and Journeyman engineers, decoupled from public CAs.",
    citation: "Velocity, Cloud & Safe Harbor"
  },
  "Statutory Malpractice Liability Cap": {
    title: "Statutory Malpractice Liability Cap",
    category: "Liability Shield",
    def: "$0 personal civil damages liability cap for non-negligent Masters of Record and Journeymen maintaining verified baseline compliance and clean attestation feeds.",
    citation: "Pillar V & Technical Refusal"
  },
  "Strict Blast-Radius Localization Rule": {
    title: "Strict Blast-Radius Localization Rule",
    category: "Cloud Governance",
    def: "Cloud force majeure rule limiting toll-free compliance suspensions strictly to documented CSP sub-regions/services (72-hr max), preventing fraudulent tenant-parking abuse.",
    citation: "Velocity, Cloud & Safe Harbor"
  },
  "72-Hour Internal Remediation Rule": {
    title: "72-Hour Internal Remediation Rule",
    category: "Ethics & Whistleblower",
    def: "Mandatory corporate cure period requiring a Form FORM-003 filing before external whistleblower bounties attach, preventing malicious compliance traps.",
    citation: "Code of Ethics & Conduct"
  }
};

let estTooltipEl = null;
let estHideTimeout = null;

function initEstimatorTooltips() {
  estTooltipEl = document.createElement("div");
  estTooltipEl.className = "glossary-tooltip-card";
  estTooltipEl.innerHTML = `
    <div class="tooltip-header">
      <span class="tooltip-title" id="est-tt-title"></span>
      <span class="tooltip-category" id="est-tt-cat"></span>
    </div>
    <div class="tooltip-body" id="est-tt-body"></div>
    <div class="tooltip-citation" id="est-tt-cite"></div>
  `;
  document.body.appendChild(estTooltipEl);

  estTooltipEl.addEventListener("mouseenter", () => clearTimeout(estHideTimeout));
  estTooltipEl.addEventListener("mouseleave", hideEstTooltip);

  const termElements = document.querySelectorAll(".glossary-term");
  termElements.forEach(el => {
    const termKey = el.getAttribute("data-term") || el.textContent.trim();
    el.addEventListener("mouseenter", (e) => showEstTooltip(e.target, termKey));
    el.addEventListener("mouseleave", hideEstTooltip);
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      showEstTooltip(e.target, termKey);
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".glossary-term") && !e.target.closest(".glossary-tooltip-card")) {
      hideEstTooltip();
    }
  });
}

function showEstTooltip(targetEl, termKey) {
  const data = ESTIMATOR_GLOSSARY[termKey];
  if (!data || !estTooltipEl) return;
  clearTimeout(estHideTimeout);

  document.getElementById("est-tt-title").textContent = data.title;
  document.getElementById("est-tt-cat").textContent = data.category;
  document.getElementById("est-tt-body").textContent = data.def;
  document.getElementById("est-tt-cite").textContent = data.citation;

  const rect = targetEl.getBoundingClientRect();
  const tooltipWidth = 300;
  let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
  let top = rect.bottom + window.scrollY + 8;

  if (left < 16) left = 16;
  if (left + tooltipWidth > window.innerWidth - 16) {
    left = window.innerWidth - tooltipWidth - 16;
  }

  estTooltipEl.style.left = `${left}px`;
  estTooltipEl.style.top = `${top}px`;
  estTooltipEl.classList.add("active");
}

function hideEstTooltip() {
  estHideTimeout = setTimeout(() => {
    if (estTooltipEl) estTooltipEl.classList.remove("active");
  }, 120);
}

function init() {
  initChips();
  calculateStanding();
  initEstimatorTooltips();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
