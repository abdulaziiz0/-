# 📋 Product Requirement Document (PRD)
## MIJHAR Platform (منصة مِجهر للتحقق من موثوقية المحتوى الإسلامي وعزو النصوص الشرعية)

---

- **Product Name:** MIJHAR | مِجهر
- **Arabic Tagline:** «ما يُنسب إلى الدين، افحص دليله قبل نشره.»
- **English Tagline:** *“Verify the evidence before you publish.”*
- **Target Challenge:** AI Challenge for Introducing Islam and Islamic Content (تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي والتعريف به)
- **Competitive Track:** Track 04: *Knowledge and Verification Tools for Islamic Duat and Content Creators* (مسار 04: أدوات المعرفة والتحقق لتمكين المعرّفين بالإسلام وصنّاع المحتوى)
- **Sponsoring & Enablement Entities:**
  1. **BATHL Foundation (مؤسسة باذل الأهلية للتعريف بالإسلام):** Organizing foundation and scientific package custodian.
  2. **Saudi Data & AI Authority - SDAIA (الهيئة السعودية للبيانات والذكاء الاصطناعي - سدايا):** Strategic National AI Partner.
  3. **Ministry of Communications and Information Technology - MCIT (وزارة الاتصالات وتقنية المعلومات):** Digital Enablement Partner.
  4. **Future Frontiers (آفاق المستقبل):** Executive Challenge Development Partner.
  5. **Technical Transformation - TTS.SA (التحول التقني):** Digital Infrastructure & Cloud Hosting Partner.

---

## 1. Professional Team & Role Distribution (أعضاء الفريق والمسؤوليات التقنية)

The platform was built by a multidisciplinary team aligned with the technical and scientific demands of the challenge track:

| Member Name (الاسم) | Track Designation & Role | Academic Specialization (التخصص) | Technical Scope & Key Deliverables |
|---|---|---|---|
| **Abdulaziz Al-Mutairi**<br>(عبدالعزيز لاحق المطيري) | **IT Lead / Team Leader & Technical Product Architect**<br>(قائد الفريق ومدير المنتج التقني) | **Information Technology (IT)**<br>(تقنية معلومات) | • Overall technical leadership, project governance, and challenge standards alignment (100% compliance).<br>• Product requirement management, workflow design for the 4-tier scientific response rubric (Levels A, B, C, D).<br>• Governance of the Non-Fatwa Doctrine, automated fatwa council referral protocols, and quality assurance. |
| **Mishari Al-Otaibi**<br>(مشاري العتيبي / العصيمي) | **Lead AI Engineer & NLP Specialist**<br>(مهندس الذكاء الاصطناعي والنماذج اللغوية) | **Computer Science (CS)**<br>(علوم حاسب) | • Engineered Gemini-powered religious claim extraction, segmentation, and semantic claim categorization.<br>• Designed zero-temperature prompt engineering enforcing the challenge's 4-tier response rubric.<br>• Implemented anti-hallucination guardrails, prompt injection barriers, and strict canonical source grounding. |
| **Fahad Al-Khammash**<br>(فهد تركي الخماش) | **Frontend, UX & Data Engineer**<br>(مهندس واجهة وتجربة المستخدم والبيانات) | **Information Technology (IT)**<br>(تقنية معلومات) | • Designed high-clarity responsive user interface with bilingual RTL/LTR support following Islamic design tokens.<br>• Structured and normalized verified canonical databases (King Fahd Quran Complex, Sahih Bukhari & Muslim).<br>• Architected the official printable verification certificate (PDF export) and source transparency views. |
| **Aseel Al-Harthi**<br>(اصيل سمير الحارثي) | **Lead Full-Stack & Systems Engineer**<br>(مهندس البرمجيات والنظم الكاملة) | **Computer Engineering**<br>(هندسة حاسب) | • Built distributed full-stack architecture (React 19, TypeScript, Node.js, Express, Vite middlewares).<br>• Designed the 12-stage deterministic verification pipeline, character-level diff matching, and REST APIs.<br>• Integrated cryptographic SHA-256 digital stamp generation for tamper-proof certificate validation. |

