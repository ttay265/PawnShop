sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "mortgage/pawnshop/model/formatter",
    "sap/m/BusyDialog"
], function (BaseController, MessageToast, JSONModel, Filter, formatter, BusyDialog) {
    "use strict";

    return BaseController.extend("mortgage.pawnshop.controller.Home", {
        formatter: formatter,
        onInit: function () {

        },
        onRegister: function (e) {
            this.getRouter().navTo("regPawnShop");
        },
        onCreateTransaction: function () {
            this.getRouter().navTo("creTrans");
        }
    });
});