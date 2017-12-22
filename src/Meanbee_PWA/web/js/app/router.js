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
define(["require", "exports", "jquery", "underscore", "Magento_Customer/js/customer-data", "./history", "./messages", "./router/link", "./router/locationChange", "./router/form", "./errors/response_format_error", "./errors/http_error", "./debugger", "./routes/cart"], function (require, exports, $, _, customerData, HistoryTracker, Messages, Link, LocationChange, Form, ResponseFormatError, HttpError, Debugger, CartRouteCallbacks) {
    "use strict";
    var Router = (function () {
        function Router(config) {
            this.requestCounter = 0;
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
        Router.prototype._routeBefore = function (url) {
            this.debugger.log('fired', '_routeBefore', {
                url: url
            });
            $(document).trigger("route:*:before");
        };
        Router.prototype._routeAfter = function (url) {
            this.debugger.log('fired', '_routeAfter', {
                url: url
            });
            $(document).trigger("route:*:after");
            if (url.match(/checkout\/cart(\/index)?/)) {
                this.debugger.log('fired cart callback', '_routeAfter', {
                    url: url
                });
                CartRouteCallbacks();
            }
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
                var requestId, result, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            requestId = ++this.requestCounter;
                            this.debugger.log('request made', 'resolve', {
                                requestId: requestId
                            });
                            this._routeBefore(request.url);
                            result = {};
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.dataStore.fetch(request)];
                        case 2:
                            result = _a.sent();
                            this.debugger.log('request returned', 'resolve', {
                                requestId: requestId
                            });
                            if (this.requestCounter != requestId) {
                                this.debugger.log('discarding response as there are newer requests', 'resolve', {
                                    requestId: requestId
                                });
                                return [2];
                            }
                            this._compareHistory(request, result);
                            this.dataStore.update(result);
                            this._routeAfter(request.url);
                            return [3, 4];
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
                            this._routeAfter(request.url);
                            return [3, 4];
                        case 4: return [2, result];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJQSxZQUFZLENBQUM7SUFnQmI7UUFnQkksZ0JBQVksTUFBb0I7WUFSaEMsbUJBQWMsR0FBVyxDQUFDLENBQUM7WUFTdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7WUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRztnQkFDbkIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLEtBQUssRUFBRSxJQUFJO2FBQ2QsQ0FBQztZQUVGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFdkMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBS0Qsc0JBQUssR0FBTDtZQUFBLGlCQWlCQztZQWhCRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2hELENBQUM7WUFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxLQUFlLEVBQUUsR0FBRztnQkFDdkMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBSSxLQUFLLG1DQUFnQyxDQUFDLENBQUM7Z0JBQzlELENBQUM7Z0JBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFD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