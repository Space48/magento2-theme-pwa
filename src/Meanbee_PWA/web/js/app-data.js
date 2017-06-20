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
         * @param {Array} array - Array of objects
         * @return {FormData}
         */
        serializedArrayToFormData: function( array ) {
            let formData = new FormData();

            _.each( array, function( obj, key ) {
                if ( obj['name'] && obj['value'] ) {
                    formData.append( obj['name'], obj['value'] );
                }
            });

            return formData;
        },

        /**
         * @param {String} url
         * @param {Array} data - Serialized array of data
         * @return {*}
         */
        postToServer: function( url, data ) {
            data.push( { name: 'service_worker', value: true } );
            let body = this.serializedArrayToFormData( data );

            return fetch( url, {
                method: 'post',
                body: body,
                credentials: 'include'
            })
            .catch(function( error ) {
                return new Error( error );
            });
        },

        /**
         * @param {String} url
         * @return {*}
         */
        getFromServer: function( url ) {
            var url = new URL( url );
            var params = {
                'service_worker': true
            };
            Object.keys( params ).forEach( key => url.searchParams.append( key, params[key] ) );

            return fetch( url , {
                method: 'get',
                credentials: 'include'
            })
            .catch(function( error ) {
                return new Error( error );
            });
        },

        /**
         * @param {*} response
         * @param {String} textStatus
         * @param {Object} jqXHR
         * @return {*}
         */
        handleJson: function( json ) {
            if ( json['content'] ) {
                return json;
            }

            if ( json['backUrl'] ) {
                return this.getFromServer( json['backUrl'] );
            }
            
            return false;
        },

        /**
         * @param {String} error
         * @return {Object}
         */
        handleError: function( error ) {
            throw new Error( error );
        },

        /**
         * @param {Object} response
         * @return {*}
         */
        handleRedirects: function( response ) {
            if ( response.redirected ) {
                return this.getFromServer( response.url ).then( this.handleRedirects.bind( this ) );
            }

            return response.json();
        },

        /**
         * @param {String} url
         * @param {Array} data - Serialized array of data objects
         * @return {*}
         */
        fetch: function( url, data ) {
            let req;
            
            if ( data ) {
                req = this.postToServer( url, data );
            } else {
                req = this.getFromServer( url );
            }
            
            return req
                .then( this.handleRedirects.bind( this ) )
                .then( this.handleJson.bind( this ) )
                .then( this.update.bind( this ) )
                .catch( this.handleError.bind( this ) );
        }
    };

    return appData;
});
