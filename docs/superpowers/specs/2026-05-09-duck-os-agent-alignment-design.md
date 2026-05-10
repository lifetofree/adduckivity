# Design Spec: Duck OS Agent Rule Alignment

**Date:** 2026-05-09  
**Status:** Approved  
**Topic:** Aligning agent rules in `.ai.agents/` with the project's real-world structure and tech stack.

---

## 1. Vision & Goals

The current agent rules in `.ai.agents/` are generic boilerplates. This spec aims to align them with the **Duck OS** project (Adduckivity), ensuring every agent understands the monorepo structure, Cloudflare Pages constraints, and the project's unique terminology.

**Goals:**
- Correct all paths to point to `apps/immersive/momentum-3d/`.
- Reflect the Cloudflare Pages (Edge Runtime) tech stack.
- Replace the non-existent `STATUS.md` with existing trackers (`ROADMAP.md`, `ISSUESTOFIX.md`).
- Infuse the "Duck OS" culture (Momentum, Protocols, Energy-Awareness) into the roles.

---

## 2. Global Standards (Apply to All Agents)

- **Primary Workspace:** `/Users/lifetofree/Documents/Projects/adduckivity/`
- **Application Path:** `apps/immersive/momentum-3d/`
- **Source Code:** `apps/immersive/momentum-3d/src/`
- **Tests:** `apps/immersive/momentum-3d/src/__tests__/` (Vitest)
- **Tracking:** Use `ROADMAP.md` for high-level progress and `ISSUESTOFIX.md` for technical debt and bug tracking.
- **Constraints:** STRICT adherence to Cloudflare Edge Runtime (no `fs`, `path`, or Node.js built-ins in API routes).

---

## 3. Role-Specific Definitions

### 00_PO_RULES.md (Product Owner)
- **Mission:** Guard the vision of "passive income through systems for neurodivergent creators."
- **Workspaces:** `docs/BUSINESS_GOALS.md`, `ROADMAP.md`.
- **Handoff:** Update `ROADMAP.md` and signal the PM.

### 01_PM_RULES.md (Product Manager)
- **Mission:** Translate vision into functional "Protocols."
- **Workspaces:** `docs/REQUIREMENTS.md`, `docs/USER_STORIES.md`.
- **Handoff:** Update `ROADMAP.md` and signal the Tech Lead.

### 02_TECH_LEAD_RULES.md (Technical Lead)
- **Mission:** Enforce Edge Runtime compatibility and "Momentum" engineering standards.
- **Workspaces:** `docs/TECH_STACK.md`, `apps/immersive/momentum-3d/wrangler.toml`, `next.config.ts`.
- **Handoff:** Signal the Architect.

### 03_ARCHITECT_RULES.md (System Design)
- **Mission:** Design 3D interactive "Protocols" and KV/R2 data flows.
- **Workspaces:** `docs/SYSTEM_DESIGN.md`, `apps/immersive/momentum-3d/src/lib/`.
- **Handoff:** Signal the Coder.

### 04_CODER_RULES.md (TDD Coder)
- **Mission:** Build stable, high-performance 3D tools using TDD (Vitest).
- **Workspaces:** `apps/immersive/momentum-3d/src/`, `apps/immersive/momentum-3d/src/__tests__/`.
- **Handoff:** Update `ISSUESTOFIX.md` and signal the Reviewer.

### 05_REVIEWER_RULES.md (Reviewer)
- **Mission:** Audit for "Edge-Safe" code and sensory-aware UX.
- **Workspaces:** Read `apps/immersive/momentum-3d/src/`. Write to `docs/REVIEWS.md`.
- **Handoff:** If green, signal DevOps. If red, return to Coder.

### 06_DEVOPS_RULES.md (DevOps)
- **Mission:** Automate "Ignition" and Cloudflare deployment.
- **Workspaces:** `apps/immersive/momentum-3d/wrangler.toml`, `apps/immersive/momentum-3d/scripts/`, `.github/` (if created).
- **Handoff:** Update `ROADMAP.md` to "Production Live".

---

## 4. Implementation Plan

1. **Research:** Verify all specific paths and file names one last time. (Done)
2. **Execution:** Surgical `replace` or `write_file` for each of the 7 rule files.
3. **Verification:** Ensure no broken links or inconsistent instructions remain.
