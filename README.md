# Fieldwork — Training Planner

A mobile-first, installable web app for organizing the soccer training sheets shared by the user. It runs as a static site: no build step, dependencies, login, or server-side database required.

## Run locally

Open `index.html` in a browser. For install/PWA and offline support, serve the repository over HTTPS (or use `localhost`), since browsers do not enable service workers for `file://` URLs.

## Put it on an iPhone

Deploy the repository as a static site with HTTPS (GitHub Pages is one option), open its URL in Safari, tap **Share**, then **Add to Home Screen**. Progress is saved in that browser/device using local storage; it is not synced between devices.

## What’s included

- Today dashboard, searchable/filterable workout library, 12-week conditioning schedule, and progress view.
- Check-off steps, individual timers for timed drills, week/day completion, and progress bars.
- Offline cache and web-app manifest for installable use.
- Starter content transcribed from the supplied sheets: warm-ups, mobility/hip primers, reactive stability, fast-twitch activation, core and cooldown routines, three speed/agility tiers, and the 12-week conditioning schedule.

## Important content note

The supplied photos include a repeated Total-Body Mobility Primer and handwritten daily markings. The app keeps one copy of the repeated routine and preserves only clear daily markings in routine notes. Some speed/agility sheets are dense; their exercise families and set/rest guidance are summarized rather than every variation transcribed. Review details with the coach and edit `app.js` to correct or expand the content. Follow the coach’s instructions; the app is a tracker, not medical or training advice.

## Progress data

Workout checkmarks, conditioning day checkmarks, and week selection are stored locally under `fieldwork-v1`. Use **Progress → Reset all saved progress** to clear completion data.
