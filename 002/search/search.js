"use strict";

const searchData = [
  {
    keywords: ["デュランタ"],
    number: "投稿No.6",
    date: "2026年7月6日",
    title: "私はデュランダ",
    url: "../blog1/posts/post-06.html"
  },
  {
    keywords: ["新作情報"],
    number: "投稿No.9",
    date: "2026年7月9日",
    title: "新作情報公開！！！",
    url: "../blog1/posts/post-09.html"
  },
  {
    keywords: ["あっち"],
    number: "",
    date: "",
    title: "独り言。",
    url: "../blog2/index.html"
  },
  {
    keywords: ["監視カメラ映像"],
    number: "",
    date: "",
    title: "7/4　13：40　ｘｘ階　廊下　監視カメラ映像",
    url: "./pages/camera.html"
  },
{
  keywords: [
    "青木　葵",
    "青木葵"
  ],
  number: "",
  date: "",
  title: "監視記録１",
  url: "./pages/record-01.html"
},
{
    keywords: [
        "青木"
    ],
    title: "マンションブルーホーン　情報",
    url: "./pages/bluehorn.html"
},
{
    keywords: [
        "管理人からのお知らせ",
        "お知らせ"
    ],
    title: "過去掲載のお知らせの一部",
    url: "./pages/notice.html"
},
{
  keywords: [
    "監視記録2"
  ],
  number: "",
  date: "",
  title: "監視記録2",
  url: "./pages/record-02.html"
}
];

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const statusArea = document.getElementById("search-status");
const resultsArea = document.getElementById("search-results");

function normalizeText(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[\s　]+/g, "");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function searchPages(query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  return searchData.filter((page) =>
    page.keywords.some((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      return normalizedKeyword === normalizedQuery;
    })
  );
}

function renderResults(query) {
  const cleanQuery = String(query || "").trim();

  input.value = cleanQuery;
  resultsArea.innerHTML = "";

  if (!cleanQuery) {
    statusArea.textContent = "";
    return;
  }

  const matchedPages = searchPages(cleanQuery);

  statusArea.textContent =
    `「${cleanQuery}」の検索結果：${matchedPages.length}件`;

  if (matchedPages.length === 0) {
    resultsArea.innerHTML = `
      <div class="no-results">
        該当するページは見つかりませんでした。
      </div>
    `;
    return;
  }

  resultsArea.innerHTML = matchedPages
    .map((page) => {
      const meta =
        page.number || page.date
          ? `
            <div class="result-meta">
              ${escapeHtml(page.number)}
              ${page.number && page.date ? "　" : ""}
              ${escapeHtml(page.date)}
            </div>
          `
          : "";

      return `
        <article class="result-card">
          ${meta}

          <h2 class="result-title">
            <a href="${escapeHtml(page.url)}">
              ${escapeHtml(page.title)}
            </a>
          </h2>
        </article>
      `;
    })
    .join("");
}

function loadQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";

  renderResults(query);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const query = input.value.trim();
  const url = new URL(window.location.href);

  if (query) {
    url.searchParams.set("q", query);
  } else {
    url.searchParams.delete("q");
  }

  window.history.pushState({}, "", url);
  renderResults(query);
});

window.addEventListener("popstate", loadQueryFromUrl);

loadQueryFromUrl();