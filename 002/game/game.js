"use strict";

/*
 * 現在の注文内容
 *
 * 例：
 * {
 *   "唐揚げ": 2,
 *   "ビール": 1
 * }
 */
const order = {};

/*
 * 正しい注文
 * blog2の記事最下部に隠されていた6品
 */
const goodOrder = {
  "唐揚げ": 1,
  "杏仁豆腐": 1,
  "ピータン": 1,
  "焼酎": 1,
  "醤油ラーメン": 1,
  "みそラーメン": 1
};

/*
 * 投稿No.14に記載された偽の注文
 */
const badOrder = {
  "唐揚げ": 2,
  "ビール": 1,
  "お好み焼き": 1
};

const addButtons = document.querySelectorAll(".add-button");
const orderList = document.getElementById("order-list");
const emptyMessage = document.getElementById("empty-message");
const orderButton = document.getElementById("order-button");

const messageOverlay = document.getElementById("message-overlay");
const messageBox = document.getElementById("message-box");

/*
 * 商品を注文リストへ追加する
 */
function addItem(itemName) {
  if (order[itemName]) {
    order[itemName] += 1;
  } else {
    order[itemName] = 1;
  }

  renderOrder();
}

/*
 * 商品を1個減らす
 */
function decreaseItem(itemName) {
  if (!order[itemName]) {
    return;
  }

  order[itemName] -= 1;

  if (order[itemName] <= 0) {
    delete order[itemName];
  }

  renderOrder();
}

/*
 * 商品を注文リストから完全に削除する
 */
function removeItem(itemName) {
  delete order[itemName];
  renderOrder();
}

/*
 * 注文リストを画面へ表示する
 */
function renderOrder() {
  const items = Object.entries(order);

  orderList.innerHTML = "";

  if (items.length === 0) {
    emptyMessage.hidden = false;
    orderButton.disabled = true;
    return;
  }

  emptyMessage.hidden = true;
  orderButton.disabled = false;

  items.forEach(([itemName, quantity]) => {
    const listItem = document.createElement("li");
    listItem.className = "order-item";

    const nameArea = document.createElement("span");
    nameArea.className = "order-item-name";
    nameArea.textContent = itemName;

    const controls = document.createElement("div");
    controls.className = "order-item-controls";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.className = "quantity-button";
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute(
      "aria-label",
      `${itemName}を1個減らす`
    );

    decreaseButton.addEventListener("click", () => {
      decreaseItem(itemName);
    });

    const quantityArea = document.createElement("span");
    quantityArea.className = "quantity";
    quantityArea.textContent = quantity;

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.className = "quantity-button";
    increaseButton.textContent = "＋";
    increaseButton.setAttribute(
      "aria-label",
      `${itemName}を1個増やす`
    );

    increaseButton.addEventListener("click", () => {
      addItem(itemName);
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.textContent = "×";
    removeButton.setAttribute(
      "aria-label",
      `${itemName}を注文リストから削除`
    );

    removeButton.addEventListener("click", () => {
      removeItem(itemName);
    });

    controls.append(
      decreaseButton,
      quantityArea,
      increaseButton,
      removeButton
    );

    listItem.append(nameArea, controls);
    orderList.appendChild(listItem);
  });
}

/*
 * 2つの注文内容が完全に一致しているか確認する
 *
 * 商品の種類と個数がすべて一致した場合のみtrue。
 */
function isSameOrder(currentOrder, answerOrder) {
  const currentItems = Object.keys(currentOrder);
  const answerItems = Object.keys(answerOrder);

  if (currentItems.length !== answerItems.length) {
    return false;
  }

  return answerItems.every((itemName) => {
    return currentOrder[itemName] === answerOrder[itemName];
  });
}

/*
 * 中央にメッセージを表示する
 */
function showMessage({
  type = "",
  title,
  text,
  buttonText = "閉じる",
  onClose = null
}) {
  messageBox.className = "message-box";

  if (type) {
    messageBox.classList.add(type);
  }

  messageBox.innerHTML = "";

  const titleElement = document.createElement("h2");
  titleElement.textContent = title;

  const textElement = document.createElement("p");
  textElement.textContent = text;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "message-close";
  closeButton.textContent = buttonText;

  closeButton.addEventListener("click", () => {
    messageOverlay.hidden = true;

    if (typeof onClose === "function") {
      onClose();
    }
  });

  messageBox.append(
    titleElement,
    textElement,
    closeButton
  );

  messageOverlay.hidden = false;
  closeButton.focus();
}

/*
 * 注文内容を判定する
 */
function checkOrder() {
  if (isSameOrder(order, goodOrder)) {
    showMessage({
      type: "success",
      title: "送信処理を開始します",
      text: "保存されていた記録を、指定された送信先へ転送します。",
      buttonText: "続ける",
      onClose: () => {
        window.location.href = "../ending/good/index.html";
      }
    });

    return;
  }

  if (isSameOrder(order, badOrder)) {
    showMessage({
      type: "error",
      title: "ロック解除処理を開始します",
      text: "電子ロックへ解除命令を送信しました。",
      buttonText: "続ける",
      onClose: () => {
        window.location.href = "../ending/bad/index.html";
      }
    });

    return;
  }

  showMessage({
    type: "error",
    title: "注文を受け付けられませんでした",
    text: "注文内容が登録された組み合わせと一致しません。"
  });
}

/*
 * 商品追加ボタン
 */
addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const itemName = button.dataset.item;

    if (!itemName) {
      return;
    }

    addItem(itemName);
  });
});

/*
 * 注文確定ボタン
 */
orderButton.addEventListener("click", checkOrder);

/*
 * オーバーレイの外側を押した場合は、
 * 通常の不正解メッセージだけ閉じられる。
 *
 * GOOD・BAD判定後はボタンを押して遷移させる。
 */
messageOverlay.addEventListener("click", (event) => {
  if (event.target !== messageOverlay) {
    return;
  }

  const closeButton =
    messageBox.querySelector(".message-close");

  if (
    closeButton &&
    closeButton.textContent === "閉じる"
  ) {
    messageOverlay.hidden = true;
  }
});

/*
 * Escキーでも通常メッセージを閉じる
 */
document.addEventListener("keydown", (event) => {
  if (
    event.key !== "Escape" ||
    messageOverlay.hidden
  ) {
    return;
  }

  const closeButton =
    messageBox.querySelector(".message-close");

  if (
    closeButton &&
    closeButton.textContent === "閉じる"
  ) {
    messageOverlay.hidden = true;
  }
});

/*
 * 初期状態
 */
renderOrder();