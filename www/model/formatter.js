sap.ui.define(["mortgage/pawnshop/controller/BaseController"], function (BaseController) {
    "use strict";
    var baseController = new BaseController();
    return {
        transStatus: function (sStatus) {
            switch (sStatus) {
                case 1:
                    return sap.ui.core.ValueState.Success;
                case 2:
                    return sap.ui.core.ValueState.Warning;
                case 3:
                    return sap.ui.core.ValueState.Error;
                default:
                    return sap.ui.core.ValueState.None
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