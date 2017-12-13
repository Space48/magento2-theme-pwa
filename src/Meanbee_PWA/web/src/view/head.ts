/**
 * Manage <head> children
 */

"use strict";

import _ = require("underscore");
import ko = require("knockout");
import SPA = require("spa");
import Component = require("uiComponent");

const Head = Component.extend({
    /**
     * @override
     */
    initialize() {
        this.dataStore = SPA.getDataStore();
        this.headObservable = this.dataStore.get("head");
        this.assetObservable = this.dataStore.get("assets");
        this.assetItems = ko.observableArray();
        this.additionalItems = ko.observableArray();

        const assetData = this.htmlStringToArray(this.assetObservable());
        const headData = this.htmlStringToArray(this.headObservable());

        this.update(this.assetItems, assetData);
        this.update(this.additionalItems, headData);

        this._sub(this.assetObservable, this.assetItems);
        this._sub(this.headObservable, this.additionalItems);

        return this._super();
    },

    /**
     * Subscribe to an observable and update
     * given targets value
     *
     * @param {*} provider
     * @param {*} target
     * @returns void
     */
    _sub(
        provider: KnockoutObservable<string>,
        target: KnockoutObservableArray<string>
    ) {
        return provider.subscribe(data => {
            const arrayData = this.htmlStringToArray(data);

            this.update(target, arrayData);
        });
    },

    /**
     * Break html string by newline
     *
     * @param {String} string
     * @returns Array
     */
    htmlStringToArray(value: string) {
        if (typeof value !== "string") {
            return;
        }

        return value.split("\n");
    },

    /**
     * Retrieve internal property value
     *
     * @param {String} prop
     * @returns {*} Value of requested prop
     */
    getProp(prop: string) {
        if (!_.isUndefined(prop)) {
            if (!this.hasOwnProperty(prop)) {
                this[prop] = ko.observable();
            }
        }

        return this[prop]();
    },

    /**
     * Update changed head elements
     *
     * @param {Array} data
     * @param {ObservableArray} observableArray
     * @returns void
     */
    update(observableArray: KnockoutObservableArray<string>, data = []) {
        const observableValue = observableArray();

        if (_.isEmpty(data)) {
            return false;
        }

        const newValues = filter(data, observableValue);
        newValues.map(value => observableArray.push(value));

        const oldValues = filter(observableValue, data);
        oldValues.map(value => observableArray.remove(value));

        function filter(data: string[], matcher: string[]) {
            return data.filter((value: string, index) => {
                return !matcher.includes(value) && value.length;
            });
        }
    }
});

export = Head;
