document.getElementById("update-key-button").addEventListener("click", updateAPIKey);

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  if('key' in item) {
    document.getElementById("key-text-area").value = item.key;
  }
}

function updateAPIKey() {
  var key = document.getElementById("key-text-area").value;
  let setting = browser.storage.local.set({key});
  setting.then(null, onError);
}

function getAPIKey() {
  let getting = browser.storage.local.get("key");
  getting.then(onGot, onError);
}

getAPIKey();
