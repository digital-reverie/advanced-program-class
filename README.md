# Classroom Lab

A reusable classroom presentation application built with **SvelteKit 3.1.0 and Svelte 5.57.3**, using the Node adapter. It includes the current 15-slide List Lab and a four-slide starter lesson.

The presentation retains keyboard navigation, teacher notes, code traces, quizzes, answer reveals, array labs, responsive layouts, and full-screen mode. Student pages contain no links to external teaching websites. The home page links to the lessons hosted by this application.

## Run locally

Use Node 24 LTS (minimum 22.17).

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. The List Lab is at `/lessons/list-lab`; the starter is at `/lessons/starter`.

On Windows, use `npm.cmd` if PowerShell blocks the npm script shim.

## Create the next lesson

1. Copy `src/lib/lessons/starter.js` to a new file such as `loops.js`.
2. Change its `id`, `title`, `subject`, `description`, and slides. Use a unique URL-safe id, for example `loops`.
3. Import it in `src/lib/lessons/index.js` and add it to the `lessons` array.
4. Preview, then run the checks and rebuild before deployment.

The new lesson will appear on the home page and at `/lessons/loops`. Navigation and teacher notes come from the shared player; you do not need to duplicate them. Remove the starter from the registry if you do not want students to see it.

See `AUTHORING.md` for block examples and custom interactive slides.

## Deploy on a Linux server with Docker

The server needs Docker Engine and Docker Compose v2 with support for `up --wait`. It does not need Node installed. Copy or clone this project onto the server, including `package-lock.json`, then run:

```sh
cp .env.example .env
# Edit .env for your server before building.
bash deploy.sh
```

The script validates Compose, builds and checks the application, then starts it and waits for the container health check. A failed build leaves the running service unchanged. Replacing the running container can briefly interrupt service; this script does not provide zero-downtime deployment or automatic rollback.

For later updates, replace the source files or pull your repository changes and run `bash deploy.sh` again. Preserve the server's `.env` file.

On Windows with Docker Desktop running:

```powershell
Copy-Item .env.example .env
.\deploy.ps1
```

Both scripts run from their own project directory, so the caller's working directory does not matter.

### Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_PORT` | `3012` | Port published on the server |
| `BIND_ADDRESS` | `127.0.0.1` | Interface on the server; use `0.0.0.0` for direct LAN access |
| `APP_ORIGIN` | blank | Optional canonical public origin, such as `https://classes.example.org` |
| `IMAGE_TAG` | `local` | Tag of the locally built Docker image |

`APP_ORIGIN` is a **build-time** setting for SvelteKit 3's `paths.origin`. Rebuild after changing it. Do not set the removed SvelteKit 2 `ORIGIN` variable. Leave it blank for local testing.

By default the app listens at `http://127.0.0.1:3012` on the server. For internet hosting, place your existing HTTPS reverse proxy in front of that address. For example, with Caddy installed on the same host:

```caddyfile
classes.example.org {
    reverse_proxy 127.0.0.1:3012
}
```

Point your domain at the server and set `APP_ORIGIN=https://classes.example.org` before deploying. If your proxy runs in another container, connect it to the app's Docker network and proxy to `app:3000` instead. DNS, TLS, firewall setup, and server provisioning are outside the deploy script.

### Operations

```sh
docker compose ps
docker compose logs -f app
curl http://127.0.0.1:3012/health
docker compose restart app
docker compose down
```

The image runs as the unprivileged `node` user. Compose uses a read-only filesystem with temporary space, restarts after a process failure or server restart, limits log sizes, and waits for `/health` to return success. There is no database or persistent volume.

The Docker build uses `npm ci` with the included lockfile. Its runtime contains only the bundled server and assets. If you later introduce runtime `dependencies` that the adapter externalizes, update the runtime stage to install or copy those dependencies too.

## Production without Docker

```sh
npm ci
npm run check
npm test
npm run build
npm start
```

The server uses port 3000 by default; `PORT` and `HOST` can override its listening address. Use a process manager if running this way on a server.

## Checks

```sh
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite starts the production build on port 4173 and shuts it down afterward. To use installed Edge instead of downloading Chromium, set `PLAYWRIGHT_CHANNEL=msedge` (PowerShell: `$env:PLAYWRIGHT_CHANNEL='msedge'`).

Tests cover desktop/mobile slide rendering, deep links, pointer traces, answer reveals, quiz feedback, array boundaries, circular ordering, the growth slider, the starter template, and missing-lesson routing.

## Project map

```text
src/lib/components/Player.svelte   Shared navigation, notes, full screen, session state
src/lib/components/Blocks.svelte   Text, code, callout, quiz, and reveal blocks
src/lib/components/GrowthLab.svelte Native interactive growth comparison
src/lib/lessons/index.js           Lesson registry
src/lib/lessons/starter.js         Copy this to create a lesson
src/lib/lessons/list-lab.js        Original diagrams, content, and activity state reducers
src/app.css                       Shared visual template
src/routes/lessons/[slug]/        Dynamic lesson route
src/routes/health/                Health endpoint
Dockerfile / compose.yaml         Container build and service configuration
deploy.sh / deploy.ps1            Linux and Windows deployment scripts
```

The List Lab's diagram markup is author-controlled HTML rendered within the Svelte player, with pure state transitions rather than document-global event handlers. New text-based lessons use native Svelte blocks. There is no iframe or separate legacy HTML page inside the app.

Lesson content is edited in source files, then rebuilt. This is not an in-browser lesson editor. All hosted lessons and teacher notes are public to anyone who can reach the app; the notes toggle is a display control, not authentication. Activity state is per browser session and resets on refresh; the slide number remains in the URL hash. No student answers are sent to a backend or saved.
# advanced-program-class
