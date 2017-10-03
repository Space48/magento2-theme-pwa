/**
 * Request history change through link elements
 */

"use strict";

import $ = require("jquery");
import _ = require("underscore");

// References
import HistoryTracker = require("../history");
import Router = require("../router");

const Link = (function() {
    let history: HistoryTracker;
    let eventNamespace: string = "Link";

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
            `click.${eventNamespace}`,
            "a",
            handleDocumentClick.bind(Link)
        );
    }

    /**
     * Request navigate if location exists
     *
     * @param {Object} event
     * @return void
     */
    function handleDocumentClick(event: JQueryEventObject) {
        const target = $(event.currentTarget);
        if (!target.prop("href")) {
            return;
        }

        const targetUrl = new URL(target.prop("href"));
        const location = new URL(window.location.href);
        const currentUrl = new URL(location.href);

        if (targetUrl.origin !== currentUrl.origin) {
            return;
        }

        event.preventDefault();

        // Save the current page position
        // before requesting a new history entry
        history.replace({
            state: {
                scrollY: window.scrollY
            },
            title: "",
            url: location
        });

        history.push({
            state: {},
            title: "",
            url: targetUrl
        });
    }

    /**
     * Cleanup object manipulations
     *
     * @return void
     */
    function destroy() {
        $(document).off(`click.${eventNamespace}`);
    }

    return init;
})();

export = Link;
