import 'server-only';
import { Document, Page, View, Text, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { COUNTRY_OPTIONS } from '@/lib/countries';

// ─── Data normalisation ───────────────────────────────────────────────────────

type SD = Record<string, unknown>;

interface AppData {
    step1: SD;
    step2: SD;
    step3: SD;
    step4: SD;
    step5: SD;
}

/**
 * Converts the flat-dotted form_data from the DB into a per-step nested object.
 * Also handles already-nested data (dual-format resilience).
 *
 *   { 'step1.company_name': 'Acme', 'step4.persons': [...] }
 *   → { step1: { company_name: 'Acme' }, step4: { persons: [...] } }
 */
function expandFlatKeys(flat: Record<string, unknown>): AppData {
    const d: AppData = {
        step1: {}, step2: {}, step3: {}, step4: {}, step5: {},
    };

    for (const [key, value] of Object.entries(flat)) {
        // Flat dotted key: 'step1.company_name'
        const m = key.match(/^(step\d+)\.(.+)$/);
        if (m) {
            const [, step, field] = m;
            const stepKey = step as keyof AppData;
            if (stepKey in d) d[stepKey][field] = value;
            continue;
        }
        // Already-nested step object: { step1: { company_name: ... } }
        if (/^step\d+$/.test(key) && value && typeof value === 'object' && !Array.isArray(value)) {
            const stepKey = key as keyof AppData;
            if (stepKey in d) Object.assign(d[stepKey], value as SD);
        }
    }

    return d;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 9, color: '#1e293b', padding: 40, lineHeight: 1.5 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#2563eb', paddingBottom: 8 },
    headerBrand: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#2563eb' },
    headerMeta: { fontSize: 8, color: '#64748b', textAlign: 'right' },
    sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#2563eb', marginTop: 14, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 3 },
    row: { flexDirection: 'row', marginBottom: 3 },
    label: { width: '38%', fontFamily: 'Helvetica-Bold', color: '#475569' },
    value: { width: '62%', color: '#1e293b' },
    personCard: { marginBottom: 10, padding: 8, backgroundColor: '#f8fafc', borderRadius: 4 },
    personTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 5 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#e2e8f0', padding: 4, marginBottom: 1 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 3 },
    tableCell: { fontSize: 8 },
    footer: { position: 'absolute', bottom: 24, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: '#94a3b8' },
    signBox: { marginTop: 14, padding: 10, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 4 },
});

// ─── Forecast config (mirrors step-3/page.tsx) ───────────────────────────────

const FORECAST_ROWS = [
    { label: 'Transaction #', key: 'transaction_count' },
    { label: 'Total Volume ($)', key: 'total_volume' },
    { label: 'Chargeback Amt', key: 'chargeback_amount' },
    { label: 'Chargeback Ratio', key: 'chargeback_ratio' },
] as const;

const FORECAST_COLS = [
    { label: 'Next Mo.', key: 'month_1' },
    { label: '+2 Mo.', key: 'month_2' },
    { label: '+3 Mo.', key: 'month_3' },
    { label: '+4 Mo.', key: 'month_4' },
    { label: '+5 Mo.', key: 'month_5' },
    { label: '+6 Mo.', key: 'month_6' },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Safely stringify a step field value. */
function f(step: SD | undefined, key: string): string {
    if (!step) return '—';
    const v = step[key];
    if (v === null || v === undefined || v === '') return '—';
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    if (Array.isArray(v)) return v.length === 0 ? '—' : v.join(', ');
    return String(v) || '—';
}

/** Convert ISO alpha-2 code → full country name; falls back to the raw value. */
function countryName(code: string): string {
    if (!code || code === '—') return code || '—';
    const opt = COUNTRY_OPTIONS.find(o => o.value === code);
    return opt ? opt.label : code;
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View style={s.row}>
            <Text style={s.label}>{label}</Text>
            <Text style={s.value}>{value}</Text>
        </View>
    );
}

