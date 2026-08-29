# Cybersecurity Trade Tier & Grandfathering Estimator

A privacy-first, client-side web application and mathematical engine to estimate trade tier placement, Prior Learning Assessment (PLA) credits, and wage floors according to **[The Cybersecurity Trade Project](https://github.com/DanielTolczyk/the-cyber-trade-project)** specifications (v1.5.1).

---

## Key Features

1. **Interactive Experience Wizard:**
   * Dynamic sliders for active cybersecurity runtime hours and prior IT/SysAdmin experience.
   * Multi-select checklist for industry certifications (CISSP, OSCP, Security+, GCFA, etc.).
   * Military cyber occupational specialty (MOS/AFSC) credits (Army 17C, Navy CWT, AF 1B4X1, USMC 1721).
   * Specialty practice domain selection (`SE-MED`, `SE-APP`, `SE-ICS`, `SE-DFIR`, `SE-CLD`, `SE-AIML`).

2. **Client-Side Resume & LinkedIn PDF Parsing:**
   * Drag-and-drop local PDF text extraction using `pdf.js`.
   * **100% Client-Side Privacy:** Parsed in browser memory. Zero resumes, personal names, or corporate data are transmitted to any server.

3. **Rigorous Mathematical Engine:**
   * Evaluates Prior Learning Assessment (PLA) hour caps (50% / 4,000-hr maximum residency floor).
   * Benchmark licensure grandfathering (CISSP -> Licensed Journeyman on Day 1).
   * Specialty endorsement stacking (+20% to +25% primary, 50% secondary value, max +35% total ceiling).
   * Generates actionable statutory sign-off authorities (FDA 524B, NERC-CIP, etc.).

---

## Project Structure

```
cyber-trade-estimator/
├── src/
│   └── cyber_trade_estimator/
│       ├── __init__.py
│       └── calculator.py       # Core Python calculation engine

---

## Architectural Foundations: Static vs. Dynamic Framework Rules

To provide total clarity to practitioners, employers, and educators using this tool, the calculation engine distinguishes between **permanent architectural constants** and **provisional community specifications**:

### 1. Permanent Architectural Constants (Static Standards)
These core principles are locked into the foundation of [The Cybersecurity Trade Project](https://github.com/DanielTolczyk/the-cyber-trade-project) and do not change:
* **The 8,000-Hour Apprenticeship Standard:** 2,000 operational hours per full-time year over 4 years across 5 core domains.
* **The 50% Residency Floor (4,000-Hour PLA Cap):** No candidate may bypass more than 50% of an apprenticeship through prior learning, degrees, or certifications; supervised live production practice is mandatory.
* **The Progressive Wage Step Schedule:** Linear +10% annual increases: Tier 1 (50%), Tier 2 (60%), Tier 3 (70%), Tier 4 (80%), Licensed Journeyman (100% RJPB).
* **The 2:1 Line-of-Sight Supervisory Ratio:** Enforced on-shift density governing all human-in-the-loop operational seats.
* **The Tripartite 11-Member Board Balance:** 4 Workforce, 4 Business/Insurers, 3 Independent Public Interest/Education + 2 Advisory Delegates.

### 2. Provisional & Dynamic Elements (Subject to Community RFCs & Board Ratification)
These elements evolve as the community and National Board ratify new domain standards:
* **Specific Specialty Endorsement Curricula:** While `SE-MED` is ratified as the live exemplar, remaining tracks (`SE-ICS`, `SE-DFIR`, `SE-CLD`, `SE-AIML`, `SE-OFF`) evolve through public RFCs.
* **Credential Evaluation Clearinghouse Mappings:** The exact hour credits awarded for specific vendor certifications are audited and updated by the Board against NIST NICE guidelines.
* **Actuarial Policy Discounts:** Exact percentage premium credits are negotiated dynamically between participating employer consortia and insurance underwriters.

---

├── tests/
│   └── test_calculator.py     # Automated pytest test suite
├── public/
│   ├── index.html             # High-contrast accessible web UI
│   ├── app.js                 # In-browser engine & PDF parser
│   └── styles.css             # Typography-first styling
├── pyproject.toml             # Project definition managed via uv
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

