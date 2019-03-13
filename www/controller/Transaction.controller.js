sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "mortgage/pawnshop/model/formatter",
    "sap/m/BusyDialog"
], function (BaseController, MessageToast, JSONModel, Filter, formatter, BusyDialog) {
    "use strict";

    return BaseController.extend("mortgage.pawnshop.controller.Transaction", {
        formatter: formatter,
        onInit: function () {
            var transModel = this.getModel("trans");
            console.log(transModel);
            this.getRouter().getRoute("transaction").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (arg) {
            var transModel = this.getModel("trans");

            transModel.loadData("model/transaction.json");
            console.log(transModel);
        },
        onRegister: function (e) {
            this.getRouter().navTo("regPawnShop");
        },
        onCreateTransaction: function () {
            this.getRouter().navTo("creTrans");
        },
        onTransDetailPress: function () {
            if (!this.TransDetailDialog) {
                this.TransDetailDialog = sap.ui.xmlfragment(this.getView().getId(), "mortgage.pawnshop.fragment.TransDetail", this);
                this.getView().addDependent(this.TransDetailDialog);
            }
            this.TransDetailDialog.open();

        }
    });
});