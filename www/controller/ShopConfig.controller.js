sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "mortgage/pawnshop/model/formatter",
    "sap/m/BusyDialog"
], function (BaseController, MessageToast, JSONModel, Filter, formatter, BusyDialog) {
    "use strict";

    return BaseController.extend("mortgage.pawnshop.controller.ShopConfig", {
        formatter: formatter,
        onInit: function () {
            var transModel = this.getModel("trans");

            this.getRouter().getRoute("shopConfig").attachPatternMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function (arg) {
            var transModel = this.getModel("trans");
            transModel.loadData("model/transaction.json");
            // console.log(transModel);
        }
    });
});