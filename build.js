import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read metadata
const metadata = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));

// Read template files
const templateHtml = fs.readFileSync('template.html', 'utf8');
const headerHtml = fs.readFileSync('header.html', 'utf8');
const footerHtml = fs.readFileSync('footer.html', 'utf8');

// Read main content (you can modify this to read from markdown files, etc.)
const mainContent = '<h1>Welcome to the Document</h1><p>This is the main content area.</p>';

// Prepare template data
const templateData = {
  ...metadata,
  title: metadata.title || 'Document',
  content: mainContent,
  header: headerHtml,
  footer: footerHtml
};

// Render the template
const renderedHtml = Mustache.render(templateHtml, templateData);

// Write the output
fs.writeFileSync('dist/index.html', renderedHtml);

// Copy static assets
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

if (!fs.existsSync('dist/style')) {
  fs.mkdirSync('dist/style', { recursive: true });
}

// Copy CSS
fs.copyFileSync('style.css', 'dist/style.css');

// Copy images and fonts if they exist
if (fs.existsSync('style/images')) {
  fs.cpSync('style/images', 'dist/style/images', { recursive: true });
}

if (fs.existsSync('style/fonts')) {
  fs.cpSync('style/fonts', 'dist/style/fonts', { recursive: true });
}

console.log('Build complete! Output written to dist/index.html');