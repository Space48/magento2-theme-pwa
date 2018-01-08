import $ = require('jquery');
import _ = require('underscore');
import HttpError = require("./errors/http_error");
import Debugger = require("./debugger");

class Ajax {

    /**
     * This method replaces the need to use $.ajax directly meaning you can avoid jQuery's deferred objects and use
     * proper promises instead.
     *
     * @param {string} url
     * @param {string} method
     * @param {JQuery.NameValuePair[]} data
     * @returns {Promise<any>}
     */
    static request(url: string, method: string, data: JQuery.NameValuePair[] = []): Promise<any> {
        let debug = new Debugger("ajax");

        method = method.toLowerCase();

        // Add the service worker to GET/POST data
        data.push({ name: "service_worker", value: "true" });

        if (method == 'get') {
            url = this.addSearchParametersToUrl(url, data);
        }

        return new Promise<any>((resolve, reject) => {

            let ajaxOptions: any = {
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
                .then((data, textStatus, jqXHR) => {
                    debug.log(`request to ${url} succeeded`, 'request', {
                        response: data
                    });

                    resolve(data);
                }).fail((jqXHR: JQueryXHR, textStatus, errorThrown) => {
                    const statusCode = jqXHR.status;

                    debug.warn(`request to ${url} failed`, 'request', {
                        statusCode,
                        textStatus
                    });

                    let message = "A problem occurred.";

                    if (statusCode === 500) {
                        message = "There was a problem connecting to the server. Please try again."
                    } else if (statusCode === 404) {
                        message = "The file you requested was not found"
                    }

                    message = `${message} (status code: ${statusCode})`;

                    reject(new HttpError(message));
                });
        })
    }

    /**
     * @param {string} url
     * @param {JQuery.NameValuePair[]} parameters
     * @returns {string}
     */
    private static addSearchParametersToUrl(url: string, parameters: JQuery.NameValuePair[]): string {
        const urlObj = new URL(url);

        _.each(parameters, obj => {
            urlObj.searchParams.append(obj.name, obj.value);
        });

        return urlObj.href;
    }
}

export = Ajax;