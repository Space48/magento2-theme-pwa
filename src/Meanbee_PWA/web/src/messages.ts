/**
 * Flash messages storage as ko observables
 */

"use strict";

import ko = require("knockout");

const Messages = {
    state: ko.observable(),

    /**
     * Retrieve messages observable
     *
     * @returns {*} Observable
     */
    getMessages() {
        return this.state;
    },

    /**
     * Set state to given data
     *
     * @param {Object} data
     * @returns void
     */
    set(data: any) {
        return this.state(data);
    }
};

export = Messages;
