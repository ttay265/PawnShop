sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";
    const serverInfo = {
        url: "http://192.168.2.74:8080",
        localUrl: "model",
        useLocal: true
    };
    return {

        getServerInfo: function () {
            return serverInfo;
        },

        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        createGlobalModel: function () {
            var globalModel = new JSONModel({
                "user": "",
                "name": "",
                "token": "none",
                "accountId": "",
                "appTitleIcon": "sap-icon://home"
            });
            return globalModel;
        },
        createTransactionModel: function () {
            return new JSONModel();
        },
        getTransactions: function (shopId) {
            var data = [];
            var url;
            if (serverInfo.useLocal) {
                url = serverInfo.localUrl + "/transaction.json";
            } else {
                url = serverInfo.url + "/cam-do";
            }
            var ajaxData = {
                shopId: shopId
            };
            $.ajax({
                url: url,
                context: this,
                dataType: 'json',
                data: ajaxData,
                async: false,
                success: function (d, r, xhr) {
                    data = d;
                },
                error: function (e) {

                }

            });
            return data;
        },
        submitCreateTransation: function (data) {

            var returnCallback = false;
            var onSuccess = function (res, status, xhr) {

                },
                onError = function (jqXHR, textStatus, errorThrown) {
                    //Mock-backend test login

                    // that._LoginDialog.getModel("loginResult").setProperty("/failed", true);
                    // console.log("Got an error response: " + textStatus + errorThrown);
                    // //Off-Busy after proceed
                };
            var serverInfo = this.getServerInfo();
            var url = "",
                method = "GET";
            if (serverInfo.useLocal) {
                url = serverInfo.localUrl + "/account.json";
            } else {
                method = "POST";
                url = serverInfo.url + "/tao-hop-dong";
            }

            $.ajax({
                data: data,
                url: url,
                type: method,
                async: false,
                //end-local
                dataType: "json",
                context: this,
                success: function (res, status, xhr) {
                    console.log(res);
                    returnCallback = true;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //Mock-backend test login

                    // that._LoginDialog.getModel("loginResult").setProperty("/failed", true);
                    // console.log("Got an error response: " + textStatus + errorThrown);
                    // //Off-Busy after proceed
                }
            });
            return returnCallback;
        },
        getCateConfigSet: function (shopId) {
            var data = [];
            var url;
            if (serverInfo.useLocal) {
                url = serverInfo.localUrl + "/categoryConfig.json";
            } else {
                url = serverInfo.url + "/danh-muc";
            }
            var ajaxData = {
                shopId: shopId
            };
            $.ajax({
                url: url,
                context: this,
                dataType: 'json',
                data: ajaxData,
                async: false,
                success: function (d, r, xhr) {
                    data = d;
                },
                error: function (e) {

                }

            });
            return data;
        },
        getTransactionDetail: function (transId) {
            var data = [];
            var url = "";
            if (serverInfo.useLocal) {
                url = serverInfo.localUrl + "/transaction.json";
            } else {
                url = serverInfo.url + "/phieu-cam-do";
            }
            var ajaxData = {
                transId: transId
            };
            $.ajax({
                url: url,
                context: this,
                dataType: 'json',
                data: ajaxData,
                async: false,
                success: function (d, r, xhr) {
                    data = d;
                },
                error: function (e) {
                }
            });
            return data;
        }


    };

});