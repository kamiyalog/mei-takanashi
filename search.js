function search() {
  const q = document.getElementById("searchBox").value.trim();

  if (q === "月白大学") {
    window.location.href = "deleted-blog-01.html";
} else if (q === "記憶残留現象と共同幻想") {
  window.location.href = "research-presentation.html";
}

  } else {
    alert("該当する記事は見つかりませんでした");
  }
}