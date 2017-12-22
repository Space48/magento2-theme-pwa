define(["require", "exports", "jquery", "underscore", "./errors/http_error"], function (require, exports, $, _, HttpError) {
    "use strict";
    var Ajax = (function () {
        function Ajax() {
        }
        Ajax.request = function (url, method, data) {
            if (data === void 0) { data = []; }
            method = method.toLowerCase();
            data.push({ name: "service_worker", value: "true" });
            if (method == 'get') {
                url = this.addSearchParametersToUrl(url, data);
            }
            return new Promise(function (resolve, reject) {
                var ajaxOptions = {
                    method: method,
                    cache: true,
                    xhrFields: {
                        withCredentials: true
                    }
                };
                if (method === 'post') {
                    ajaxOptions['data'] = data;
                }
                $.ajax(url, ajaxOptions)
                    .then(function (data, textStatus, jqXHR) {
                    resolve(data);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    var statusCode = jqXHR.status;
                    var message = "A problem occurred.";
                    if (statusCode === 500) {
                        message = "There was a problem connecting to the server. Please try again.";
                    }
                    else if (statusCode === 404) {
                        message = "The file you requested was not found";
                    }
                    message = message + " (status code: " + statusCode + ")";
                    reject(new HttpError(message));
                });
            });
        };
        Ajax.addSearchParametersToUrl = function (url, parameters) {
            var urlObj = new URL(url);
            _.each(parameters, function (obj) {
                urlObj.searchParams.append(obj.name, obj.value);
            });
            return urlObj.href;
        };
        return Ajax;
    }());
    return Ajax;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWpheC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hamF4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBSUE7UUFBQTtRQXNFQSxDQUFDO1FBM0RVLFlBQU8sR0FBZCxVQUFlLEdBQVcsRUFBRSxNQUFjLEVBQUUsSUFBaUM7WUFBakMscUJBQUEsRUFBQSxTQUFpQztZQUN6RSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRzlCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFFckQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEdBQUcsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQU0sVUFBQyxPQUFPLEVBQUUsTUFBTTtnQkFFcEMsSUFBSSxXQUFXLEdBQVE7b0JBQ25CLE1BQU0sRUFBRSxNQUFNO29CQUNkLEtBQUssRUFBRSxJQUFJO29CQUNYLFNBQVMsRUFBRTt3QkFDUCxlQUFlLEVBQUUsSUFBSTtxQkFDeEI7aUJBQ0osQ0FBQztnQkFFRixFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDL0IsQ0FBQztnQkFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUM7cUJBQ25CLElBQUksQ0FBQyxVQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSztvQkFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFnQixFQUFFLFVBQVUsRUFBRSxXQUFXO29CQUM5QyxJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUVoQyxJQUFJLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztvQkFFcEMsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLE9BQU8sR0FBRyxpRUFBaUUsQ0FBQTtvQkFDL0UsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzVCLE9BQU8sR0FBRyxzQ0FBc0MsQ0FBQTtvQkFDcEQsQ0FBQztvQkFFRCxPQUFPLEdBQU0sT0FBTyx1QkFBa0IsVUFBVSxNQUFHLENBQUM7b0JBRXBELE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQU9jLDZCQUF3QixHQUF2QyxVQUF3QyxHQUFXLEVBQUUsVUFBa0M7WUFDbkYsSUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQSxHQUFHO2dCQUNsQixNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFDTCxXQUFDO0lBQUQsQ0FBQyxBQXRFRCxJQXNFQztJQUVELE9BQVMsSUFBSSxDQUFDIn0=