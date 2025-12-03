# iTraNavi Static Pages

This repository now only contains the standalone static mock pages for the improvement board (`dashboard-static`) and its admin console (`dashboard-admin`). There is no Flask server, database, or migration setup required.

## Files
- `app/static/dashboard-static.html` - public board with search, filters, pagination, likes, and comments.
- `app/static/js/board.js` - front-end logic for the board page (seed data, localStorage persistence, detail drawer).
- `app/static/dashboard-admin.html` - admin/ops view with analytics tab, post form, and management table.
- `app/static/js/board-admin.js` - front-end logic for the admin page (charts, form handling, localStorage cases).
- `app/static/css/style.css` - shared styles for both pages.

## How to View
- Open either HTML file directly in your browser from `app/static/`.
- Or run a simple static server from the repo root:
  - `python -m http.server 8000 -d app/static`
  - Then visit `http://localhost:8000/dashboard-static.html` or `http://localhost:8000/dashboard-admin.html`.

## Notes
- All data is client-side only and stored in `localStorage` (`customCases`, `likedCaseIds`, etc.).
- Removed backend-related files and instructions so the repository is focused solely on the static and admin pages.
