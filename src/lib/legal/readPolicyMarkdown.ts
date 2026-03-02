import { readFile } from 'fs/promises';
import path from 'path';

/** Committed legal content used at build time (Vercel/deploy). Raw sources live in src/_raw_designs (gitignored). */
const LEGAL_CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'legal');

/**
 * Reads a markdown file from src/content/legal. Safe for server components.
 */
export async function readPolicyMarkdown(filename: string): Promise<string> {
    const filePath = path.join(LEGAL_CONTENT_DIR, filename);
    const content = await readFile(filePath, 'utf-8');
    return content;
}

/** Extracts "Last updated: ..." from markdown content if present (e.g. "20.02.2026"). */
export function extractLastUpdated(content: string): string | undefined {
    const match = content.match(/Last updated:\s*([^\n]+)/i);
    return match ? match[1].trim() : undefined;
}

/** Bullet character (unicode bullet or black circle). */
const BULLET = /[\u2022\u25CF]/;

/** Max length for a line to be treated as a "short phrase" for colon-list conversion. */
const SHORT_PHRASE_MAX = 90;

/**
 * Normalizes policy markdown before rendering:
 * - Removes "Last updated: ..." from body (use extractLastUpdated for header).
 * - Removes duplicate document title: first-line ALL CAPS or line matching pageTitle (case-insensitive).
 * - Converts numbered section lines to headings: 1. -> ##, 1.1 -> ###, 1.1.1 -> ####.
 * - Converts bullet lines (● or •) to markdown list items; splits inline "• A • B" into separate items.
 * - Converts "line ending with :" followed by short phrases into a markdown list.
 *
 * @param content - Raw markdown body
 * @param pageTitle - Optional page title; any line matching this (case-insensitive) is removed as duplicate
 */
export function normalizePolicyMarkdown(content: string, pageTitle?: string): string {
    const lines = content.split(/\r?\n/);
    const out: string[] = [];
    let firstContentLineStripped = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Remove "Last updated: ..." from body (shown once in layout)
        if (/^\s*Last updated:\s*.+$/i.test(trimmed)) {
            continue;
        }

        // Remove duplicate document title only at the first non-empty content line
        if (trimmed.length > 0 && !firstContentLineStripped) {
            const isAllCapsTitle = trimmed.length < 100 && /^[A-Z\s\-]+$/.test(trimmed);
            const matchesPageTitle = pageTitle && trimmed.toLowerCase() === pageTitle.toLowerCase();
            if (isAllCapsTitle || matchesPageTitle) {
                firstContentLineStripped = true;
                continue;
            }
        }

        // Numbered sections -> markdown headings (allow tab or spaces after number)
        const threePart = line.match(/^(\d+)\.(\d+)\.(\d+)\s+(.+)$/);
        if (threePart) {
            out.push(`#### ${threePart[4].trim()}`);
            continue;
        }
        const twoPart = line.match(/^(\d+)\.(\d+)\s+(.+)$/);
        if (twoPart) {
            out.push(`### ${twoPart[3].trim()}`);
            continue;
        }
        const onePart = line.match(/^(\d+)\.\s+(.+)$/);
        if (onePart) {
            out.push(`## ${onePart[2].trim()}`);
            continue;
        }

        // Line with multiple bullets -> split into separate list items
        if (BULLET.test(line)) {
            const parts = line.split(BULLET).map((s) => s.replace(/^\s+|\s+$/g, '').trim()).filter(Boolean);
            if (parts.length > 1) {
                parts.forEach((p) => out.push(`- ${p}`));
                continue;
            }
            const bulletLine = line.replace(/^[\s\u2022\u25CF]+\s*/, '');
            if (bulletLine.length > 0) {
                out.push(`- ${bulletLine.trim()}`);
                continue;
            }
        }

        out.push(line);
    }

    // Second pass: "line ending with :" followed by short phrases -> list
    const result: string[] = [];
    for (let j = 0; j < out.length; j++) {
        const current = out[j];
        result.push(current);

        const trimmed = current.trim();
        if (!trimmed.endsWith(':') || trimmed.length > SHORT_PHRASE_MAX) continue;

        let k = j + 1;
        while (k < out.length) {
            const next = out[k];
            const nextTrimmed = next.trim();
            if (nextTrimmed.length === 0) break;
            if (nextTrimmed.startsWith('#') || nextTrimmed.startsWith('-')) break;
            if (nextTrimmed.length > SHORT_PHRASE_MAX) break;
            result.push(`- ${nextTrimmed}`);
            k++;
        }
        j = k - 1; // advance outer loop past consumed lines
    }

    return result.join('\n');
}
