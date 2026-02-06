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
} = process.env;

if (!REACT_APP_NAME || !REACT_APP_DESCRIPTION) {
  console.error('Error: REACT_APP_NAME and REACT_APP_DESCRIPTION env vars are required');
  process.exit(1);
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
    let markdown = `${frontMatter}\n\n# ${REACT_APP_NAME}\n\n### ${REACT_APP_DESCRIPTION}\n\n${contacts}${experience}${education}`;

    // Conditionally include projects section
    if (!projectsDisabled) {
      const projects = fs.readFileSync(
        path.join(__dirname, '..', 'src', 'assets', 'projects.md'),
        'utf8',
      );
      markdown += projects;
    }

    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate PDF from markdown
    const outputFile = path.join(publicDir, `${REACT_APP_NAME} CV.pdf`);
    await mdToPdf(
      { content: markdown },
      { dest: outputFile },
    );

    console.log(`✓ PDF generated: ${outputFile}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error generating PDF:', message);
    process.exit(1);
  }
}

buildPdf();
