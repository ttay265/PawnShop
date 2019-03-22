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

    return BaseController.extend("mortgage.pawnshop.controller.CateConfig", {
        formatter: formatter,
        onInit: function () {

            this.getRouter().getRoute("cateConfig").attachPatternMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function (arg) {
            // console.log(transModel);
            this.bindShopConfigModel();
        },
        bindShopConfigModel: function () {
            var shopId = this.getModel("account").getProperty("/shop/id");
            var model = this.getModel("cateConfig");
            if (!model) {
                model = new JSONModel();
                this.setModel(model, "cateConfig");
            }
            var data = models.getCateConfigSet(shopId);
            model.setProperty("/", data);
        },
        onCreateConfigPressed: function () {
            if (!this.shopConfigDialog) {
                this.shopConfigDialog = this.initFragment("mortgage.pawnshop.fragment.ShopConfigDialog", "currentConfig");
            }
            // set mode = create
            this.shopConfigDialog.getModel("currentConfig").setProperty("/isUpdate", false, null, false);
            this.shopConfigDialog.open();
        },
        onDetailConfigPressed: function (e) {
            //get detail Config data
            var data = e.getSource().getBindingContext("cateConfig").getProperty("");
            if (!this.shopConfigDialog) {
                this.shopConfigDialog = this.initFragment("mortgage.pawnshop.fragment.ShopConfigDialog", "currentConfig");
            }
            var currentConfigModel = this.shopConfigDialog.getModel("currentConfig");
            if (!currentConfigModel) {
                var msg = this.getResourceBundle().getText("msgFailToInitDialog");
                MessageToast.show(msg);
                return;
            }
            //set data for detailConfigDialog
            currentConfigModel.setProperty("/", data, null, false);
            // set mode = update
            currentConfigModel.setProperty("/isUpdate", true, null, false);
            this.shopConfigDialog.open();
        },
        onCateConfigUpdate: function () {
            //get data of editing cate config
            var currentConfigModel = this.shopConfigDialog.getModel("currentConfig");
            var data = currentConfigModel.getProperty("/");
            // submit changes
            var updateResult = models.postCateConfigSet(data);
            if (updateResult) {
                var msg = this.getResourceBundle().getText("msgSavedChanges");
                MessageToast.show(msg);
                this.shopConfigDialog.close();
            } else {
                //handle error here
            }
        },

        onFilterByStatus: function (e) {

        }
    });
});