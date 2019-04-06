sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "mortgage/pawnshop/model/formatter",
    "sap/m/BusyDialog",
    "mortgage/pawnshop/model/models"
], function (BaseController, MessageToast, JSONModel, Filter, formatter, BusyDialog, models) {
    "use strict";
    var url = "model/transactionDetail.json";
    return BaseController.extend("mortgage.pawnshop.controller.Transaction", {
        formatter: formatter,
        onInit: function () {
            this.getRouter().getRoute("transaction").attachMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function (oEvent) {
            var oArgs, oView, oQuery;
            // oArgs = oEvent.getParameter("arguments");

            // var shopId = oArgs.shopId;
            this.bindTransactionModel();
        },
        bindTransactionModel: function () {
            var accountModel = this.getModel("account");
            if (!accountModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var shopId = accountModel.getProperty("/shop/id");
            var data = models.getTransactions(shopId);
            var transModel = this.getModel("trans");
            if (!transModel) {
                transModel = new JSONModel();
                this.setModel(transModel, "trans");
            }
            transModel.setProperty("/", data);
        },

        onRegister: function (e) {
            this.getRouter().navTo("regPawnShop");
        },
        onCreateTransaction: function () {
            this.getRouter().navTo("creTrans");
        },
        onTransDetailPress: function (e) {
            //fetch detail data of transaction
            var transId = e.getSource().getBindingContext("trans").getProperty("id");
            var d = this.getTransactionDetail(transId);
            if (!this.TransDetailDialog) {
                this.TransDetailDialog = this.initFragment("mortgage.pawnshop.fragment.TransDetail", "transDetail");
            }
            //Data of Detail tab
            var transDetailModel = this.TransDetailDialog.getModel("transDetail");
            if (!transDetailModel) {
                transDetailModel = new JSONModel(d);
                this.TransDetailDialog.setModel(transDetailModel, "transDetail");
            } else {
                transDetailModel.setProperty("/", d);
            }
            var nextPayDate = d.transaction.nextPaymentDate;
            //Data of payment Tab
            this.loadNewPaymentData(nextPayDate);
            this.TransDetailDialog.open();
        },
        onLiquidatePressed: function (e) {
            var transDetailModel = this.TransDetailDialog.getModel("transDetail");
            if (!transDetailModel) {
                return;
            }
            var transDetailData = {
                transaction: transDetailModel.getProperty("/transaction"),
                pictureList: transDetailModel.getProperty("/pictureList")
            };
            this.getOwnerComponent().setModel(new JSONModel(transDetailData), "pasModel");
            this.TransDetailDialog.close();
            this.getRouter().navTo("sales", false);
        },
        onNextPaymentSubmit: function () {
            var busyTitle = this.getResourceBundle().getText("payment");
            this.openBusyDialog({
                title: busyTitle,
                showCancelButton: true
            });
            var transDetailModel = this.TransDetailDialog.getModel("transDetail");
            if (!transDetailModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var transDetail = transDetailModel.getProperty("/");
            var nextPaymentModel = this.getModel("newPayment");
            if (!nextPaymentModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var nextPayment = nextPaymentModel.getProperty("/");
            nextPayment.paidDate.setHours(7);
            var data = {
                transactionId: transDetail.transaction.id,
                date: nextPayment.paidDate,
                description: nextPayment.description
            };
            var result = models.postNextPayment(data);
            if (result) {
                this.refreshTransDetail(transDetail.transaction.id);
            }
            this.closeBusyDialog();
        },
        onUploadPress: function (oEvt) {
            //fetch transDetail
            var transDetailModel = this.TransDetailDialog.getModel("transDetail");
            if (!transDetailModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var transDetail = transDetailModel.getProperty("/");
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
                success: function (r) {
                    var data = {
                        idCloud: r.data.id,
                        deleteHash: r.data.deletehash,
                        picUrl: r.data.link,
                        objId: transDetail.transaction.id,
                        type: 1
                    };
                    models.addImg(data);
                    that.closeBusyDialog();
                },
                error: function (oEvt) {
                    //Handle error here
                    that.closeBusyDialog();
                }
            });
        },

        onDeletePic: function () {
            var that = this;
            var carousel = this.byId("carUploadedImg");
            var currentImage = carousel.getActivePage();
            var cI = sap.ui.getCore().byId(currentImage);
            var imgList = this.getModel("createSalesItem").getProperty("/picturesObj");
            var context = cI.getBindingContext("createSalesItem");
            if (context) {
                var picData = context.getProperty("");
                var index = -1;
                for (var i = 0; i < imgList.length; i++) {
                    if (imgList[i] === picData) {
                        index = i;
                    }
                }
                if (index === -1) {
                    return;
                    // no img
                }
                var callback = {
                    success: function () {
                        imgList.splice(index, 1);
                        that.getModel("createSalesItem").updateBindings(true);
                        that.closeBusyDialog();
                    },
                    error: function () {
                        that.closeBusyDialog();
                        MessageToast.show();
                    }
                };

                // delete on cloud and back-end
                //*set Busy before*
                this.openBusyDialog({
                    showCancelButton: true
                });
                var svDeleted = models.deleteImg(null, picData.idCloud, callback);
                if (svDeleted) {

                }
            }
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

        refreshTransDetail: function (transId) {
            var transDetailModel = this.TransDetailDialog.getModel("transDetail");
            if (!transDetailModel) {
                return;
            }
            var transDetailData = models.getTransactionDetail(transId);
            transDetailModel.setProperty("/", transDetailData);
            transDetailModel.updateBindings(true);
        },
        loadNewPaymentData: function (nextPaymentDate) {
            var newPayment = this.getModel("newPayment");
            if (!newPayment) {
                newPayment = new JSONModel();
                this.setModel(newPayment, "newPayment");
            }
            var data = {
                paidDate: new Date(),
                description: ""
            };
            newPayment.setProperty("/", data);
        },
        //load detail of transaction by transaction Id: d = transId
        getTransactionDetail: function (transId) { //TransId: Mã HD
            var d = models.getTransactionDetail(transId);
            //process d for further usage.
            var attributes = d.transactionItemAttributes;
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].attributeName) {
                    d["attr" + (i + 1) + "name"] = attributes[i].attributeName;
                    d["attr" + (i + 1) + "value"] = attributes[i].attributeValue;
                }
            }

            return d;
        },
        onTransEditPressed: function (e) {
            this.TransDetailDialog.getModel().setProperty("/editMode", true);
        }
    });
});