# Step 4 Regression Report (Post PR-1 Countries)

**Date:** 2026-03-01  
**Context:** Step 4 worked (operator confirmed) before PR-1. After PR-1 (shared countries list), Step 4 no longer restores after F5; user reports all fields empty. DB uses flat dotted keys (e.g. `step4.persons`).  
**Scope:** Analysis and recommended fix only — no code changes in this run.

---

## 1. Git / change identification

- **Repository state:** Git history does not show a distinct “PR-1” commit; recent commits are project init / chore. The PR-1 change set is taken from `.agent/HANDOVER.md` (snapshot [2026-03-01]).
- **Last known good:** Pre–PR-1 (Step 4 with local `COUNTRIES` array, 5 options per country dropdown).
- **Current:** Step 4 uses `COUNTRY_OPTIONS` from `src/lib/countries.ts` (~250 options × 4 dropdowns).

---

## 2. Focused diff summary (Step 4–related)

### `src/app/(dashboard)/application/step-4/page.tsx`

| Change | Description |
|--------|-------------|
| **Import** | Added: `import { COUNTRY_OPTIONS } from '@/lib/countries';` |
| **Removed** | Local `COUNTRIES = ['United Kingdom', 'United States', 'Germany', 'France', 'Singapore']` (lines previously ~100–106). |
| **Selects (4)** | Replaced `COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)` with `COUNTRY_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)` for: Citizenship, Country Issuing, Country of Residence, UBO Tax Residence. |

**Unchanged:** Restore effect (lines 124–144), `step4Data` build from `initialData`, `reset(step4Data)`, `skipNextSaveRef`, watch/autosave effect, `Step4FormData` / `Person` shape, `useFieldArray` name `'step4.persons'`. No edits to `useDraft`, draft API route, or `draft.ts`.

### `src/lib/countries.ts`

- **New file.** Exports `COUNTRY_OPTIONS` (array of `{ value, label }`, ~250 entries). No side effects; pure data.

### Shared form components

- **ToggleField, FormSection, StepActions, StepProgress:** Not modified in PR-1.
- **useDraft / flattenToDottedKeys / normalizeFormData:** Not modified in PR-1.

### Draft hydration / extraction

- **GET** `/api/application/draft`: Unchanged; returns row with `form_data` (flat keys from DB).
- **useDraft** `normalizeFormData(data.form_data)`: Unchanged; `"step4.persons"` is preserved (key does not match `/^step\d+$/`, so it is copied through).
- **Step 4 restore:** Still builds `step4Data` from `Object.keys(initialData).filter(key => key.startsWith('step4.'))` and calls `reset(step4Data)`; fallback to one empty person if `step4.persons` missing or empty.

---

## 3. Step 4 field names and data flow

- **POST patch:** `flattenToDottedKeys(watch())` still produces `"step4.persons": [...]` (nested objects are recursed; arrays are assigned as a single key). So the POST patch still includes `step4.persons`.
- **GET response:** Server returns `row.form_data` as stored. No server-side change in PR-1; if the DB has `step4.persons`, the response still contains it.
- **Restore logic:** Step 4 field names and the way `step4Data` is built from `initialData` were not changed. Restore still expects flat keys like `step4.persons` and passes them to `reset()`.

Conclusion: The regression is not caused by a change in field names or in the contract of GET/POST or restore (step4.persons still present and used).

---

## 4. Regressions suspected (max 3)

### 1. **First / early watch() emission overwrites DB with empty (timing)**

- **Where:** `src/app/(dashboard)/application/step-4/page.tsx` — restore effect (lines 124–144) and autosave effect (lines 146–157).
- **Why:** PR-1 increased DOM size (4 × ~250 options). That can change render/layout timing and when the first `watch()` callback runs relative to `reset()`. If the first emission is skipped but a second emission runs before RHF has applied `reset()`, the second payload can still be the default (one empty person). That patch would then be saved and overwrite existing `step4.persons` in the DB. On the next F5, GET returns the emptied draft, so the user sees all fields empty.
- **Evidence:** HANDOVER already documents the same class of bug for Step 4 (skip-first-emission + race). No change was made to that logic in PR-1; only the amount of options rendered changed, which is a plausible trigger for different timing.

