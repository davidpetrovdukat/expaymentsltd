# Application Data Contract

> **Single source of truth** for field names, types, validation, toggle logic, and Supabase JSONB shape.
> All React Hook Form registrations, Zod schemas, draft autosave payloads, and PDF mappings
> MUST reference this document. If it's not listed here, it doesn't exist.

---

## A. Field Naming Convention

| Rule | Example |
|------|---------|
| **Case:** `snake_case` for all keys | `company_name`, `vat_number` |
| **Step prefix:** Keys are scoped by step object, NOT by key prefix | `step1.company_name` (not `step1_company_name`) |
| **Booleans:** `is_` or `has_` prefix for toggles | `is_licensed`, `has_own_stock` |
| **Arrays:** plural noun | `stock_locations`, `suppliers`, `persons` |
| **Nested objects:** Access via dot path | `persons[0].compliance.is_pep` |
| **Repeated groups:** Array of typed objects | `persons: PersonEntry[]` |
| **Checkbox groups:** `string[]` of selected values | `target_market: ["eu", "international"]` |
| **Radio groups:** Single `string` value | `rep_rights: "sole_signature"` |

---

## B. Step-by-Step Field Registry

### Step 1 — Company & Contact Details

**PDF Section: "Company Information"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step1.company_name` | Company Name | `string` | yes | `""` | input text | min 2, max 200 |
| `step1.company_number` | Company Number | `string` | yes | `""` | input text | min 1, max 50 |
| `step1.vat_number` | VAT Number | `string` | no | `""` | input text | max 50 |
| `step1.incorporation_country` | Incorporation Country | `string` | yes | `""` | select | must be non-empty |
| `step1.incorporation_date` | Incorporation Date | `string` | yes | `""` | date picker | valid ISO date, not future |

**PDF Section: "Legal Address & Contact"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step1.corporate_phone` | Corporate Phone | `string` | yes | `""` | input tel | phone format |
| `step1.corporate_email` | Corporate E-mail | `string` | yes | `""` | input email | valid email |
| `step1.corporate_website` | Corporate Website | `string` | no | `""` | input url | valid URL or empty |
| `step1.street` | Street, building, office | `string` | yes | `""` | input text | min 3 |
| `step1.city` | City | `string` | yes | `""` | input text | min 1 |
| `step1.area` | Area / State | `string` | no | `""` | input text | — |
| `step1.post_code` | Post Code | `string` | yes | `""` | input text | min 1 |

**PDF Section: "Contact Person"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step1.contact_first_name` | First Name | `string` | yes | `""` | input text | min 1 |
| `step1.contact_surname` | Surname | `string` | yes | `""` | input text | min 1 |
| `step1.contact_telephone` | Telephone | `string` | yes | `""` | input tel | phone format |
| `step1.contact_email` | Email | `string` | yes | `""` | input email | valid email |
| `step1.contact_telegram` | Telegram | `string` | no | `""` | input text | — |

---

### Step 2 — Business Information

**PDF Section: "General Information"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step2.base_activity` | Base Activity | `string` | yes | `""` | select | non-empty |
| `step2.sub_activity` | Sub Activity | `string` | yes | `""` | select | non-empty |
| `step2.url_address` | URL Address | `string` | yes | `""` | input url | valid URL |
| `step2.is_domain_owner` | Owner of a domain name | `boolean` | yes | `false` | checkbox | — |
| `step2.terminal_types` | Type of terminals | `string[]` | yes | `[]` | checkbox group | min 1 selected |

> Terminal type options: `"moto"`, `"ecommerce"`, `"3ds_vdv"`

**PDF Section: "Classification"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step2.mcc_code` | MCC Code | `string` | yes | `""` | input text | 4-digit string |
| `step2.mcc_not_defined` | Currently not defined | `boolean` | no | `false` | checkbox | — |
| `step2.business_description` | Briefly describe your business activity | `string` | yes | `""` | textarea | min 10, max 2000 |
| `step2.goods_description` | Description of goods / services | `string` | yes | `""` | textarea | min 10, max 2000 |

**PDF Section: "Compliance & Operations" — see Section C for toggles**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step2.is_licensed` | Additionally licensing required | `boolean` | no | `false` | toggle | — |
| `step2.license_number` | License Number | `string` | no | `""` | input text | conditional |
| `step2.license_issue_date` | License Issue Date | `string` | no | `""` | date picker | conditional |
| `step2.has_subscription` | Subscription products offered | `boolean` | no | `false` | toggle | — |
| `step2.subscription_terms_url` | URL with Subscription Terms | `string` | no | `""` | input url | conditional |
| `step2.has_country_restrictions` | Country restrictions / blocking | `boolean` | no | `false` | toggle | — |
| `step2.restricted_countries` | Restricted Countries | `string[]` | no | `[]` | multi-select | conditional |
| `step2.has_own_payment_gateway` | Own payment gateway | `boolean` | no | `false` | toggle | — |
| `step2.has_own_stock` | Own goods stock | `boolean` | no | `false` | toggle | — |
| `step2.stock_locations` | Stock locations | `StockLocation[]` | no | `[]` | repeatable row | conditional, see §D |
| `step2.has_customer_identification` | Identifies customers at delivery | `boolean` | no | `false` | toggle | — |
| `step2.identification_details` | Details of Identification | `string` | no | `""` | textarea | conditional |
| `step2.has_cancellation_policy` | Customers can cancel orders | `boolean` | no | `false` | toggle | — |
| `step2.cancellation_policy` | Cancellation Deadline & Refund Policy | `string` | no | `""` | textarea | conditional |

