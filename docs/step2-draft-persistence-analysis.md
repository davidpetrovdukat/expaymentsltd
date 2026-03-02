# Step 2 Draft Persistence — Analysis & References

**Date:** 2026-03-01  
**Scope:** Bug — “Do you have your own goods stock?” and “Main suppliers / courier companies” disappear after F5. Step 4 is fixed; DB stores flat dotted keys (e.g. `step4.persons`).  
**Purpose:** Identify real field keys, restore path, toggle resets, and hypothesis. No code fixes in this document.

---

## 1. Step 2 Field Names and Related Fields

### “Do you have your own goods stock?”

| Item | Value |
|------|--------|
| **Form field name** | `step2.has_own_stock` (boolean) |
| **Dependent fields** | `step2.stock_locations` (array of `{ country, city, postal, street }`) |
| **UI** | `ToggleField` + `useFieldArray` for `step2.stock_locations` |

### “Main suppliers / courier companies”

| Item | Value |
|------|--------|
| **Form field names** | `step2.suppliers` (array of `{ name, country, url }`) |
| **Related** | `step2.shipping_terms` (string) |
| **UI** | `useFieldArray` for `step2.suppliers` |

**Relevant code:**  
`src/app/(dashboard)/application/step-2/page.tsx` — interface and defaults (lines 37–50, 60–89), `useFieldArray` (92–106), toggle (361–424), suppliers section (378–434).

---

## 2. Draft Restore Path for Step 2

| Stage | Location | Behavior |
|-------|----------|----------|
| **GET response** | `src/app/api/application/draft/route.ts` L22 | Returns full row: `NextResponse.json(row)`. `row.form_data` is whatever is in DB (flat keys after server normalization). |
| **Client fetch** | `src/components/application/useDraft.ts` L94–106 | `fetch('/api/application/draft')` → `data = await res.json()` → `data.form_data`. |
| **Normalize** | `src/components/application/useDraft.ts` L43–64, L104 | `normalizeFormData(data.form_data)`: flattens any top-level `stepN` objects into `"stepN.key"`; other keys kept as-is. Result stored in `initialData`. |
| **Step 2 restore** | `src/app/(dashboard)/application/step-2/page.tsx` L119–145 | Builds `step2Data` from `initialData`: only keys with `key.startsWith('step2.')` are copied (L121–126). Fallbacks: if no `step2.suppliers` or empty array → `[{ name: '', country: '', url: '' }]`; if no `step2.stock_locations` → `[]`. Then `skipNextSaveRef.current = true`, `reset(step2Data)`, `setIsRestored(true)`. |

**Expected shape:**

- **DB / GET:** Flat keys only (e.g. `"step2.has_own_stock"`, `"step2.stock_locations"`, `"step2.suppliers"`) — server always saves via `normalizeServerFormData` → flat.
- **Client:** `initialData` is flat after `normalizeFormData`. Step 2 does **not** merge restored data with full `defaultValues`; any step2 key missing from `initialData` is not in `step2Data`, so `reset(step2Data)` leaves that key at RHF `defaultValues` (e.g. `has_own_stock: false`, `suppliers: []`).

**Relevant code:**

- `src/app/api/application/draft/route.ts` L11–23
- `src/components/application/useDraft.ts` L90–127
- `src/app/(dashboard)/application/step-2/page.tsx` L119–145

---

## 3. Step 2 Toggle Resets (`applyToggleResets`)

**Location:** `src/server/application/draft.ts` L210–268.

**Step 2 keys read/written:**

| Toggle / rule | Reads | Writes (reset when false) |
|---------------|--------|----------------------------|
| Licensing | `step2.is_licensed` | `step2.license_number`, `step2.license_issue_date` → `''` |
| Subscription | `step2.has_subscription` | `step2.subscription_terms_url` → `''` |
| Country restrictions | `step2.has_country_restrictions` | `step2.restricted_countries` → `[]` |
| **Own stock** | **`step2.has_own_stock`** | **`step2.stock_locations`** → **`[]`** |
| Customer identification | `step2.has_customer_identification` | `step2.identification_details` → `''` |
| Cancellation | `step2.has_cancellation_policy` | `step2.cancellation_policy` → `''` |

**Step 2 key mismatches (contract vs implementation):**

- **Gateway:** Contract: `step2.has_own_payment_gateway`. Step 2 page: `step2.uses_own_gateway`. Server does **not** reference this in `applyToggleResets` (no-dependent-fields toggle).
- **Suppliers:** `applyToggleResets` does **not** read or write `step2.suppliers`; it is not tied to a toggle, so server-side toggle logic is not the cause of suppliers disappearing.

**Relevant code:**  
`src/server/application/draft.ts` L210–239 (Step 2 section).

---

