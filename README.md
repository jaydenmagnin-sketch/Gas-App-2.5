# Gas App 2.5

This version is a GasBuddy-style static app focused on **posting gas prices by map location**.

## What it does
- Record only:
  - price per gallon
  - station name (optional)
  - latitude/longitude for map placement
- Auto-assigns timestamp at submit time (`now`).
- No odometer, no gallons, no manual date entry.
- Shows latest pin on an embedded map.
- Stores reports in `localStorage` and exports CSV.

## Run locally
```bash
python3 -m http.server 8080
```
Then open <http://localhost:8080>.

## Files
- `index.html` – UI and map layout
- `styles.css` – styling
- `app.js` – report logic, persistence, map updates, CSV export