**PDF Section: "Suppliers"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step2.suppliers` | Main suppliers / courier companies | `Supplier[]` | no | `[emptySupplier]` | repeatable row | see §D |
| `step2.shipping_terms` | Shipping terms | `string` | no | `""` | textarea | max 2000 |

---

### Step 3 — Processing Details

**PDF Section: "Target Market & Currencies"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step3.target_market` | Target market | `string[]` | yes | `[]` | checkbox group | min 1 |
| `step3.processing_currencies` | Processing currency | `string[]` | yes | `[]` | checkbox group | min 1 |
| `step3.settlement_currencies` | Settlement currency | `string[]` | yes | `[]` | checkbox group | min 1 |

> Target market options: `"eu"`, `"international"`
> 
> Currency options: `"usd"`, `"eur"`, `"gbp"`

**PDF Section: "Current Processing History"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step3.lowest_price` | Lowest goods/services price | `string` | no | `""` | input ($ prefix) | numeric string |
| `step3.highest_price` | Highest goods/services price | `string` | no | `""` | input ($ prefix) | numeric string |
| `step3.avg_transaction_amount` | Current avg. transaction amount | `string` | no | `""` | input ($ prefix) | numeric string |
| `step3.monthly_turnover` | Current monthly turnover | `string` | no | `""` | input ($ prefix) | numeric string |
| `step3.avg_chargebacks_count` | Avg. monthly chargebacks (count) | `string` | no | `""` | input number | integer string |
| `step3.avg_chargebacks_volume` | Avg. monthly chargebacks (volume) | `string` | no | `""` | input ($ prefix) | numeric string |
| `step3.avg_chargeback_ratio` | Avg. monthly chargeback ratio | `string` | no | `""` | input (% suffix) | numeric 0-100 |

> **Ambiguous:** These financial fields use `type="text"` in the UI with `$` / `%` adornments. Stored as `string` to preserve user formatting (commas, decimals). Zod should `.trim()` and validate as parseable number.

**PDF Section: "Merchant URL Forecast"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step3.forecast` | 6-month forecast table | `ForecastTable` | no | (see §D) | table grid | — |

> `ForecastTable` is a fixed-shape object with 4 rows × 6 columns. See §D for full shape.

---

### Step 4 — Directors, Shareholders & UBO

This entire step is a **repeated group** of `PersonEntry` objects (see §D for shape).

