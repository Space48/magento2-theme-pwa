/**
 * Data object for requesting and storing
 * current route result
 */

"use strict";

import _ = require("underscore");
import $ = require("jquery");
import ko = require("knockout");

class DataStore {
    state: any;

    constructor() {
        this.state = {};

        return this;
    }

    /**
     * Create an observable for a state prop
     *
     * @param {String} key
     * @returns {*} Observable
     */
    _bind(key: string) {
        return (this.state[key] = ko.observable({}));
    }

    /**
     * Get state observable by name
     *
     * @param {String} key
     * @returns {*} Observable
     */
    get(key: string) {
        if (!this.state[key]) {
            this._bind(key);
        }
        return this.state[key];
    }

    /**
     * Get state object keys
     *
     * @return {Array}
     */
    keys() {
        return _.keys(this.state);
    }

    /**
     * Change given keys observable value
     *
     * @param {String} key
     * @param {*} value
     */
    notify(key: string, value: any) {
        if (!this.state[key]) {
            this._bind(key);
        }

        this.state[key](value);
    }

    /**
     * Update state with given objects key/values
     *
     * @param {Object} data
     * @returns {Object}
     */
    update(data: PWA_JSON) {
        if (data) {
            _.each(data, (value, key) => {
                this.notify(key, value);
            });
        }

        return data;
    }

    /**
     * Add service worker param to existing serialized data array
     *
     * @param {Array} data - Array of objects
     * @return {*}
     */
    _addSwParam(data: JQuery.NameValuePair[]) {
        data.push({ name: "service_worker", value: "true" });
        return data;
    }

    /**
     * Add name/value pairs to url
     *
     * @param {String} url
     * @param {Array} data - Array of objects
     * @return {*}
     */
    _addSearchParams(url: string, data: JQuery.NameValuePair[]) {
        const urlObj = new URL(url);

        _.each(data, obj => {
            urlObj.searchParams.append(obj.name, obj.value);
        });

        return urlObj.href;
    }

    /**
     * Post data to given url
     *
     * @param {String} url
     * @param {Array} data - Array of objects
     * @return {*}
     */
    _postRequest(url: string, data: JQuery.NameValuePair[] = []) {
        const body = this._addSwParam(data);

        return $.ajax(url, {
            data: body,
            method: "post",
            cache: false,
            xhrFields: {
                withCredentials: true
            }
        }).fail((jqXHR, message, error) => {
            return new Error(message);
        });
    }

    /**
     * Get server response for given url
     *
     * @param {String} url
     * @param {Array} data - Array of objects
     * @return {*}
     */
    _getRequest(url: string, data: JQuery.NameValuePair[] = []) {
        const prepareData = this._addSwParam(data);
        const requestUrl = this._addSearchParams(url, prepareData);

        return $.ajax(requestUrl, {
            method: "get",
            cache: false,
            xhrFields: {
                withCredentials: true
            }
        }).fail((jqXHR, message, error) => {
            return new Error(message);
        });
    }

    /**
     * If resolved json is another redirect, re-resolve.
     * Magento can return json if it detects an ajax request,
     * this JSON is not the PWA response json we require. Re-request.
     *
     * @param {Object} json
     * @return {*}
     */
    _handleJson(json: PWA_JSON) {
        const { content, backUrl } = json;

        if (content) {
            return json;
        }

        if (backUrl) {
            return this._getRequest(backUrl);
        }

        return false;
    }

    /**
     * Handle given error
     *
     * @param {String} error
     * @return {Object}
     */
    _handleError(error: string) {
        throw new Error(error);
    }

    /**
     * Send request to server
     *
     * @param {Object} options
     * @return {*}
     */
    fetch(options: DataStoreRequest) {
        let { url, data, method } = options;
        let req;

        method = method || "get";

        if (method === "post") {
            req = this._postRequest(url, data);
        } else {
            req = this._getRequest(url, data);
        }

        return req.then(this._handleJson.bind(this));
    }

    /**
     * Send request to server and update internal state
     *
     * @param {Object} options
     * @return {*}
     */
    reload(options: DataStoreRequest) {
        const req = this.fetch(options);

        return req
            .then(this.update.bind(this))
            .catch(this._handleError.bind(this));
    }
}

export = DataStore;
