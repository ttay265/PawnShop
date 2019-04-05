sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "mortgage/pawnshop/model/formatter",
    "sap/m/BusyDialog",
    "mortgage/pawnshop/model/models",
    "sap/m/MessageStrip"
], function (BaseController, MessageToast, JSONModel, Filter, formatter, BusyDialog, models, MessageStrip) {
    "use strict";

    return BaseController.extend("mortgage.pawnshop.controller.CreateSalesItem", {
        formatter: formatter,
        onInit: function () {
            this.getRouter().getRoute("createSales").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function () {
            if (!this.checkLogin()) {
                this.getRouter().navTo("login", true);
                return;
            } else {
                this.loadInitTransaction();
            }
        },
        onClearPressed: function () {
            this.loadInitTransaction();
        },
        loadInitTransaction: function () {
            var initData = {
                itemName: "",
                price: "0",
                picturesObj: [],
                description: "",
                categoryId: "",
                transId: ""
            };
            var createSalesModel = this.getModel("createSalesItem");
            if (!createSalesModel) {
                createSalesModel = new JSONModel();
                this.setModel(createSalesModel, "createSalesItem");
            }
            createSalesModel.setProperty("/", initData, null, false);
            console.log(createSalesModel.getProperty("/picturesObj"));
        },

        onUploadPress: function (oEvt) {
            var that = this;
            var oFileUploader = oEvt.getSource();
            var aFiles = oEvt.getParameters().files;
            var currentFile = aFiles[0];
            var msgUploadingPic = this.getResourceBundle().getText("msgUploadingPic");
            var msgPleaseWait = this.getResourceBundle().getText("msgPleaseWait");
            this.openBusyDialog({
                title: msgUploadingPic,
                text: msgPleaseWait,
                showCancelButton: true
            });
            this.resizeAndUpload(currentFile, {
                success: function (oEvt) {
                    oFileUploader.setValue("");
                    console.log(oEvt);
                    //Here the image is on the backend, so i call it again and set the image
                    var model = that.getModel("createSalesItem");
                    if (!model) {
                        return;
                    }
                    var pics = model.getProperty("/picturesObj");
                    pics.push({
                        pictureUrl: encodeURI(oEvt.data.link),
                        idCloud: oEvt.data.id,
                        deleteHash: oEvt.data.deletehash
                    });
                    model.updateBindings(true);
                    that.closeBusyDialog();
                },
                error: function (oEvt) {
                    //Handle error here
                    that.closeBusyDialog();
                }
            });
        },

        onDeletePic: function () {
            var carousel = this.byId("");
        },
        resizeAndUpload: function (file, mParams) {
            var that = this;
            var reader = new FileReader();
            reader.onerror = function (e) {
                //handle error here
            };
            reader.onloadend = function () {
                var tempImg = new Image();
                tempImg.src = reader.result;
                tempImg.onload = function () {
                    that.uploadFile(tempImg.src, mParams, file);
                }
            };
            reader.readAsDataURL(file);
        },

        uploadFile: function (dataURL, mParams, file) {
            var xhr = new XMLHttpRequest();
            var BASE64_MARKER = 'data:' + file.type + ';base64,';
            var base64Index = dataURL.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            var base64string = dataURL.split(",")[1];

            xhr.onreadystatechange = function (ev) {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
                    mParams.success(JSON.parse(xhr.response));
                } else if (xhr.readyState == 4) {
                    mParams.error(ev);
                }
            };
            var URL = "https://api.imgur.com/3/upload";
            var fileName = (file.name === "image.jpeg") ? "image_" + new Date().getTime() + ".jpeg" : file.name;
            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", file.type);//"application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", "Bearer 5c25e781ffc7f495059078408c311799e277d70e");//"application/x-www-form-urlencoded");
            var data = base64string;
            xhr.send(data);
        },

        forceChangePass: function () {
            this.changePasswordPress();
        },

        submitSalesItemPressed: function () {
            //get binding model from current view
            var model = that.getModel("createSalesItem");
            if (!model) {
                return;
            }
            //parse data before submit
            var submitData = model.getProperty("/");
            submitData.picUrl = submitData.picturesObj[0].pictureUrl;
            submitData.categoryId = submitData.category.id;
            submitData.picUrl = submitData.picturesObj[0].pictureUrl;
            submitData.picUrl = submitData.picturesObj[0].pictureUrl;
        },

        changePasswordPress: function () {
            this.changePassDialog.open();
        },

    });
});