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

    return BaseController.extend("mortgage.pawnshop.controller.SalesItems", {
        formatter: formatter,
        onInit: function () {

            this.getRouter().getRoute("sales").attachPatternMatched(this._onObjectMatched, this);
            //
        },
        _onObjectMatched: function (arg) {
            this.bindCateConfigModel();
        },
        bindCateConfigModel: function () {
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
        onCreateSalesPressed: function (e) {
            var initData = {
                itemName: "",

            };
            if (!this.createSalesItemDialog) {
                this.createSalesItemDialog = this.initFragment("mortgage.pawnshop.fragment.CreateSalesItem");
                this.createSalesItemDialog.setModel(), "currentSalesItem");
            }
            this.createSalesItemDialog.open();
        }

    });
});