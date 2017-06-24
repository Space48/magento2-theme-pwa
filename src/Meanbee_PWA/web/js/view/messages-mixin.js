define([
    'ko',
    'jquery',
    'Meanbee_PWA/js/app-messages',
    'jquery/jquery-storageapi'
], function (ko, $, appMessages) {
    'use strict';

    return function(Component) {
        return Component.extend({
            initialize: function() {
                this._super();

                appMessages.set(this.cookieMessages);
                this.cookieMessages = appMessages.getMessages();
            }
        });
    }
});