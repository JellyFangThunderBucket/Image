# Enhanced Reverse Image Search

A dependency-free Tampermonkey/Violentmonkey userscript that sends a local,
clipboard, linked, or page image to multiple reverse-image-search providers.
Install [`Main`](./Main) as a userscript and open **Reverse Image Search** from
your userscript manager menu.

## What it does

- Selects an image from disk, the clipboard, an HTTP(S) URL, or an image on the
  current page.
- Opens Google Lens, TinEye, Yandex, Copyseeker, Lenso.ai, Bing, trace.moe,
  SauceNAO, IQDB, 3DIQDB, or ascii2d with that image.
- Uploads local data to Uguu only when an engine needs a public URL. The script
  validates image MIME type and size (20 MB maximum) before uploading.
- Persists the resizable menu dimensions and supports English and Chinese UI.

## Privacy and security

Page and remote image URLs go directly to the selected search provider. Local
and clipboard images are uploaded to the third-party temporary host `uguu.se`,
then their returned public URL is disclosed to the selected provider. Do not
use the upload workflow for confidential images. URL inputs are restricted to
HTTP(S); script, data, file, and other active/local schemes are rejected.

The script needs broad `@match` access so it can select images on arbitrary
pages and automate Copyseeker. It only makes a cross-origin upload to the host
declared by `@connect`.

## Development

The checked-in `Main` file is the distributable userscript; it has no build
step and no runtime package dependencies.

```sh
npm test
npm run check
```

Tests use Node's built-in test runner and a small browser sandbox. They verify
the security-sensitive URL/file validation and menu-bound calculations.

## Product roadmap

### Level 1 — Fix it

- Keep provider URLs covered by contract tests and display provider-specific
  failures instead of silently doing nothing.
- Add release automation, metadata validation, and browser integration tests.
- Replace the temporary public upload dependency with direct provider uploads
  where providers support them.

### Level 2 — Upgrade it

- Add configurable providers and one-click multi-engine search sessions.
- Add previews, image downscaling, metadata stripping, upload cancellation,
  keyboard navigation, and a context-menu command.
- Report privacy/cost/retention information before data leaves the browser.

### Level 3 — Reinvent it

Turn the script into a privacy-first visual provenance workbench: a browser
extension with a provider adapter SDK, local perceptual hashing and OCR,
deduplicated concurrent searches, result normalization, similarity clustering,
source timelines, saved investigations, team collaboration, and an audited
self-hosted upload proxy. A queued backend could continuously re-check images,
track first-seen sources, expose an API, and process large collections while
keeping provider rate limits, retries, and data retention explicit.

## License

BSD 3-Clause, as declared in the userscript metadata.
