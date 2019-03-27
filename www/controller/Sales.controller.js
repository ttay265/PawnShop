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

    return BaseController.extend("mortgage.pawnshop.controller.Sales", {
        formatter: formatter,
        onInit: function () {

            // this.getRouter().getRoute("shopConfig").attachPatternMatched(this._onObjectMatched, this);
            //
        },
        _onObjectMatched: function (arg) {
            // console.log(transModel);
            // this.bindShopConfigModel();
        },

    });
});