# Fieldwork — training sheets

This is a simple website for browsing the supplied workout sheets. **The original PNG sheet is the authority**; the exercise list and checkmarks are convenience features only.

## Easiest way to open it on Windows

You do not need to install Python or use Command Prompt.

1. Open the project page: https://github.com/ebdesigns2019/ciu-training/tree/copilot/training-app-upgrade
2. Click the green **Code** button, then **Download ZIP**.
3. In File Explorer, open the downloaded ZIP and choose **Extract all**.
4. Open the extracted `ciu-training` folder and double-click **index.html**.
5. Click **Workouts**, then click a sheet to see its original image and the readable steps.

Keep `index.html`, `workouts.js`, `app-source.js`, `styles.css`, and the `assets` folder together. If you move only `index.html`, the app cannot find its data or sheet images.

## What the app does

- Shows the workout sheets in a searchable, filterable library.
- Opens the original source image in each workout detail view.
- Lets you check off steps; progress is saved only in your browser on this device.
- Does not edit, rename, or replace the original PNGs.

For local preview, opening `index.html` directly is enough. Offline installation/service-worker features require serving the folder from `localhost` or HTTPS, but they are not needed to browse the app.
