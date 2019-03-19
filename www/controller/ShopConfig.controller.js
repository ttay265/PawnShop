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

            this.getRouter().getRoute("shopConfig").attachPatternMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function (arg) {
            var model = this.getModel("shopConfig");
            model.loadData("model/categoryConfig.json");
            // console.log(transModel);
        },
        onFilterByStatus: function (e) {

        }
    });
});