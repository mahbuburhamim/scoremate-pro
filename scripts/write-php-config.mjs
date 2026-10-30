// Writes dist/api/_config.php from environment variables at build time.
// Secrets live only in the hosting panel's environment variables, never in git.
import fs from 'node:fs';
import path from 'node:path';

const keys = [
  'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'ADMIN_EMAILS', 'APP_URL',
  'GOOGLE_CLIENT_ID',
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_FROM_NAME',
];
const cfg = {};
for (const k of keys) if (process.env[k]) cfg[k] = process.env[k];

if (!cfg.DB_NAME || !cfg.DB_USER) {
  console.warn('[php-config] DB_NAME/DB_USER not set; skipping _config.php (API will report "not configured").');
  process.exit(0);
}

const encoded = Buffer.from(JSON.stringify(cfg), 'utf8').toString('base64');
const php = `<?php\n// Generated at build time. Do not commit.\nreturn json_decode(base64_decode('${encoded}'), true);\n`;
const out = path.join('dist', 'api', '_config.php');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, php, { mode: 0o600 });
console.log('[php-config] wrote', out, 'with keys:', Object.keys(cfg).join(', '));
