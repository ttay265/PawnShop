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
            var transId = e.getSource().getBindingContext("trans").getProperty("id");
            var d = this.getTransactionDetail(transId);
            if (!this.TransDetailDialog) {
                this.TransDetailDialog = this.initFragment("mortgage.pawnshop.fragment.TransDetail", "transDetail");
            }
            //Data of Detail tab
            var transDetailModel = this.getModel("transDetail");
            if (!transDetailModel) {
                transDetailModel = new JSONModel(d);
                this.TransDetailDialog.setModel(transDetailModel, "transDetail");
            } else {
                transDetailModel.setProperty("/", d);
            }
            var nextPayDate = d.transaction.nextPaymentDate;
            //Data of payment Tab
            this.loadNewPaymentData(nextPayDate);
            this.TransDetailDialog.open();
        },
        onNextPaymentSubmit: function () {
            var busyTitle = this.getResourceBundle().getText("payment");
            this.openBusyDialog({
                title: busyTitle,
                showCancelButton: true
            });
            var transDetailModel = this.TransDetailDialog.getModel("transDetail");
            if (!transDetailModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var transDetail = transDetailModel.getProperty("/");
            var nextPaymentModel = this.getModel("newPayment");
            if (!nextPaymentModel) {
                this.getRouter().navTo("login", true);
                return;
            }
            var nextPayment = nextPaymentModel.getProperty("/");
            nextPayment.paidDate.setHours(7);
            var data = {
                transactionId: transDetail.transaction.id,
                date: nextPayment.paidDate,
                description: nextPayment.description
            };
            var result = models.postNextPayment(data);
            if (result) {
                this.refreshPayment(transDetail.transaction.id);
            }
            this.closeBusyDialog();
        },
        refreshPayment: function (transId) {
            var transDetailModel = this.TransDetailDialog.getModel("transDetail");
            if (!transDetailModel) {
                return;
            }
            var transDetailData = models.getTransactionDetail(transId);
            transDetailModel.setProperty("/", transDetailData);
            transDetailModel.updateBindings(true);
        },
        loadNewPaymentData: function (nextPaymentDate) {
            var newPayment = this.getModel("newPayment");
            if (!newPayment) {
                newPayment = new JSONModel();
                this.setModel(newPayment, "newPayment");
            }
            var data = {
                paidDate: new Date(),
                description: ""
            };
            newPayment.setProperty("/", data);
        },
        //load detail of transaction by transaction Id: d = transId
        getTransactionDetail: function (transId) { //TransId: Mã HD
            var d = models.getTransactionDetail(transId);
            //process d for further usage.
            var attributes = d.transactionItemAttributes;
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].attributeName) {
                    d["attr" + (i + 1) + "name"] = attributes[i].attributeName;
                    d["attr" + (i + 1) + "value"] = attributes[i].attributeValue;
                }
            }

            return d;
        },
        onTransEditPressed: function (e) {
            this.TransDetailDialog.getModel().setProperty("/editMode", true);
        }
    });
});