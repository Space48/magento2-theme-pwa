/**
 * Request data reload for form submissions
 */

"use strict";

import $ = require("jquery");
import _ = require("underscore");

// References
import HistoryTracker = require("../history");
import Router = require("../router");

const Form = (function() {
    let history: HistoryTracker;
    let router: Router;
    let eventNamespace: string = "Form";

    /**
     * @param {Router} router
     */
    function init(router: Router) {
        router = router;
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
        $(document).on(`submit.${eventNamespace}`, _handleSubmit.bind(Form));
        $(document).on(
            `click.${eventNamespace}`,
            'form button:not([type="button"]), form input[type="submit"]',
            _handleClickFormSubmit.bind(Form)
        );
    }

    /**
     * Pass clicked form button name as event data
     *
     * @param {Object} event
     * @return void
     */
    function _handleClickFormSubmit(event: JQueryEventObject) {
        const target = event.currentTarget;
        const form = target.closest("form");
        const name = $(target).prop("name");
        const data = [];

        if (!form) {
            return;
        }

        name &&
            data.push({
                name,
                value: "1"
            });

        $(form).trigger("submit", data);
        return false;
    }

    /**
     * Request route data on form submission
     *
     * @param {Object} event
     * @return void
     */
    function _handleSubmit(
        event: JQueryEventObject,
        data: JQuery.NameValuePair
    ) {
        const form = $(event.target).is("form");
        const formTarget = $(event.target);
        const formAction = formTarget.prop("action") || null;

        if (!form || !formAction) {
            return;
        }

        const url = new URL(formAction);
        if (url.origin !== location.origin) {
            return;
        }

        event.preventDefault();
        const formMethod = formTarget.prop("method") || "post";
        const additionalData = [data];
        const formData = formTarget.serializeArray().concat(additionalData);

        router.invalidateMessages();
        router.resolve({
            data: formData,
            method: formMethod,
            url: url.href
        });
    }

    /**
     * Cleanup object manipulations
     *
     * @return void
     */
    function destroy() {
        $(document).off(`submit.${eventNamespace}`);
        $(document).off(`click.${eventNamespace}`);
    }

    return init;
})();

export = Form;
