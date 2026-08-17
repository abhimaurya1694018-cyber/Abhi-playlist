# Abhi Playlist — Polished YouTube Edition

A mobile-first, interactive playlist site for GitHub Pages.

## What this version does

- Uses the uploaded artwork as the visual background pool.
- Chooses a different background on each load when possible.
- Adds tap/click ripple effects and a desktop cursor glow.
- Swipe up/down changes the selected playlist.
- Shows a custom Abhi Playlist interface as the main experience.
- Uses the official YouTube embedded player for standard YouTube playlists.
- Keeps the YouTube player compact rather than making it the main page UI.
- Provides custom play/pause, next, previous, shuffle, repeat, seek and volume controls where the YouTube IFrame API supports them.
- YouTube Mix links are opened on YouTube because Mix/radio URLs are not ordinary playlist IDs suitable for the same embedded-playlist flow.

## Important YouTube note

The compact player is intentionally still present and visible. It is not hidden or used to bypass YouTube branding, ads, or playback restrictions. Playback remains through YouTube's official embed/player.

## GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and the `images` folder.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main`, and choose `/ (root)`.
5. Save and wait for GitHub Pages to publish.

## Adding more backgrounds

Put additional files into `images/`, then add their paths to `bgPool` in `script.js`.

Example:

`"images/bg-6.jpg"`

## Changing playlists

Edit the `playlists` array in `script.js`. For a normal YouTube playlist, provide its playlist ID in `yt`. For a YouTube Mix/radio URL, leave `yt:null` and keep the full URL in `url`.
