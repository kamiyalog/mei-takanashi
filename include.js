async function include(id, file) {
  const target = document.getElementById(id);
  if (!target) return;

  const response = await fetch(file);
  const html = await response.text();
  target.innerHTML = html;
}

include("header", "header.html");
include("footer", "footer.html");
include("profile", "profile.html");