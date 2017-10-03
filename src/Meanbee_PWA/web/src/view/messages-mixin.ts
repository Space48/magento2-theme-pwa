/**
 * Use the app-messages component for data
 */

"use strict";

import ko = require("knockout");
import $ = require("jquery");
import Messages = require("Meanbee_PWA/js/app/messages");
import Component = require("uiComponent");
import cookieMessages = require("jquery/jquery-storageapi");

const Mixin = Component => {
    return Component.extend({
        initialize() {
            this._super();
            // because typescript
            cookieMessages;

            Messages.set(this.cookieMessages);
            this.cookieMessages = Messages.getMessages();
        }
    });
};

export = Mixin;
