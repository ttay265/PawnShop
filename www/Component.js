sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "mortgage/pawnshop/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (UIComponent, Device, models, JSONModel, MessageToast) {
    "use strict";

    return UIComponent.extend("mortgage.pawnshop.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            var lblHome = this.getModel("i18n").getResourceBundle().getText("navToHome");
            this.setModel(models.createGlobalModel(), "global");
            this.setModel(new JSONModel(), "trans");
            this.setModel(models.createDeviceModel(), "device");
            this.getRouter().getTargetHandler().setCloseDialogs(false);
            this.getModel().attachRequestFailed(this.requestFailed, this);
            this.getRouter().initialize();
            // set the device model


        },
        requestFailed: function (oEvent) {

        }
    });

});