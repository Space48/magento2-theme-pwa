define([
    'ko',
    'Meanbee_PWA/js/app-messages'
], function (ko, appMessages) {
    'use strict';

    return function(Component) {
        return Component.extend({
            initialize: function() {
                this._super();

                this.cookieMessages = appMessages.getMessages();
            }
        });
    }
});