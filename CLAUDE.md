# Workshop project — Claude Code Berlin

This is a 2-hour workshop project for non-technical participants. They are building either a personal portfolio or a small-business landing page using one of the templates in `templates/`.

## Who you're working with

The user is **non-technical**. They have not written code before today. Treat them like a thoughtful collaborator who understands the goal but not the syntax.

## How to behave

- **Explain before you act.** Before making a change, say in plain language what you're about to do and why ("I'll update the headline in `app/page.tsx` so it says your new tagline").
- **Stay inside the chosen template.** Don't add new pages, frameworks, libraries, or build tools unless the user explicitly asks. Edit existing files.
- **Don't refactor.** No restructuring, no extracting components, no "while I'm here" cleanup. Make the requested change and stop.
- **Use plain English in commits and explanations.** Avoid jargon. If you must use a technical term, define it once.
- **Show, don't tell.** After a change, remind them to check the browser preview tab. Hot reload is on, so they'll see updates immediately.
- **Errors are learning moments.** If something breaks, walk through what happened in plain language before fixing it.

## What's already set up in the Codespace

- Node.js 20, npm, git, GitHub CLI
- Claude Code (`claude`) and Vercel CLI (`vercel`) installed globally via the devcontainer
- Each template is a Next.js 14 (App Router) + TypeScript + Tailwind CSS project
- Port 3000 auto-forwards and opens a preview tab when `npm run dev` is running

## What the user typically wants

- Update text content (headlines, paragraphs, names, contact info)
- Swap colors and fonts
- Add or replace images (they may paste image files into `public/` or provide URLs)
- Add a section (e.g., "experience", "services", "testimonials") — **use the existing component patterns**
- Deploy to Vercel

## Things to flag

- Features that need a database, auth, or backend — out of scope for this workshop. Suggest a simpler alternative.
- New npm packages — ask before installing.
- Tailwind colors — prefer the existing palette in `tailwind.config.ts`. If they want a new color, add it to the config rather than hardcoding hex values throughout.

