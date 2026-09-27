# VIDYASETU (विद्यासेतु)
### *“Har Vidyarthi Ka, Safalta Ka Marg”*
**AI-Enabled Lifecycle Scholarship & Fellowship Management Engine for Scheduled Tribes**  
**Smart India Hackathon (SIH) 2026** • Ministry of Tribal Affairs (MoTA), Government of India  
**Team Name:** `parllaxx_24951A05M7`

---

## 🌟 Executive Summary & Impact Metrics (SIH Presentation Alignment)
Currently, Ministry of Tribal Affairs (MoTA) schemes like **National Fellowship for Scheduled Tribes (NFST)** and **National Overseas Scholarship (NOS)** suffer from 45–60 day clerical backlogs, repeated blurry upload rejection loops, and missed international admission/visa intake windows.

**VidyaSetu** resolves this through an integrated zero-trust digital bridge:
- 🚀 **48-Hour Decision SLA (22.5x Faster Processing):** Reduced from typical 45-day manual delays down to 2.0 days (48 hours).
- 📸 **Zero Blurry Rejections:** Instant in-browser OpenCV/WASM edge check (`Laplacian Variance ≥ 100` passes, `< 100` prompts retake).
- ✈️ **Zero Missed Intakes:** Foreign university and visa cut-offs protected for ST scholars (Imperial College, UBC, etc.).
- 💰 **Est. ₹1.80 Cr / year Saved:** Direct annual fiscal savings by eliminating third-party manual scrutiny vendor agencies.
- 🔒 **DPDP Act 2023 Compliant & Strict Safeguard:** Automated sensitive ID masking (`XXXX-XXXX-4921`), AES-256 encryption, and **Strict Policy: Zero Autonomous Rejections (Human-In-The-Loop Safeguard)**.

---

## 🔄 Sovereign 5-Stage Lifecycle Audit Trail
The platform enforces the 5-stage sovereign pipeline on every application:
```
[IDENTITY VERIFIED] ➔ [DOCS VALIDATED] ➔ [DATA CROSS-CHECKED] ➔ [FUNDS TRACKED] ➔ [RENEWAL MONITORED]
```

---

## 🛠️ Technical Architecture & Innovation Stack

| Layer | Technology | Purpose & Role |
| :--- | :--- | :--- |
| **Auth & Ingestion** | DigiLocker SSO, CDAC OTP, MeriPehchan | Sovereign multi-channel identity ingestion with e-KYC handshake |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS | Mobile-first citizen upload wizard & dual-pane officer review UI |
| **Client Edge AI** | WASM / Canvas Laplacian Variance Filter | Browser-side blur & Image Quality Assessment (IQA) before upload (`Var ≥ 100`) |
| **NLP / ML** | LayoutLMv3 Architecture | Multimodal token alignment on document layout & field extraction |
| **Phonetic Matching** | Jaro-Winkler + Bhashini AI | Hybrid phonetic NLP mapping regional tribal transliterations automatically (`> 92%`) |
| **Disbursement Rail**| PFMS DBT Rails | Direct Benefit Transfer into Aadhaar-linked bank accounts (Near-Zero Leakage) |

---

## 👥 1-Click Demo Evaluation Personas (Demo Switcher)
For hackathon evaluation, click any demo persona in the top header or login screen:
1. **Arun Soren (Applicant - NFST Verified):** Santhal tribe, Odisha, JNU Ph.D scholar. High-resolution documents verified with 99.2% Jaro-Winkler match.
2. **Sunita Munda (Applicant - NOS Shortlisted):** Munda tribe, Jharkhand, Imperial College London (QS #2) Ph.D. Ranked #1 for overseas grant.
3. **Vipin Kumar Gond (Applicant - Deficiency Demo):** Gond tribe, MP. Has an outdated/blurry Income Certificate flagged. Click **"Re-Upload Valid Certificate (1-Click Fix)"** to test instant real-time resolution!
4. **Dr. Rajeshwar Rao (Nodal Scrutiny Officer):** Reviews queue with AI risk scores; operates the 30-Second Dual-Pane Spotlight Review UI.
5. **Prof. Kamala Tirkey (Selection Committee Member):** Merit-based ranking matrix, 33% female sub-quota tracking, and audited Human Override.
6. **Smt. Ananya Sen, IAS (MoTA Director / Admin):** Executive Analytics, Est. ₹1.80 Cr / year savings tracking, and Zero-Code Scheme Rulebook Engine.

---

## 🚀 Quickstart & Local Execution

### Prerequisites
- Node.js (v18+ or v22+)
- npm (v9+)

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/padmakruthi/VidyaSetu.git
cd VidyaSetu

# Install dependencies (already prepared)
npm install

# Start development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🌐 Routes Overview
- `/` — Landing page with MoTA branding, team badge, 4 impact metric cards, and 5-stage lifecycle audit trail.
- `/apply` — Guided multi-step wizard with in-browser Edge Blur Filter, DigiLocker auto-ingest, and PFMS acknowledgment slip.
- `/track` — Sovereign 5-stage lifecycle tracking with live status milestones and deficiency notice links.
- `/portal` — Student Portal with 1-click friendly deficiency resolution flow.
- `/admin` — Scrutiny Officer queue with AI risk scores, Laplacian variance status, and Jaro-Winkler scores.
- `/admin/review/[id]` — Dual-pane Spotlight UI review screen with zoomable document viewer and field comparison.
- `/admin/selection` — Selection Committee merit ranking matrix, quota counters, and human override with justification notes.
- `/admin/rules` — Configurable zero-code scheme eligibility rulebook engine.
- `/admin/analytics` — Executive MoTA impact analytics with 22.5x turnaround speedup and state-wise charts.
- `/login` — Accessible bilingual login with 1-click demo persona switcher and simulated mobile OTP.

---

## ⚖️ Compliance & Governance
- **DPDP Act 2023:** Complete masking of sensitive personal identifiers (`XXXX-XXXX-4921`).
- **WCAG 2.1 AA:** High-contrast toggle, font-size zoom controls (`A-` / `A` / `A+`), and screen-reader semantics.
- **Bilingual Interface:** Instant English & हिन्दी language toggle.
