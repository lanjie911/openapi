let showWarnDialog = function (vueIntance, strMessage) {
    vueIntance.$alert(strMessage, '警告', {
        confirmButtonText: "确定",
        type: "warning",
        showClose: false
    });
};

let showSuccessDialog = function (vueIntance, strMessage,invokerFunc) {
    vueIntance.$alert(strMessage, '成功', {
        confirmButtonText: "确定",
        type: "success",
        showClose: false,
        callback: invokerFunc
    });
};

let REGUtil = {
    checkPhone: function (strPhoneNumber) {
        let iphone = strPhoneNumber;
        if ((/^1[3456789]\d{9}$/.test(iphone))) {
            return true;
        }
        return false;
    },
    checkPasswd: function(strPassword){
        if ((/^[a-zA-Z0-9]{8,16}$/.test(strPassword))) {
            return true;
        }
        return false;
    },
    generateRand: function(){
        return (new Date()).getTime();
    }
};