### 2. **Stale closure or effect order on mount**

- **Where:** `src/app/(dashboard)/application/step-4/page.tsx` — same two effects; dependency arrays `[isLoading, initialData, reset]` and `[watch, autoSave, progressPercent, isRestored, isHydrated]`.
- **Why:** Heavier initial render (countries module + large option lists) could change the order in which effects run or the identity of `initialData` when the restore effect runs. If the restore effect ever runs with `initialData === {}` (e.g. stale closure or batching), `step4Data` would only get the fallback `[{ ...DEFAULT_PERSON }]`, so `reset()` would load a single empty person and the form would appear “all fields empty.”
- **Evidence:** Speculative; no code path was changed that would obviously clear `initialData`. Still worth considering if “empty after F5” is 100% reproducible on first load.

### 3. **Country value mismatch causing “empty” only for country fields (partial)**

- **Where:** `src/app/(dashboard)/application/step-4/page.tsx` — four country selects now use `value` = ISO code (e.g. `GB`). Stored values from before PR-1 were full names (e.g. `United Kingdom`).
- **Why:** After restore, `citizenship`, `issuing_country`, `residence_country`, `ubo_tax_residence` would still hold old string values. Those values no longer match any `<option value="...">`, so the selects show blank. User might describe that as “fields empty” even if other fields (name, DOB, etc.) are filled.
- **Evidence:** HANDOVER PR-1 note: “Existing drafts that had full names (e.g. `United Kingdom`) will not match an option and will show blank until re-selected.” This explains blank country dropdowns only, not “all fields empty.”

---

## 5. Recommended minimal fix strategy

**Primary:** Treat the regression as **#1 (early watch emission overwriting DB)** and harden the “skip first emission” behavior for Step 4 so that no save runs until after `reset()` has been applied.

- **Option A (minimal):** In Step 4 only, skip the first **two** watch emissions (e.g. a ref `skipCountRef` that goes 2 → 1 → 0 and only allow `autoSave` when 0). This reduces the chance that a second early emission (still default values) overwrites the DB.
- **Option B (more robust):** Defer attaching the watch subscription until the next tick after `reset()`: e.g. after `reset(step4Data)` call `setTimeout(() => setIsRestored(true), 0)` or use `requestAnimationFrame` so that `isRestored` flips in a follow-up paint, and the watch effect then runs after RHF has applied the reset. Requires care so the loading state does not flash.
- **Option C (targeted revert):** Revert only the Step 4 portion of PR-1 (restore local `COUNTRIES` and the old option markup for the four dropdowns). That restores previous render/timing and confirms that the regression is timing-related. Then re-apply countries with Option A or B in place.

**Secondary:** If the operator confirms that **all** fields (including non-country) are empty after F5, then #1 (and possibly #2) are the right focus. If only the four country dropdowns are blank and the rest of the form is populated, then #3 is the cause and the fix is either a one-time migration (map old label → ISO code) or accepting that old drafts show blank country until re-selected; no change to restore logic needed.

**Do not change:** Draft API, `useDraft`, `normalizeFormData`, `flattenToDottedKeys`, or server `applyToggleResets` for this regression; they were not modified in PR-1 and still handle `step4.persons` correctly.

---

## 6. File and line references

| Topic | File | Lines |
|-------|------|--------|
| Step 4 restore effect | `src/app/(dashboard)/application/step-4/page.tsx` | 124–144 |
| Step 4 watch / autosave, skipNextSaveRef | `src/app/(dashboard)/application/step-4/page.tsx` | 146–157 |
| useDraft fetch + normalizeFormData | `src/components/application/useDraft.ts` | 90–127 |
| normalizeFormData (flat step4.persons preserved) | `src/components/application/useDraft.ts` | 43–64 |
| flattenToDottedKeys (step4.persons in patch) | `src/components/application/useDraft.ts` | 17–35 |
| GET draft response | `src/app/api/application/draft/route.ts` | 11–23 |
| applyToggleResets step4.persons | `src/server/application/draft.ts` | 239–267 |
