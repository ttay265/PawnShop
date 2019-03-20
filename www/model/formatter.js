sap.ui.define(["mortgage/pawnshop/controller/BaseController",
    "sap/ui/core/ValueState"], function (BaseController, ValueState) {
    "use strict";
    var baseController = new BaseController();
    return {
        transStatusState: function (sStatus) {
            switch (sStatus) {
                case 1:
                    return ValueState.Warning; //Warning
                case 2:
                    return ValueState.Accept; //Accept
                case 3:
                    return ValueState.None; // Neutral
                case 4:
                    return ValueState.Error; //critical
                case 5:
                    return ValueState.Information; //Information
                case 6:
                    return ValueState.None; // Neutral
                default:
                    return "";
            }
        },
        transStatusDesc: function (sStatus) {
            var i18n = this.getResourceBundle();
            switch (sStatus) {
                case 1:
                    return i18n.getText('UNPAID'); //Warning
                case 2:
                    return i18n.getText('WAIT_FOR_LIQUIDATION'); //Accept
                case 3:
                    return i18n.getText('REDEEMED'); // Neutral
                case 4:
                    return i18n.getText('LATE'); //critical
                case 5:
                    return i18n.getText('LIQUIDATION'); //Information
                case 6:
                    return i18n.getText('CANCELED'); // Neutral
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
        }
    };
});