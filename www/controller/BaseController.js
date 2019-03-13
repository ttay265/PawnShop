sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog",
    'sap/m/Button',
    'sap/m/MessageToast',
    'sap/m/ResponsivePopover',
    'sap/ui/core/syncStyleClass',
    'sap/m/NotificationListItem',
    'sap/ui/core/CustomData',
    'sap/m/ActionSheet',
    'sap/m/library',
    'sap/m/MessageBox'
], function (Controller, UIComponent, Device, JSONModel, BusyDialog, Button, MessageToast, ResponsivePopover, syncStyleClass,
             NotificationListItem, CustomData, ActionSheet, mobileLibrary, MessageBox) {
    "use strict";

    // shortcut for sap.m.PlacementType
    // var PlacementType = mobileLibrary.PlacementType;
    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    return Controller.extend("mortgage.pawnshop.controller.BaseController", {

        openBusyDialog: function (oSetting) {
            if (!this.busyDialog) {
                this.busyDialog = new BusyDialog(oSetting);
            } else {
                this.busyDialog.setTitle(oSetting.title);
                this.busyDialog.getText(oSetting.text);
                this.busyDialog.setShowCancelButton(oSetting.showCancelButton);
            }
            this.busyDialog.open();
        },
        closeBusyDialog: function () {
            if (this.busyDialog) {
                this.busyDialog.close();
            }
        },
        /**
         * Convenience method for getting the control of view by Id.
         * @public
         * @param {string} sId id of the control
         * @returns {sap.m.control} the control
         */
        getId: function () {
            return this.getView().getId();
        },
        byId: function (sId) {
            return this.getView().byId(sId);
        },
        getSId: function (id) {
            return this.getView().getId() + "--" + id;
        },
        /**
         * Convenience method for getting the control of view by Id.
         * @public
         * @param {string} sId id of the control
         * @returns {sap.m.control} the control
         */
        toast: function (sMessage) {
            return MessageToast.show(sMessage);
        },

        back: function () {
            window.history.back();
        },

        getDevice: function () {
            return Device;
        },
        dialogClose: function (oSource) {
            oSource.close();
        },
        /**
         * Convenience method for accessing the router in each controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            // if (sName === null || sName === "") {
            // 	return this.getOwnerComponent().getModel("i18n");
            // }
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        createModel: function (sName) {
            var model = new JSONModel();
            this.getView().setModel(model, sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },
        onDialogClose: function (e) {
            e.getSource().getParent().close();
        },
        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resource model of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        /**
         * Convenience method to get the global model containing the global state of the app.
         * @returns {object} the global Propery model
         */
        getGlobalModel: function () {
            return this.getOwnerComponent().getModel("global");
        },
        /**
         * Convenience method to get the global model containing the global state of the app.
         * @returns {object} the global Propery model
         */
        getFilterParmeter: function () {
            return this.getOwnerComponent().getModel("globalFilterParam");
        },
        /**
         * Convenience method to get the global model containing the global state of the app.
         * @returns {object} the global Propery model
         */
        getCartModel: function () {
            return this.getOwnerComponent().getModel("CartProperties");
        },
        /**
         * Convenience method
         * @returns {object} the application controller
         */
        getApplication: function () {
            return this.getGlobalModel().getProperty("/application");
        },

        /**
         * Convenience method checking login token
         * @returns {object} the application controller
         */

        checkLogin: function (username, password) {
            //Set Busy before check login
            var that = this;
            var logonData = {
                username: username,
                password: password
            };
            var returnCall = false;
            var onSuccess = function (res, status, xhr) {
                    console.log(res);
                    var logonResult = res.id !== "" && res.password !== "";
                    //process after login
                    if (logonResult && res.role.roleName === "ROLE_PAWNSHOP") {
                        //post-process
                        that.getGlobalModel().setProperty("/accountId", res.id);
                        that.getGlobalModel().setProperty("/username", res.username);
                        that.getGlobalModel().setProperty("/role", res.role);
                        that.getGlobalModel().setProperty("/password", res.password);
                        //Navigate to any page???
                        //save_login
                        localStorage.setItem("username", res.username);
                    } else {
                        logonResult = false;
                        //if login = false
                    }
                    //Off-Busy after proceed
                    returnCall = logonResult;
                },
                onError = function (jqXHR, textStatus, errorThrown) {
                    //Mock-backend test login

                    // that._LoginDialog.getModel("loginResult").setProperty("/failed", true);
                    // console.log("Got an error response: " + textStatus + errorThrown);
                    // //Off-Busy after proceed
                };
            $.ajax({

                // data: logonData,
                // type: "POST",
                // crossDomain: true,
                // url: "http://192.168.2.97:8080/dang-nhap",
                //local
                url: "model/account.json",
                type: "GET",
                async: false,
                //end-local
                dataType: "json",
                success: onSuccess,
                error: onError
            });
            return returnCall;
        },

        backToHome: function () {
            this.getRouter().navTo("home");
        },

        sellItems: function () {
            this.getRouter().navTo("sellItem");
        },

        /*************************************************************************************************/
        openDialogLogin: function () {
            if (!this._LoginDialog) {
                this._LoginDialog = sap.ui.xmlfragment(this.getId(), "sap.ui.demo.basicTemplate.fragment.Login",
                    this);
                var loginDialogModel = new JSONModel({
                    username: "",
                    password: "",
                    failed: false,
                    isLogging: false
                });
                this._LoginDialog.setModel(loginDialogModel, "loginResult");
                //Set models which is belonged to View to Fragment
                this.getView().addDependent(this._LoginDialog);
            }
            this._LoginDialog.open();
        },

        openDialogRegister: function () {
            if (!this._RegisterDialog) {
                this._RegisterDialog = sap.ui.xmlfragment(this.getId(), "sap.ui.demo.basicTemplate.fragment.Register",
                    this);
                var registerDialogModel = new JSONModel({
                    email: "",
                    password: ""
                });
                this._RegisterDialog.setModel(registerDialogModel, "registerResult");
                //Set models which is belonged to View to Fragment
                this.getView().addDependent(this._RegisterDialog);
            }
            this._RegisterDialog.open();
        },

        /**
         * Event handler for the continue button
         */
        checkInputRegister: function () {
            var that = this;
            // collect input controls
            var registerModel = this._RegisterDialog.getModel("registerResult");
            var email = registerModel.getProperty("/email");
            var password = registerModel.getProperty("/password");

            $.ajax({
                type: "POST",
                data: {
                    username: email,
                    password: password
                },
                crossDomain: true,
                url: "http://192.168.0.6:8080/dang-ky",
                dataType: "json",
                success: onSuccess,
                error: function (jqXHR, textStatus, errorThrown) {
                }

            });
        },

        dialogAfterclose: function () {
            if (this._oDialog) {
                this._oDialog.destroy(); //destroy only the content inside the Dialog
            }
        },

        /**
         * Event handler for the notification button
         * @param {sap.ui.base.Event} oEvent the button press event
         * @public
         */
        onNotificationPress: function (oEvent) {
            // close message popover
            var oMessagePopover = this.byId("errorMessagePopover");
            if (oMessagePopover && oMessagePopover.isOpen()) {
                oMessagePopover.destroy();
            }

            var placement = oEvent.getSource();
            var alertPo = this.byId("poAlert");
            alertPo.openBy(placement);
        },

        onUserNamePress: function (oEvent) {
            if (!this.oActionSheet) {
                this.oActionSheet = this.byId("userMessageActionSheet");
            }
            this.oActionSheet.openBy(oEvent.getSource());
            this.oActionSheet.setVisible(true);
        },

        logout: function () {
            this.getGlobalModel().setProperty("/accountId", "");
            this.getGlobalModel().setProperty("/username", "");
            this.getGlobalModel().setProperty("/role", "");
            this.getGlobalModel().setProperty("/password", "");

            //Set Local Storage
            localStorage.removeItem("username");
        },

        filterTable: function (aCurrentFilterValues) {
            this.getTableItems().filter(this.getFilters(aCurrentFilterValues));
            this.updateFilterCriterias(this.getFilterCriteria(aCurrentFilterValues));
        },

        onSearch: function (oEvent) {
            var value = oEvent.getParameter("query");
        }
    });

});