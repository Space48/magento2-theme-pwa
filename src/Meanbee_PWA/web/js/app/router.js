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
define(["require", "exports", "jquery", "underscore", "Magento_Customer/js/customer-data", "./history", "./messages", "./router/link", "./router/locationChange", "./router/form", "./errors/response_format_error", "./errors/http_error", "./debugger"], function (require, exports, $, _, customerData, HistoryTracker, Messages, Link, LocationChange, Form, ResponseFormatError, HttpError, Debugger) {
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
            this.debugger = new Debugger('router');
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
                value.call(value, _this);
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
            var paths = _.uniq(_.pluck(routes, "path"));
            if (paths.length <= 0) {
                return this;
            }
            var routeCallbacks = {};
            _.each(paths, function (path) {
                if (typeof routeCallbacks[path] === "undefined") {
                    routeCallbacks[path] = {
                        before: [],
                        after: []
                    };
                }
            });
            _.each(routes, function (obj) {
                var path = obj.path, callback = obj.callback, action = obj.action;
                routeCallbacks[path][action].push(callback);
            });
            this.routeCallbacks = routeCallbacks;
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
                    var resolve;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                resolve = this.resolve({
                                    url: to.url.href
                                });
                                return [4, resolve()];
                            case 1:
                                _a.sent();
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
                var result, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.debugger.log('request made', 'resolve');
                            this._routeBefore();
                            result = {};
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4, this.dataStore.fetch(request)];
                        case 2:
                            result = _a.sent();
                            this.debugger.log('request returned', 'resolve');
                            this._compareHistory(request, result);
                            this.dataStore.update(result);
                            return [3, 5];
                        case 3:
                            e_1 = _a.sent();
                            if (e_1 instanceof HttpError) {
                                alert(e_1.message);
                            }
                            else if (e_1 instanceof ResponseFormatError) {
                                console.warn(e_1.message);
                                alert("Sorry, there was a problem communicating with the server.");
                            }
                            else {
                                throw e_1;
                            }
                            return [3, 5];
                        case 4:
                            this._routeAfter();
                            return [7];
                        case 5: return [2, result];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJQSxZQUFZLENBQUM7SUFlYjtRQWVJLGdCQUFZLE1BQW9CO1lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO1lBQy9CLElBQUksQ0FBQyxlQUFlLEdBQUc7Z0JBQ25CLEtBQUssRUFBRSxJQUFJO2dCQUNYLGNBQWMsRUFBRSxjQUFjO2dCQUM5QixLQUFLLEVBQUUsSUFBSTthQUNkLENBQUM7WUFFRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXZDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUtELHNCQUFLLEdBQUw7WUFBQSxpQkFpQkM7WUFoQkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNoRCxDQUFDO1lBRUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsS0FBZSxFQUFFLEdBQUc7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUksS0FBSyxtQ0FBZ0MsQ0FBQyxDQUFDO2dCQUM5RCxDQUFDO2dCQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1lBRUgsQ0FBQyxDQUFDLFFBQVEsQ0FB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