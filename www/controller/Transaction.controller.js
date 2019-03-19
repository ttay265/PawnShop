sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "mortgage/pawnshop/model/formatter",
    "sap/m/BusyDialog",
], function (BaseController, MessageToast, JSONModel, Filter, formatter, BusyDialog) {
    "use strict";

    return BaseController.extend("mortgage.pawnshop.controller.Transaction", {
        formatter: formatter,
        onInit: function () {

            this.getRouter().getRoute("transaction").attachPatternMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function (arg) {
            var transModel = this.getModel("trans");

            transModel.loadData("model/transaction.json");
        },
        onRegister: function (e) {
            this.getRouter().navTo("regPawnShop");
        },
        onCreateTransaction: function () {
            this.getRouter().navTo("creTrans");
        },
        onTransDetailPress: function () {
            if (!this.TransDetailDialog) {
                this.TransDetailDialog = this.initFragment("mortgage.pawnshop.fragment.TransDetail");
            }
            this.TransDetailDialog.getModel().setProperty("/editMode", false);
            this.TransDetailDialog.open();
        },
        onTransEditPressed: function (oE) {
            this.TransDetailDialog.getModel().setProperty("/editMode", true);
        }
    });
});