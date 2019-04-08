sap.ui.define([
    "mortgage/pawnshop/controller/BaseController",
    "sap/ui/core/ValueState",
    "sap/ui/model/type/Currency"
], function (BaseController, ValueState, Currency) {
    "use strict";
    var baseController = new BaseController();
    return {
        transStatusState: function (sStatus) {
            switch (sStatus) {
                case 1: //NOT_OVERDUE
                    return ValueState.Information;
                case 2: //WAIT_FOR_LIQUIDATION
                    return ValueState.Error;
                case 3: //ON_DUE_DATE
                    return ValueState.Warning;
                case 4: //REDEEMED
                    return ValueState.Success;
                case 5: //LATE
                    return ValueState.Warning;
                case 6: //LIQUIDATION
                    return ValueState.Success;
                case 7: //CANCELED
                    return ValueState.None;
                default:
                    return ValueState.None;
            }
        },
        salesStatusState: function (sStatus) {
            switch (sStatus) {
                case 1: //WAIT_FOR_LIQUIDATION
                    return ValueState.Information;
                case 2: //LIQUIDATED
                    return ValueState.Success;
                case 4: //CANCEL
                    return ValueState.Error;
                default:
                    return ValueState.None;
            }
        },
        transStatusDesc: function (sStatus) {
            var i18n = this.getResourceBundle();
            switch (sStatus) {
                case 1:
                    return i18n.getText('NOT_OVERDUE'); //Information
                case 2:
                    return i18n.getText('WAIT_FOR_LIQUIDATION'); //Accept
                case 3:
                    return i18n.getText('ON_DUE_DATE'); //Warning
                case 4:
                    return i18n.getText('REDEEMED'); // Neutral
                case 5:
                    return i18n.getText('LATE'); //critical
                case 6:
                    return i18n.getText('LIQUIDATION'); //Information
                case 7:
                    return i18n.getText('CANCELED'); // Neutral
                default:
                    return "";
            }
        },
        transLogStatusState: function (sStatus) {
            switch (sStatus) {
                case 1: //PAID
                    return ValueState.Success;
                case 2: //NOT PAID YET
                    return ValueState.None;
                default:
                    return ValueState.None;
            }
        },
        transLogStatusDesc: function (sStatus) {
            var i18n = this.getResourceBundle();
            switch (sStatus) {
                case 1:
                    return i18n.getText('PAID'); //Information
                case 2:
                    return i18n.getText('UNPAID'); //Accept
                default:
                    return "";
            }
        },
        paymentType: function (paymentType) {
            switch (paymentType) {
                case 1:
                    return 'Lãi ngày';
                case 2:
                    return 'Lãi tháng';
                case 3:
                    return 'Lãi tuần';
            }
        },
        liquidateAfter: function (liquidateAfter) {
            if (liquidateAfter) {
                var overdue_days = this.getResourceBundle().getText("overdue_days");
                return liquidateAfter + ' ' + overdue_days;
            }
        },
        favorite: function (sStatus) {
            return sStatus.length % 2 === 0;
        },
        formattedCurrency: function (amount, currency) {
            var oCurrency = new Currency({
                showMeasure: false
            });

            return oCurrency.formatValue([amount, currency], "string");

        },
        formattedCurrencyWithUom: function (amount, currency) {
            var oCurrency = new Currency({
                showMeasure: false
            });

            return oCurrency.formatValue([amount, currency], "string") + " " + "VND";

        }
    };
});