**PDF Section: "Directors, Shareholders & UBO"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step4.persons` | Persons list | `PersonEntry[]` | yes | `[emptyPerson]` | repeatable card | min 1 |

See §D for the full `PersonEntry` shape with all nested fields.

---

### Step 5 — Declaration

**PDF Section: "Declaration & Signature"**

| fieldKey | Label | Type | Required | Default | UI Control | Validation |
|----------|-------|------|----------|---------|------------|------------|
| `step5.signatory_title` | Title | `string` | yes | `""` | select | non-empty |
| `step5.signatory_first_name` | First Name | `string` | yes | `""` | input text | min 1 |
| `step5.signatory_surname` | Surname | `string` | yes | `""` | input text | min 1 |

> Title options: `"mr"`, `"ms"`, `"mrs"`, `"dr"`

> **Note:** `signed_at` timestamp is NOT a user field — it is set server-side at submission time and stored as `submitted_at` on the `merchant_applications` row, not in `form_data`.

---

## C. Conditional Logic / Toggles Map

### Step 2 Toggles (7 total)

| # | toggleKey | Controls | visibleWhen | resetWhenHidden | Notes |
|---|-----------|----------|-------------|-----------------|-------|
| 1 | `step2.is_licensed` | `step2.license_number`, `step2.license_issue_date` | `is_licensed === true` | Set both to `""` | Section collapses, 2 fields |
| 2 | `step2.has_subscription` | `step2.subscription_terms_url` | `has_subscription === true` | Set to `""` | 1 field |
| 3 | `step2.has_country_restrictions` | `step2.restricted_countries` | `has_country_restrictions === true` | Set to `[]` | Multi-select collapses |
| 4 | `step2.has_own_payment_gateway` | *(none)* | — | — | Boolean-only toggle, no dependent fields |
| 5 | `step2.has_own_stock` | `step2.stock_locations` | `has_own_stock === true` | Set to `[]` (remove all location rows) | Repeatable group collapses |
| 6 | `step2.has_customer_identification` | `step2.identification_details` | `has_customer_identification === true` | Set to `""` | Textarea collapses |
| 7 | `step2.has_cancellation_policy` | `step2.cancellation_policy` | `has_cancellation_policy === true` | Set to `""` | Textarea collapses |

### Step 4 Toggles (5 per person, nested under `persons[i]`)

| # | toggleKey | Controls | visibleWhen | resetWhenHidden | Notes |
|---|-----------|----------|-------------|-----------------|-------|
| 1 | `.compliance.is_us_person` | *(none)* | — | — | Boolean-only, no dependent fields |
| 2 | `.compliance.is_pep` | `.compliance.pep_categories` | `is_pep === true` | Set to `[]` | Checkboxes: PEP, Family, Associate |
| 3 | `.compliance.has_criminal_record` | *(none)* | — | — | Boolean-only |
| 4 | `.role.is_shareholder` | `.role.shareholder_percent` | `is_shareholder === true` | Set to `""` | Single numeric field |
| 5 | `.role.is_ubo` | `.ubo.share_percent`, `.ubo.ownership_type`, `.ubo.tax_residence`, `.ubo.tax_id`, `.ubo.fund_sources` | `is_ubo === true` | Reset all to defaults: `""`, `""`, `""`, `""`, `[]` | Entire UBO section collapses |

### Reset Strategy (Global Rule)

When a toggle is set to `false` and the `ToggleField` component unmounts its children:
1. **Strings** → `""`
2. **Booleans** → `false`
3. **Arrays** → `[]`
4. **Objects** → removed from array (for repeatable rows)
5. **Numbers (stored as string)** → `""`

The current `ToggleField` component achieves this via **unmount** (children are removed from DOM, React state is destroyed). When RHF is integrated, this must be wired to explicitly call `resetField()` or `setValue()` for the controlled keys to ensure the form state and the DB stay in sync. **Unmount alone is insufficient for RHF** because form values persist in the `useForm` store even after unmount — an explicit reset callback is required.

---

## D. Repeated Groups & Complex Shapes

### `StockLocation`

```typescript
interface StockLocation {
  country: string;   // ""
  city: string;      // ""
  postal: string;    // ""
  street: string;    // ""
}
```

- **Min:** 0 (only visible when `has_own_stock` is true)
- **Max:** Unbounded (UI has "Add location" button)
- **Add:** Push `{ country: "", city: "", postal: "", street: "" }`
- **Remove:** Splice by index (trash icon per row)

### `Supplier`

```typescript
interface Supplier {
  full_name: string;            // ""
  incorporation_country: string; // ""
  webpage_url: string;           // ""
}
```

- **Min:** 1 (always show at least one empty row)
- **Max:** Unbounded (UI has "Add supplier" button)
- **Add:** Push `{ full_name: "", incorporation_country: "", webpage_url: "" }`
- **Remove:** Splice by index (trash icon per row). If last row, keep it but clear values.

### `PersonEntry`

```typescript
interface PersonEntry {
  // Section A: Personal Details
  entity_type: "person" | "company" | "";  // "" (radio)
  first_name: string;                      // ""
  surname: string;                         // ""
  date_of_birth: string;                   // "" (ISO date)
  citizenship_country: string;             // ""
  passport_number: string;                 // ""
  identity_code: string;                   // ""
  document_issue_date: string;             // "" (ISO date)
  document_expiry_date: string;            // "" (ISO date)
  issuing_country: string;                 // ""
  issuing_authority: string;               // ""
  residence_country: string;               // ""

  // Section B: Contact Information
  contact: {
    address: string;       // ""
    city: string;          // ""
    postal_code: string;   // ""
    telephone: string;     // ""
    email: string;         // ""
  };

  // Section C: Compliance (contains toggles)
  compliance: {
    is_us_person: boolean;         // false
    is_pep: boolean;               // false
    pep_categories: string[];      // [] — options: "pep", "family_member", "close_associate"
    has_criminal_record: boolean;  // false
  };

