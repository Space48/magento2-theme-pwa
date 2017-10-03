define(["require", "exports", "jquery", "knockout", "spa", "uiComponent"], function (require, exports, $, ko, SPA, Component) {
    "use strict";
    var namespace = "Block";
    var Block = Component.extend({
        options: {
            clean: false,
            cleanElement: null,
            key: null
        },
        state: {},
        initialize: function (config) {
            var options = config.options;
            if (!this.mergeOptions(options)) {
                return;
            }
            this._bind();
            this.dataStore = SPA.getDataStore();
            this.createSubscription(this.options.key);
            this.loadingStatus = ko.observable();
            return this._super();
        },
        _bind: function () {
            $(document).on("route:*:before", this._handleLoading.bind(this));
            $(document).on("route:*:after", this._handleLoaded.bind(this));
        },
        _handleLoading: function (event) {
            this.loadingStatus("is-loading");
        },
        _handleLoaded: function (event) {
            this.loadingStatus(null);
        },
        _cleanChildren: function () {
            if (typeof this.options === "undefined" || !this.options.cleanElement) {
                return;
            }
            var target = $(this.options.cleanElement).children();
            if (target.length) {
                target.each(function (index, element) {
                    ko.cleanNode(element) && ko.applyBindings({}, element);
                });
            }
            $("body").trigger("contentUpdated");
            $(target).trigger(this.options.key + ".loaded." + namespace, {
                selector: this.options.cleanElement
            });
        },
        update: function (data) {
            if (!this.state.hasOwnProperty(this.options.key)) {
                this.state[this.options.key] = ko.observable();
            }
            return this.state[this.options.key](data);
        },
        getValue: function () {
            if (!this.state.hasOwnProperty(this.options.key)) {
                this.state[this.options.key] = ko.observable();
            }
            return this.state[this.options.key]();
        },
        createSubscription: function (key) {
            var _this = this;
            var blockData = this.dataStore.get(key);
            return blockData.subscribe(function (updatedData) {
                _this.update(updatedData);
                _this.options.clean && _this._cleanChildren();
            });
        },
        mergeOptions: function (options) {
            if (typeof options.key !== "string" || options.key === "undefined") {
                throw new Error("App Block: A key must be provided to subscribe for updates");
            }
            this.options = $.extend(true, {}, this.options, options);
            return true;
        }
    });
    return Block;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdmlldy9ibG9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBUWIsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBRTFCLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDM0IsT0FBTyxFQUFFO1lBQ0wsS0FBSyxFQUFFLEtBQUs7WUFDWixZQUFZLEVBQUUsSUFBSTtZQUNsQixHQUFHLEVBQUUsSUFBSTtTQUNaO1FBQ0QsS0FBSyxFQUFFLEVBQUU7UUFLVCxVQUFVLFlBQUMsTUFBVztZQUNWLElBQUEsd0JBQU8sQ0FBWTtZQUUzQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7WUFFckMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBT0QsS0FBSztZQUNELENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FB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