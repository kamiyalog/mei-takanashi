function search() {
  const q = document.getElementById("searchBox").value.trim();

  if (q === "月白大学") {
    window.location.href = "deleted-blog-01.html";
  } else {
    alert("該当する記事は見つかりませんでした");
  }
}