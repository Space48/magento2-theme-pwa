define(["require", "exports", "underscore", "knockout", "spa", "uiComponent"], function (require, exports, _, ko, SPA, Component) {
    "use strict";
    var Head = Component.extend({
        initialize: function () {
            this.dataStore = SPA.getDataStore();
            this.headObservable = this.dataStore.get("head");
            this.assetObservable = this.dataStore.get("assets");
            this.assetItems = ko.observableArray();
            this.additionalItems = ko.observableArray();
            var assetData = this.htmlStringToArray(this.assetObservable());
            var headData = this.htmlStringToArray(this.headObservable());
            this.update(this.assetItems, assetData);
            this.update(this.additionalItems, headData);
            this._sub(this.assetObservable, this.assetItems);
            this._sub(this.headObservable, this.additionalItems);
            return this._super();
        },
        _sub: function (provider, target) {
            var _this = this;
            return provider.subscribe(function (data) {
                var arrayData = _this.htmlStringToArray(data);
                _this.update(target, arrayData);
            });
        },
        htmlStringToArray: function (value) {
            if (typeof value !== "string") {
                return;
            }
            return value.split("\n");
        },
        getProp: function (prop) {
            if (!_.isUndefined(prop)) {
                if (!this.hasOwnProperty(prop)) {
                    this[prop] = ko.observable();
                }
            }
            return this[prop]();
        },
        update: function (observableArray, data) {
            if (data === void 0) { data = []; }
            var observableValue = observableArray();
            if (_.isEmpty(data)) {
                return false;
            }
            var newValues = filter(data, observableValue);
            newValues.map(function (value) { return observableArray.push(value); });
            var oldValues = filter(observableValue, data);
            oldValues.map(function (value) { return observableArray.remove(value); });
            function filter(data, matcher) {
                return data.filter(function (value, index) {
                    return !matcher.includes(value) && value.length;
                });
            }
        }
    });
    return Head;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92aWV3L2hlYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtJQUlBLFlBQVksQ0FBQztJQU9iLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFJMUIsVUFBVTtZQUNOLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUU1QyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFDakUsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBRS9ELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRXJELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsQ0FBQztRQVVELElBQUksWUFDQSxRQUFvQyxFQUNwQyxNQUF1QztZQUYzQyxpQkFTQztZQUxHLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQUEsSUFBSTtnQkFDMUIsSUFBTSxTQUFTLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUUvQyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFRRCxpQkFBaUIsWUFBQyxLQUFhO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBUUQsT0FBTyxZQUFDLElBQVk7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDakMsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDeEIsQ0FBQztRQVNELE1BQU0sWUFBQyxlQUFnRCxFQUFFLElBQVM7WUFBVCxxQkFBQSxFQUFBLFNBQVM7WUFDOUQsSUFBTSxlQUFlLEdBQUcsZUFBZSxFQUFFLENBQUM7WUFFMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUVELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDaEQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQztZQUVwRCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7WUFFdEQsZ0JBQWdCLElBQWMsRUFBRSxPQUFpQjtnQkFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFhLEVBQUUsS0FBSztvQkFDcEMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUNwRCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDO0tBQ0osQ0FBQyxDQUFDO0lBRUgsT0FBUyxJQUFJLENBQUMifQ==