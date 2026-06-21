const TOTAL_PAGES = 34;

async function include(id, file) {
  const target = document.getElementById(id);
  if (!target) return;

  const response = await fetch(file);
  const html = await response.text();
  target.innerHTML = html;

  if (id === "footer") {
    setPageNumber();
  }
}

function setPageNumber() {
  const page = document.body.dataset.page;
  const pageNumber = document.getElementById("page-number");

  if (!page || !pageNumber) return;

  pageNumber.textContent = `${page} / ${TOTAL_PAGES}`;
}

include("header", "header.html");
include("footer", "footer.html");
include("profile", "profile.html");