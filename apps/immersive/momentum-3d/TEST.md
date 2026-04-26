# Test Report

**Date:** 2026-04-25  
**Framework:** Vitest v4.1.5  
**Environment:** jsdom  
**Result:** 26 passed, 0 failed (2 test files)

---

## Test Files

### `src/__tests__/posts.pure.test.ts` — Pure Function Tests

Tests for stateless utility functions in `src/lib/posts.ts`.

| # | Suite | Test | Status |
|---|-------|------|--------|
| 1 | `readingTime` | returns "< 1 min read" for very short content | PASS |
| 2 | `readingTime` | calculates 1 min for ~200 words | PASS |
| 3 | `readingTime` | calculates 3 min for ~600 words | PASS |
| 4 | `readingTime` | strips markdown syntax characters before counting | PASS |
| 5 | `readingTime` | handles empty string | PASS |
| 6 | `toSlug` | lowercases the title | PASS |
| 7 | `toSlug` | replaces spaces with hyphens | PASS |
| 8 | `toSlug` | removes special characters | PASS |
| 9 | `toSlug` | collapses multiple hyphens | PASS |
| 10 | `toSlug` | truncates to 60 characters | PASS |
| 11 | `toSlug` | handles Thai and non-ASCII by stripping them | PASS |
| 12 | `toSlug` | returns empty string for all-special input | PASS |

---

### `src/__tests__/posts.kv.test.ts` — KV CRUD Tests

Tests for all Cloudflare KV-backed post operations in `src/lib/posts.ts`, using an in-memory KV stub.

| # | Suite | Test | Status |
|---|-------|------|--------|
| 13 | `savePost` | creates a new post with defaults filled in | PASS |
| 14 | `savePost` | persists the post so getPostBySlug retrieves it | PASS |
| 15 | `savePost` | overwrites an existing post on re-save | PASS |
| 16 | `getPostBySlug` | returns null for a missing slug | PASS |
| 17 | `getAllPosts` | returns all saved posts sorted newest-first | PASS |
| 18 | `getAllPosts` | returns empty array when KV is empty | PASS |
| 19 | `getPublishedPosts` | filters out draft posts | PASS |
| 20 | `updatePost` | updates fields on an existing post | PASS |
| 21 | `updatePost` | returns null when post does not exist | PASS |
| 22 | `updatePost` | moves to new slug when slug is changed | PASS |
| 23 | `deletePost` | removes an existing post and returns true | PASS |
| 24 | `deletePost` | returns false when post does not exist | PASS |
| 25 | `slugExists` | returns true for an existing slug | PASS |
| 26 | `slugExists` | returns false for a missing slug | PASS |

---

## Bugs Fixed During TDD

| Function | Bug | Fix |
|----------|-----|-----|
| `readingTime` | `Math.ceil` means `mins < 1` is dead code — `< 1 min read` could never trigger | Changed to `if (words < 200)` check |
| `toSlug` | Leading/trailing hyphens not stripped (e.g. Thai prefix → `-world`) | Added `.replace(/^-+\|-+$/g, '')` |

---

## Run Commands

```bash
npm run test          # single run
npm run test:watch    # watch mode
```
