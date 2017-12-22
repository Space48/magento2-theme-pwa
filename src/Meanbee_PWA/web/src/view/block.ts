/**
 * Subscribe to a PWA response key to synchronize
 * data/HTML across route changes
 */
"use strict";

import $ = require("jquery");
import ko = require("knockout");
import SPA = require("spa");
import Component = require("uiComponent");

const namespace = "Block";

const Block = Component.extend({
    options: {
        clean: false,
        cleanElement: null,
        key: null
    },
    state: {},

    /**
     * @override
     */
    initialize(config: any) {
        const { options } = config;

        if (!this.mergeOptions(options)) {
            return;
        }

        this._bind();
        this.dataStore = SPA.getDataStore();
        this.createSubscription(this.options.key);
        this.loadingStatus = ko.observable();

        const data = this.dataStore.get(this.options.key)();
        this.update(data);

        return this._super();
    },

    /**
     * Setup event listeners
     *
     * @returns void
     */
    _bind() {
        $(document).on("route:*:before", this._handleLoading.bind(this));
        $(document).on("route:*:after", this._handleLoaded.bind(this));
    },

    /**
     * @param {Object} event
     * @returns void
     */
    _handleLoading(event: JQueryEventObject) {
        this.loadingStatus("is-loading");
    },

    /**
     * @param {Object} event
     * @returns void
     */
    _handleLoaded(event: JQueryEventObject) {
        this.loadingStatus(null);
    },

    /**
     * Clean child nodes to re-init ko bindings
     *
     * @returns void
     */
    _cleanChildren() {
        if (typeof this.options === "undefined" || !this.options.cleanElement) {
            return;
        }

        const target = $(this.options.cleanElement).children();
        if (target.length) {
            target.each(function(index, element) {
                ko.cleanNode(element) && ko.applyBindings({}, element);
            });
        }

        /**
         * Initialize new data-mage-init elements
         */
        $("body").trigger("contentUpdated");

        $(target).trigger(`${this.options.key}.loaded.${namespace}`, {
            selector: this.options.cleanElement
        });
    },

    /**
     * Update state with given objects key/values
     *
     * @param {Object} data
     * @returns void
     */
    update(data: {}) {
        if (!this.state.hasOwnProperty(this.options.key)) {
            this.state[this.options.key] = ko.observable();
        }
        return this.state[this.options.key](data);
    },

    /**
     * Get app block HTML as string
     *
     * @returns {String}
     */
    getValue() {
        if (!this.state.hasOwnProperty(this.options.key)) {
            this.state[this.options.key] = ko.observable();
        }

        return this.state[this.options.key]();
    },

    /**
     * Create subscription to given key
     *
     * @param {String} key - Name of block
     * @returns {*} Observable
     */
    createSubscription(key: string) {
        const blockData = this.dataStore.get(key);

        return blockData.subscribe((updatedData: any) => {
            this.update(updatedData);
            this.options.clean && this._cleanChildren();
        });
    },

    /**
     * Merge passed options with defaults
     *
     * @returns {Boolean} Success state
     */
    mergeOptions(options: BlockConfig) {
        if (typeof options.key !== "string" || options.key === "undefined") {
            throw new Error(
                "App Block: A key must be provided to subscribe for updates"
            );
        }

        this.options = $.extend(true, {}, this.options, options);
        return true;
    }
});

export = Block;
