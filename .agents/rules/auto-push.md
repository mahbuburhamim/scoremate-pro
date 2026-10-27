# Auto-Push to GitHub

Always automatically push changes to GitHub so the live website is immediately updated.

## Workflow:
1. Validate the build: Run `npm run build` to verify there are zero TypeScript/Vite compilation errors.
2. Stage and commit: Stage modified files and commit with a concise, descriptive commit message.
3. Push to GitHub: Run `git push origin main` so changes are continuously deployed to production without waiting for explicit prompt.
