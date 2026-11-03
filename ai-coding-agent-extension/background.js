chrome.runtime.onInstalled.addListener(() => {
    console.log("AI Coding Agent Pro installed.");
    // Allow users to open the side panel by clicking on the action toolbar icon
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
});

// Setup Native Messaging Connection
let nativePort = null;

function connectToNativeHost() {
    const hostName = "com.ai.agent.host";
    nativePort = chrome.runtime.connectNative(hostName);

    nativePort.onMessage.addListener((msg) => {
        console.log("Received from native host:", msg);
        // TODO: Forward messages to the frontend UI (app.js)
    });

    nativePort.onDisconnect.addListener(() => {
        console.error("Disconnected from native host:", chrome.runtime.lastError?.message);
        nativePort = null;
        // Optional: Attempt to reconnect after a delay
    });
}

// Connect initially
// connectToNativeHost(); // Uncomment when the host is installed on the OS

// Listen for messages from the UI (app.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SEND_TO_HOST') {
        if (nativePort) {
            nativePort.postMessage(request.payload);
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: "Native host not connected." });
        }
    }
    return true; // Keep the message channel open for asynchronous response
});
