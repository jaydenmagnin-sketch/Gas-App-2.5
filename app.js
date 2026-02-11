const STORAGE_KEY = "gas-app-2.5-reports";

const form = document.getElementById("report-form");
const rowsEl = document.getElementById("rows");
const statsEl = document.getElementById("stats");
const exportBtn = document.getElementById("export");
const useLocationBtn = document.getElementById("use-location");
const mapEl = document.getElementById("map");
const mapLabelEl = document.getElementById("map-label");

let reports = loadReports();

function loadReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function persistReports() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
}

function formatDateTime(isoValue) {
  return new Date(isoValue).toLocaleString();
}

function sortedReports() {
  return [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function updateMap(lat, lng, station) {
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return;

  const delta = 0.02;
  const bbox = [lngNum - delta, latNum - delta, lngNum + delta, latNum + delta]
    .map((n) => n.toFixed(6))
    .join("%2C");
  const marker = `${latNum.toFixed(6)}%2C${lngNum.toFixed(6)}`;

  mapEl.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
  mapLabelEl.textContent = station ? `Showing: ${station}` : "Showing latest report location";
}

function renderStats(rows) {
  const totalReports = rows.length;
  const avgPrice = totalReports ? rows.reduce((sum, r) => sum + r.price, 0) / totalReports : 0;
  const lowestPrice = totalReports ? Math.min(...rows.map((r) => r.price)) : 0;
  const latest = rows[0];

  statsEl.innerHTML = [
    ["Reports", totalReports.toString()],
    ["Average Price", formatMoney(avgPrice)],
    ["Lowest Price", formatMoney(lowestPrice)],
    ["Latest Post", latest ? formatDateTime(latest.createdAt) : "—"],
  ]
    .map(([label, value]) => `
      <article class="stat">
        <h3>${label}</h3>
        <p>${value}</p>
      </article>
    `)
    .join("");
}

function renderTable(rows) {
  rowsEl.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${formatDateTime(row.createdAt)}</td>
          <td>${row.station || "—"}</td>
          <td>${formatMoney(row.price)}</td>
          <td>${row.lat.toFixed(6)}</td>
          <td>${row.lng.toFixed(6)}</td>
          <td><a href="https://www.openstreetmap.org/?mlat=${row.lat}&mlon=${row.lng}#map=15/${row.lat}/${row.lng}" target="_blank" rel="noopener noreferrer">Open</a></td>
          <td><button data-id="${row.id}">Delete</button></td>
        </tr>
      `
    )
    .join("");
}

function render() {
  const rows = sortedReports();
  renderStats(rows);
  renderTable(rows);

  if (rows[0]) {
    updateMap(rows[0].lat, rows[0].lng, rows[0].station);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const next = {
    id: crypto.randomUUID(),
    station: document.getElementById("station").value.trim(),
    price: Number(document.getElementById("price").value),
    lat: Number(document.getElementById("lat").value),
    lng: Number(document.getElementById("lng").value),
    createdAt: new Date().toISOString(),
  };

  if (!Number.isFinite(next.price) || next.price <= 0) return;
  if (!Number.isFinite(next.lat) || !Number.isFinite(next.lng)) return;

  reports.push(next);
  persistReports();
  form.reset();
  render();
});

rowsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;

  reports = reports.filter((item) => item.id !== button.dataset.id);
  persistReports();
  render();
});

exportBtn.addEventListener("click", () => {
  const rows = sortedReports();
  const headers = ["createdAt", "station", "price", "lat", "lng"];
  const body = rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")).join("\n");
  const csv = `${headers.join(",")}\n${body}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gas-price-reports.csv";
  link.click();
  URL.revokeObjectURL(url);
});

useLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    document.getElementById("lat").value = position.coords.latitude.toFixed(6);
    document.getElementById("lng").value = position.coords.longitude.toFixed(6);
    updateMap(position.coords.latitude, position.coords.longitude, "Current location");
  });
});

render();
