function searchWord() {
  const q = document.getElementById("searchInput").value.trim();

  if (q === "月白大学") {
    window.location.href = "post-04.html";
  } else if (q === "呪いによる記憶の欠如と成就") {
    window.location.href = "research-presentation.html";
  } else if (q === "森高宵") {
    window.location.href = "professor-moritaka.html";
  } else if (q === "呪い") {
    window.location.href = "post-07.html";
  } else if (q === "美沙") {
    window.location.href = "misa-profile.html";
  } else if (q === "不幸集中化と記憶の忘却") {
    window.location.href = "research-curse.html";
  } else if (q === "葬式") {
    window.location.href = "post-11.html";
  } else if (q === "新庄美沙") {
    window.location.href = "misa-belongings.html";
  } else if (q === "黒羽文鳥") {
    window.location.href = "author-kurobane.html";
  } else if (q === "八朔伝承") {
    window.location.href = "hassaku-legend.html";
  } else if (q === "呪成就") {
    window.location.href = "post-17.html";
  } else if (q === "朝霧神社") {
    window.location.href = "asagiri-shrine.html";
  } else if (q === "真克神") {
    window.location.href = "village-record.html";
  } else if (q === "朱祓村") {
    window.location.href = "akabara-ritual.html";
  } else if (q === "修正版祭事記録") {
    window.location.href = "akabara-ritual.html";
  } else if (q === "下書き") {
    window.location.href = "draft.html";
  } else {
    alert("検索結果は見つかりませんでした。");
  }
}