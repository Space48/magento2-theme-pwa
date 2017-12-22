/**
 * Navigate to previous route history if available
 */

"use strict";

import ko = require("knockout");
import Component = require("uiComponent");
import SPA = require("spa");

const Back = Component.extend({
    /**
     * @override
     */
    initialize(config: any) {
        const options = config && config.options;
        const excludes = options && options.excludeUrl;
        const excludeUrl = new URL(excludes);

        this.baseUrl = options && options.baseUrl;
        this.pathMatch = ko.observable();
        this.shouldShow = ko.computed(() => {
            if (
                this.pathMatch() ||
                document.location.pathname === excludeUrl.pathname
            ) {
                return false;
            }

            return true;
        }, this);

        this.history = SPA.getHistory();
        this.history && this.history.watch(excludeUrl.pathname, this.pathMatch);

        return this._super();
    },

    /**
     * Perform a history back request
     */
    navigate() {
        if (!this.history) {
            let previousUrl = this.baseUrl;

            const referrer = document.referrer && new URL(document.referrer);
            if (referrer && referrer.origin === location.origin) {
                previousUrl = referrer;
            }

            return location.assign(previousUrl);
        }

        return this.history.back();
    }
});

export = Back;
