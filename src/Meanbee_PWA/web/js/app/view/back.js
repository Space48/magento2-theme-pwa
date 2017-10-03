define(["require", "exports", "knockout", "uiComponent", "spa"], function (require, exports, ko, Component, SPA) {
    "use strict";
    var Back = Component.extend({
        initialize: function (config) {
            var _this = this;
            var options = config && config.options;
            var excludes = options && options.excludeUrl;
            var excludeUrl = new URL(excludes);
            this.baseUrl = options && options.baseUrl;
            this.pathMatch = ko.observable();
            this.shouldShow = ko.computed(function () {
                if (_this.pathMatch() ||
                    document.location.pathname === excludeUrl.pathname) {
                    return false;
                }
                return true;
            }, this);
            this.history = SPA.getHistory();
            this.history && this.history.watch(excludeUrl.pathname, this.pathMatch);
            return this._super();
        },
        navigate: function () {
            if (!this.history) {
                var previousUrl = this.baseUrl;
                var referrer = document.referrer && new URL(document.referrer);
                if (referrer && referrer.origin === location.origin) {
                    previousUrl = referrer;
                }
                return location.assign(previousUrl);
            }
            return this.history.back();
        }
    });
    return Back;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92aWV3L2JhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtJQUlBLFlBQVksQ0FBQztJQU1iLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFJMUIsVUFBVSxZQUFDLE1BQU07WUFBakIsaUJBc0JDO1lBckJHLElBQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ3pDLElBQU0sUUFBUSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQy9DLElBQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXJDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FDQyxLQUFJLENBQUMsU0FBUyxFQUFFO29CQUNoQixRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxVQUFVLENBQUMsUUFDOUMsQ0FBQyxDQUFDLENBQUM7b0JBQ0MsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakIsQ0FBQztnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVULElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBS0QsUUFBUTtZQUNKLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBRS9CLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRSxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDbEQsV0FBVyxHQUFHLFFBQVEsQ0FBQztnQkFDM0IsQ0FBQztnQkFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsQ0FBQztLQUNKLENBQUMsQ0FBQztJQUVILE9BQVMsSUFBSSxDQUFDIn0=