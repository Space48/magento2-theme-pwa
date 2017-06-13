define([
    'ko'
], function ( ko ) {
    'use strict';

    return {
        state: null,

        /**
         * @override
         */
        initialize: function () {
            this.state = this.bind();
            return this._super();
        },

        bind: function() {
            this.state = ko.observable( {} );
        },

        getMessages: function() {
            if ( !this.state ) {
                this.bind();
            }
            return this.state;
        },

        /**
         * Update state
         *
         * @param {Object} data
         * @returns void
         */
        set: function( data ) {
            if ( !this.state ) {
                this.bind();
            }
            this.state( data );
        }
    };
});
