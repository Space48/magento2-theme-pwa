define([
    'uiComponent',
    'jquery',
    'mage/apply/main',
    'ko',
    'Meanbee_PWA/js/app-data'
], function ( Component, $, mage, ko, appData ) {
    'use strict';

    function reload() {
        var $target = $('#maincontent'),
            target = $target.get(0);
        // Clean the app target of ko descendant bindings
        // so that we can create a new descendant binding context
        // for the updated content
        if ( target ) {
            ko.cleanNode( target );
            ko.applyBindings( {}, target );
        }

        // Initialize all data-mage-init elements.
        // This will fetch all require.js modules for these elements and
        // run their corresponding js/plugin constructors
        $('body').trigger( 'contentUpdated' );
        $target.trigger('app.contentLoaded');
    }

    return Component.extend({
        state: {},

        /**
         * @override
         */
        initialize: function () {
            var contentData = appData.get( 'content' );

            contentData.subscribe(function( updatedData ) {
                this.update( updatedData );
                reload();
            }.bind( this ));

            appData.fetch( document.location );

            return this._super();
        },

        /**
         * Update app data
         *
         * @param {Object} data
         * @returns void
         */
        update: function( data ) {
            if (!this.state.hasOwnProperty( 'content' )) {
                this.state[ 'content' ] = ko.observable();
            }
            this.state[ 'content' ]( data );
        },

        /**
         * Get app content
         * @returns {*}
         */
        getContent: function() {
            if (!this.state.hasOwnProperty( 'content' )) {
                this.state[ 'content' ] = ko.observable();
            }
            return this.state[ 'content' ]();
        }
    });
});
