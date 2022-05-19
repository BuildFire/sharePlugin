let config = {
    strings: {},
    defaultValues: new Strings(),
    timer:null,
    delay:350,
};

function callBack(err, data) {
    if (err) {
        console.log(err);
    } else {
        config.strings = data;
    }

    // checkValues();
    if(data){
        setDefaultData(data.share, data.message);
    }else{
        setDefaultData(config.defaultValues.share, config.defaultValues.message);
    }
}

StringsHandler.get(callBack);


function setDefaultData(share, message){
    shareBtn.defaultValue = share || config.defaultValues.share;
    scanText.defaultValue = message  || config.defaultValues.message;
}

function setListener(){
    shareBtn.addEventListener('keyup', saveData);
    scanText.addEventListener('keyup', saveData);
}

function saveData(e){
    clearTimeout(config.timer);
    config.timer = setTimeout(()=>{
        let newData = {
            share:shareBtn.value,
            message:scanText.value,
        };

        StringsHandler.set(newData, callBack);
    }, config.delay);
}


setListener();