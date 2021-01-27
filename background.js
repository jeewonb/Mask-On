const sendTelegramMessage = () => {
  if (!process.env.botToken || !process.env.chatId) {
    return;
  }

  // 개인 botToken, chatId를 .env 파일에 작성해야함.
  const msg = encodeURI("Your order was successful.");
  const url = `https://api.telegram.org/bot${process.env.botToken}/sendmessage?chat_id=${process.env.chatId}&text=${msg}`;

  fetch(url);
};

chrome.extension.onMessage.addListener((message, sendResponse) => {
  if (message && message.type == "successOrdering") {
    sendTelegramMessage();
    sendResponse(true);
  }
});
