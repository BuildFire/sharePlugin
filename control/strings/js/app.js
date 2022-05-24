let strings;
let delay = 350;
let timer;
function loadLanguage(lang) {
  strings = new buildfire.services.Strings(lang, stringsConfig);
  strings.init().then(() => {
    strings.inject();
  });
  stringsUI.init("stringsContainer", strings, stringsConfig);
}

async function loadingAndCreateLanguage(lang) {
  loadLanguage(lang);
  createLanguage(lang);
}

function createLanguage(language) {
  stringsContainer.disabled = true;
  strings.createLanguage(language, () => {
    stringsContainer.disabled = false;
  });
  return false;
}

function deleteLanguage() {
  buildfire.notifications.confirm(
    {
      message: "Are you sure you want to remove support fo this language?",
      confirmButton: { type: "danger" },
    },
    (e, r) => {
      if (r.selectedButton.key == "confirm") {
        strings.deleteLanguage(() => {
          loadLanguage(langOptions.value);
        });
      }
    }
  );
}

function save() {
  strings.save((r) => {
    buildfire.messaging.sendMessageToWidget({ cmd: "refresh" });
  });
}

const initialState = async () => {
  await loadingAndCreateLanguage(langOptions.value);
};

function saveOnClick(){
  saveButton.addEventListener("click", save);
}


initialState();
saveOnClick();