define([
    'uiComponent',
    'jquery',
    'ko',
    'Meanbee_PWA/js/app-data'
], function ( Component, $, ko, appData ) {
    'use strict';

    return Component.extend({
        /**
         * @override
         */
        initialize: function () {
            let headObservable = appData.get( 'assets' ),
                headData = headObservable();

            this.headItems = ko.observableArray();
            this.pwaShell = ko.observable();

            headObservable.subscribe(function( updatedData ) {
                let data = this.htmlStringToArray( updatedData );
                this.update( data );
                this.pwaShell( true );
            }.bind( this ));

            this.update( this.htmlStringToArray( headData ) );

            return this._super();
        },

        /**
         * Break html string by newline
         *
         * @param {String} string
         * @returns Array
         */
        htmlStringToArray: function( string ) {
            if ( typeof (string) !== "string" ) {
                return;
            }
                
            return string.split('\n');
        },

        /**
         * @param {String} key
         * @returns {*}
         */
        getProp: function( prop ) {
            if ( !_.isUndefined( prop ) ) {
                if ( !this.hasOwnProperty( prop ) ) {
                    this[prop] = ko.observable();
                }
            }

            return this[prop]();
        },

        /**
         * Update head elements that have changed
         * in the response
         *
         * @param {Array} data
         * @returns void
         */
        update: function( data = [] ) {
            let currentArray = this.headItems();

            data.filter( ( value, index ) => {
                return currentArray.indexOf( value ) === -1;
            }).forEach( ( value, index ) => {
                value.length && this.headItems.push( value );
            });

            currentArray.filter( ( value, index ) => {
                return data.indexOf( value ) === -1;
            }).forEach( (value, index) => {
                this.headItems.remove( value );
            });
        }
    });
});