  // Section D: Role & Rights
  role: {
    rep_rights: "sole_signature" | "joint_signature" | "other" | "";  // ""
    rep_rights_specify: string;    // ""
    positions: string[];           // [] — options: "director", "board_member", "other"
    position_specify: string;      // ""
    is_shareholder: boolean;       // false
    shareholder_percent: string;   // ""
  };

  // UBO sub-section (visible only when role.is_ubo === true)
  ubo: {
    share_percent: string;                                            // ""
    ownership_type: "direct" | "indirect_person" | "indirect_company" | "";  // ""
    tax_residence: string;  // ""
    tax_id: string;         // ""
    fund_sources: string[]; // [] — options: "salary", "dividends", "personal_savings",
                            //                "inheritance", "investment", "real_estate",
                            //                "loan", "other"
  };
}
```

- **Min persons:** 1 (always at least one card rendered)
- **Max persons:** Unbounded (UI has "Add director or authorised representative" button)
- **Add:** Push a deep-cloned empty `PersonEntry` (all defaults)
- **Remove:** Splice by index. If last person, keep but clear values.

> **Note:** `role.is_ubo` is the toggle key for the UBO section but is stored inside `role` alongside `is_shareholder`. This is intentional — both are role-level booleans.

### `ForecastTable`

```typescript
interface ForecastTable {
  transaction_count: ForecastRow;
  total_volume: ForecastRow;
  chargeback_amount: ForecastRow;
  chargeback_ratio: ForecastRow;
}

interface ForecastRow {
  month_1: string;  // ""
  month_2: string;  // ""
  month_3: string;  // ""
  month_4: string;  // ""
  month_5: string;  // ""
  month_6: string;  // ""
}
```

- Fixed shape — no add/remove. 4 rows × 6 columns = 24 cells.
- All cells are `string` (numeric input stored as text).

---

## E. Supabase `form_data` JSON Shape

The following is the canonical empty/default JSON stored in `merchant_applications.form_data`:

```json
{
  "step1": {
    "company_name": "",
    "company_number": "",
    "vat_number": "",
    "incorporation_country": "",
    "incorporation_date": "",
    "corporate_phone": "",
    "corporate_email": "",
    "corporate_website": "",
    "street": "",
    "city": "",
    "area": "",
    "post_code": "",
    "contact_first_name": "",
    "contact_surname": "",
    "contact_telephone": "",
    "contact_email": "",
    "contact_telegram": ""
  },
  "step2": {
    "base_activity": "",
    "sub_activity": "",
    "url_address": "",
    "is_domain_owner": false,
    "terminal_types": [],
    "mcc_code": "",
    "mcc_not_defined": false,
    "business_description": "",
    "goods_description": "",
    "is_licensed": false,
    "license_number": "",
    "license_issue_date": "",
    "has_subscription": false,
    "subscription_terms_url": "",
    "has_country_restrictions": false,
    "restricted_countries": [],
    "has_own_payment_gateway": false,
    "has_own_stock": false,
    "stock_locations": [],
    "has_customer_identification": false,
    "identification_details": "",
    "has_cancellation_policy": false,
    "cancellation_policy": "",
    "suppliers": [
      {
        "full_name": "",
        "incorporation_country": "",
        "webpage_url": ""
      }
    ],
    "shipping_terms": ""
  },
  "step3": {
    "target_market": [],
    "processing_currencies": [],
    "settlement_currencies": [],
    "lowest_price": "",
    "highest_price": "",
    "avg_transaction_amount": "",
    "monthly_turnover": "",
    "avg_chargebacks_count": "",
    "avg_chargebacks_volume": "",
    "avg_chargeback_ratio": "",
    "forecast": {
      "transaction_count": { "month_1": "", "month_2": "", "month_3": "", "month_4": "", "month_5": "", "month_6": "" },
      "total_volume":      { "month_1": "", "month_2": "", "month_3": "", "month_4": "", "month_5": "", "month_6": "" },
      "chargeback_amount": { "month_1": "", "month_2": "", "month_3": "", "month_4": "", "month_5": "", "month_6": "" },
      "chargeback_ratio":  { "month_1": "", "month_2": "", "month_3": "", "month_4": "", "month_5": "", "month_6": "" }
    }
  },
  "step4": {
    "persons": [
      {
        "entity_type": "",
        "first_name": "",
        "surname": "",
        "date_of_birth": "",
        "citizenship_country": "",
        "passport_number": "",
        "identity_code": "",
        "document_issue_date": "",
        "document_expiry_date": "",
        "issuing_country": "",
        "issuing_authority": "",
        "residence_country": "",
        "contact": {
          "address": "",
          "city": "",
          "postal_code": "",
          "telephone": "",
          "email": ""
        },
        "compliance": {
          "is_us_person": false,
          "is_pep": false,
          "pep_categories": [],
          "has_criminal_record": false
        },
        "role": {
          "rep_rights": "",
          "rep_rights_specify": "",
          "positions": [],
          "position_specify": "",
          "is_shareholder": false,
          "shareholder_percent": "",
          "is_ubo": false
        },
        "ubo": {
          "share_percent": "",
          "ownership_type": "",
          "tax_residence": "",
          "tax_id": "",
          "fund_sources": []
        }
      }
    ]
  },
  "step5": {
    "signatory_title": "",
    "signatory_first_name": "",
    "signatory_surname": ""
  }
}
```

---

## F. Implementation Guidance

### React Hook Form (`defaultValues`)

```typescript
// src/lib/form/default-values.ts
import type { ApplicationFormData } from '@/types/application';

