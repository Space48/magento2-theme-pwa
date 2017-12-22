define(["require", "exports", "jquery", "underscore", "./errors/http_error", "./debugger"], function (require, exports, $, _, HttpError, Debbuger) {
    "use strict";
    var Ajax = (function () {
        function Ajax() {
        }
        Ajax.request = function (url, method, data) {
            if (data === void 0) { data = []; }
            var debug = new Debbuger("ajax");
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
                    debug.log("request to " + url + " succeeded", 'request', {
                        response: data
                    });
                    resolve(data);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    var statusCode = jqXHR.status;
                    debug.warn("request to " + url + " failed", 'request', {
                        statusCode: statusCode,
                        textStatus: textStatus
                    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWpheC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hamF4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBS0E7UUFBQTtRQWlGQSxDQUFDO1FBdEVVLFlBQU8sR0FBZCxVQUFlLEdBQVcsRUFBRSxNQUFjLEVBQUUsSUFBaUM7WUFBakMscUJBQUEsRUFBQSxTQUFpQztZQUN6RSxJQUFJLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVqQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRzlCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFFckQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEdBQUcsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQU0sVUFBQyxPQUFPLEVBQUUsTUFBTTtnQkFFcEMsSUFBSSxXQUFXLEdBQVE7b0JBQ25CLE1BQU0sRUFBRSxNQUFNO29CQUNkLEtBQUssRUFBRSxJQUFJO29CQUNYLFNBQVMsRUFBRTt3QkFDUCxlQUFlLEVBQUUsSUFBSTtxQkFDeEI7aUJBQ0osQ0FBQztnQkFFRixFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDL0IsQ0FBQztnQkFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUM7cUJBQ25CLElBQUksQ0FBQyxVQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSztvQkFDMUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxnQkFBYyxHQUFHLGVBQVksRUFBRSxTQUFTLEVBQUU7d0JBQ2hELFFBQVEsRUFBRSxJQUFJO3FCQUNqQixDQUFDLENBQUM7b0JBRUgsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFnQixFQUFFLFVBQVUsRUFBRSxXQUFXO29CQUM5QyxJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUVoQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFjLEdBQUcsWUFBUyxFQUFFLFNBQVMsRUFBRTt3QkFDOUMsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLFVBQVUsRUFBRSxVQUFVO3FCQUN6QixDQUFDLENBQUM7b0JBRUgsSUFBSSxPQUFPLEdBQUcscUJBQXFCLENBQUM7b0JBRXBDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixPQUFPLEdBQUcsaUVBQWlFLENBQUE7b0JBQy9FLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixPQUFPLEdBQUcsc0NBQXNDLENBQUE7b0JBQ3BELENBQUM7b0JBRUQsT0FBTyxHQUFNLE9BQU8sdUJBQWtCLFVBQVUsTUFBRyxDQUFDO29CQUVwRCxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUM7UUFPYyw2QkFBd0IsR0FBdkMsVUFBd0MsR0FBVyxFQUFFLFVBQWtDO1lBQ25GLElBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTVCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQUEsR0FBRztnQkFDbEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN2QixDQUFDO1FBQ0wsV0FBQztJQUFELENBQUMsQUFqRkQsSUFpRkM7SUFFRCxPQUFTLElBQUksQ0FBQyJ9