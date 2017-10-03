define(["require", "exports", "underscore", "knockout", "spa", "uiComponent"], function (require, exports, _, ko, SPA, Component) {
    "use strict";
    var Head = Component.extend({
        initialize: function () {
            this.dataStore = SPA.getDataStore();
            var assetObservable = this.dataStore.get("assets");
            var headObservable = this.dataStore.get("head");
            this.assetItems = ko.observableArray();
            this.additionalItems = ko.observableArray();
            this.update(assetObservable(), this.assetItems);
            this.update(headObservable(), this.additionalItems);
            this._sub(assetObservable, this.assetItems);
            this._sub(headObservable, this.additionalItems);
            return this._super();
        },
        _sub: function (provider, target) {
            var _this = this;
            return provider.subscribe(function (data) {
                var arrayData = _this.htmlStringToArray(data);
                _this.update(arrayData, target);
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
        update: function (data, observableArray) {
            if (data === void 0) { data = []; }
            var observableValue = observableArray();
            if (_.isEmpty(data)) {
                return false;
            }
            data
                .filter(function (value, index) {
                return !observableValue.includes(value);
            })
                .forEach(function (value, index) {
                value.length && observableArray.push(value);
            });
            observableValue
                .filter(function (value, index) {
                return !data.includes(value);
            })
                .forEach(function (value, index) {
                observableArray.remove(value);
            });
        }
    });
    return Head;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92aWV3L2hlYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtJQUlBLFlBQVksQ0FBQztJQU9iLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFJMUIsVUFBVTtZQUNOLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXBDLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWxELElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRTVDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBVUQsSUFBSSxZQUNBLFFBQW9DLEVBQ3BDLE1BQXVDO1lBRjNDLGlCQVNDO1lBTEcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO2dCQUMxQixJQUFNLFNBQVMsR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRS9DLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQVFELGlCQUFpQixZQUFDLEtBQWE7WUFDM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFRRCxPQUFPLFlBQUMsSUFBWTtZQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNqQyxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBU0QsTUFBTSxZQUFDLElBQVMsRUFBRSxlQUFnRDtZQUEzRCxxQkFBQSxFQUFBLFNBQVM7WUFDWixJQUFNLGVBQWUsR0FBRyxlQUFlLEVBQUUsQ0FBQztZQUUxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBRUQsSUFBSTtpQkFDQyxNQUFNLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSztnQkFDakIsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUM7aUJBQ0QsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUs7Z0JBQ2xCLEtBQUssQ0FBQyxNQUFNLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztZQUVQLGVBQWU7aUJBQ1YsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUs7Z0JBQ2pCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDO2lCQUNELE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO2dCQUNsQixlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUNKLENBQUMsQ0FBQztJQUVILE9BQVMsSUFBSSxDQUFDIn0=