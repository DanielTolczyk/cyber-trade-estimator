# Cybersecurity Trade Tier & Grandfathering Estimator

A privacy-first, client-side web application and mathematical evaluation engine enabling cybersecurity practitioners, students, and career transitioners to estimate their provisional trade placement, Prior Learning Assessment (PLA) credits, and career milestone trajectory under **[The Cybersecurity Trade Project](https://the-cyber-trade-project.github.io/framework/)** specifications (v1.6.1).

* **Live Interactive Web Application:** [https://the-cyber-trade-project.github.io/estimator/](https://the-cyber-trade-project.github.io/estimator/)
* **Specifications Repository:** [The Cybersecurity Trade Project](https://github.com/the-cyber-trade-project/framework)

---

## Core Capabilities & Architecture

The estimator models the 10-Year Industry Transition Roadmap and National Apprenticeship Standards across four dedicated pathways:

### 1. Dedicated Entry & Transition Pathways

* **Entry Pipeline: Students & Stranded Learners:**
  * Coursework articulation waives up to 144 to 288 hours of Year 1 Related Technical Instruction (RTI) classroom requirements for completed bootcamps and degree coursework.
  * Models the Challenge-Out debt release valve enabling trapped students to sit for the free Pre-Apprenticeship Practical Benchmark Challenge to exit tuition debt and qualify for paid W-2 employer dispatch ($25-$32/hr base wage floor).
  * Outlines Guild legal defense against deceptive Income Share Agreements (ISAs) and Training Repayment Agreement Provisions (TRAPs).

* **Track A: Career Runtime & Peer Review (Zero Vendor Certifications Required):**
  * Evaluates candidates with 4 to 8+ years of direct industry experience using W-2/1099 payroll runtime and two (2) sworn professional peer reference affidavits.
  * Direct grandfathering into Licensed Journeyman (8,000 hrs) with zero commercial vendor certification requirements.
  * Senior candidates (8+ years / 16,000 hrs) with three (3) sanitized engineering defense artifacts unlock Master Oral Board Defense standing.

* **Track B: Benchmark Fast-Track (Active or Lapsed Credentials):**
  * Credits recognized multi-domain credentials (CISSP, CISM, CISA, CCSP, GSLC) as permanent Related Technical Instruction (RTI) credit without requiring active vendor annual maintenance fees (AMFs).
  * Direct grandfathered Journeyman standing at 4+ years (8,000 hrs) and senior Master Oral Board standing at 6+ years (12,000 hrs).

* **Track C: Practical Range Challenge (Hands-On Test-Out):**
  * Models the 4-hour proctored Board practical range challenge, conferring an immediate 8,000-hour Journeyman legal baseline upon passing.
  * Enables senior practitioners with 8+ years of runtime to immediately submit technical defense artifacts (published CVEs, exploit research, or blueprints) for Master Oral Board defense.

---

### 2. Rigorous Statutory Mathematical Rules

* **The 8,000-Hour Apprenticeship Standard:** 2,000 operational hours per full-time year over 4 years across 5 core defensive engineering domains.
* **The 50% Residency Floor (4,000-Hour PLA Cap):** No candidate may bypass more than 50% (4,000 hours) of an apprenticeship through prior learning, degrees, military MOS, or certifications; supervised live production practice is legally mandatory.
* **Additive PLA Modeling:** Accurately stacks military cyber MOS (Army 17C, Navy CWT, USAF 1B4X1, USMC 1721), prior IT/SysAdmin cross-skilling (1,000 hrs/yr up to 2,000 hrs max), academic degrees, and published CVE disclosures.
* **Two-Step Master Verification:** Distinguishes between candidate readiness (96% progress) and finalized board defense completion (100% full Master Practitioner licensure).

---

### 3. 100% Client-Side Privacy & Security

* **Zero Data Transmission:** Runs entirely in browser memory. Zero personal inputs, work histories, or telemetry are ever collected, stored, or transmitted to any server.
* **Zero External Dependencies:** Built with pure vanilla HTML5, CSS3, and modern ES6 JavaScript. Zero third-party tracker scripts, CDN dependencies, or external runtime libraries.
* **Strict Security Directives:** Hardened with strict Content Security Policy (CSP), anti-sniffing, and sensor restriction headers.

---

## Project Structure

```
estimator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── data/
│   │   └── trade_specifications.json  # Canonical trade schema & credential mappings
│   ├── images/
│   │   └── cyber-trade-practitioner.jpg # Official high-resolution engineer banner
│   ├── index.html              # High-contrast, responsive, accessible UI
│   ├── app.js                  # 100% client-side calculation & UI engine
│   └── styles.css              # Typography-first design & component stylesheet
├── src/
│   └── cyber_trade_estimator/
│       ├── __init__.py
│       ├── calculator.py       # Standalone Python mathematical engine
│       └── data/
│           └── trade_specifications.json
├── tests/
│   └── test_calculator.py      # Automated pytest regression suite (11 test scenarios)
├── pyproject.toml              # Project metadata managed via uv
└── README.md
```

---

## Local Development & Testing

### Running the Python Test Suite

Managed via `uv`:
```bash
uv run pytest
```

### Running the Local Web App

Serve the static web application locally:
```bash
uv run python -m http.server 8000 --directory public
```

Open your browser to `http://localhost:8000`.

---

## License

Dual-licensed under the **Apache 2.0 License** (Code) and **Creative Commons Attribution 4.0 International (CC-BY-4.0)** (Documentation & Specifications).


