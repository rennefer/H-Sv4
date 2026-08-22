# Horus and Seth — Hieratic Word List

Static site: a home page plus four browsable pages (Dictionary, Sign List, Wenamun, Horus and Seth). No build step, no server — just static HTML/CSS/JS files that link to each other with relative paths.

## Files

- `index.html` — home page with links to the four sections
- `dictionary.html` — searchable word list (4,973 headwords)
- `sign-list.html` — Gardiner sign list (277 signs)
- `wenamun.html` — Papyrus Moscow 120 transcription
- `horus-and-seth.html` — Papyrus Chester Beatty I transcription
- `manifest.webmanifest`, `sw.js`, `icons/` — make the site installable as an app (see below)

## Publish with GitHub Pages

1. Create a new GitHub repository (public, or private if your plan supports Pages on private repos).
2. Add **all files and folders** (including the `icons/` folder) to the repo root — either:
   - **Drag-and-drop**: on the repo's GitHub page, click "Add file" → "Upload files", drag everything in (the `icons` folder included), and commit.
   - **Git**: `git init`, `git add .`, `git commit -m "Initial site"`, then push to your repo's remote.
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch", pick the branch (usually `main`) and folder `/ (root)`, then Save.
5. GitHub will give you a URL like `https://<username>.github.io/<repo-name>/` within a minute or two — that's your live site.

No further configuration is needed. All pages find each other automatically via relative links, since they all live in the same folder.

## Turning it into a real Android app (no coding)

The site is already a installable PWA (manifest + service worker + icons), which is what lets a tool called **PWABuilder** turn it into a real Android APK/AAB — installable directly, or publishable to the Play Store.

Once your GitHub Pages URL is live:

1. Go to **https://www.pwabuilder.com**
2. Paste your site's URL (e.g. `https://rennefer.github.io/horus-and-seth-/`) and click "Start"
3. PWABuilder scans the site and should report it's installable (green checks for manifest, service worker, icons)
4. Click **"Package for stores"** → choose **Android**
5. Leave the defaults (package ID, app name, colors are already pulled from the manifest) and click **Generate**
6. Download the generated package — it includes a signed `.apk` you can install directly on an Android phone (enable "install from unknown sources" if prompted), or an `.aab` bundle ready to upload to Google Play Console if you want it on the Play Store

No Android Studio, no signing keys to manage yourself — PWABuilder handles all of that.
