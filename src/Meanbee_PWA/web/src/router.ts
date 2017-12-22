/**
 * Catch navigate events and perform ajax route switch
 */

"use strict";

import $ = require("jquery");
import _ = require("underscore");
import customerData = require("Magento_Customer/js/customer-data");
import HistoryTracker = require("./history");
import Messages = require("./messages");
import DataStore = require("./dataStore");
import Link = require("./router/link");
import LocationChange = require("./router/locationChange");
import Form = require("./router/form");
import ResponseFormatError = require("./errors/response_format_error");
import HttpError = require("./errors/http_error");
import Debugger = require("./debugger");

class Router {
    history: HistoryTracker;
    store: DataStore;
    eventNamespace: string;
    dataStore: DataStore;
    routeCallbacks: { [name: string]: {} };
    defaultBindings: {};
    bindings: {};
    requestCounter: number = 0;
    debugger: Debugger;

    /**
     * Router initialization
     *
     * @returns {Router}
     */
    constructor(config: RouterConfig) {
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

    /**
     * Setup document listeners to intercept actions
     */
    _bind() {
        if (!this.bindings) {
            this.registerBindings(this.defaultBindings);
        }

        _.each(this.bindings, (value: Function, key) => {
            if (typeof value !== "function") {
                throw new Error(`${value} requires a callable signature`);
            }

            value.call(value, this);
        });

        $(document).on(
            `ajaxComplete.${this.eventNamespace}`,
            this._handleAjaxComplete.bind(this)
        );
    }

    /**
     * Check if route has changed
     *
     * @param {URL} route
     * @param {URL} newRoute
     * @returns {Boolean}
     */
    _isSameRoute(route: URL, newRoute: URL) {
        const path = route.pathname === newRoute.pathname;
        const search = route.search === newRoute.search;

        return path && search;
    }

    /**
     * Move scroll position to state offset
     *
     * @param {Object} state
     * @returns {Int}
     */
    _restoreScroll(yPosition?: number) {
        const position = yPosition || 0;

        window.scrollTo(0, position);

        return position;
    }

    /**
     * Synchonise app messages
     *
     * @returns void
     */
    _updateMessages() {
        const cookies = $.cookieStorage.get("mage-messages");

        cookies && cookies.length && Messages.set(cookies);
        $.cookieStorage.set("mage-messages", "");
    }

    /**
     * Reinitialise form keys
     *
     * @returns void
     */
    _resetFormKeys() {
        const body = $("body");

        return body.data("formKey") && body.formKey("destroy").formKey();
    }

    /**
     * Update flash messages after ajax request
     *
     * @param {Object} event
     * @param {Object} xhr
     * @param {Object} settings
     * @returns void
     */
    _handleAjaxComplete(
        event?: JQueryEventObject,
        xhr?: XMLHttpRequest,
        settings?: {}
    ) {
        this._updateMessages();
    }

    /**
     * Clear message data
     *
     * @returns {Router}
     */
    invalidateMessages(): this {
        customerData.set("messages", {});
        $.cookieStorage.set("mage-messages", "");
        Messages.set("");

        return this;
    }

    /**
     * Apply given bindings
     *
     * @returns {Router}
     */
    registerBindings(bindings: {}): this {
        this.bindings = $.extend({}, this.defaultBindings, bindings);

        return this;
    }

    /**
     * Apply bindings and begin tracking
     *
     * @returns {Router}
     */
    start(): this {
        if (!this.dataStore) {
            throw new Error(`Router does not have a store set`);
        }

        this._bind();
        this.listen();

        const request = this.resolve({
            url: document.location.href
        });

        request();

        return this;
    }

    /**
     * Set DataStore instance
     *
     * @param {DataStore} store
     * @returns {Router}
     */
    setDataStore(store: DataStore): this {
        if (!store) {
            throw new Error(`No store supplied`);
        }

        this.dataStore = store;
        return this;
    }

    /**
     * Get History instance
     *
     * @returns {HistoryTracker}
     */
    getHistory() {
        return this.history;
    }

    /**
     * Configure route matching
     *
     * @param {Array} routes
     * @returns Router
     */
    routes(routes: RouteConfig[]): this {
        const paths: string[] = _.uniq(_.pluck(routes, "path"));

        if (paths.length <= 0) {
            return this;
        }

        const routeCallbacks: RouteCallback = {};

        // Initialise the route callback
        _.each(paths, (path: string) => {
            if (typeof routeCallbacks[path] === "undefined") {
                routeCallbacks[path] = {
                    before: [],
                    after:  []
                };
            }
        });

        _.each(routes, (obj: RouteConfig) => {
            const { path, callback, action } = obj;
            routeCallbacks[path][action].push(callback);
        });

        this.routeCallbacks = routeCallbacks;

        return this;
    }

    /**
     * Before store data is updated
     *
     * @param {Object} data - The resolved request
     * @returns {Object} data
     */
    _routeBefore(url: string) {
        this.debugger.log('fired', '_routeBefore', {
            url: url
        });

        $(document).trigger(`route:*:before`);
    }

    /**
     * After store data has been updated
     *
     * @param {Object} request - The initial request
     * @param {Object} data - The resolved request data
     * @returns {Object} data
     */
    _routeAfter(url: string) {
        this.debugger.log('fired', '_routeAfter', {
            url: url
        });

        $(document).trigger(`route:*:after`);

        // Path match callbacks
        this._resetFormKeys();
        this._handleAjaxComplete();
    }

    /**
     * Listen for changes in history
     *
     * @returns {Object} data
     */
    listen() {
        this.history.listen((to: HistoryEntry, from: HistoryEntry) => {
            // Return for same page hashes
            if (this._isSameRoute(to.url, from.url)) {
                return;
            }

            const execute = async () => {
                const resolve = this.resolve({
                    url: to.url.href
                });

                await resolve();
                this._restoreScroll(to.state.scrollY);
            };

            return execute();
        }, this);
    }

    /**
     * Request Store data and run route callbacks
     *
     * @param {Object} request
     * @returns {Object} data
     */
    resolve(request: DataStoreRequest) {
        return async () => {
            // A unique identifier for this request.
            const requestId = ++this.requestCounter;

            this.debugger.log('request made', 'resolve', {
                requestId: requestId
            });

            this._routeBefore(request.url);

            let result = <PWA_JSON> {};

            try {
                result = await this.dataStore.fetch(request);

                this.debugger.log('request returned', 'resolve', {
                    requestId: requestId
                });

                // Check that our request is still the latest. If it isn't, then return early.
                if (this.requestCounter != requestId) {

                    this.debugger.log(
                        'discarding response as there are newer requests',
                        'resolve',{
                            requestId: requestId
                        }
                    );

                    return;
                }

                this._compareHistory(request, result);
                this.dataStore.update(result);
                this._routeAfter(request.url);
            } catch (e) {
                if (e instanceof HttpError) {
                    alert(e.message);
                } else if (e instanceof ResponseFormatError) {
                    console.warn(e.message);
                    alert("Sorry, there was a problem communicating with the server.");
                } else {
                    throw e;
                }

                this._routeAfter(request.url);
            }

            return result;
        };
    }

    /**
     * Check for redirects and update history
     *
     * @param {Object} request
     * @param {Object} result
     * @param {String} request.url - The request URL
     * @param {Array} [request.data] - Serialized array of data objects
     * @param {String} [request.method] - Request type
     * @returns {Object}
     */
    _compareHistory(request: DataStoreRequest, result: PWA_JSON) {
        if (request.url !== result.meta.url) {
            this.history.replace({
                state: {},
                title: "",
                url: new URL(result.meta.url)
            });
        }

        return result;
    }

    /**
     * Cleanup router
     *
     * @return void
     */
    destroy() {
        $(document).off(`ajaxComplete.${this.eventNamespace}`);
    }
}

export = Router;
