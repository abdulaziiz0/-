# 🔍 MIJHAR (مِجهر) - Islamic Content Verification Platform
### منصة التحقق من موثوقية المحتوى الإسلامي وعزو النصوص الشرعية

> **Arabic Tagline:** «ما يُنسب إلى الدين، افحص دليله قبل نشره.»  
> **English Tagline:** *“Verify the evidence before you publish.”*

[![Challenge Track](https://img.shields.io/badge/Challenge_Track-مسار_04:_أدوات_المعرفة_والتحقق-147D64?style=for-the-badge)](./PRD.md)
[![Compliance](https://img.shields.io/badge/Scientific_Package-100%25_Verified-0B3D2E?style=for-the-badge)](./PRD.md)
[![PRD](https://img.shields.io/badge/PRD-Product_Requirements_Document-C7A45B?style=for-the-badge)](./PRD.md)
[![Test Suite](https://img.shields.io/badge/Tests-13%2F13_Passing-brightgreen?style=for-the-badge)](./test/verification.test.ts)
[![TypeScript](https://img.shields.io/badge/TypeScript-0_Errors-blue?style=for-the-badge)](#)

---

## 📑 Product Requirement Document (PRD)

The complete and detailed specification of the platform, including functional requirements, scientific rubrics, pipeline algorithms, and security guidelines, is documented in the root PRD:

👉 **[Read the Full Product Requirement Document (PRD.md)](./PRD.md)**

---

## 👥 Professional Team & Role Distribution (فريق العمل وتوزيع الأدوار)

The MIJHAR development team combines specialized technical and scientific disciplines directly mapped to the requirements of the **AI Challenge for Introducing Islam and Islamic Content**:

| Team Member (الاسم) | Defined Professional Role | Academic Specialization | Track & System Scope |
|---|---|---|---|
| **Abdulaziz Al-Mutairi**<br>(عبدالعزيز لاحق المطيري) | **IT Lead / Team Leader & Technical Product Architect**<br>(قائد الفريق ومدير المنتج التقني) | **Information Technology (IT)**<br>(تقنية معلومات) | • Overall project direction, sprint delivery, and 100% compliance with challenge specifications.<br>• MIJHAR product requirements governance and 4-tier scientific response rubric architecture.<br>• Implementation of the Non-Fatwa Doctrine and official fatwa council referral protocols. |
| **Mishari Al-Otaibi**<br>(مشاري العتيبي / العصيمي) | **Lead AI Engineer & NLP Specialist**<br>(مهندس الذكاء الاصطناعي والنماذج اللغوية) | **Computer Science (CS)**<br>(علوم حاسب) | • Designed and trained religious claim extraction models and JSON schema mapping via Gemini.<br>• Authored strict zero-temperature system prompts following the challenge's 4-tier scientific package.<br>• Implemented anti-hallucination guardrails and prompt-injection security barriers. |
| **Fahad Al-Khammash**<br>(فهد تركي الخماش) | **Frontend, UX & Data Engineer**<br>(مهندس واجهة وتجربة المستخدم والبيانات) | **Information Technology (IT)**<br>(تقنية معلومات) | • Designed high-fidelity, accessible UI with native RTL/LTR support adhering to Islamic design tokens.<br>• Structured and normalized verified canonical datasets (King Fahd Quran Complex, Sahih Hadith corpora).<br>• Engineered the printable verification certificate (PDF export) and source transparency views. |
| **Aseel Al-Harthi**<br>(اصيل سمير الحارثي) | **Lead Full-Stack & Systems Engineer**<br>(مهندس البرمجيات والنظم الكاملة) | **Computer Engineering**<br>(هندسة حاسب) | • Built distributed full-stack architecture (React 19, TypeScript, Node.js, Express, Vite middlewares).<br>• Developed the 12-stage deterministic verification pipeline and character-level diff matching.<br>• Integrated cryptographic SHA-256 digital stamp generation for tamper-proof certificate validation. |

---

## 🏛️ Sponsoring Bodies & Challenge Partners (الجهات الراعية والشريكة)

Developed for the **AI Challenge for Introducing Islam and Islamic Content** (تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي والتعريف به):

- 🏢 **BATHL Foundation (مؤسسة باذل الأهلية للتعريف بالإسلام):** Organizing foundation and scientific package custodian.
- 🇸🇦 **Saudi Data & AI Authority - SDAIA (الهيئة السعودية للبيانات والذكاء الاصطناعي - سدايا):** Strategic national AI enablement partner.
- 🌐 **Ministry of Communications and Information Technology - MCIT (وزارة الاتصالات وتقنية المعلومات):** Digital enablement partner.
- 🚀 **Future Frontiers (آفاق المستقبل):** Executive challenge development and acceleration partner.
- ☁️ **Technical Transformation - TTS.SA (التحول التقني):** Digital infrastructure and cloud hosting partner.
- 🎯 **Target Track:** Track 04: *Knowledge & Verification Tools for Islamic Duat & Content Creators* (مسار 04: أدوات المعرفة والتحقق).

---

## 📖 Project Documentation & Core Features

### 1. Evidence-First Verification Engine
Between drafting Islamic content and publishing it, MIJHAR acts as an automated, objective validation layer:
- **Claim Segmentation:** Automatically breaks down text into atomic claims (Quran verses, Hadiths, scholarly statements, fiqh rulings, or personal questions).
- **Deterministic Text Matching:** Compares quotations against authentic canonical corpora without relying on LLM memory:
  - **Uthmani Quran Corpus:** King Fahd Glorious Quran Printing Complex in standard Hafs narration.
  - **Verified Hadith Corpus:** *Sahih al-Bukhari*, *Sahih Muslim*, and authenticated Hadith encyclopedias with international locators and declared scholarly grades.
- **Typographical Discrepancy Detection:** Identifies changed, missing, or added words and flags them with character-level visual diffs.

### 2. The 4-Tier Scientific Package (ضوابط الحزمة العلمية)
MIJHAR strictly categorizes claims and queries into four response levels:
1. **Level A (Established Principles - أصل مستقر):** Quranic texts, mutawatir/sahih Hadiths, pillars of faith ➡️ Direct answers with exact chapter/verse/locator citations.
2. **Level B (Sourced Explanations - بيان واستدلال):** Concepts, comparisons, answering intellectual inquiries ➡️ Explanations drawn strictly from approved materials without decisive ruling on debated issues.
3. **Level C (Disputed Matters - مسألة خلافية معتبرة):** Valid jurisprudential differences across Islamic schools (*madhahib*) ➡️ Objective presentation of recognized positions without automated preference (*tarjeeh*).
4. **Level D (Personal Fatwa & Specific Inquiries - فتوى وحالات شخصية):** Individual questions regarding personal divorce, specific contracts, or personal acts of worship ➡️ **Absolute refusal of automated fatwa**, with immediate guidance and referral to accredited official fatwa councils (such as the *General Presidency of Scholarly Research and Ifta*).

### 3. Official Verification Certificate (وثيقة الفحص وشهادة التدقيق)
Every verified submission produces a verifiable document featuring:
- Official **MIJHAR Verification Stamp & Seal**.
- **Cryptographic SHA-256 Signature Hash** tying the input text to the audit result.
- Quantitative verification score, breakdown of supported vs. mismatched text, and canonical sources checked.
- One-click **Print / Download as PDF** formatted cleanly for official publication clearance.

### 4. Interactive Islamic AI Assistant (المساعد الذكي التفاعلي)
- Accessible site-wide via the floating action button or navbar.
- Directly integrated with `/api/chat` and constrained by the Challenge's Scientific Guidelines.
- Features visual Level Badges (Level A, B, C, D), traceable footnote links, and instant presets for testing common scenarios.

### 5. Source Transparency & Open Corpus Registry
- Complete disclosure of indexed databases, editions, publishers, and licensing:
  - King Fahd Glorious Quran Printing Complex (Madinah Edition)
  - Sahih al-Bukhari & Sahih Muslim with book & Hadith numbers
  - Dorar.net authenticated Hadith index

---

## 🛠️ Technology Stack

- **Client:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons.
- **Server:** Node.js, Express REST API mounted via Vite middlewares (`server.ts`).
- **AI Engine:** Google GenAI SDK (`@google/genai` with `gemini-3.8-flash`), strict JSON schemas, and deterministic fallback pipelines.
- **Corpora:** King Fahd Quran Complex (Hafs 'an 'Asim), Canonical Hadith collections (*Kutub al-Sittah*), Dorar.net indexing.
- **Testing & QA:** Vitest automated test suite with 13 comprehensive end-to-end integration tests.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/verify` | Runs the 12-stage verification pipeline on submitted text. |
| `POST` | `/api/chat` | AI conversational query constrained by the 4-tier scientific guidelines. |
| `GET` | `/api/sources` | Lists indexed and planned canonical Islamic databases. |
| `GET` | `/api/team` | Returns team members, roles, and challenge track affiliations. |
| `GET` | `/api/health` | System health check (corpus status, uptime, engine version). |
| `GET` | `/api/verifications` | Retrieves user's audit history. |
| `POST` | `/api/verifications/:id/flag` | Flags a claim for scholarly human review. |
| `GET` | `/api/admin/reviews` | Scholarly review queue (reviewer/admin roles only). |

---

## 🚀 Installation & Local Execution

Follow these steps to run MIJHAR locally on your development machine:

### Prerequisites
- **Node.js:** `v20.x` or higher installed
- **npm:** `v10.x` or higher installed
- **Gemini API Key:** (optional; local in-memory fallback runs automatically if unset)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mijhar-platform.git
cd mijhar-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Ensure your `GEMINI_API_KEY` is specified in `.env` if enabling live AI extraction (in development mode, the local deterministic fallback handles offline processing).

### 4. Run the Test Suite
Verify that all 13 automated integration tests pass:
```bash
npm test
```

### 5. Check Code Quality & TypeScript Types
```bash
npm run lint
```

### 6. Start the Development Server
```bash
npm run dev
```
The application will launch on **http://localhost:3000**. Open your browser to access the workspace, demo reports, team section, and Islamic AI assistant.

### 7. Production Build
```bash
npm run build
npm start
```

---

## ⚖️ Scientific & Ethical Disclaimer (إخلاء المسؤولية المنهجية)

1. **Non-Fatwa Doctrine (مبدأ عدم الإفتاء):** MIJHAR is strictly an evidence-matching and citation verification tool. Under no circumstances does the platform issue personal religious rulings, legal fatwas, or settle judicial disputes. All personal questions are referred to certified human scholars and official Islamic councils.
2. **Current Corpus Boundaries (حدود التغطية المصدرية):** The platform indexes the Holy Quran according to the Madinah Hafs narration and authenticated classical Hadith collections. Unverified status does **not** imply that a narration is fabricated; it indicates solely that the quotation is absent from the currently indexed database.
