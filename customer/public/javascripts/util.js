let showWarnDialog = function (vueIntance, strMessage) {
    vueIntance.$alert(strMessage, '警告', {
        confirmButtonText: "确定",
        type: "warning",
        showClose: false
    });
}

let REGUtil = {
    checkPhone: function (strPhoneNumber) {
        let iphone = strPhoneNumber;
        if ((/^1[3456789]\d{9}$/.test(iphone))) {
            return true;
        }
        return false;
    }
};