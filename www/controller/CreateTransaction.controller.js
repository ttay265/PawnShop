sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "mortgage/pawnshop/model/formatter",
    "sap/m/BusyDialog",
    "mortgage/pawnshop/model/models",
], function (BaseController, MessageToast, JSONModel, Filter, formatter, BusyDialog, models) {
    "use strict";

    return BaseController.extend("mortgage.pawnshop.controller.CreateTransaction", {
        formatter: formatter,
        onInit: function () {
            var accountModel = this.getModel("account");
            if (!accountModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var createTransModel = new JSONModel({
                pawneeId: "4",
                pawneeName: "",
                email: "",
                phone: "",
                address: "",
                addressObject: {
                    streetName: "",
                    city: "",
                    district: ""
                },
                identityNumber: "",
                pictures: "",
                attributes: "",
                shopId: accountModel.getProperty("/shop/id"),
                itemName: "",
                pawneeInfoId: "4",
                paymentTerm: "",
                paymentType: "1",
                startDate: new Date(),
                liquidateAfter: "",
                categoryId: "",
                note: ""
            });
            this.setModel(createTransModel, "createTrans");
            this.getRouter().getRoute("creTrans").attachPatternMatched(this._onObjectMatched, this);
        },


        // onDialogClosed: function (oEvent) {
        //     var busy
        //     // jQuery.sap.clearDelayedCall(_timeout);
        //
        //     // if (oEvent.getParameter("cancelPressed")) {
        //     //     MessageToast.show("The operation has been cancelled");
        //     // } else {
        //     //     MessageToast.show("The operation has been completed");
        //     // }
        // },
        _onObjectMatched: function () {
            if (!this.checkLogin()) {
                this.getRouter().navTo("login", true);
                return;
            } else {
                this.bindShopConfigForCreateTrans();
            }
        },
        bindShopConfigForCreateTrans: function () {
            var shopId = this.getModel("account").getProperty("/shop/id");
            var model = this.getModel("shopConfig");
            if (!model) {
                model = new JSONModel();
                this.setModel(model, "shopConfig");
            }
            var data = models.getCateConfigSet(shopId);
            model.setProperty("/", data);
            var currentConfigModel = this.getModel("currentConfig");
            if (!currentConfigModel) {
                currentConfigModel = new JSONModel();
                this.setModel(currentConfigModel, "currentConfig");
            }
            currentConfigModel.setProperty("/", data[0]);
            console.log(currentConfigModel);
        },
        forceChangePass: function () {
            this.changePasswordPress();
        },
        changePasswordPress: function () {
            this.changePassDialog.open();
        },
        onAfterRendering: function () {
            if (!this.changePassDialog) {
                this.changePassDialog = sap.ui.xmlfragment(this.getView().getId(), "mortgage.pawnshop.fragment.ChangePassDialog", this);
                this.getView().addDependent(this.changePassDialog);
                this.txtOldPass = this.byId("_txtOldPass");
                this.txtNewPass = this.byId("_txtNewPass");
                this.txtConfirmNewPass = this.byId("_txtConfirmNewPass");
            }
            //dialog initialization
            // if (!this.AddressDialog) {
            //     this.AddressDialog = sap.ui.xmlfragment(this.getView().getId(), "mortgage.pawnshop.fragment.Address", this);
            //     this.getView().addDependent(this.AddressDialog);
            // }
        },
        onCateConfigChanged: function (e) {
            var selectedItem = e.getParameter("selectedItem");
            console.log(selectedItem);
            var confData = selectedItem.getBindingContext("shopConfig").getProperty("");
            console.log(confData);
            this.getModel("currentConfig").setProperty("/", confData, null, false);
        },
        onSubmitCreateTransaction: function () {
            var sendingData = this.parseSendData();
            models.submitCreateTransation(sendingData);
        },
        parseSendData: function () {
            var createModel = this.getModel("createTrans");
            if (!createModel) {
                return;
            }
            var data = createModel.getProperty("/");
            data.address = data.addressObject.streetName + ", " +
                data.addressObject.district + ", " +
                data.addressObject.city;
            var currentConfig = this.getModel("currentConfig").getProperty("/");
            var attrs = [];
            if (currentConfig.value1 !== null) {
                attrs.push(currentConfig.value1 + ":" + data.value1 || "N/A");
            }
            if (currentConfig.value2 !== null) {
                attrs.push(currentConfig.value2 + ":" + data.value2 || "N/A");
            }
            if (currentConfig.value3 !== null) {
                attrs.push(currentConfig.value3 + ":" + data.value3 || "N/A");
            }
            if (currentConfig.value4 !== null) {
                attrs.push(currentConfig.value4 + ":" + data.value4 || "N/A");
            }
            data.attributes = attrs.join(",");
            data.categoryId = currentConfig.category.id;

            console.log(createModel.getProperty("/"));
            return data;

        },


        doChangePass: function () {
            var that = this;
            var onSuccess = function (data) {
                    if (data.returnValue === "X") {
                        var msg = that.getResourceBundle().getText("msgChangePassSuccess");
                        that.getGlobalModel().setProperty("/status", 'A', null, true);
                        MessageToast.show(msg);
                        that.changePassDialog.close();
                    } else {
                        var msg = that.getResourceBundle().getText("msgChangePassFailed");
                        MessageToast.show(msg);
                    }
                },
                onError = function (error) {
                    var msg = that.getResourceBundle().getText("msgChangePassFailed");
                    MessageToast.show(msg);
                };
            var parameters = {
                Pernr: this.Pernr,
                oldPassword: this.txtOldPass.getValue(),
                newPassword: this.txtNewPass.getValue()
            };
            this.getModel().callFunction("/ChangePassword", {
                method: "POST",
                urlParameters: parameters,
                success: onSuccess,
                error: onError
            });
        },

        showMenu: function () {
            var expanded = this.page.getSideExpanded();
            this.page.setSideExpanded(!expanded);
        },
        logout: function () {
            this.getGlobalModel().setProperty("/user", "", null, true);
            this.getGlobalModel().setProperty("/name", "", null, true);
            this.getGlobalModel().setProperty("/token", "none", null, true);
            this.getGlobalModel().setProperty("/status", "", null, true);
            this.resetModelData();
            this.getRouter().navTo("login", true);
            this.page.setSideExpanded(false);
            var msg = this.getResourceBundle().getText("msgLogout");
            MessageToast.show(msg);
        },
        __toViewCart: function () {
            this.getRouter().navTo("cart", false);
        },
        //On selected value from suggested list
        onSearch: function (oEvent) {
            var item = oEvent.getParameter("suggestionItem");
            if (item) {
                var Matnr = oEvent.getParameter("suggestionItem").getKey();
                if (Matnr) {
                    this.getRouter().navTo("productDetail", {"Matnr": Matnr}, false);
                }
            }
            this.openBusyDialog({
                title: "Loading...",
                showCancelButton: true
            });
        },
        onSuggest: function (oEvent) {
            var value = oEvent.getParameter("suggestValue");
            var filters = [];
            var maktgFilter = new Filter({
                path: "Maktg",
                operator: sap.ui.model.FilterOperator.StartsWith,
                value1: value
            });
            filters.push(maktgFilter);
            this.inpSearch.getBinding("suggestionItems").attachDataReceived(this.inpSearch.suggest(), this);
            this.inpSearch.getBinding("suggestionItems").filter(filters);
        },
        //Open dialog add customer address
        // _openAddressDialog: function () {
        //     this.AddressDialog.open();
        // },
        // __addAddrCancel: function () {
        //     this.AddressDialog.close();
        // },
        // onCityChange: function (oEvent) {
        //     var that = this;
        //     var selectedItem = oEvent.getSource().getSelectedItem();
        //     if (selectedItem) {
        //         var selCityKey = selectedItem.getBindingContext().getProperty("Ztinh");
        //         if (selCityKey) {
        //             this.sPath = this.getModel().createKey("/CitySet", {
        //                 Ztinh: selCityKey
        //             });
        //             console.log(this._selectDistrict);
        //             this._selectDistrict.bindElement({
        //                 path: this.sPath
        //             });
        //             // this._selectDistrict.getBinding("items").refresh();
        //         }
        //     }
        // },
        // onDistrictChange: function (oEvent) {
        //     var selectedItem = oEvent.getSource().getSelectedItem();
        //     if (selectedItem) {
        //         var selCityKey = selectedItem.getBindingContext().getProperty("Ztinh");
        //         var selDistrictKey = selectedItem.getBindingContext().getProperty("Zquan");
        //
        //         this.City = selCityKey;
        //         this.District = selDistrictKey;
        //
        //         if (selDistrictKey && selCityKey) {
        //             this.sPath = this.getModel().createKey("/DistrictSet", {
        //                 Ztinh: selCityKey,
        //                 Zquan: selDistrictKey
        //             });
        //             console.log(this.submitAddress);
        //             this._selectWard.bindElement({
        //                 path: this.sPath
        //             });
        //         }
        //     }
        // },
        // onWardChange: function (oEvent) {
        //     var selWardsKey = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Zphuong");
        //     this.submitAddress.push(this.City, this.District, selWardsKey);
        //     console.log(this.submitAddress);
        // },
        // //Adđ customer place
        // onAddressPick: function () {
        //     alert("licked");
        // }
    });
});