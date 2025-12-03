// Static bulletin board: seeded cases, detail drawer, likes (1 per user), PDF download support.

const STORAGE_KEY = "customCases";
const LIKED_KEY = "likedCaseIds";

const SEED_CASES = [
  {
    id: "c1",
    title: "AI活用で問い合わせ�E動振り�EぁE,
    summary: "問い合わせをAIでカチE��リ判定し、担当振り�Eけを自動化、E,
    detail:
      "自然言語�E琁E��カチE��リを推定し、Jira のキューに自動振り�Eけ。SLA 違反めE25% 削減し、一次対応�E体験も向上しました、E,
    tags: ["自動化", "ヘルプデスク", "AI"],
    owner: "IT サービスチE��ク",
    impact: "SLA違反 -25%",
    date: "2025-05-01",
    likes: 8,
    pv: 0,
    comments: [
      { name: "Sato", team: "Ops", text: "手作業の振り�Eけがほぼゼロになりました、E },
      { name: "Yamada", team: "HR", text: "他部門でも流用できそぁE��す、E },
    ],
  },
  {
    id: "c2",
    title: "リモートワークVPN可視化",
    summary: "VPN 混雑をダチE��ュボ�Eド化し、ピーク時�E接続障害を減少、E,
    detail:
      "帯域と同時接続数を監視し、ピーク時にゲートを自動増設。接続失敗を 30% 削減し、リモート体験を改喁E��ました、E,
    tags: ["監要E, "クラウチE, "運用改喁E],
    owner: "ネットワーク",
    impact: "失敗率 -30%",
    date: "2025-04-18",
    likes: 5,
    pv: 0,
    comments: [],
  },
  {
    id: "c3",
    title: "権限申請�Eセルフサービス匁E,
    summary: "権限申請をフォーム化し承認フローを�E動化、リードタイム短縮、E,
    detail:
      "RBAC を整備し、PowerAutomate で承認ワークフローを�E動化。承認リードタイムめE3 日から 1 日に短縮しました、E,
    tags: ["権限管琁E, "自動化", "ナレチE��"],
    owner: "ID 管琁E,
    impact: "リードタイム -66%",
    date: "2025-05-10",
    likes: 7,
    pv: 0,
    comments: [],
  },
  {
    id: "c4",
    title: "ログイン監査でアカウント棚卸ぁE,
    summary: "半年未ログインのアカウントを検知し�E動失効、E,
    detail:
      "サインインログを集紁E��、未使用アカウントを週次で自動失効。アカウント数めE12% 削減し、リスクを低減しました、E,
    tags: ["セキュリチE��", "ID 管琁E, "刁E��"],
    owner: "セキュリチE��",
    impact: "無効匁E+12%",
    date: "2025-05-22",
    likes: 6,
    pv: 0,
    comments: [],
  },
  {
    id: "c5",
    title: "パッチE��用の段階ロールアウチE,
    summary: "自動テスト後に段階�E信し、失敗を早期検知、E,
    detail:
      "リング 0 で自動テストし、リング 1/2 へ段階�E信。失敗を即座にロールバックし、停止時間を最小化しました、E,
    tags: ["運用改喁E, "監要E, "開発効玁E],
    owner: "プラチE��フォーム",
    impact: "障害影響 -40%",
    date: "2025-04-05",
    likes: 4,
    pv: 0,
    comments: [],
  },
  {
    id: "c6",
    title: "コストタグの自動是正",
    summary: "未タグリソースを検知し�E動でタグ付け、E��計漏れを解消、E,
    detail:
      "Policy で未タグを検知し、E��門/環墁E��グを�E動補完。コスト集計漏れをゼロにし、ダチE��ュボ�Eド�E精度を向上させました、E,
    tags: ["コスト最適匁E, "クラウチE, "運用改喁E],
    owner: "クラウチECoE",
    impact: "雁E��漏れ 0件",
    date: "2025-03-28",
    likes: 5,
    pv: 0,
    comments: [],
  },
  {
    id: "c7",
    title: "ナレチE��検索の高速化",
    summary: "全斁E��索と類似 FAQ 提案で自己解決玁E��向上、E,
    detail:
      "ナレチE��を検索基盤に雁E��E��、E��似 FAQ を提案。�E己解決玁E�� 18% 向上し、�Eルプデスク負荷を削減しました、E,
    tags: ["ナレチE��", "UX", "刁E��"],
    owner: "ITSM",
    impact: "自己解決 +18%",
    date: "2025-04-15",
    likes: 9,
    pv: 0,
    comments: [],
  },
  {
    id: "c8",
    title: "ゼロタチE�� PC キチE��ィング",
    summary: "AutoPilot でキチE��ィングを�E動化し、E台あためE90 刁E��縮、E,
    detail:
      "標準イメージとポリシーをコード化し、到着即日利用可能に、E 台あためE90 刁EↁE30 刁E��短縮しました、E,
    tags: ["自動化", "開発効玁E, "UX"],
    owner: "エンド�EインチE,
    impact: "工数 -66%",
    date: "2025-05-30",
    likes: 12,
    pv: 0,
    comments: [],
  },
  {
    id: "c9",
    title: "Teams 会議録の自動要紁E,
    summary: "議事録を�E動生成し、�E有漏れを削減、E,
    detail:
      "音声認識＋要紁E��議事録を�E動�E信。�E有漏れめE80% 削減し、振り返り時間を短縮しました、E,
    tags: ["AI", "ナレチE��", "自動化"],
    owner: "コラボチーム",
    impact: "共有漏れ -80%",
    date: "2025-06-01",
    likes: 10,
    pv: 0,
    comments: [],
  },
  {
    id: "c10",
    title: "セキュリチE��アラート�E優先度自動付け",
    summary: "誤検知を減らし、E��要アラートを優先的に処琁E��E,
    detail:
      "脁E��インチE��ジェンスと賁E��重要度から優先度を�E動算�E。誤検知対応を 35% 削減しました、E,
    tags: ["セキュリチE��", "監要E, "刁E��"],
    owner: "SOC",
    impact: "誤検知 -35%",
    date: "2025-05-12",
    likes: 8,
    pv: 0,
    comments: [],
  },
];

let customCases = [];
let currentId = null;
let searchTerm = "";
let currentPage = 1;
const PAGE_SIZE = 50;

function escapeHtml(text) {
  const s = String(text ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeSvgText(text) {
  const s = String(text ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tagColor(tag) {
  const map = {
    自動化: "#34d399",
    ヘルプデスク: "#0ea5e9",
    Teams: "#2563eb",
    コスト最適匁E "#f59e0b",
    PowerBI: "#a855f7",
    クラウチE "#22c55e",
    セキュリチE��: "#f97316",
    UX: "#8b5cf6",
    "ID 管琁E: "#ef4444",
    運用改喁E "#06b6d4",
    刁E��: "#eab308",
    開発効玁E "#4f46e5",
    ナレチE��: "#10b981",
    監要E "#f43f5e",
    権限管琁E "#fb7185",
    AI: "#0ea5e9",
  };
  return map[tag] || "#2563eb";
}

function generateFallbackImage(title = "Case", primaryTag = "未刁E��E) {
  const safe = escapeSvgText(title.slice(0, 28) || "Case");
  const base = tagColor(primaryTag);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${base}'/><stop offset='100%' stop-color='#60a5fa'/></linearGradient></defs><rect width='800' height='500' rx='32' fill='url(#g)'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Segoe UI' font-size='48' font-weight='700'>${safe}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function normalizeCase(item) {
  const tags =
    Array.isArray(item.tags) && item.tags.length ? item.tags.filter(Boolean) : ["未刁E��E];
  const primary = tags[0];
  return {
    ...item,
    id: String(item.id || Date.now()),
    image: item.image || generateFallbackImage(item.title || "Case", primary),
    tags,
    likes: Number.isFinite(item.likes) ? item.likes : 0,
    pv: Number.isFinite(item.pv) ? item.pv : 0,
    comments: Array.isArray(item.comments) ? item.comments : [],
    pdfData: item.pdfData || null,
    pdfName: item.pdfName || "",
    deleted: Boolean(item.deleted),
  };
}

function normalizeCases(list) {
  return list.map(normalizeCase);
}

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

function loadLikedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveLikedSet(set) {
  localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(set)));
}

function parseDate(str) {
  const t = Date.parse(str);
  return Number.isNaN(t) ? 0 : t;
}

function getAllCases() {
  return [...customCases]
    .filter((c) => !c.deleted)
    .sort(
    (a, b) => parseDate(b.date) - parseDate(a.date) || (b.pv || 0) - (a.pv || 0)
  );
}

function findCase(id) {
  const idStr = String(id);
  return getAllCases().find((c) => String(c.id) === idStr);
}

function renderCards() {
  const list = document.getElementById("case-list");
  const pager = document.getElementById("list-pagination");
  const liked = loadLikedSet();
  if (!list) return;
  list.innerHTML = "";

  const filtered = getAllCases().filter((item) => {
    if (!searchTerm) return true;
    const haystack = [
      item.title,
      item.summary,
      item.detail,
      item.tags.join(" "),
      item.owner,
      item.impact,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  pageItems.forEach((item) => {
    const tags = item.tags;
    const isLiked = liked.has(item.id);
    const primaryTag = tags[0] || "未刁E��E;
    const tagCol = tagColor(primaryTag);
    const card = document.createElement("article");
    card.className = "case-card" + (isLiked ? " liked" : "");
    card.dataset.id = item.id;
    card.style.setProperty("--tag-color", tagCol);
    card.innerHTML = `
      <div class="color-bar"></div>
      <div class="thumb">
        <div class="tag-row">
          ${tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-summary">${item.summary}</div>
        <div class="card-meta">
          <span class="pill">拁E��E${item.owner}</span>
          <span class="pill">効极E${item.impact}</span>
        </div>
        <div class="card-actions">
          <button class="btn like-btn${isLiked ? " liked" : ""}" data-id="${item.id}">
            👍 ${isLiked ? "グチE��済み" : "グチE��"} <span class="like-num">${item.likes}</span>
          </button>
          <span class="stat">💬 ${item.comments.length}</span>
        </div>
      </div>
    `;
    const thumb = card.querySelector(".thumb");
    if (thumb) {
      thumb.style.backgroundImage = `url("${item.image}")`;
      thumb.style.backgroundColor = tagCol;
    }
    list.appendChild(card);
  });

  renderPagination(pager, totalPages);
}

function setPage(page) {
  const clamped = Math.max(1, page);
  if (clamped === currentPage) return;
  currentPage = clamped;
  renderCards();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderPagination(container, totalPages) {
  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = "";
    container.style.display = "none";
    return;
  }
  container.style.display = "flex";
  container.innerHTML = "";

  const addBtn = (label, page, disabled = false, active = false) => {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (active ? " active" : "");
    btn.textContent = label;
    btn.disabled = disabled;
    btn.addEventListener("click", () => setPage(page));
    container.appendChild(btn);
  };

  addBtn("前へ", Math.max(1, currentPage - 1), currentPage === 1);

  const windowSize = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + windowSize - 1);
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);

  for (let p = start; p <= end; p += 1) {
    addBtn(String(p), p, false, p === currentPage);
  }

  addBtn("次へ", Math.min(totalPages, currentPage + 1), currentPage === totalPages);
}

function openDetail(id) {
  const item = findCase(id);
  if (!item) return;
  currentId = String(id);

  const idx = customCases.findIndex((c) => String(c.id) === String(id));
  if (idx !== -1) {
    customCases[idx].pv = (customCases[idx].pv || 0) + 1;
    saveCustomCases(customCases);
  }

  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-summary").textContent = item.summary;
  document.getElementById("detail-body").textContent = item.detail;
  document.getElementById("detail-owner").textContent = `拁E��E ${item.owner}`;
  document.getElementById("detail-impact").textContent = `効极E ${item.impact}`;
  document.getElementById("detail-date").textContent = `公開日: ${item.date}`;
  document.getElementById("detail-hero").style.backgroundImage = `url("${item.image}")`;
  document.getElementById("detail-tags").textContent = item.tags.join(" / ");
  const likeCountEl = document.getElementById("like-count");
  const commentCountEl = document.getElementById("comment-count");
  if (likeCountEl) likeCountEl.textContent = item.likes;
  if (commentCountEl) commentCountEl.textContent = item.comments.length;

  const liked = loadLikedSet();
  const likeBtn = document.getElementById("like-btn");
  if (likeBtn) {
    likeBtn.classList.toggle("liked", liked.has(item.id));
    likeBtn.innerHTML = `👍 ${liked.has(item.id) ? "グチE��済み" : "グチE��"} <span id="like-count">${item.likes}</span>`;
  }

  const pdfLink = document.getElementById("detail-pdf");
  if (pdfLink) {
    if (item.pdfData) {
      pdfLink.classList.remove("hidden");
      pdfLink.href = item.pdfData;
      pdfLink.download = item.pdfName || `${item.title}.pdf`;
      pdfLink.textContent = item.pdfName ? `📄 ${item.pdfName} をダウンロード` : "📄 添付PDFを開ぁE;
      pdfLink.target = "_blank";
      pdfLink.rel = "noopener";
    } else {
      pdfLink.classList.add("hidden");
      pdfLink.removeAttribute("href");
    }
  }

  renderComments(item.comments);

  document.getElementById("detail-drawer").classList.add("open");
  const overlay = document.getElementById("drawer-overlay");
  if (overlay) overlay.classList.add("open");
}

function likeCase(id) {
  const idx = customCases.findIndex((c) => String(c.id) === String(id));
  const likedSet = loadLikedSet();
  if (likedSet.has(String(id))) return;

  if (idx !== -1) {
    customCases[idx].likes += 1;
    saveCustomCases(customCases);
  }
  likedSet.add(String(id));
  saveLikedSet(likedSet);

  if (String(currentId) === String(id)) {
    const item = findCase(id);
    const likeCountEl = document.getElementById("like-count");
    const likeBtn = document.getElementById("like-btn");
    if (item && likeCountEl) likeCountEl.textContent = item.likes;
    if (item && likeBtn)
      likeBtn.innerHTML = `👍 グチE��済み <span id="like-count">${item.likes}</span>`;
  }

  renderCards();
}

function renderComments(list) {
  const container = document.getElementById("comment-list");
  if (!container) return;
  container.innerHTML = "";
  list.forEach((c) => {
    const div = document.createElement("div");
    div.className = "comment";
    const who = [c?.name || "匿吁E, c?.team].filter(Boolean).join(" / ");
    div.innerHTML = `
      <div class="comment-head">
        <span>${who}</span>
        <span>${new Date().toLocaleDateString("ja-JP")}</span>
      </div>
      <div class="comment-body">${escapeHtml(c?.text)}</div>
    `;
    container.appendChild(div);
  });
}

function addComment(e) {
  e.preventDefault();
  if (!currentId) return;
  const name = document.getElementById("comment-name")?.value.trim() || "";
  const team = document.getElementById("comment-team")?.value.trim() || "";
  const text = document.getElementById("comment-text")?.value.trim();
  if (!text) return;
  const idx = customCases.findIndex((c) => String(c.id) === String(currentId));
  if (idx === -1) return;
  const entry = { name: name || "匿吁E, team, text };
  customCases[idx].comments.push(entry);
  saveCustomCases(customCases);
  renderComments(customCases[idx].comments);
  const commentCountEl = document.getElementById("comment-count");
  if (commentCountEl) commentCountEl.textContent = customCases[idx].comments.length;
  const form = e.target;
  if (form) form.reset();
}

function attachEvents() {
  const closeBtn = document.getElementById("drawer-close");
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  const overlay = document.getElementById("drawer-overlay");
  if (overlay) overlay.addEventListener("click", closeDrawer);
  const likeBtn = document.getElementById("like-btn");
  if (likeBtn) likeBtn.addEventListener("click", () => likeCase(currentId));

  const list = document.getElementById("case-list");
  if (list) {
    list.addEventListener("click", (e) => {
      const like = e.target.closest(".like-btn");
      if (like) {
        likeCase(like.dataset.id);
        return;
      }
      const card = e.target.closest(".case-card");
      if (card) {
        openDetail(card.dataset.id);
      }
    });
  }

  const commentForm = document.getElementById("comment-form");
  if (commentForm) {
    commentForm.addEventListener("submit", addComment);
  }
}

function closeDrawer() {
  document.getElementById("detail-drawer").classList.remove("open");
  const overlay = document.getElementById("drawer-overlay");
  if (overlay) overlay.classList.remove("open");
  currentId = null;
}

function updateClockOnce() {
  const el = document.getElementById("current-time");
  if (el) el.textContent = new Date().toLocaleString("ja-JP");
}

document.addEventListener("DOMContentLoaded", () => {
  const stored = loadCustomCases();
  if (stored.length) {
    customCases = normalizeCases(stored);
  } else {
    customCases = normalizeCases(SEED_CASES);
    saveCustomCases(customCases);
    localStorage.removeItem(LIKED_KEY);
  }

  renderCards();
  attachEvents();
  updateClockOnce();
  const searchBox = document.getElementById("search-box");
  if (searchBox) {
    searchBox.addEventListener("input", (e) => {
      searchTerm = e.target.value;
       currentPage = 1;
      renderCards();
    });
  }
});
