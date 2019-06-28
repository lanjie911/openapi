let vueInstance = new Vue({
    el: "#worksarea",
    data: {
        uiHeight: 100,
        uiMargin: 160,
        activeTabIndex: "0",

        // 当前请求的事务
        currentReqFunc: "",

        //应用列表属性
        appGrid: {
            pageSize: 10,
            totalCount: 0,
            currentPage: 1,
            results: [],
            app_code: ""
        },

        appPanel: {
            isShow: false,
            app_name: "",
            app_ip: "",
            app_type: "",
            app_desc: ""
        },

        realName: {
            person: {
                name: "",
                idNo: "",
                idImgSrc: ""
            },
            enterprise: {
                name: "",
                idNo: "",
                idImgSrc: "/images/yyzz.jpeg"
            },
            uploadData: {
                token: "290"
            }
        }
    },
    created: function () {
        this.uiHeight = document.documentElement.clientHeight;
    },
    mounted: function () {
        this.qryList('qry_app_list', 1, this.handleReqPara, this.handleRespArray);
    },
    computed: {
        calcHeight: function () {
            return this.uiHeight - this.uiMargin;
        },
        containerHeight: function () {
            return this.calcHeight - 2;
        },
        asideHeight: function () {
            return this.containerHeight - 2;
        },
        mainHeight: function () {
            return this.asideHeight;
        }
    },
    methods: {
        checkTabsExist: function (tabIdx) {
            for (let i = 0; i < this.editableTabs.length; i++) {
                let element = this.editableTabs[i];
                if (element.name == tabIdx) {
                    return true;
                }
            }
            return false;
        },
        gofunc: function (idx) {
            document.getElementById("tab-" + idx).style.display = "";
            document.getElementById("pane-" + idx).style.display = "";
            document.getElementById("tab-" + idx).click();

        },
        // 关闭标签
        tabRemoved: function (tabIdx) {
            document.getElementById("tab-" + tabIdx).style.display = "none";
            document.getElementById("pane-" + tabIdx).style.display = "none";
        },
        // 点击标签
        tabClicked: function (tabObj) {
            let tabIdx = tabObj.index;
            // 加载应用列表
            this.qryList('qry_app_list', 1);
        },
        // 请求列表翻页
        goPage: function (reqName, pageNumber) {
            this.qryList(reqName, pageNumber);
        },

        // 清除查询条件
        clearSearchConditions: function (paraName) {

        },
        // 请求列表条件查询
        qryWithCondition: function (paraName) {
            //TODO
        },
        // 绑定进件明细的处理器
        handleReqPara: function (obParas) {
            //binding HTTP Req body paras
        },
        // 处理进件数据的回显
        handleRespArray: function (rsdata) {
            //
        },
        qryList: function (funcName, pageNumber) {
            let rand = new Date().getTime();
            let obParas = {
                limit: 10,
                offset: (pageNumber - 1) * 10,
                randstamp: rand
            };

            // 对全局请求路径赋值，后面解析参数和回调要用
            this.currentReqFunc = funcName;

            // 处理绑定参数
            this.handleReqPara(obParas);

            // 构造请求URL
            let reqURL = "./" + funcName;

            // ajax请求发出并处理
            axios.post(reqURL, obParas).then(function (resp) {
                let rsdata = resp.data;
                vueInstance.handleRespArray(rsdata);
            }).catch(resp => {
                console.log('请求失败：' + resp.status + ',' + resp.statusText);
            });
        },
        createNewApp: function () {
            this.appPanel.isShow = true;
        },
        // 处理文件上传
        beforeUpload: function(file){
            let append = file.type;
            let a = (append == "image/png");
            let b = (append == "image/jpg");
            let c = (append == "image/jpeg");
            let d = a||b||c;
            if(!d){
                showWarnDialog(this,"图片只能是png|jpg|jpeg格式");
                return false;
            }

            let fz = file.size / 1024 / 1024;
            if(fz > 1){
                showWarnDialog(this,"图片最大不能超过1M");
                return false;
            }
            
            return true;
        },
        onUploadOK: function(res,file){
            console.log(res);
            if(res.rs == "OK"){
                this.realName.person.idImgSrc = "/"+res.filepath.substr(7);
            }
        }
    }
});