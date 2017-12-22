/**
 * Data object for requesting and storing
 * current route result
 */

"use strict";

import _ = require("underscore");
import ko = require("knockout");
import Ajax = require("./ajax");
import ResponseFormatError = require("./errors/response_format_error");

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
     * Send request to server
     *
     * @param {Object} options
     * @return {Promise<PWA_JSON>}
     */
    async fetch(options: DataStoreRequest) : Promise<PWA_JSON> {
        let { url, data, method } = options;
        let req;

        method = method || "get";
        req = Ajax.request(url, method, data);

        let responseBody = await req.then();

        if (typeof responseBody == 'string') {
            throw new ResponseFormatError('The response from the server was a string - was expecting JSON');
        }

        return responseBody;
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
            .then(this.update.bind(this));
    }
}

export = DataStore;
