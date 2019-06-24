let checkPhone = function (strPhoneNumber) {
    let iphone = strPhoneNumber;
    if ((/^1[3456789]\d{9}$/.test(iphone))) {
        return true;
    }
    return false;
};

exports.checkPhone = checkPhone;