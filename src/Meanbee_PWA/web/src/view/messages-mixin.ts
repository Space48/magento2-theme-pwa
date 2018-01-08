/**
 * Use the app-messages component for data
 */

"use strict";

import Messages = require("Meanbee_PWA/js/app/messages");
import cookieMessages = require("jquery/jquery-storageapi");

const Mixin = (Component: any) => {
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
