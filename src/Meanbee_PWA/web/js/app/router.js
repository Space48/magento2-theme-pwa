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
define(["require", "exports", "jquery", "underscore", "Magento_Customer/js/customer-data", "./history", "./messages", "./router/link", "./router/locationChange", "./router/form", "./errors/response_format_error", "./errors/http_error"], function (require, exports, $, _, customerData, HistoryTracker, Messages, Link, LocationChange, Form, ResponseFormatError, HttpError) {
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
                            this._routeBefore();
                            result = {};
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4, this.dataStore.fetch(request)];
                        case 2:
                            result = _a.sent();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJQSxZQUFZLENBQUM7SUFjYjtRQWNJLGdCQUFZLE1BQW9CO1lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO1lBQy9CLElBQUksQ0FBQyxlQUFlLEdBQUc7Z0JBQ25CLEtBQUssRUFBRSxJQUFJO2dCQUNYLGNBQWMsRUFBRSxjQUFjO2dCQUM5QixLQUFLLEVBQUUsSUFBSTthQUNkLENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFLRCxzQkFBSyxHQUFMO1lBQUEsaUJBaUJDO1lBaEJHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDaEQsQ0FBQztZQUVELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQWUsRUFBRSxHQUFHO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLElBQUksS0FBSyxDQUFJLEtBQUssbUNBQWdDLENBQUMsQ0FBQztnQkFDOUQsQ0FBQztnQkFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUMsQ0FBQztZQUVILENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQ1Ysa0JBQWdCLElBQUksQ0FBQyxjQUFnQixFQUNyQyxJQUFJLENBQUMs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