export const DEFAULT_FORM_DATA: ApplicationFormData = {
  // ... paste the full JSON from §E, typed properly
};
```

- Use the JSON from §E as-is for the `defaultValues` prop of `useForm<ApplicationFormData>()`.
- When restoring a draft from Supabase, deep-merge the stored `form_data` over the defaults to fill any missing keys added in future schema migrations.

### Zod Per-Step Schemas

Create one schema per step in `src/lib/validators/`:

| File | Schema | Scope |
|------|--------|-------|
| `step1.ts` | `step1Schema` | All `step1.*` fields |
| `step2.ts` | `step2Schema` | All `step2.*` fields — conditional fields use `.optional()` or `.superRefine()` |
| `step3.ts` | `step3Schema` | All `step3.*` fields + nested `forecast` |
| `step4.ts` | `step4Schema` | `step4.persons` with `.array()` of `personEntrySchema` |
| `step5.ts` | `step5Schema` | All `step5.*` fields |
| `full.ts` | `applicationSchema` | Union of all 5 — used at **final submit** only |

**Toggle-dependent fields:** Use `z.superRefine()` to validate dependent fields only when the parent toggle is `true`. When toggle is `false` the dependent fields must still exist in the payload (set to defaults) but skip validation.

### Step Navigation Gating (Future)

- **Next:** Validate current step schema on "Next Step" click. Block navigation if invalid.
- **Back:** Always allowed, no validation needed.
- **Save Draft:** Validate nothing — accept partial data. Debounced autosave writes raw form state.
- **Final Submit:** Validate `applicationSchema` (all 5 steps combined).

### PDF Builder Mapping

The `pdfSection` column in the field registry (§B) maps directly to section headings in the PDF:

| PDF Page/Section | Source |
|------------|--------|
| Company Information | `step1.company_name` through `step1.incorporation_date` |
| Legal Address & Contact | `step1.corporate_phone` through `step1.post_code` |
| Contact Person | `step1.contact_*` fields |
| General Information | `step2.base_activity` through `step2.terminal_types` |
| Classification | `step2.mcc_code` through `step2.goods_description` |
| Compliance & Operations | `step2.is_licensed` through `step2.cancellation_policy` (skip toggles that are `false`) |
| Suppliers | `step2.suppliers` array + `step2.shipping_terms` |
| Target Market & Currencies | `step3.target_market`, `step3.processing_currencies`, `step3.settlement_currencies` |
| Processing History | `step3.lowest_price` through `step3.avg_chargeback_ratio` |
| Forecast | `step3.forecast` (render as table) |
| Directors / UBO (per person) | `step4.persons[i].*` — one section per person entry |
| Declaration & Signature | `step5.signatory_*` + server `submitted_at` timestamp |

**PDF toggle rule:** If a toggle is `false`, **omit** the corresponding section from the PDF entirely. Do not print empty fields for hidden sections.

---

## Appendix: Field Count Summary

| Step | Total Fields | Toggles | Repeatable Groups | Checkbox Groups |
|------|-------------|---------|-------------------|-----------------|
| 1 | 17 | 0 | 0 | 0 |
| 2 | 22 + repeatable | 7 | 2 (`stock_locations`, `suppliers`) | 1 (`terminal_types`) |
| 3 | 10 + 24 forecast cells | 0 | 0 | 3 (`target_market`, `processing_currencies`, `settlement_currencies`) |
| 4 | ~30 per person × N | 5 per person | 1 (`persons`) | 3 per person (`pep_categories`, `positions`, `fund_sources`) |
| 5 | 3 | 0 | 0 | 0 |
| **Total (1 person)** | **~106** | **12** | **3** | **7** |
