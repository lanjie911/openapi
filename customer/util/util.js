let checkPhone = function (strPhoneNumber) {
    let iphone = strPhoneNumber;
    if ((/^1[3456789]\d{9}$/.test(iphone))) {
        return true;
    }
    return false;
};

let checkPwd = function (strPwd) {
    if ((/[a-zA-Z0-9\.\!\$\%\^\&\*\,\_\@\#]{8,16}$/.test(strPwd))) {
        return true;
    }
    return false;
};

let generateVCode = function () {
    let a_code = "";
    let pt = 0;
    while (pt < 6) {
        let iCode = Math.ceil(Math.random() * 10);
        if (iCode >= 10) {
            iCode = iCode - 1;
        }
        a_code += iCode;
        pt++;
    }
    return a_code;
};

exports.checkPhone = checkPhone;
exports.generateVCode = generateVCode;
exports.checkPwd = checkPwd;