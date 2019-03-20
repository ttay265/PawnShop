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
    var url = "model/transactionDetail.json";
    return BaseController.extend("mortgage.pawnshop.controller.Transaction", {
        formatter: formatter,
        onInit: function () {
            this.getRouter().getRoute("transaction").attachMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function (oEvent) {
            var oArgs, oView, oQuery;
            // oArgs = oEvent.getParameter("arguments");

            // var shopId = oArgs.shopId;
            this.bindTransactionModel();
        },
        bindTransactionModel: function () {
            var accountModel = this.getModel("account");
            if (!accountModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var shopId = accountModel.getProperty("/shop/id");
            var data = models.getTransactions(shopId);
            var transModel = this.getModel("trans");
            if (!transModel) {
                transModel = new JSONModel();
                this.setModel(transModel, "trans");
            }
            transModel.setProperty("/", data);
        },

        onRegister: function (e) {
            this.getRouter().navTo("regPawnShop");
        },
        onCreateTransaction: function () {
            this.getRouter().navTo("creTrans");
        },
        onTransDetailPress: function (e) {
            //fetch detail data of transaction
            var transId = e.getSource().getBindingContext("trans").getProperty("/id");
            this.getTransactionDetail(transId);
            if (!this.TransDetailDialog) {
                this.TransDetailDialog = this.initFragment("mortgage.pawnshop.fragment.TransDetail");
            }

            this.TransDetailDialog.open();
        },
        //load detail of transaction by transaction Id: d = transId
        getTransactionDetail: function (transId) { //TransId: Mã HD
            var ajaxData = {};
            $.ajax({
                url: url,
                context: this,
                dataType: 'json',
                data: ajaxData,
                success: function (d, r, xhr) {
                    this.loadTransDetail(d);
                },
                error: function (e) {

                }

            });
        },
        //load data of trans detail to view (fragment TransDetail)
        // d: data object
        loadTransDetail: function (d) {
            var transDetailModel = this.getModel("transDetail");
            if (!transDetailModel) {
                transDetailModel = new JSONModel(d);
                this.setModel(transDetailModel, "transDetail");
            } else {
                transDetailModel.setProperty("/", d);
            }
        },
        onTransEditPressed: function (e) {
            this.TransDetailDialog.getModel().setProperty("/editMode", true);
        }
    });
});