# Duck OS — First Revenue Roadmap

**Goal:** First paying customer within 30 days  
**Constraint:** One person, zero audience, Stripe live, site ready  
**Date created:** 2026-04-23

---

## Context

- **Distribution:** Facebook (311 followers) → Immersive site
- **Email list:** SendFox (12 subscribers, keep it)
- **Content hub:** Immersive site only — WordPress becomes archive
- **Payment:** Stripe (live mode) + Payment Links — manual PDF delivery first
- **Core framework:** 3 Laws of Duck OS (System > Emotion / Action Precedes Motivation / Protect the System)
- **Personal origin:** ADHD + MDD + burnout — violated Law 3, built Duck OS as recovery

---

## Priority Order

| # | What | When | Tool |
|---|------|------|------|
| 1 | Write origin story post (burnout → ADHD/MDD → 3 Laws that saved me) | This week | Immersive site CMS |
| 2 | Write Emergency Checklist PDF (5 actions to stop a burnout spiral) | Sunday, 2 hrs | Google Docs → PDF |
| 3 | Build email capture form on site → SendFox API | This week | Code (Claude builds) |
| 4 | Create Stripe Payment Link for $29 Recovery Protocol | 10 min | Stripe dashboard |
| 5 | Compile $29 PDF from existing WordPress posts | Next week | Google Docs |
| 6 | Post origin story on Facebook with email capture CTA | After #1–3 done | Facebook |
| 7 | Manual PDF delivery per sale (Stripe notifies → email PDF) | After #4–5 | Email |

---

## Products

### Lead Magnet (Free)
**Duck OS Emergency Checklist**
- Format: 1-page PDF
- Content: 5 specific actions to stop a burnout spiral (Law 3 focused)
- Delivery: Email via SendFox after form submission
- Time to build: 2 hours (Sunday)

### First Paid Product ($29)
**Duck OS Recovery Protocol**
- Format: PDF (~15 pages)
- Content (from existing WordPress posts):
  1. Origin story — burnout, ADHD/MDD, the crash (new writing)
  2. The 3 Laws of Duck OS explained with personal examples
  3. N.E.S.T Framework — DEC-01 Decision Protocol
  4. Emergency Checklist (from lead magnet, expanded)
- Delivery: Manual — Stripe sends payment notification → email PDF to buyer
- Payment: Stripe Payment Link (live, no code needed)

---

## What Claude Builds (Code)

1. **Email capture section** on home/blog page — posts to SendFox API
2. **"Get the Protocol" CTA button** — links to Stripe Payment Link

---

## What You Write

1. **Origin story post** — "ทำไมฉัน Burnout และ 3 กฎที่ช่วยฉันรอด" (your real story, ADHD + MDD + crash → Duck OS)
2. **Emergency Checklist PDF** — Sunday, 2 hours, Google Docs → export PDF

---

## Funnel Flow

```
Facebook post (origin story)
  → Immersive site blog post
    → Email capture form ("Get free Emergency Checklist")
      → SendFox delivers PDF
        → Follow-up email: "Want the full Recovery Protocol? $29"
          → Stripe Payment Link
            → Manual PDF delivery
```

---

## Phase 2 (After First 20 Sales)

- Automate PDF delivery via webhook + email
- Migrate email to Resend or ConvertKit for better automation
- Build Stripe checkout natively on site
- Add Notion template to $29 product
- Create $49 tier: Duck OS System Blueprint (complete guide)

---

## Decision Log

- Stripe over Gumroad — user has live Stripe, prefers to keep revenue 100% own platform
- Manual delivery first — faster to ship, automate at 20+ sales/week
- PDF only, no Notion — user not familiar with Notion template creation
- Immersive site only — WordPress becomes archive, all new content goes to new hub
- SendFox stays — migrating at 12 subscribers is zero-leverage work
- Origin story is highest leverage content — personal + authentic = highest Facebook reach
