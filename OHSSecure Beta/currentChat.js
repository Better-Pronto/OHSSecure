function logURL(requestDetails) {
    if (requestDetails.url.includes("https://stanfordohs.pronto.io/api/v2/bubble.info")) {
        if (requestDetails.method === "POST") {
            let postedString = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(requestDetails.requestBody.raw[0].bytes)));
            const chat_id = JSON.parse(postedString);

            chrome.storage.local.get("token", function(value) {
                let token = value.token;
                console.log("TOKEN: " + token);

                fetch("https://encryptionapi.pythonanywhere.com/key", {
                    method: "POST",
                    body: JSON.stringify({"token": token, "chat": chat_id.bubble_id})
                })
                .then((response) => response.json())
                .then((data) => {
                    if ("error" in data) {
                        chrome.storage.local.set({"token": ""});
                        chrome.storage.local.set({"key": ""});
                        chrome.storage.local.set({"chat_id": ""});
                    }
    
                    console.log("KEY: " + data["key"]);
    
                    chrome.storage.local.set({"key": data["key"]});
                });
            });
        }
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    logURL,
    {
        urls: [
        "https://stanfordohs.pronto.io/api/v2/bubble.info"
        ],
    },
    ["requestBody"]
);