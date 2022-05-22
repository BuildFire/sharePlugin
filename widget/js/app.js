const config = {
    messageText: "",
};
Languages.get((err, res) => {
    console.log('res -=>', res);
    if (err) console.error(err);
    else {
        shareBtn.innerHTML = res.data.screenOne.share.value || res.data.screenOne.share.defaultValue;
        shareText.innerHTML = res.data.screenOne.message.value || res.data.screenOne.message.defaultValue;
    }
});

buildfire.messaging.onReceivedMessage = (message) => {
    if (message.cmd == 'refresh') {
        buildfire.datastore.onUpdate((e) => {
            if (e.tag == "$bfLanguageSettings_en-us") {
                shareBtn.innerHTML = e.data.screenOne.share.value || e.data.screenOne.share.defaultValue;
                shareText.innerHTML = e.data.screenOne.message.value || e.data.screenOne.message.defaultValue;
            }
        });

    }
};