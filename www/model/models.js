sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createGlobalModel: function() {
            var globalModel = new JSONModel({
                "user": "",
                "name": "",
                "token": "none",
                "accountId": "",
                "appTitleIcon": "sap-icon://home"
            });
			return globalModel;
		}


	};

});