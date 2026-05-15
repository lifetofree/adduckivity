# System Spec: CMS Content (/content)

**Last updated:** 2026-05-11  
**Files:** `src/app/content/page.tsx`, `src/app/content/new/page.tsx`, `src/app/content/edit/EditPostInner.tsx`

---

## Purpose

Owner-only CMS dashboard for managing Duck OS posts. Provides full CRUD with auto-save, Unsplash image search, AI assistant, and Facebook publishing.

---

## Routes

| Route | Purpose |
|---|---|
| `/content` | Dashboard — list all posts with stats |
| `/content/new` | New post editor |
| `/content/edit?slug=` | Edit existing post |

---

## Features

| Feature | Implementation |
|---|---|
| Auto-save | 4-second debounce in editor; preserves status |
| Publish/Unpublish | Modals for status transitions |
| Unsplash search | `/api/unsplash` proxy for cover images |
| AI assistant | `/api/ai` for titles, excerpt, outline, SEO, tags |
| Delete protection | Published posts cannot be deleted (403); must unpublish first |
| R2 image cleanup | Deletes post + associated R2 images on delete |
| Facebook auto-post | Triggers on first publish via `postToFacebook()` |

---

## Auto-Save (Edit)

```typescript
// 4-second debounce
const debouncedSave = useDebouncedCallback(
  async (post: Post) => {
    await fetch('/api/posts/save', { method: 'POST', body: JSON.stringify(post) })
  },
  4000
)
```

---

## Post Editor

Built with:
- Markdown content area
- Title, excerpt, category, mood, scene inputs
- Featured image with Unsplash search
- Tag management
- AI assistant panel (titles, excerpt, SEO, tags, outline)
- Preview modal with markdown rendering
- Auto-calculated `readingTime`

---

## Key Files

- `src/app/content/page.tsx` — Dashboard
- `src/app/content/new/page.tsx` — New post editor
- `src/app/content/edit/EditPostInner.tsx` — Edit post inner (shared with new)
- `src/components/editor/EditorShared.tsx` — Shared editor components
- `src/components/editor/PreviewModal.tsx` — Markdown preview modal
