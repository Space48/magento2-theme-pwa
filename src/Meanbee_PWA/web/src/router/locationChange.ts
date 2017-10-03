/**
 * Request history change through location events
 */

"use strict";

import $ = require("jquery");
import _ = require("underscore");

// References
import HistoryTracker = require("../history");
import Router = require("../router");

const LocationChange = (function() {
    let history: HistoryTracker;
    let eventNamespace: string = "LocationChange";

    /**
     * @param {Router} router
     */
    function init(router: Router) {
        history = router.getHistory();
        _bind();

        const public_api = {
            destroy: destroy
        };

        return public_api;
    }

    /**
     * Setup document listeners to intercept actions
     */
    function _bind() {
        $(document).on(
            `locationChange.${eventNamespace}`,
            handleLocationChange.bind(LocationChange)
        );
    }

    /**
     * Request navigate instead of location global call
     *
     * @param {Object} event
     * @param {Object} data
     * @return void
     */
    function handleLocationChange(
        event: JQueryEventObject,
        data: LocationEvent
    ) {
        if (!data || !data.href) {
            return;
        }

        const url = new URL(data.href);
        if (url.origin !== location.origin) {
            return;
        }

        event.preventDefault();
        history.push({
            state: {},
            title: "",
            url
        });
    }

    /**
     * Cleanup object manipulations
     *
     * @return void
     */
    function destroy() {
        $(document).off(`locationChange.${eventNamespace}`);
    }

    return init;
})();

export = LocationChange;
