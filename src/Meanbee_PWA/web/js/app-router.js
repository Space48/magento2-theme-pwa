define([
    'jquery',
    'underscore',
    'Meanbee_PWA/js/app-data',
    'Meanbee_PWA/js/app-messages',
    'Magento_Customer/js/customer-data'
], function ( $, _, appData, appMessages, customerData ) {

    function clickNavigate( url ) {
        if ( url.origin == location.origin ) {
            event.preventDefault();

            history.replaceState(
                { scrollY: window.scrollY },
                document.title,
                document.location.href
            );

            router.fetch( url.href ).then( addHistory ).then(function() {
                customerData.set( 'messages', {} );
                appMessages.set( '' );
            });
        }
    };

    function addHistory( data ) {
        if ( data.meta.url !== document.location.href ) {
            history.pushState( {}, data.meta.title, data.meta.url );
        }
        return data;
    };

    $(document).on('locationChange', function( event, data ) {
        if ( data && data.href ) {
            const url = new URL( data.href );
            clickNavigate( url );
        }
    });

    $(document).on('click', 'a', function ( event ) {
        if ( event.currentTarget.href ) {
            const url = new URL(event.currentTarget.href);
            clickNavigate( url );
        }
    });

    $(document).on('ajaxComplete router.fetchComplete', function ( event, xhr, settings ) {
        var cookies = $.cookieStorage.get('mage-messages');

        cookies && cookies.length && appMessages.set( cookies );
        $.cookieStorage.set('mage-messages', "");
    });

    // Pass the buttons name as additional data to form submits
    $(document).on('click', 'form button, form input[type="submit"]', function ( event ) {
        $(this.form).trigger('submit', {
            [this.name]: "1"
        });
        return false;
    });
    
    $(document).on('submit', function ( event, data ) {
        const form = $( event.target ).is( 'form' ) ? $( event.target ) : false,
              formAction = form.prop( 'action' ) ? form.prop( 'action' ) : false;

        if ( !formAction ) {
            return;
        }

        const url = new URL( formAction );
        if ( url.origin == location.origin ) {
            event.preventDefault();

            appMessages.set( '' );
            $.cookieStorage.set('mage-messages', "");
            
            var formData = form.serializeArray();
            if ( data ) {
                _.each( data, function ( value, key ) {
                    formData.push( { name: key, value: value } );
                });
            }
            router.fetch( url.href, formData ).then( addHistory );
        }
    });

    window.addEventListener('popstate', function ( event ) {
        router.fetch( document.location.href ).then( scroll.bind( null, event ) ).then(function() {
            customerData.set( 'messages', {} );
        });

        function scroll( event ) {
            event.state && window.scrollTo( 0, event.state.scrollY );
        }
    });

    var router = {
        state: {
            title: null,
            url: null
        },

        /**
         * Router initialization
         */
        init: function() {
            var routerData = appData.get( 'meta' );

            routerData.subscribe(function( updatedState ) {
                this.update( updatedState );
                document.title = this.state[ 'title' ];
            }.bind( this ) );
        },

        /**
         * @param {Object} data
         */
        update: function( data ) {
            _.each( data, function ( value, key ) {
                this.state[ key ] = value;
            }.bind( this ) );
            
            return data;
        },

        /**
         * @param {Object} data
         */
        handleLoadResponse: function( data ) {
            let body = $('body');
            body.removeClass('is-loading').addClass('has-loaded');

            // Re-sync our form keys
            body.formKey('destroy').formKey();
            
            body.trigger('router.fetchComplete');
            return data;
        },

        /**
         * @param {String} url
         * @param {Object} [data=null]
         */
        fetch: function( url, data = null ) {
            $('body').removeClass('has-loaded').addClass('is-loading');

            return appData.fetch( url, data ).then( this.handleLoadResponse );
        },

        /**
         * @constructor
         */
        'Meanbee_PWA/js/app-router': function () {
            router.init();
        }
    }

    return router;

});