function SectionTitle({ children }: { children: string }) {
    return <Text style={s.sectionTitle}>{children}</Text>;
}

function PageHeader({ company }: { company: string }) {
    return (
        <View style={s.header}>
            <Text style={s.headerBrand}>Ex-Payments</Text>
            <Text style={s.headerMeta}>{company}</Text>
        </View>
    );
}

function PageFooter({ company }: { company: string }) {
    return (
        <View style={s.footer} fixed>
            <Text>{company} — Merchant Application</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
    );
}

// ─── PDF Document ─────────────────────────────────────────────────────────────

function ApplicationPDF({ d, submittedAt }: { d: AppData; submittedAt: string }) {
    const companyName = f(d.step1, 'company_name');
    const submitDate = new Date(submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    const persons = Array.isArray(d.step4?.persons) ? d.step4.persons as SD[] : [];
    const suppliers = Array.isArray(d.step2?.suppliers) ? d.step2.suppliers as SD[] : [];
    const stockLocs = Array.isArray(d.step2?.stock_locations) ? d.step2.stock_locations as SD[] : [];

    const isLicensed = Boolean(d.step2?.is_licensed);
    const hasSubs = Boolean(d.step2?.has_subscription);
    const hasRestrictions = Boolean(d.step2?.has_country_restrictions);
    const hasCustomerID = Boolean(d.step2?.has_customer_identification);
    const hasCancellation = Boolean(d.step2?.has_cancellation_policy);

    return (
        <Document title={`ExPayments Application — ${companyName}`} author="Ex-Payments">

            {/* ── Page 1: Company + Contact ───────────────────────────────── */}
            <Page size="A4" style={s.page}>
                <View style={s.header}>
                    <Text style={s.headerBrand}>Ex-Payments</Text>
                    <View>
                        <Text style={s.headerMeta}>Merchant Application</Text>
                        <Text style={s.headerMeta}>Submitted: {submitDate}</Text>
                    </View>
                </View>

                <SectionTitle>1. Company Information</SectionTitle>
                <Row label="Company Name" value={f(d.step1, 'company_name')} />
                <Row label="Company Number" value={f(d.step1, 'company_number')} />
                <Row label="VAT Number" value={f(d.step1, 'vat_number')} />
                <Row label="Incorporation Country" value={countryName(f(d.step1, 'incorporation_country'))} />
                <Row label="Incorporation Date" value={f(d.step1, 'incorporation_date')} />

                <SectionTitle>2. Legal Address &amp; Contact</SectionTitle>
                <Row label="Street / Office" value={f(d.step1, 'street')} />
                <Row label="City" value={f(d.step1, 'city')} />
                <Row label="Area / State" value={f(d.step1, 'area')} />
                <Row label="Post Code" value={f(d.step1, 'post_code')} />
                <Row label="Corporate Phone" value={f(d.step1, 'corporate_phone')} />
                <Row label="Corporate E-mail" value={f(d.step1, 'corporate_email')} />
                <Row label="Corporate Website" value={f(d.step1, 'corporate_website')} />

                <SectionTitle>3. Contact Person</SectionTitle>
                <Row label="Name" value={`${f(d.step1, 'contact_first_name')} ${f(d.step1, 'contact_surname')}`} />
                <Row label="Telephone" value={f(d.step1, 'contact_telephone')} />
                <Row label="Email" value={f(d.step1, 'contact_email')} />
                <Row label="Telegram" value={f(d.step1, 'contact_telegram')} />

                <PageFooter company={companyName} />
            </Page>

            {/* ── Page 2: Business Info ────────────────────────────────────── */}
            <Page size="A4" style={s.page}>
                <PageHeader company={companyName} />

                <SectionTitle>4. General Business Information</SectionTitle>
                <Row label="Base Activity" value={f(d.step2, 'activity_base')} />
                <Row label="Sub Activity" value={f(d.step2, 'activity_sub')} />
                <Row label="Website URL" value={f(d.step2, 'url_address')} />
                <Row label="Domain Owner" value={f(d.step2, 'domain_name')} />
                <Row label="MCC Code" value={f(d.step2, 'mcc_code')} />
                <Row label="MCC Undefined" value={f(d.step2, 'mcc_undefined')} />
                <Row label="Business Description" value={f(d.step2, 'business_description')} />
                <Row label="Goods / Services" value={f(d.step2, 'goods_description')} />
                <Row label="Terminals" value={
                    [
                        Boolean(d.step2?.terminals_moto) && 'MO/TO',
                        Boolean(d.step2?.terminals_ecommerce) && 'E-commerce',
                        Boolean(d.step2?.terminals_3ds) && '3DS / VDV',
                    ].filter(Boolean).join(', ') || '—'
                } />

                <SectionTitle>5. Compliance &amp; Operations</SectionTitle>
                <Row label="Licensed" value={f(d.step2, 'is_licensed')} />
                {isLicensed && (
                    <>
                        <Row label="License Number" value={f(d.step2, 'license_number')} />
                        <Row label="License Issue Date" value={f(d.step2, 'license_issue_date')} />
                    </>
                )}
                <Row label="Subscription Products" value={f(d.step2, 'has_subscription')} />
                {hasSubs && (
                    <Row label="Subscription Terms URL" value={f(d.step2, 'subscription_terms_url')} />
                )}
                <Row label="Country Restrictions" value={f(d.step2, 'has_country_restrictions')} />
                {hasRestrictions && (
                    <Row label="Restricted Countries" value={f(d.step2, 'restricted_countries')} />
                )}
                <Row label="Own Payment Gateway" value={f(d.step2, 'uses_own_gateway')} />
                <Row label="Own Goods Stock" value={f(d.step2, 'has_own_stock')} />
                {hasCustomerID && (
                    <>
                        <Row label="Customer Identification" value="Yes" />
                        <Row label="ID Details" value={f(d.step2, 'identification_details')} />
                    </>
                )}
                {hasCancellation && (
                    <>
                        <Row label="Cancellation Policy" value="Yes" />
                        <Row label="Policy Details" value={f(d.step2, 'cancellation_policy')} />
                    </>
                )}

                {stockLocs.length > 0 && (
                    <>
                        <SectionTitle>6. Stock Locations</SectionTitle>
                        {stockLocs.map((loc, i) => (
                            <Row
                                key={i}
                                label={`Location ${i + 1}`}
                                value={[loc.street, loc.city, loc.postal, loc.country].filter(Boolean).join(', ')}
                            />
                        ))}
                    </>
                )}

                {suppliers.length > 0 && (
                    <>
                        <SectionTitle>7. Main Suppliers / Couriers</SectionTitle>
                        <View style={s.tableHeader}>
                            <Text style={[s.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Name</Text>
                            <Text style={[s.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>Country</Text>
                            <Text style={[s.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>URL</Text>
                        </View>
                        {suppliers.map((sup, i) => (
                            <View key={i} style={s.tableRow}>
                                <Text style={[s.tableCell, { width: '35%' }]}>{String(sup.name || '—')}</Text>
                                <Text style={[s.tableCell, { width: '30%' }]}>{String(sup.country || '—')}</Text>
                                <Text style={[s.tableCell, { width: '35%' }]}>{String(sup.url || '—')}</Text>
                            </View>
                        ))}
                        <View style={{ marginTop: 4 }}>
                            <Row label="Shipping Terms" value={f(d.step2, 'shipping_terms')} />
                        </View>
                    </>
                )}

                <PageFooter company={companyName} />
            </Page>

            {/* ── Page 3: Processing Profile ───────────────────────────────── */}
            <Page size="A4" style={s.page}>
                <PageHeader company={companyName} />

                <SectionTitle>8. Target Market &amp; Currencies</SectionTitle>
                <Row label="Target Markets" value={f(d.step3, 'target_markets')} />
                <Row label="Processing Currencies" value={f(d.step3, 'processing_currencies')} />
                <Row label="Settlement Currencies" value={f(d.step3, 'settlement_currencies')} />

                <SectionTitle>9. Current Processing History</SectionTitle>
                <Row label="Lowest Price" value={f(d.step3, 'lowest_price')} />
                <Row label="Highest Price" value={f(d.step3, 'highest_price')} />
                <Row label="Avg. Transaction Amount" value={f(d.step3, 'avg_transaction_amount')} />
                <Row label="Monthly Turnover" value={f(d.step3, 'monthly_turnover')} />
                <Row label="Avg. Chargeback Count" value={f(d.step3, 'avg_chargeback_count')} />
                <Row label="Avg. Chargeback Volume" value={f(d.step3, 'avg_chargeback_volume')} />
                <Row label="Avg. Chargeback Ratio" value={f(d.step3, 'avg_chargeback_ratio')} />

                <SectionTitle>10. Merchant URL Forecast</SectionTitle>
                <View style={s.tableHeader}>
                    <Text style={[s.tableCell, { width: '28%', fontFamily: 'Helvetica-Bold' }]}>Metric</Text>
                    {FORECAST_COLS.map(col => (
                        <Text key={col.key} style={[s.tableCell, { width: '12%', fontFamily: 'Helvetica-Bold', textAlign: 'center' }]}>
                            {col.label}
                        </Text>
                    ))}
                </View>
                {FORECAST_ROWS.map(row => (
                    <View key={row.key} style={s.tableRow}>
                        <Text style={[s.tableCell, { width: '28%', fontFamily: 'Helvetica-Bold' }]}>{row.label}</Text>
                        {FORECAST_COLS.map(col => (
                            <Text key={col.key} style={[s.tableCell, { width: '12%', textAlign: 'center' }]}>
                                {f(d.step3, `forecast_${row.key}_${col.key}`)}
                            </Text>
                        ))}
                    </View>
                ))}

                <PageFooter company={companyName} />
            </Page>

            {/* ── Page 4: Directors / Shareholders / UBO ───────────────────── */}
            <Page size="A4" style={s.page}>
                <PageHeader company={companyName} />

                <SectionTitle>11. Directors, Shareholders &amp; UBO</SectionTitle>

                {persons.length === 0 && (
                    <Text style={{ color: '#94a3b8', fontSize: 9 }}>No persons listed.</Text>
                )}

                {persons.map((p, i) => (
                    <View key={i} style={s.personCard} wrap={false}>
                        <Text style={s.personTitle}>
                            Person {i + 1}: {String(p.first_name || '')} {String(p.last_name || '')}
                            {' '}({String(p.type || 'Person')})
                        </Text>
                        {String(p.type) === 'Company' ? (
                            <>
                                <Row label="Company Name" value={String(p.company_name || '—')} />
                                <Row label="Reg. Number" value={String(p.company_reg_number || '—')} />
                                <Row label="Company Type" value={String(p.company_type || '—')} />
                                <Row label="Jurisdiction" value={countryName(String(p.company_jurisdiction || ''))} />
                                <Row label="Registered Address" value={String(p.company_address || '—')} />
                            </>
                        ) : (
                            <>
                                <Row label="Date of Birth" value={String(p.dob || '—')} />
                                <Row label="Citizenship" value={countryName(String(p.citizenship || ''))} />
                                <Row label="Passport No." value={String(p.passport_number || '—')} />
                                <Row label="Identity Code" value={String(p.identity_code || '—')} />
                                <Row label="Issue Date" value={String(p.issue_date || '—')} />
                                <Row label="Expiry Date" value={String(p.expiry_date || '—')} />
                                <Row label="Issuing Authority" value={String(p.issuing_authority || '—')} />
                                <Row label="Issuing Country" value={countryName(String(p.issuing_country || ''))} />
                                <Row label="Residence Country" value={countryName(String(p.residence_country || ''))} />
                            </>
                        )}
                        <Row label="Address" value={`${String(p.living_address || '')}, ${String(p.city || '')} ${String(p.postal_code || '')}`} />
                        <Row label="Email" value={String(p.email || '—')} />
                        <Row label="Telephone" value={String(p.telephone || '—')} />
                        <Row label="US Person" value={Boolean(p.is_us_person) ? 'Yes' : 'No'} />
                        <Row label="PEP" value={Boolean(p.is_pep) ? 'Yes' : 'No'} />
                        {Boolean(p.is_pep) && Array.isArray(p.pep_roles) && (p.pep_roles as string[]).length > 0 && (
                            <Row label="PEP Roles" value={(p.pep_roles as string[]).join(', ')} />
                        )}
                        <Row label="Criminal Record" value={Boolean(p.has_criminal_record) ? 'Yes' : 'No'} />
                        <Row label="Representative Rights" value={
                            [String(p.rep_rights || ''), String(p.rep_rights_details || '')]
                                .filter(s => s.length > 0).join(' — ') || '—'
                        } />
                        <Row label="Position(s)" value={
                            [
                                Array.isArray(p.positions) && (p.positions as string[]).length > 0
                                    ? (p.positions as string[]).join(', ')
                                    : '',
                                String(p.position_details || ''),
                            ].filter(s => s.length > 0).join(' — ') || '—'
                        } />
                        <Row label="Shareholder" value={Boolean(p.is_shareholder) ? `Yes (${String(p.shareholder_percent || '')}%)` : 'No'} />
                        <Row label="UBO" value={Boolean(p.is_ubo) ? `Yes (${String(p.ubo_share_percent || '')}%)` : 'No'} />
                        {Boolean(p.is_ubo) && (
                            <>
                                <Row label="UBO Ownership Type" value={String(p.ubo_ownership_type || '—')} />
                                <Row label="UBO Tax Residence" value={countryName(String(p.ubo_tax_residence || ''))} />
                                <Row label="UBO Tax ID" value={String(p.ubo_tax_id || '—')} />
                                <Row label="Source of Funds" value={
                                    Array.isArray(p.ubo_fund_sources) && (p.ubo_fund_sources as string[]).length > 0
                                        ? (p.ubo_fund_sources as string[]).join(', ')
                                        : '—'
                                } />
                            </>
                        )}
                    </View>
                ))}

                <PageFooter company={companyName} />
            </Page>

            {/* ── Page 5: Declaration ──────────────────────────────────────── */}
            <Page size="A4" style={s.page}>
                <PageHeader company={companyName} />

                <SectionTitle>12. Declaration &amp; Electronic Signature</SectionTitle>
                <Text style={{ marginBottom: 10, color: '#475569', fontSize: 8, lineHeight: 1.6 }}>
                    By submitting this application, the representative confirms that all information provided is true, complete,
                    and accurate. The merchant is not involved in any illegal activity, money laundering, or financing of terrorism.
                    This electronic signature carries the same legal weight as a wet ink signature under eIDAS regulation.
                </Text>

                <View style={s.signBox}>
                    <Row label="Title" value={f(d.step5, 'title')} />
                    <Row label="First Name" value={f(d.step5, 'first_name')} />
                    <Row label="Last Name" value={f(d.step5, 'last_name')} />
                    <Row label="Date Submitted" value={submitDate} />
                </View>

                <PageFooter company={companyName} />
            </Page>
        </Document>
    );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateApplicationPdf(
    formData: Record<string, unknown>,
    submittedAt: string
): Promise<Buffer> {
    const d = expandFlatKeys(formData);
    const buffer = await renderToBuffer(
        <ApplicationPDF d={d} submittedAt={submittedAt} />
    );
    return Buffer.from(buffer);
}

export function buildPdfFilename(formData: Record<string, unknown>, submittedAt: string): string {
    const d = expandFlatKeys(formData);
    const company = String(d.step1.company_name || 'Unknown')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 50);
    const date = submittedAt.slice(0, 10);
    return `ExPayments_Application_${company}_${date}.pdf`;
}
