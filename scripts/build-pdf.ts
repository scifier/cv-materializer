import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line import/no-extraneous-dependencies
import { mdToPdf } from 'md-to-pdf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {
  REACT_APP_NAME,
  REACT_APP_DESCRIPTION,
  REACT_APP_PROJECTS_DISABLED,
  REACT_APP_PAGE_BREAK_BEFORE,
} = process.env;

if (!REACT_APP_NAME || !REACT_APP_DESCRIPTION) {
  console.error('Error: REACT_APP_NAME and REACT_APP_DESCRIPTION env vars are required');
  process.exit(1);
}

const pdfCss = `
  @page { margin: 18mm; }

  html, body {
    font-size: 12px;
    line-height: 1.35;
  }

  h1 { margin: 0 0 8px 0; }
  h2 { margin: 14px 0 6px 0; }
  h3 { margin: 10px 0 4px 0; }

  p { margin: 0 0 6px 0; }

  ul, ol { margin: 4px 0 8px 18px; padding: 0; }
  li { margin: 0 0 4px 0; }
`;

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * PDF-only: insert a hard page break BEFORE headings matching a configured prefix.
 * - Optional: if env var is not set -> no change.
 * - Safe: if no matches -> no change.
 */
function applyPdfPageBreakBefore(md: string): string {
  if (!REACT_APP_PAGE_BREAK_BEFORE) {
    return md;
  }

  const needle = REACT_APP_PAGE_BREAK_BEFORE.trim();
  if (!needle) {
    return md;
  }

  // Insert page break before occurrences that start on a new line.
  const escaped = escapeRegExp(needle);
  const re = new RegExp(`\\n(${escaped})`, 'g');

  const pageBreak = '\n<div style="page-break-before: always; break-before: page;"></div>\n\n';

  return md.replace(re, `${pageBreak}$1`);
}

async function buildPdf(): Promise<void> {
  try {
    // Read markdown content from files
    const frontMatter = fs.readFileSync(
      path.join(__dirname, '..', 'src', 'assets', 'front-matter.md'),
      'utf8',
    );
    const contacts = fs.readFileSync(
      path.join(__dirname, '..', 'src', 'assets', 'contacts.md'),
      'utf8',
    );
    const experience = fs.readFileSync(
      path.join(__dirname, '..', 'src', 'assets', 'experience.md'),
      'utf8',
    );
    const education = fs.readFileSync(
      path.join(__dirname, '..', 'src', 'assets', 'education.md'),
      'utf8',
    );

    const projectsDisabled = ['1', 'true', 'yes'].includes(
      String(REACT_APP_PROJECTS_DISABLED).toLowerCase(),
    );

    // Combine markdown content
    let markdown =
      `${frontMatter}\n\n` +
      `# ${REACT_APP_NAME}\n\n` +
      `### ${REACT_APP_DESCRIPTION}\n\n` +
      `${contacts}${experience}${education}`;

    // Conditionally include projects section
    if (!projectsDisabled) {
      const projects = fs.readFileSync(
        path.join(__dirname, '..', 'src', 'assets', 'projects.md'),
        'utf8',
      );
      markdown += projects;
    }

    // Apply PDF-only transformations (website unaffected)
    markdown = applyPdfPageBreakBefore(markdown);

    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate PDF from markdown
    const outputFile = path.join(publicDir, `${REACT_APP_NAME} CV.pdf`);

    await mdToPdf(
      { content: markdown },
      {
        dest: outputFile,
        css: pdfCss,
        // Optional:
        // pdf_options: { format: 'A4', printBackground: true },
      },
    );

    console.log(`✓ PDF generated: ${outputFile}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error generating PDF:', message);
    process.exit(1);
  }
}

buildPdf();