## 4. Summary Table

| UI label | Form field name(s) | Draft key in payload (save) | JSON key in DB / GET |
|----------|--------------------|-----------------------------|-----------------------|
| Do you have your own goods stock? | `step2.has_own_stock` | `step2.has_own_stock` | `step2.has_own_stock` |
| (dependent) Stock locations | `step2.stock_locations` (array `{ country, city, postal, street }`) | `step2.stock_locations` | `step2.stock_locations` |
| Main suppliers / courier companies | `step2.suppliers` (array `{ name, country, url }`) | `step2.suppliers` | `step2.suppliers` |
| (related) Shipping terms | `step2.shipping_terms` | `step2.shipping_terms` | `step2.shipping_terms` |

**Contract vs implementation (suppliers):**  
Contract (§D): `Supplier`: `full_name`, `incorporation_country`, `webpage_url`. Step 2 page: `name`, `country`, `url`. Same key `step2.suppliers` is used; only inner property names differ. Relevant for PDF/submit; does not change whether the key exists on restore.

---

## 5. Hypothesis: Why These Two Areas Clear After F5

**Most likely: first `watch()` emission overwrites DB (restore race).**

- On F5, Step 2 mounts, `useDraft` fetches and sets `initialData` (flat step2 keys).
- Restore effect runs: builds `step2Data` from `initialData`, sets `skipNextSaveRef.current = true`, calls `reset(step2Data)`, then `setIsRestored(true)`.
- The autosave effect depends on `isRestored` and `isHydrated`. When `isRestored` becomes true, the `watch()` subscription runs. If the first emission happens before RHF has applied `reset()` (e.g. batching), `value` can still be the initial `defaultValues` (e.g. `has_own_stock: false`, `suppliers: []`). That gets flattened and sent as the patch.
- Even with `skipNextSaveRef`, if there are two quick emissions (e.g. one from subscription setup, one after reset), only the first is skipped; the second could still be pre-reset or incomplete and overwrite `step2.has_own_stock` and `step2.suppliers` in the DB. Next GET then returns form_data without those values, and Step 2 restore sees no step2 keys for them, so they stay at defaultValues (false / []).

**Secondary: missing keys in `initialData`.**

- Restore does **not** merge `step2Data` with the full step2 `defaultValues`. So if `initialData` has no `step2.has_own_stock` or `step2.suppliers` (e.g. GET returned nested `step2` that wasn’t flattened correctly for those keys, or they were never saved), then `step2Data` won’t contain them and `reset(step2Data)` leaves them at RHF defaults (false / []). So “disappear” can also be “never restored” because they were missing from the GET response.

**Unlikely:**  
- Toggle reset: `applyToggleResets` only clears `step2.stock_locations` when `step2.has_own_stock === false`; it never touches `step2.suppliers`. So server toggle logic is not the cause of suppliers disappearing.

---

## 6. Exact File and Line References

| Purpose | File | Lines |
|--------|------|--------|
| Step 2 form interface & defaultValues | `src/app/(dashboard)/application/step-2/page.tsx` | 13–50, 60–89 |
| Step 2 useFieldArray (stock_locations, suppliers) | `src/app/(dashboard)/application/step-2/page.tsx` | 92–106 |
| Step 2 restore (step2Data from initialData, reset, skipNextSaveRef) | `src/app/(dashboard)/application/step-2/page.tsx` | 119–145 |
| Step 2 autosave (watch, flattenToDottedKeys, autoSave) | `src/app/(dashboard)/application/step-2/page.tsx` | 146–157 |
| “Own goods stock” toggle + stock_locations UI | `src/app/(dashboard)/application/step-2/page.tsx` | 361–424 |
| “Main suppliers” section + shipping_terms | `src/app/(dashboard)/application/step-2/page.tsx` | 378–434 |
| GET draft (return row) | `src/app/api/application/draft/route.ts` | 11–23 |
| useDraft fetch + normalizeFormData → initialData | `src/components/application/useDraft.ts` | 90–127 |
| normalizeFormData (client) | `src/components/application/useDraft.ts` | 43–64 |
| flattenToDottedKeys | `src/components/application/useDraft.ts` | 17–35 |
| upsertDraftPatch, normalizeServerFormData, applyToggleResets | `src/server/application/draft.ts` | 132–206, 210–239 |
| normalizeServerFormData | `src/server/application/draft.ts` | 106–125 |

---

## References

- **Data contract:** `docs/application-data-contract.md` (Step 2 §B, toggles §C, Supplier/StockLocation §D).
- **Backend draft flow:** `docs/backend-mvp-architecture.md` (Draft autosave §E).
- **Handover / Step 4 fix:** `.agent/HANDOVER.md` (skipNextSaveRef, isRestored, Controller for toggles).
