/**
 * History API wrapper for handling current, previous
 * and next route states
 */

"use strict";

import $ = require("jquery");
import _ = require("underscore");
import ko = require("knockout");

class HistoryTracker {
    state: {
        currentIndex: KnockoutObservable<number>;
        previousIndex: KnockoutObservable<number>;
        history: KnockoutObservableArray<{}>;
    };
    history: History;
    location: Location;
    started: boolean;
    root: RootConfig;
    eventNamespace: string;

    /**
     * Start tracking history
     *
     * @param {Object} config
     */
    constructor(config: HistoryConfig) {
        this.state = {
            currentIndex: ko.observable(-1),
            history: ko.observableArray(),
            previousIndex: ko.observable(-1)
        };

        this.root = config.root;
        if (typeof this.root.url == "string") {
            this.root.url = new URL(this.root.url);
        } else {
            this.root.url = this.root.url;
        }

        this.history = window.history;
        this.location = window.location;

        if ("scrollRestoration" in this.history) {
            this.history.scrollRestoration = "manual";
        }

        this._bindListeners();

        // Add the current page
        this.state.history.push({
            state: {},
            title: "",
            url: new URL(this.location.href)
        });
        this.state.currentIndex(0);

        return this;
    }

    /**
     * Is the requested URL permitted
     *
     * @param {URL} url
     * @returns {Boolean}
     */
    _isSameOrigin(url: URL) {
        return url.origin === this.root.url.origin;
    }

    /**
     * Create DOM listeners
     *
     * @return void
     */
    _bindListeners() {
        $(window).on(
            `popstate.${this.eventNamespace}`,
            this._handlePopState.bind(this)
        );
    }

    /**
     * Request update on history back/forward event
     *
     * @param {Object} event
     * @return void
     */
    _handlePopState(event: any) {
        const url = new URL(this.location.href);
        const previous = this.getPrevious();
        const next = this.getNext();

        if (_.isEmpty(previous) && _.isEmpty(next)) {
            const state = <PopStateEvent>event.state ? event.state : {};

            return this.replace({
                state,
                title: "",
                url
            });
        }

        return this._updateIndexes(url, previous, next);
    }

    /**
     * Update internal history pointers
     *
     * @param {URL} url
     * @return {Int} Updated current index
     */
    _updateIndexes(url: URL, previous: HistoryEntry, next: HistoryEntry) {
        const index = this.state.currentIndex;
        const previousIndex = this.state.previousIndex;

        previousIndex(index());

        const prevUrl = previous && previous.url && previous.url.href;
        const nextUrl = next && next.url && next.url.href;

        if (prevUrl === url.href) {
            return index(index() - 1);
        }

        if (nextUrl === url.href) {
            return index(index() + 1);
        }

        // At this point, there is browser history but
        // we don't have it stored!
        return index(0);
    }

    /**
     * Get the internal history arrays length
     *
     * @returns {Int}
     */
    getLength() {
        return this.state.history().length;
    }

    /**
     * Get history entry object at given index
     *
     * @param {Int}
     * @returns {Object|Boolean}
     */
    get(index: number) {
        const entry = this.state.history.slice(index, index + 1);

        return entry && (<any>Object).assign({}, ...entry);
    }

    /**
     * Get current history entry object
     *
     * @returns {Object|Boolean}
     */
    getCurrent() {
        const index = this.state.currentIndex();

        return this.get(index);
    }

    /**
     * Get previous history entry object
     *
     * @returns {Object|Boolean}
     */
    getPrevious() {
        const index = this.state.currentIndex();
        const current =
            this.getLength() > 1 && this.state.history.slice(index - 1, index);

        return current && (<any>Object).assign({}, ...current);
    }

    /**
     * Get next history entry object
     *
     * @returns {Object|Boolean}
     */
    getNext() {
        const index = this.state.currentIndex();
        const current =
            this.getLength() > 1 &&
            this.state.history.slice(index + 1, index + 2);

        return current && (<any>Object).assign({}, ...current);
    }

    /**
     * Replace the current history entry
     *
     * @param {Object} history - History state
     */
    replace(history: HistoryEntry) {
        const { state, title, url } = history;

        if (!this._isSameOrigin(url)) {
            throw new Error("History cannot replace on a different origin");
        }

        this.history.replaceState(state, title, url.href);
        this.state.history.splice(this.state.currentIndex(), 1, history);
    }

    /**
     * Add a new history entry to the end of the stack
     *
     * @param {Object} state - History state
     */
    push(history: HistoryEntry) {
        let { state } = history;
        const { title, url } = history;
        const currentIndex = this.state.currentIndex();

        if (!this._isSameOrigin(url)) {
            throw new Error("History cannot replace on a different origin");
        }

        state = state || { scrollY: 0 };

        // Do not add a new entry if the requested page is the same
        if (url.href === this.location.href) {
            return;
        }

        // Remove forward entries if previously navigated back
        this.state.history.splice(currentIndex + 1, this.getLength());

        this.history.pushState(state, title, url.href);
        this.state.history.push(history);

        this.state.previousIndex(currentIndex);
        return this.state.currentIndex(currentIndex + 1);
    }

    /**
     * Move back in history
     * @return {void}
     */
    back() {
        const currentIndex = this.state.currentIndex();

        if (currentIndex - 1 < 0) {
            this.push(this.root);
            this.history.go(0);
            return -1;
        }

        return this.history.back();
    }

    /**
     * Move forward in history
     * @return {Int} Current index of history
     */
    forward() {
        const currentIndex = this.state.currentIndex();

        this.history.forward();
        this.state.previousIndex(currentIndex);
        return this.state.currentIndex(currentIndex + 1);
    }

    /**
     * Update given observable with a match status
     *
     * @param {String} path - Path to match
     * @param {*} observable - Observable to update
     * @returns {function}
     */
    watch(path: string, observable: KnockoutObservable<boolean>) {
        return this.state.currentIndex.subscribe(update => {
            const current = this.getCurrent();
            const url = !_.isEmpty(current) && current.url;
            const status = url && url.pathname === path;

            observable(status);
        });
    }

    /**
     * Call all listeners when the currentIndex changes
     *
     * @param {String} fn - Call function
     * @returns {function}
     */
    listen(fn: Function, context: any) {
        return this.state.currentIndex.subscribe(update => {
            let current = this.getCurrent();
            const previousIndex = this.state.previousIndex();
            const from = this.get(previousIndex);

            if (_.isEmpty(current)) {
                current = this.root;
            }

            return fn.call(context, current, from);
        }, this);
    }

    destroy() {
        $(window).off(`popstate.${this.eventNamespace}`);
    }
}

export = HistoryTracker;
