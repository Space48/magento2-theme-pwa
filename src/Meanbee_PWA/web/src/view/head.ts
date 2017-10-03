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

        const assetObservable = this.dataStore.get("assets");
        const headObservable = this.dataStore.get("head");

        this.assetItems = ko.observableArray();
        this.additionalItems = ko.observableArray();

        this.update(assetObservable(), this.assetItems);
        this.update(headObservable(), this.additionalItems);
        this._sub(assetObservable, this.assetItems);
        this._sub(headObservable, this.additionalItems);

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

            this.update(arrayData, target);
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
    update(data = [], observableArray: KnockoutObservableArray<string>) {
        const observableValue = observableArray();

        if (_.isEmpty(data)) {
            return false;
        }

        data
            .filter((value, index) => {
                return !observableValue.includes(value);
            })
            .forEach((value, index) => {
                value.length && observableArray.push(value);
            });

        observableValue
            .filter((value, index) => {
                return !data.includes(value);
            })
            .forEach((value, index) => {
                observableArray.remove(value);
            });
    }
});

export = Head;
