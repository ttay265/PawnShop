sap.ui.define([
    "mortgage.pawnshop/controller/BaseController"
], function (BaseController) {
    "use strict";
    return {
        StockingText: function (toStock) {
        },
        isSaleAvailable: function () {
            var cartItems = this.getCartModel().getProperty("/CartItems");
            var assignedSite = this.getGlobalModel().getProperty("/AssignedSite");
            for (var i = 0; i < cartItems.length; i++) {
                if (cartItems[i].Site !== assignedSite) {
                    return false;
                }
            }
            return true;
        },
        CartTotalQuantity: function (CartItems) {
            console.log(CartItems);
            CartItems.forEach(function (item, index) {
            });
        },
        DeliveryStatusState: function (DlvStatus) {
            switch (DlvStatus) {
                case " ":
                    return "None";
                case "A":
                    return "Error";
                case "B":
                    return "Warning";
                case "C":
                    return "Success";
            }
        },
        AddressText: function (address) {
            var addressObj = JSON.parse(address);
            return addressObj.fullAdd;
        }
    };
});
