sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";
    return BaseController.extend("mortgage.pawnshop.controller.LoginView", {

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf mortgage.pawnshop.view.LoginView
         */
        onInit: function () {
            // this.logon = this.checkLogin();
            var text = this.getResourceBundle().getText("txtLoginWaitingText");
            var title = this.getResourceBundle().getText("txtLoginWaitingTitle");
            this.busyDialog = new sap.m.BusyDialog({
                text: text, title: title
            });
            this.getRouter().getRoute("login").attachPatternMatched(this.onAfterRendering, this);
            this.txtUsername = this.getView().byId("_txtUsername");
            this.txtPassword = this.getView().byId("_txtPassword");
            this.txtPassword.setValue("");
        },
        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf mortgage.pawnshop.view.LoginView
         */

        verifyUser: function () {
            if (this.validateUsername() && this.validatePassword()) {
                this.busyDialog.open();
                var pernr = this.txtUsername.getValue();
                var password = this.txtPassword.getValue();
                this.login(pernr, password);
            } else {
                if (this.txtUsername.getValueState() === "Error") {
                    MessageToast.show(this.txtUsername.getValueStateText());
                    return;
                }
                if (this.txtPassword.getValueState() === "Error") {
                    MessageToast.show(this.txtPassword.getValueStateText());
                    return;
                }
            }
        },
        login: function (username, password) {
            this.busyDialog.open();
            var result = this.checkLogin(username, password);
            if (result) {
                this.getRouter().navTo("home", true);
            } else {
                var msg;
                msg = this.getResourceBundle().getText("msgWrongPass");
                this.txtPassword.setValueState("Error");
                this.txtPassword.setValueStateText(msg);
            }

        },
        processLoginResult: function (odata) {
            var msg = "";
            switch (odata.ReturnValue) {
                case "O": {
                    this.busyDialog.close();
                    msg = this.getResourceBundle().getText("msgWrongPass");
                    this.txtPassword.setValueState("Error");
                    this.txtPassword.setValueStateText(msg);
                    break;
                }
                case "-": {
                    this.busyDialog.close();
                    msg = this.getResourceBundle().getText("msgNoUser");
                    this.txtUsername.setValueState("Error");
                    this.txtUsername.setValueStateText(msg);
                    break;
                }
                case "X": {
                    this.busyDialog.close();
                    this.getGlobalModel().setProperty("/user", odata.Pernr, null, true);
                    this.getGlobalModel().setProperty("/name", odata.Ename, null, true);
                    this.getGlobalModel().setProperty("/AssignedSite", odata.AssignedSite, null, true);
                    this.getGlobalModel().setProperty("/SiteDesc", odata.SiteDesc, null, true);
                    this.getGlobalModel().setProperty("/status", odata.Status, null, true);
                    this.getGlobalModel().setProperty("/token", this.txtPassword.getValue(), null, true);
                    this.getRouter().navTo("home", true);
                    msg = this.getResourceBundle().getText("msgLoginSuccessfully");
                    break;
                }
                default:
                    return;
            }
        },

        validateUsername: function (oEvent) {
            var source = oEvent ? oEvent.getSource() : this.txtUsername;
            var value = source.getValue();
            var regex = /d+/;
            if (value && value !== "" && !regex.test(value)) {
                source.setValueState("None");
                return true;
            } else {
                source.setValueState("Error");
                var msg = this.getResourceBundle().getText("msgNoUser");
                source.setValueStateText(msg);
                return false;
            }
        },
        validatePassword: function (oEvent) {
            var source = oEvent ? oEvent.getSource() : this.txtPassword;
            var value = source.getValue();
            if (value && value !== "") {
                source.setValueState("None");
                return true;
            } else {
                source.setValueState("Error");
                var msg = this.getResourceBundle().getText("msgWrongPass");
                source.setValueStateText(msg);
                return false;
            }
        },
        onBeforeRendering: function () {
            this.getView().setBusy(true);

        },

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf mortgage.pawnshop.view.LoginView
         */
        onAfterRendering: function () {
            this.logon = this.checkLogin();
            if (this.logon) {
                this.getRouter().navTo("home", true);
            } else {
                this.getView().setBusy(false);
                this.txtPassword.setValue("");
            }
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf mortgage.pawnshop.view.LoginView
         */
        onExit: function () {
        }

    });

});