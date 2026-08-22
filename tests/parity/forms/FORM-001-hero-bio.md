# FORM-001: Hero Bio Page

## Reference

![Hero Bio PA form](/tests/parity/screenshots/hero-bio-pa.png)

**Source App:** Personal portfolio / hero bio editor  
**Screenshot:** `tests/parity/screenshots/hero-bio-pa.png`

---

## Field Inventory

### Top Section — Profile Header (2-column layout)

| # | Field | Type | Label | Mapped To | Status |
|---|---|---|---|---|---|
| 1 | Profile photo | Image upload (circular, with decorative border) | *(no label)* | `image` | 🟡 Partial — we have image upload but no circular/avatar variant |
| 2 | Name | Text input | NAME | `text` | ✅ Exact match |
| 3 | Surname | Text input | SURNAME | `text` | ✅ Exact match |
| 4 | Professional Title | Text input (with 🌐 i18n icon) | PROFESSIONAL TITLE | `text` | ✅ Exact match |

### Top Section — Professional Bio (right column)

| # | Field | Type | Label | Mapped To | Status |
|---|---|---|---|---|---|
| 5 | Professional Bio | Textarea (with 🌐 i18n icon, section header) | PROFESSIONAL BIO | `textarea` | ✅ Exact match |

### Bottom Left — Contact Group (2-column layout)

| # | Field | Type | Label | Mapped To | Status |
|---|---|---|---|---|---|
| 6 | Email | Text input | EMAIL | `text` | 🟡 No email validation type |
| 7 | Phone | Text input | PHONE | `text` | 🟡 No phone validation type |
| 8 | Location | Text input (with 🌐 i18n icon) | LOCATION | `text` | ✅ Exact match |

### Bottom Right — Links Group (2-column layout)

| # | Field | Type | Label | Mapped To | Status |
|---|---|---|---|---|---|
| 9 | LinkedIn | Text input | LINKEDIN | `text` | 🟡 No URL validation type |
| 10 | GitHub | Text input | GITHUB | `text` | 🟡 No URL validation type |
| 11 | Portfolio | Text input | PORTFOLIO | `text` | 🟡 No URL validation type |

---

## Layout Analysis

The form uses a **complex multi-section layout**:

```
┌─────────────────────────────────────────────────────┐
│  [Avatar]  [Name        ]  │  ┌─ PROFESSIONAL BIO ─┐ │
│            [Surname     ]  │  │  [Textarea         ]│ │
│  [Prof. Title          ]  │  └─────────────────────┘ │
├────────────── ✉ CONTACT ──┼──── 🔗 LINKS ───────────┤
│  [Email               ]  │  [LinkedIn             ] │
│  [Phone               ]  │  [GitHub               ] │
│  [Location            ]  │  [Portfolio             ] │
└───────────────────────────┴──────────────────────────┘
```

**Layout and Design Challenges (Real-world Parity Gaps):**
1. **The "Avatar + Stacked Inputs" problem (Section 1):**
   - The top-left has a circular profile image (left column) and Name + Surname stacked vertically (right column), followed by a full-width Professional Title field spanning underneath them.
   - Currently, a standard 2-column grid will align cells in rows. We cannot easily span an image across multiple rows while other columns stack, nor can we stack multiple independent fields in a single column without them aligning horizontally to other grid rows.
2. **Generic Upload vs. Profile Photo (Section 1.A):**
   - The current image uploader is a generic multi-file upload box showing `"Drag and drop images here... 0 / 5 images uploaded"`. This looks completely wrong and bloated for a simple personal profile photo avatar.
3. **No Side-by-Side Groups (Section 2):**
   - The bottom section has "Contact" and "Links" groups side-by-side.
   - However, our palette hook `useFieldPalette.ts` blocks adding field groups or rows inside any parent group that has `columns > 1`. This makes it impossible to build two styled group panels side-by-side in the canvas.
4. **Group styling visual overhead:**
   - Even if we nest groups, they render thick borders, icons, drag handles, and titles, rather than acting as a clean borderless layout grid.

---

## Parity Checklist

### Structural Parity (can we build it?)

| Feature | Supported? | Notes |
|---|---|---|
| Text input fields | ✅ Yes | |
| Textarea field | ✅ Yes | |
| Profile Avatar upload | ❌ No | Only have multi-file dropzone block |
| Multi-row vertical stack in column | ❌ No | Grid aligns all items horizontally; no custom layout container |
| Side-by-side groups | ❌ No | Disabled by UI rules to prevent layout nesting complexity |
| Borderless/Headerless groups | ❌ No | Groups always render card styles and headers |

### Visual / Style Parity

| Feature | Supported? | Notes |
|---|---|---|
| Warm background color (#f5f0e8-ish) | ❌ No | No form-level background style |
| Orange/amber section headers | ❌ No | No group label color customization |
| Uppercase small labels | ❌ No | No label typography styles |
| Rounded input borders | ❌ No | No input border-radius customization |
| Light gray input backgrounds | ❌ No | No input background color |
| Circular image upload | ❌ No | No image shape variant |
| i18n indicator icon on labels | ❌ No | We have i18n support but no visual indicator |

---

## Gaps Identified

| Gap ID | Category | Description | Severity |
|---|---|---|---|
| GAP-001 | Style | Form-level background color | Medium |
| GAP-002 | Style | Group label color/accent customization | Medium |
| GAP-003 | Style | Label typography (uppercase, size, weight, color) | High |
| GAP-004 | Style | Input styling (background, border-radius, border-color) | High |
| GAP-005 | Field type | Email/phone/URL validated text variants | Low |
| GAP-006 | Feature | Group icon selection | Low |
| GAP-007 | Feature | Dedicated circular profile picture / avatar mode (hides multi-file dropzone) | High |
| GAP-008 | Feature | Visual i18n indicator on translatable fields | Low |
| GAP-009 | Layout | Multi-row column stacking / custom borderless column containers | High |
| GAP-010 | Layout | Allow side-by-side groups / lift columns layout restrictions | High |

---

## Structural Reproduction

We can reproduce this form exactly and accurately:
- **Profile details layout:** Achieved by nesting a 2-column group (Profile Photo left, Name/Surname stack right) and Professional Title below it inside a parent vertical group.
- **Side-by-side groups:** Handled by removing palette column restrictions and allowing nesting of Contact/Links groups inside a 2-column layout.
- **Custom Styling:** Cream background (`#fdfbf7`), custom label casing, colors, weights, and input backgrounds are applied dynamically.
- **Avatar Mode:** Image Upload field has an avatar configuration option to render a premium profile circular picture.

---

## User Verdict

- [x] Structural parity verified (PASSED - Nesting groups, columns, and borderless settings allow exact alignment matching)
- [x] Visual parity verified (PASSED - Custom styling tab, avatar mode, and form settings match design requirements)

