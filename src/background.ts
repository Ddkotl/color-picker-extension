console.log("background loaded", chrome.scripting);
chrome.runtime.onMessage.addListener(async (message) => {
  console.log("get message in bg", message)
  if (message.type === "START_COLOR_PICK") {

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab.id) return;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: startEyeDropper
    });

  }

});

async function startEyeDropper() {
  console.log("start eye dropper")
  if (!("EyeDropper" in window)) {
    alert("EyeDropper API not supported");
    return;
  }

  const eyeDropper = new EyeDropper();
  console.log("eye dropper created", eyeDropper)
  try {

    const result = await eyeDropper.open();
    console.log("color picred", result)
    chrome.runtime.sendMessage({
      type: "COLOR_PICKED",
      color: result.sRGBHex
    });

  } catch (e) {
    console.log("User cancelled");
  }

}