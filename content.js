const setEscapeEvent = () => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      try {
        macroStopCart();
        macroStop();
      } catch (err) {}
    }
  });
};

const macroStart = () => {
  // 구매 시작
  alert("buy macro started");
  sessionStorage.setItem("macro", "buy");
  reload();
};
const macroStartCart = () => {
  // 장바구니 시작
  alert("cart macro started");
  sessionStorage.setItem("macro", "cart");
  reload();
};
const macroStop = () => {
  // 구매 중지
  alert("buy macro stopped");
  sessionStorage.removeItem("macro");
  reload();
};
const macroStopCart = () => {
  // 장바구니 중지
  alert("cart acro stopped");
  sessionStorage.removeItem("macro");
  reload();
};
const macro = () => {
  let buy = false;
  try {
    const $rows = document.querySelectorAll(
      // find '구매하기'
      ".prd_type3 > .btn_order > span.buy > a"
    );
    const $cart = document.querySelectorAll(
      "#wrap > div > div.prd_detail_basic > div.info > form > fieldset > div:nth-child(4) > div.prd_type3 > div.btn_order.v2 > span.cart > a"
    );
    const len = $rows.length;

    if ($rows[0]) {
      $button = $rows[0];
      if ($button.className != "_stopDefault" && $button.title == "구매하기") {
        buy = true;
        chrome.extension.sendMessage({ type: "successOrdering" });
        $button.closest("a").click();
        sessionStorage.removeItem("macro");
      }
    }
  } catch (error) {
    console.log(error);
  }
  if (!buy) {
    setTimeout(reload, 300);
  }
  // else {
  //   setTimeout(buy, 3000);
  // }
};

const macroCart = () => {
  let cart = false;
  try {
    const $cart = document.querySelectorAll(
      "#wrap > div > div.prd_detail_basic > div.info > form > fieldset > div:nth-child(4) > div.prd_type3 > div.btn_order.v2 > span.cart > a"
    );
    if ($cart[0]) {
      $button = $cart[0];
      if ($button.className != "_stopDefault" && $button.title == "장바구니") {
        $button.closest("a").click();
        cart = true;
        chrome.extension.sendMessage({ type: "successOrdering" });
        sessionStorage.removeItem("macro");
      }
    }
  } catch (error) {
    console.log(error);
  }
  if (!cart) {
    setTimeout(reload, 300);
  }
};

const buy = () => {
  try {
    // console.log("almost done");
    const $ch1 = document.querySelectorAll("#allAgree > span")[0];
    // const $ch2 = document.querySelectorAll("#buyAgree > span")[0];
    // const $ch3 = document.querySelectorAll("#mallProvisionAgree > span")[0]; //mallProvisionAgree
    const $buybtn = document.querySelectorAll(
      "#orderForm > div > div.payment_agree_wrap > button"
    )[0];
    // $ch1.classList.add("checkbox-checked");
    // $ch2.classList.add("checkbox-checked");
    // $ch3.classList.add("checkbox-checked");

    // window.scrollTo(0, document.body.scrollHeight);

    document.querySelectorAll("#buyAgree > span")[0].click();
    $buybtn.click();

    // setTimeout($buybtn.click(), 3000);

    // $ch1.addEventListener("click", function() {
    //   $buybtn.click();
    // });
  } catch (err) {
    console.log(err);
  }
};

const reload = () => {
  location.reload();
};

(() => {
  const isStarted = sessionStorage.getItem("macro") === "buy";
  const isStartedCart = sessionStorage.getItem("macro") === "cart";

  if (isStarted) {
    macro();
    setEscapeEvent();
    console.log("started");
  }
  if (isStartedCart) {
    macroCart();
    setEscapeEvent();
  }
  if (document.querySelector(".btn_order")) {
    document
      .querySelector(".btn_order")
      .insertAdjacentHTML(
        "beforeend",
        `<button type="button" class="buy-button">${
          isStarted ? "구매 정지" : "구매 시작"
        }</button>`
      );
    document
      .querySelector(".btn_order")
      .insertAdjacentHTML(
        "beforeend",
        `<button type="button" class="cart-button">${
          isStartedCart ? "장바구니 정지" : "장바구니 시작"
        }</button>`
      );
  }
  if (document.querySelector(".buy-button")) {
    document
      .querySelector(".buy-button")
      .addEventListener("click", isStarted ? macroStop : macroStart);
  }
  if (document.querySelector(".cart-button")) {
    document
      .querySelector(".cart-button")
      .addEventListener(
        "click",
        isStartedCart ? macroStopCart : macroStartCart
      );
  }
  if (buy) {
    setTimeout(buy, 300);
  }
})();
