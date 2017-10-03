define(["require", "exports", "underscore", "jquery", "knockout"], function (require, exports, _, $, ko) {
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
        DataStore.prototype._addSwParam = function (data) {
            data.push({ name: "service_worker", value: "true" });
            return data;
        };
        DataStore.prototype._addSearchParams = function (url, data) {
            var urlObj = new URL(url);
            _.each(data, function (obj) {
                urlObj.searchParams.append(obj.name, obj.value);
            });
            return urlObj.href;
        };
        DataStore.prototype._postRequest = function (url, data) {
            if (data === void 0) { data = []; }
            var body = this._addSwParam(data);
            return $.ajax(url, {
                data: body,
                method: "post",
                cache: false,
                xhrFields: {
                    withCredentials: true
                }
            }).fail(function (jqXHR, message, error) {
                return new Error(message);
            });
        };
        DataStore.prototype._getRequest = function (url, data) {
            if (data === void 0) { data = []; }
            var prepareData = this._addSwParam(data);
            var requestUrl = this._addSearchParams(url, prepareData);
            return $.ajax(requestUrl, {
                method: "get",
                cache: false,
                xhrFields: {
                    withCredentials: true
                }
            }).fail(function (jqXHR, message, error) {
                return new Error(message);
            });
        };
        DataStore.prototype._handleJson = function (json) {
            var content = json.content, backUrl = json.backUrl;
            if (content) {
                return json;
            }
            if (backUrl) {
                return this._getRequest(backUrl);
            }
            return false;
        };
        DataStore.prototype._handleError = function (error) {
            throw new Error(error);
        };
        DataStore.prototype.fetch = function (options) {
            var url = options.url, data = options.data, method = options.method;
            var req;
            method = method || "get";
            if (method === "post") {
                req = this._postRequest(url, data);
            }
            else {
                req = this._getRequest(url, data);
            }
            return req.then(this._handleJson.bind(this));
        };
        DataStore.prototype.reload = function (options) {
            var req = this.fetch(options);
            return req
                .then(this.update.bind(this))
                .catch(this._handleError.bind(this));
        };
        return DataStore;
    }());
    return DataStore;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RhdGFTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBS0EsWUFBWSxDQUFDO0lBTWI7UUFHSTtZQUNJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBRWhCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQVFELHlCQUFLLEdBQUwsVUFBTSxHQUFXO1lBQ2IsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakQsQ0FBQztRQVFELHVCQUFHLEdBQUgsVUFBSSxHQUFXO1lBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQU9ELHdCQUFJLEdBQUo7WUFDSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQVFELDBCQUFNLEdBQU4sVUFBTyxHQUFXLEVBQUUsS0FBVTtZQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFRRCwwQkFBTSxHQUFOLFVBQU8sSUFBYztZQUFyQixpQkFR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