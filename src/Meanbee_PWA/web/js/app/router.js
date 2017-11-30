var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "jquery", "underscore", "Magento_Customer/js/customer-data", "./history", "./messages", "./router/link", "./router/locationChange", "./router/form"], function (require, exports, $, _, customerData, HistoryTracker, Messages, Link, LocationChange, Form) {
    "use strict";
    var Router = (function () {
        function Router(config) {
            this.history = new HistoryTracker(config.history);
            this.eventNamespace = "Router";
            this.defaultBindings = {
                links: Link,
                locationChange: LocationChange,
                forms: Form
            };
            return this;
        }
        Router.prototype._bind = function () {
            var _this = this;
            if (!this.bindings) {
                this.registerBindings(this.defaultBindings);
            }
            _.each(this.bindings, function (value, key) {
                if (typeof value !== "function") {
                    throw new Error(value + " requires a callable signature");
                }
                value.call(null, _this);
            });
            $(document).on("ajaxComplete." + this.eventNamespace, this._handleAjaxComplete.bind(this));
        };
        Router.prototype._isSameRoute = function (route, newRoute) {
            var path = route.pathname === newRoute.pathname;
            var search = route.search === newRoute.search;
            return path && search;
        };
        Router.prototype._restoreScroll = function (yPosition) {
            var position = yPosition || 0;
            window.scrollTo(0, position);
            return position;
        };
        Router.prototype._updateMessages = function () {
            var cookies = $.cookieStorage.get("mage-messages");
            cookies && cookies.length && Messages.set(cookies);
            $.cookieStorage.set("mage-messages", "");
        };
        Router.prototype._resetFormKeys = function () {
            var body = $("body");
            return body.data("formKey") && body.formKey("destroy").formKey();
        };
        Router.prototype._handleAjaxComplete = function (event, xhr, settings) {
            this._updateMessages();
        };
        Router.prototype.invalidateMessages = function () {
            customerData.set("messages", {});
            $.cookieStorage.set("mage-messages", "");
            Messages.set("");
            return this;
        };
        Router.prototype.registerBindings = function (bindings) {
            this.bindings = $.extend({}, this.defaultBindings, bindings);
            return this;
        };
        Router.prototype.start = function () {
            if (!this.dataStore) {
                throw new Error("Router does not have a store set");
            }
            this._bind();
            this.listen();
            var request = this.resolve({
                url: document.location.href
            });
            request();
            return this;
        };
        Router.prototype.setDataStore = function (store) {
            if (!store) {
                throw new Error("No store supplied");
            }
            this.dataStore = store;
            return this;
        };
        Router.prototype.getHistory = function () {
            return this.history;
        };
        Router.prototype.routes = function (routes) {
            var keys = _.uniq(_.pluck(routes, "path"));
            if (keys.length <= 0) {
                return this;
            }
            var data = {};
            _.each(keys, function (value) {
                if (typeof data[value] === "undefined") {
                    data[value] = {
                        before: [],
                        after: []
                    };
                }
            });
            _.each(routes, function (obj) {
                var path = obj.path, callback = obj.callback, action = obj.action;
                data[path][action].push(callback);
            });
            this.routeCallbacks = data;
            return this;
        };
        Router.prototype._routeBefore = function () {
            $(document).trigger("route:*:before");
        };
        Router.prototype._routeAfter = function () {
            $(document).trigger("route:*:after");
            this._resetFormKeys();
            this._handleAjaxComplete();
        };
        Router.prototype.listen = function () {
            var _this = this;
            this.history.listen(function (to, from) {
                if (_this._isSameRoute(to.url, from.url)) {
                    return;
                }
                var execute = function () { return __awaiter(_this, void 0, void 0, function () {
                    var resolve, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                resolve = this.resolve({
                                    url: to.url.href
                                });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, resolve()];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                e_1 = _a.sent();
                                return [3, 4];
                            case 4:
                                this._restoreScroll(to.state.scrollY);
                                return [2];
                        }
                    });
                }); };
                return execute();
            }, this);
        };
        Router.prototype.resolve = function (request) {
            var _this = this;
            return function () { return __awaiter(_this, void 0, void 0, function () {
                var result, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            result = null;
                            this._routeBefore();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.dataStore.fetch(request)];
                        case 2:
                            result = _a.sent();
                            return [3, 4];
                        case 3:
                            e_2 = _a.sent();
                            return [3, 4];
                        case 4:
                            this._compareHistory(request, result);
                            this.dataStore.update(result);
                            this._routeAfter();
                            return [2, result];
                    }
                });
            }); };
        };
        Router.prototype._compareHistory = function (request, result) {
            if (request.url !== result.meta.url) {
                this.history.replace({
                    state: {},
                    title: "",
                    url: new URL(result.meta.url)
                });
            }
            return result;
        };
        Router.prototype.destroy = function () {
            $(document).off("ajaxComplete." + this.eventNamespace);
        };
        return Router;
    }());
    return Router;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJQSxZQUFZLENBQUM7SUFhYjtRQWNJLGdCQUFZLE1BQW9CO1lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO1lBQy9CLElBQUksQ0FBQyxlQUFlLEdBQUc7Z0JBQ25CLEtBQUssRUFBRSxJQUFJO2dCQUNYLGNBQWMsRUFBRSxjQUFjO2dCQUM5QixLQUFLLEVBQUUsSUFBSTthQUNkLENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFLRCxzQkFBSyxHQUFMO1lBQUEsaUJBaUJDO1lBaEJHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDaEQsQ0FBQztZQUVELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQWUsRUFBRSxHQUFHO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLElBQUksS0FBSyxDQUFJLEtBQUssbUNBQWdDLENBQUMsQ0FBQztnQkFDOUQsQ0FBQztnQkFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztZQUVILENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQ1Ysa0JBQWdCLElBQUksQ0FBQyxjQUFnQixFQUNyQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN0QyxDQUFDO1FBQ04sQ0FBQztRQVNELDZCQUFZLEdBQVosVUFBYSxLQUFVLEVBQUUsUUFBYTtZQUNsQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDbEQsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBRWhELE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDO1FBQzFCLENBQUM7UUFRRCwrQkFBYyxHQUFkLFVBQWUsU0FBa0I7WUFDN0IsSUFBTSxRQUFRLEdBQUcsU0FBUyxJQUFJLENBQUMsQ0FBQztZQUVoQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUU3QixNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUM7UUFPRCxnQ0FBZSxHQUFmO1lBQ0ksSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFckQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQU9ELCtCQUFjLEdBQWQ7WUFDSSxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyRSxDQUFDO1FBVUQsb0NBQW1CLEdBQW5CLFVBQ0ksS0FBeUIsRUFDekIsR0FBb0IsRUFDcEIsUUFBYTtZQUViLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzQixDQUFDO1FBT0QsbUNBQWtCLEdBQWxCO1lBQ0ksWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFakIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBT0QsaUNBQWdCLEdBQWhCLFVBQWlCLFFBQVk7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRTdELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQU9ELHNCQUFLLEdBQUw7WUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUVELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVkLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3pCLEdBQUcsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUk7YUFDOUIsQ0FBQyxDQUFDO1lBRUgsT0FBTyxFQUFFLENBQUM7WUFFVixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFRRCw2QkFBWSxHQUFaLFVBQWEsS0FBZ0I7WUFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBT0QsMkJBQVUsR0FBVjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLENBQUM7UUFRRCx1QkFBTSxHQUFOLFVBQU8sTUFBcUI7WUFDeEIsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBRUQsSUFBTSxJQUFJLEdBQWtCLEVBQUUsQ0FBQztZQUMvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFBLEtBQUs7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO3dCQUNWLE1BQU0sRUFBRSxFQUFFO3dCQUNWLEtBQUssRUFBRSxFQUFFO3FCQUNaLENBQUM7Z0JBQ04sQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBQSxHQUFHO2dCQUNOLElBQUEsZUFBSSxFQUFFLHVCQUFRLEVBQUUsbUJBQU0sQ0FBUztnQkFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBRTNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQVFELDZCQUFZLEdBQVo7WUFDSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDMUMsQ0FBQztRQVNELDRCQUFXLEdBQVg7WUFDSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBR3JDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMvQixDQUFDO1FBT0QsdUJBQU0sR0FBTjtZQUFBLGlCQXFCQztZQXBCRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEVBQWdCLEVBQUUsSUFBa0I7Z0JBRXJELEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFNLE9BQU8sR0FBRzs7Ozs7Z0NBQ04sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7b0NBQ3pCLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUk7aUNBQ25CLENBQUMsQ0FBQzs7OztnQ0FHQyxXQUFNLE9BQU8sRUFBRSxFQUFBOztnQ0FBZixTQUFlLENBQUM7Ozs7OztnQ0FHcEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7O3FCQUN6QyxDQUFDO2dCQUVGLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDO1FBUUQsd0JBQU8sR0FBUCxVQUFRLE9BQXlCO1lBQWpDLGlCQWdCQztZQWZHLE1BQU0sQ0FBQzs7Ozs7NEJBQ0MsTUFBTSxHQUFHLElBQUksQ0FBQzs0QkFFbEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOzs7OzRCQUdQLFdBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUE7OzRCQUE1QyxNQUFNLEdBQUcsU0FBbUMsQ0FBQzs7Ozs7OzRCQUdqRCxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQzlCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs0QkFFbkIsV0FBTyxNQUFNLEVBQUM7OztpQkFDakIsQ0FBQztRQUNOLENBQUM7UUFZRCxnQ0FBZSxHQUFmLFVBQWdCLE9BQXlCLEVBQUUsTUFBZ0I7WUFDdkQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO29CQUNqQixLQUFLLEVBQUUsRUFBRTtvQkFDVCxLQUFLLEVBQUUsRUFBRTtvQkFDVCxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ2hDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFPRCx3QkFBTyxHQUFQO1lBQ0ksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBZ0IsSUFBSSxDQUFDLGNBQWdCLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQ0wsYUFBQztJQUFELENBQUMsQUFwVUQsSUFvVUM7SUFFRCxPQUFTLE1BQU0sQ0FBQyJ9