---

## 2. Problem Statement & Strategic Vision

### The Problem
1. **Unverified Religious Quotations:** High volume of religious text shared across social media, blogs, sermons, and AI-generated articles contains inadvertent wording alterations or misattributions.
2. **AI Hallucinations in Sacred Texts:** Generic LLMs frequently fabricate Hadiths, interpolate non-existent verse numbers, or mix canonical narrations with weak folklore.
3. **The Fatwa Overreach Hazard:** Digital tools often attempt to answer personal juristic queries (*nawazil*, personal divorce, inheritance disputes), violating classical Islamic scholarly consensus that machines must never issue fatwas.

### The Solution: MIJHAR Platform
MIJHAR acts as an automated, deterministic verification layer between content drafting and public dissemination. It segments content into atomic claims, compares quotes character-by-character against verified corpora, flags typographical discrepancies, issues cryptographic audit certificates, and provides a conversational Islamic AI assistant strictly governed by the 4-tier scientific package.

---

## 3. The 4-Tier Scientific Package (ضوابط الحزمة العلمية لتحدي باذل)

The platform and its AI components strictly adhere to the four standardized scientific levels:

### Level A: Established Principles (المستوى أ: أصل مستقر)
- **Scope:** Direct Holy Quran verses, Mutawatir and Sahih Hadiths, pillars of Islam and Iman, established historical facts of the Sirah.
- **System Behavior:** Direct, evidence-grounded response with explicit chapter, verse, Hadith number, compilation book, and authenticated scholarly grade (e.g., *Sahih al-Bukhari #1*).

### Level B: Sourced Explanation & Reasoning (المستوى ب: بيان واستدلال)
- **Scope:** Islamic conceptual definitions, wisdom behind rulings, comparative contextualization, and addressing misconceptions for non-Muslims and new Muslims.
- **System Behavior:** Balanced explanation derived exclusively from authenticated source material without personal speculation or sectarian bias.

### Level C: Recognized Scholarly Differences (المستوى ج: مسألة خلافية معتبرة)
- **Scope:** Jurisprudential divergence among recognized traditional schools (*Madhahib: Hanafi, Maliki, Shafi'i, Hanbali*) and delicate theological nuances.
- **System Behavior:** Respectful, objective presentation of valid scholarly positions without automated preference (*tarjeeh*), guiding users to comprehensive scholarly manuals.

### Level D: Personal Fatwa & Specific Inquiries (المستوى د: فتوى وحالات شخصية)
- **Scope:** Questions regarding individual personal circumstances, matrimonial disputes, judicial issues, specific contracts, or personal acts of worship.
- **System Behavior:** **Total and unequivocal refusal to issue a fatwa**. The platform explains general principles and immediately refers the user to official authorized fatwa authorities (e.g., General Presidency of Scholarly Research and Ifta, Dar al-Ifta).

---

## 4. Platform Functional Specifications

### 4.1 Intelligent Verification Workspace (`/workspace`)
- Real-time text analysis supporting Arabic, English, and transliterated input (up to 50,000 characters).
- Instant demonstration presets:
  1. *Comprehensive Content (Quran + Hadith + Fatwa referral)*
  2. *Typographical Mismatch (Verse with deliberate typographical error)*
  3. *Specialist Question (Personal Ramadan fasting inquiry)*
  4. *Prophetic Hadith (Sahih Muslim brotherly love narration)*
- Real-time word and character counters.

### 4.2 12-Stage Deterministic Verification Pipeline
1. Input normalization & UTF-8 sanitization.
2. Language detection and mixed-text routing.
3. Content classification (article, sermon draft, social post, educational).
4. Atomic claim segmentation & classification via Gemini with structured schemas.
5. Anti-injection barrier: treating input as untrusted data.
6. Direct Quranic text search against the King Fahd Complex corpus (Hafs 'an 'Asim).
7. Diacritics stripping and orthographic normalization (*Tashkeel*, *Hamzat*, *Ta' Marbuta*).
8. Character-level diff computation to identify exact substitutions, omissions, and insertions.
9. Canonical Hadith retrieval with narrator chains, book references, and verified grades.
10. Personal juristic question detection triggering the Non-Fatwa Doctrine.
11. Overall submission scoring (supported percentage, mismatch count, referral count).
12. Cryptographic SHA-256 digital signature hash generation for audit trails.

### 4.3 Official Verification Certificate (`/certificate`)
- Verified document preview formatted for web display and high-resolution print/PDF export.
- Includes:
  - Official MIJHAR Gold Seal Stamp.
  - Deterministic SHA-256 hash tying submission to the verification report.
  - Quantitative score breakdown (match rate, discrepancy alerts, referral notices).
  - Detailed claims audit table with verified book, chapter, and locator citations.

### 4.4 Interactive Islamic AI Assistant (`/api/chat` Modal)
- Accessible site-wide via floating action button or navbar.
- Directly constrained by the Challenge's Scientific Guidelines.
- Provides visual level badges (Level A/B/C/D), verified source badges, and single-click copy.
- Enforces strict anti-hallucination rules: if evidence is absent, it transparently states non-verification.

### 4.5 Source Transparency & Open Corpus Registry (`/sources`)
- Complete disclosure of indexed corpora vs. planned future additions:
  - King Fahd Glorious Quran Printing Complex (Indexed - Verified)
  - Sahih al-Bukhari & Sahih Muslim (Indexed - Verified)
  - Dorar.net Hadith Encyclopedia (Indexed - Verified)
  - Four Sunan: Abu Dawud, al-Tirmidhi, al-Nasa'i, Ibn Majah (In Integration)
  - Accredited Islamic Fatwa Councils (Directory Active)

### 4.6 Scholarly Quality Control & Admin Suite (`/admin`)
- Role-gated review interface (`admin` / `reviewer` / `user`).
- Review queue for user-flagged findings with human scholar notes.
- Instant source toggling for maintenance.
- Immutable audit event log for transparency.

---

## 5. System Architecture & Technical Specifications

```
  ┌────────────────────────────────────────────────────────┐
  │                   CLIENT LAYER                         │
  │  React 19 + TypeScript + Tailwind CSS v4 (Light Theme) │
  │  RTL/LTR Context + Lucide + Motion Transitions         │
  └──────────────────────────┬─────────────────────────────┘
                             │ REST / JSON (port 3000)
  ┌──────────────────────────▼─────────────────────────────┐
  │                   SERVER LAYER                         │
  │  Node.js + Express REST API (Vite Dev Server Middlewares)
  │  Endpoints: /api/verify, /api/chat, /api/sources,      │
  │             /api/team, /api/health, /api/admin/*       │
  └─────────────┬───────────────────────────┬──────────────┘
                │                           │
  ┌─────────────▼─────────────┐ ┌───────────▼──────────────┐
  │     AI & NLP ENGINE       │ │   CANONICAL CORPORA      │
  │  @google/genai SDK        │ │  King Fahd Quran Complex │
  │  gemini-3.8-flash         │ │  Kutub al-Sittah Hadiths │
  │  Structured ResponseSchema│ │  Dorar.net Encyclopedia  │
  │  Anti-Hallucination Rules │ │  SHA-256 Crypto Stamp    │
  └───────────────────────────┘ └──────────────────────────┘
```

---

## 6. Non-Functional Requirements & Security

1. **Accessibility & Design Integrity:** WCAG AA compliant contrast, touch targets $\ge 44\text{px}$, responsive on all device viewports.
2. **Deterministic Fallback:** If external API latency occurs, the verification engine falls back to local in-memory substring matching to ensure 100% platform availability.
3. **Prompt Injection Defense:** User text is treated strictly as data payloads inside delimiters, preventing command hijacking or persona changes.
4. **Data Privacy:** User verifications can be deleted on-demand with one click; no external sharing of unpublished manuscripts.
