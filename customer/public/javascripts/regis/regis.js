let vInstance = new Vue({
    el: "#mainws",
    data :{
        mobileNum: "",
        vcodeImgSrc:"/vcode",
        verifyCode: ""
    },
    methods: {
        refreshImg: function(){
            let randTime = new Date().getTime();
            this.vcodeImgSrc = "/vcode?rand="+randTime;
        },
        sendSMSCode: function(){
            let mobile = this.mobileNum.trim();
            if(!REGUtil.checkPhone(mobile)){
                showWarnDialog(this,"请填写格式正确的手机号");
                return;
            }
            let vCode = this.verifyCode.trim();
            if(vCode == ""){
                showWarnDialog(this,"图形验证码不能为空");
                return;
            }

            axios.post("/regis/reg_sms_vcode", {
                mobile: mobile,
                vcode: vCode.toLowerCase()
            }).then(function (resp) {
                console.log(resp.data);
                let rsdata = resp.data;
                if (rsdata.rs == "OK") {
                    showSuccessDialog(vInstance,rsdata.text);
                }else{
                    showWarnDialog(vInstance,rsdata.text);
                }
                vInstance.refreshImg();
            }).catch(resp => {
                console.log('请求失败：' + resp.status + ',' + resp.statusText);
            });
        }
    }
});