define([
    'jquery',
    'underscore',
    'ko'
], function ( $, _, ko ) {
    var appData = {
        state: {},

        /**
         * @param {String} key
         */
        bind: function( key ) {
            this.state[ key ] = ko.observable( {} );
        },

        /**
         * @param {String} key
         */
        get: function( key ) {
            if (!this.state[ key ]) {
                this.bind( key );
            }
            return this.state[ key ];
        },

        /**
         * @return {Array}
         */
        keys: function() {
            return _.keys( this.state );
        },

        /**
         * @param {String} key
         * @param {*} value
         */
        notify: function ( key, value ) {
            if ( !this.state[ key ] ) {
                this.bind( key );
            }
            this.state[ key ]( value );
        },

        /**
         * @param {Object} data
         */
        update: function( data ) {
            if ( data ) {
                _.each( data, function( value, key ) {
                    this.notify( key, value );
                }.bind( this ));
            }

            return data;
        },

        /**
         * @param {String} url
         * @param {Object} data
         * @return {*}
         */
        postToServer: function( url, data ) {
            data.push( { name: 'service_worker', value: true } );

            return $.ajax({
                url: url,
                method: 'post',
                data: data
            })
            .fail(function( jqXHR ) {
                return new Error( jqXHR );
            });
        },

        /**
         * @param {String} url
         * @return {*}
         */
        getFromServer: function( url ) {
            return $.ajax({
                url: url,
                dataType: 'JSON',
                data: {
                    service_worker: 'true'
                },
                cache: true
            })
            .fail(function ( jqXHR ) {
                return new Error( jqXHR );
            });
        },

        /**
         * @param {*} response
         * @param {String} textStatus
         * @param {Object} jqXHR
         * @return {*}
         */
        handleResponse: function( response, textStatus, jqXHR ) {
            try {
                var data = JSON.parse( jqXHR.responseText );

                if ( data['content'] ) {
                    return data;
                }

                if ( data['backUrl'] ) {
                    return this.getFromServer.call( this, data['backUrl'] );
                }

                return this.getFromServer.call( this, document.location.href );
            } catch( e ) {
                return this.getFromServer( document.location.href );
            }
        },

        /**
         * @param {String} url
         * @param {Object} data
         * @return {*}
         */
        reloadPost: function( url, data ) {
            return this.postToServer( url, data ).then( this.handleResponse.bind( this ) ).then( this.update.bind( this ) );
        },

        /**
         * @param {String} url
         * @return {*}
         */
        reloadFetch: function( url ) {
            return this.getFromServer( url ).then( this.update.bind( this ) );
        }
    };

    return appData;
});
