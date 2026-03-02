chrome.runtime.onMessage.addListener(async (message) => {

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

  if (!("EyeDropper" in window)) {
    alert("EyeDropper API not supported");
    return;
  }

  const eyeDropper = new EyeDropper();

  try {

    const result = await eyeDropper.open();

    chrome.runtime.sendMessage({
      type: "COLOR_PICKED",
      color: result.sRGBHex
    });

  } catch (e) {
    console.log("User cancelled");
  }

}