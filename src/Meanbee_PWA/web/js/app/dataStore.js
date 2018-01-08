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
define(["require", "exports", "underscore", "knockout", "./ajax", "./errors/response_format_error"], function (require, exports, _, ko, Ajax, ResponseFormatError) {
    "use strict";
    var DataStore = (function () {
        function DataStore() {
            this.state = {};
            return this;
        }
        DataStore.prototype._bind = function (key) {
            return (this.state[key] = ko.observable({}));
        };
        DataStore.prototype.get = function (key) {
            if (!this.state[key]) {
                this._bind(key);
            }
            return this.state[key];
        };
        DataStore.prototype.keys = function () {
            return _.keys(this.state);
        };
        DataStore.prototype.notify = function (key, value) {
            if (!this.state[key]) {
                this._bind(key);
            }
            this.state[key](value);
        };
        DataStore.prototype.update = function (data) {
            var _this = this;
            if (data) {
                _.each(data, function (value, key) {
                    _this.notify(key, value);
                });
            }
            return data;
        };
        DataStore.prototype.fetch = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var url, data, method, req, responseBody;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = options.url, data = options.data, method = options.method;
                            method = method || "get";
                            req = Ajax.request(url, method, data);
                            return [4, req.then()];
                        case 1:
                            responseBody = _a.sent();
                            if (typeof responseBody == 'string') {
                                throw new ResponseFormatError('The response from the server was a string - was expecting JSON');
                            }
                            return [2, responseBody];
                    }
                });
            });
        };
        DataStore.prototype.reload = function (options) {
            var req = this.fetch(options);
            return req
                .then(this.update.bind(this));
        };
        return DataStore;
    }());
    return DataStore;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RhdGFTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFLQSxZQUFZLENBQUM7SUFPYjtRQUdJO1lBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFFaEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBUUQseUJBQUssR0FBTCxVQUFNLEdBQVc7WUFDYixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBUUQsdUJBQUcsR0FBSCxVQUFJLEdBQVc7WUFDWCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBT0Qsd0JBQUksR0FBSjtZQUNJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBUUQsMEJBQU0sR0FBTixVQUFPLEdBQVcsRUFBRSxLQUFVO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQVFELDBCQUFNLEdBQU4sVUFBTyxJQUFjO1lBQXJCLGlCQVFDO1lBUEcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxHQUFHO29CQUNwQixLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDNUIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBUUsseUJBQUssR0FBWCxVQUFZLE9BQXlCOzs7Ozs7NEJBQzNCLEdBQUcsR0FBbUIsT0FBTyxJQUExQixFQUFFLElBQUksR0FBYSxPQUFPLEtBQXBCLEVBQUUsTUFBTSxHQUFLLE9BQU8sT0FBWixDQUFhOzRCQUdwQyxNQUFNLEdBQUcsTUFBTSxJQUFJLEtBQUssQ0FBQzs0QkFDekIsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzs0QkFFbkIsV0FBTSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUE7OzRCQUEvQixZQUFZLEdBQUcsU0FBZ0I7NEJBRW5DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0NBQ2xDLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDOzRCQUNwRyxDQUFDOzRCQUVELFdBQU8sWUFBWSxFQUFDOzs7O1NBQ3ZCO1FBUUQsMEJBQU0sR0FBTixVQUFPLE9BQXlCO1lBQzVCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFaEMsTUFBTSxDQUFDLEdBQUc7aUJBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNMLGdCQUFDO0lBQUQsQ0FBQyxBQXpHRCxJQXlHQztJQUVELE9BQVMsU0FBUyxDQUFDIn0=