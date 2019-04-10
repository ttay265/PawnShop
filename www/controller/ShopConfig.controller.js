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

    return BaseController.extend("mortgage.pawnshop.controller.ShopConfig", {
        formatter: formatter,
        onInit: function () {
            this.getRouter().getRoute("shopConfig").attachPatternMatched(this._onObjectMatched, this);
            //
        },
        _onObjectMatched: function (oEvent) {

            this.bindSalesItemModel();
        },
        bindSalesItemModel: function () {
            var accountModel = this.getModel("account");
            if (!accountModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var shopId = accountModel.getProperty("/shop/id");
            var model = this.getModel("sales");
            if (!model) {
                model = new JSONModel();
                this.setModel(model, "sales");
            }
            var data = models.getSalesItems(shopId);
            model.setProperty("/", data);

        },
        onUploadPress: function (oEvt) {
            var that = this;
            var oFileUploader = oEvt.getSource();
            var aFiles = oEvt.getParameters().files;
            var currentFile = aFiles[0];
            this.resizeAndUpload(currentFile, {
                success: function (oEvt) {
                    oFileUploader.setValue("");
                    console.log(oEvt);
                    //Here the image is on the backend, so i call it again and set the image
                    var model = that.salesItemDialog.getModel("currentSalesItem");
                    if (!model) {
                        return;
                    }
                    var pics = model.getProperty("/pictureList");
                    pics.push({
                        pictureUrl: encodeURI(oEvt.data.link),
                        idCloud: oEvt.data.id,
                        deleteHash: oEvt.data.deletehash
                    });
                    model.setProperty("/pictureList", pics, null, false);
                    model.updateBindings(true);
                    var a = that.byId("carUploadedImg");
                    console.log(a.getBinding("pages"));
                    // that.byId("carUploadedImg").addPage(
                    //     new sap.m.Image({
                    //         width: '80%',
                    //         densityAware: false,
                    //         decorative: false,
                    //         src: encodeURI(oEvt.data.link)
                    //     }));
                },
                error: function (oEvt) {
                    //Handle error here
                }
            });
        },

        onDeletePic: function () {
            var that = this;
            var carousel = this.byId("carUploadedImg");
            var currentImage = carousel.getActivePage();
            var cI = sap.ui.getCore().byId(currentImage);
            var imgList = this.salesItemDialog.getModel("currentSalesItem").getProperty("/pictureList");
            var context = cI.getBindingContext("currentSalesItem");
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
                        that.salesItemDialog.getModel("currentSalesItem").updateBindings(true);
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
                models.deleteImg(picData.id, picData.idCloud, callback);
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
        onCreateSalesPressed: function () {
            this.getRouter().navTo("createSales", false);
        },

        onSalesPressed: function (e) {
            //Get data of current SalesItem line
            var selectedLine = e.getParameter("srcControl");
            if (!selectedLine) {
                return;
            }
            var data = selectedLine.getBindingContext("sales").getProperty("");
            //Init & Bind SalesItemDialog
            if (!this.salesItemDialog) {
                this.salesItemDialog = this.initFragment("mortgage.pawnshop.fragment.SalesItemDetail", "currentSalesItem");
            }
            var currentSalesItemModel = this.salesItemDialog.getModel("currentSalesItem");
            if (!currentSalesItemModel) {
                currentSalesItemModel = new JSONModel();
            }
            currentSalesItemModel.setProperty("/", data);
            this.salesItemDialog.open();
        },
        onCancelSalesItem: function () {
            var currentSalesItemModel = this.salesItemDialog.getModel("currentSalesItem");
            if (!currentSalesItemModel) {
                return;
            }
            var data = currentSalesItemModel.getProperty("/");
            var submitData = {
                itemId: data.saleItem.id,
                status: 4
            };
            var result = models.changeSalesItem(submitData);
            if (result) {
                MessageToast.show(this.getResourceBundle().getText("msgSalesItemCanceled"));
                this.salesItemDialog.close();
            }
        },
        onSetAsSold: function () {
            var currentSalesItemModel = this.salesItemDialog.getModel("currentSalesItem");
            if (!currentSalesItemModel) {
                return;
            }
            var data = currentSalesItemModel.getProperty("/");
            var submitData = {
                itemId: data.saleItem.id,
                status: 2
            };
            var result = models.changeSalesItem(submitData);
            if (result) {
                MessageToast.show(this.getResourceBundle().getText("msgSetAsSold"));
                this.salesItemDialog.close();
            }
        },
        onUpdateSalesItemPressed: function () {
            var currentSalesItemModel = this.salesItemDialog.getModel("currentSalesItem");
            if (!currentSalesItemModel) {
                return;
            }
            var data = currentSalesItemModel.getProperty("/");
            var submitData = {
                itemId: data.saleItem.id,
                description: data.saleItem.description,
                avaUrl: data.saleItem.picUrl,
                itemName: data.saleItem.itemName,
                price: data.saleItem.price
            };
            var result = models.updateSalesItem(submitData);
            if (result) {
                MessageToast.show(this.getResourceBundle().getText("msgUpdateSalesItemSuccessfully"));
            } else {
                //handle error here
            }
        }
    });
});