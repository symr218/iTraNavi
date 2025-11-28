// Admin form: accepts file input -> dataURL, or generates placeholder SVG. Also shows simple analytics.

const STORAGE_KEY = "customCases";
const ANALYTICS_KEY = "analyticsData";

function loadCustomCases() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCustomCases(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function generateFallbackImage(title = "New Case") {
  const text = encodeURIComponent(title.slice(0, 28));
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#60a5fa'/><stop offset='100%' stop-color='#22d3ee'/></linearGradient></defs><rect width='800' height='500' rx='32' fill='url(#g)'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Segoe UI' font-size='48' font-weight='700'>${text}</text></svg>`
    )
  );
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const owner = document.getElementById("owner").value.trim() || "IT 管理者";
  const impact = document.getElementById("impact").value.trim() || "効果未入力";
  const date = document.getElementById("date").value || new Date().toISOString().slice(0, 10);
  const summary = document.getElementById("summary").value.trim();
  const detail = document.getElementById("detail").value.trim();
  const selectedTags = Array.from(document.querySelectorAll(".tag-chip.selected")).map(
    (c) => c.dataset.value
  );
  const extraTags = document
    .getElementById("tags-extra")
    .value.split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const tagsInput = [...selectedTags, ...extraTags];
  const fileInput = document.getElementById("image-file");
  const file = fileInput.files[0];

  if (!title || !summary || !detail) return;

  let imageData = generateFallbackImage(title);
  if (file) {
    try {
      imageData = await readFileAsDataURL(file);
    } catch {
      imageData = generateFallbackImage(title);
    }
  }

  const newCase = {
    id: Date.now(),
    title,
    summary,
    detail,
    tags: tagsInput.length ? tagsInput : ["未分類"],
    owner,
    impact,
    date,
    likes: 0,
    pv: 0,
    comments: [],
    image: imageData,
    isCustom: true,
  };

  const list = loadCustomCases();
  list.unshift(newCase);
  saveCustomCases(list);

  bumpAnalyticsCounts(newCase);
  renderAnalytics();

  const status = document.getElementById("form-status");
  status.textContent = "保存しました。一覧ページを開くと反映されます。";
  e.target.reset();
}

// ------- Analytics (mock) -------

function loadAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "null");
  } catch {
    return null;
  }
}

function saveAnalytics(data) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
}

function ensureAnalytics() {
  let data = loadAnalytics();
  if (!data) {
    data = {
      logins: { weekly: 230, monthly: 980, yearly: 11200 },
      pageViews: 3200,
      cases: {},
      tags: {},
    };
    saveAnalytics(data);
  }
  return data;
}

function bumpAnalyticsCounts(newCase) {
  const data = ensureAnalytics();
  data.pageViews += 20; // mock
  data.cases[newCase.title] = (data.cases[newCase.title] || 0) + 50;
  newCase.tags.forEach((t) => {
    data.tags[t] = (data.tags[t] || 0) + 30;
  });
  saveAnalytics(data);
}

function renderAnalytics() {
  const cases = loadCustomCases();
  const totalCases = cases.length;
  const totalPv = cases.reduce((sum, c) => sum + (c.pv || 0), 0);
  const totalLikes = cases.reduce((sum, c) => sum + (c.likes || 0), 0);

  const tagAgg = {};
  cases.forEach((c) => {
    const tags = Array.isArray(c.tags) && c.tags.length ? c.tags : ["未分類"];
    tags.forEach((t) => {
      if (!tagAgg[t]) tagAgg[t] = { pv: 0, count: 0 };
      tagAgg[t].pv += c.pv || 0;
      tagAgg[t].count += 1;
    });
  });

  const pvCases = cases
    .map((c) => [c.title, c.pv || 0])
    .sort((a, b) => b[1] - a[1]);
  const pvTags = Object.entries(tagAgg).sort((a, b) => b[1].pv - a[1].pv);

  const metricEl = document.getElementById("analytics-metrics");
  metricEl.innerHTML = `
    <div class="metric-card">
      <div class="metric-title">総 PV</div>
      <div class="metric-value">${totalPv}</div>
      <div class="metric-sub">記事数 ${totalCases}</div>
    </div>
    <div class="metric-card">
      <div class="metric-title">総いいね</div>
      <div class="metric-value">${totalLikes}</div>
      <div class="metric-sub">平均いいね ${(totalCases ? (totalLikes / totalCases).toFixed(1) : 0)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-title">タグ数</div>
      <div class="metric-value">${pvTags.length}</div>
      <div class="metric-sub">タグ別集計</div>
    </div>
  `;

  const caseTable = document.getElementById("analytics-cases");
  caseTable.innerHTML =
    pvCases
      .map(([name, pv]) => {
        const width = Math.min(100, pv / (pvCases[0]?.[1] || 1) * 100);
        return `<tr><td>${name}</td><td>${pv}</td><td><div class="bar"><span style="width:${width}%"></span></div></td></tr>`;
      })
      .join("") || "<tr><td colspan='3'>データなし</td></tr>";

  const tagTable = document.getElementById("analytics-tags");
  tagTable.innerHTML =
    pvTags
      .map(([tag, v]) => {
        const width = Math.min(100, v.pv / (pvTags[0]?.[1].pv || 1) * 100);
        return `<tr><td>${tag} (${v.count}件)</td><td>${v.pv}</td><td><div class="bar"><span style="width:${width}%"></span></div></td></tr>`;
      })
      .join("") || "<tr><td colspan='3'>データなし</td></tr>";

  const likesTable = document.getElementById("analytics-likes");
  const likeCases = cases
    .map((c) => [c.title, c.likes || 0])
    .sort((a, b) => b[1] - a[1]);
  likesTable.innerHTML =
    likeCases
      .map(([name, likes]) => `<tr><td>${name}</td><td>${likes}</td></tr>`)
      .join("") || "<tr><td colspan='2'>データなし</td></tr>";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("admin-form").addEventListener("submit", handleSubmit);
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
  renderTagChips();
  switchTab("ops"); // start at ops
  renderAnalytics();
});

function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document.querySelectorAll(".admin-section").forEach((sec) => {
    sec.classList.toggle("hidden", sec.dataset.tab !== tab);
  });
  if (tab === "ops") {
    renderAnalytics();
  }
}

function renderTagChips() {
  const preset = [
    "自動化",
    "コスト最適化",
    "セキュリティ",
    "UX",
    "運用改善",
    "分析",
    "開発効率",
    "ナレッジ",
    "監視",
    "権限管理",
  ];
  const row = document.getElementById("tag-chip-row");
  row.innerHTML = "";
  preset.forEach((name) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "tag-chip";
    chip.dataset.value = name;
    chip.textContent = name;
    chip.addEventListener("click", () => {
      chip.classList.toggle("selected");
    });
    row.appendChild(chip);
  });
}
