define([
    'jquery',
    'Meanbee_PWA/js/app-data',
    'Magento_Customer/js/customer-data'
], function ( $, appData, customerData ) {

    $(document).on('click', 'a', function ( event ) {
        const url = new URL( event.currentTarget.href );

        if ( url.origin == location.origin ) {
            event.preventDefault();

            history.replaceState(
                { scrollY: window.scrollY },
                document.title,
                document.location.href
            );

            router.load( url.href ).then( addHistory ).then(function() {
                customerData.set( 'messages', {} );
            });
        }
    });

    $(document).on('submit', function ( event ) {
        const form = $( event.target ).is( 'form' ) ? $( event.target ) : false;
        const formAction = form.prop( 'action' ) ? form.prop( 'action' ) : false;

        if ( !formAction ) {
            return;
        }

        const url = new URL( formAction );
        if ( url.origin == location.origin ) {
            event.preventDefault();
            router.load( url.href, form.serializeArray() ).then( addHistory );
        }
    });

    window.addEventListener('popstate', function ( event ) {
        router.load( document.location.href ).then( scroll.bind( null, event ) ).then(function() {
            customerData.set( 'messages', {} );
        });

        function scroll( event ) {
            if ( event.state ) {
                window.scrollTo( 0, event.state.scrollY );
            }
        }
    });

    function addHistory( data ) {
        if ( data.meta.url !== document.location.href ) {
            history.pushState( {}, data.meta.title, data.meta.url );
        }
        return data;
    };

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
            $('body').removeClass('is-loading').addClass('has-loaded');
            return data;
        },

        /**
         * @param {String} url
         * @param {Object} [data=null]
         */
        load: function( url, data = null ) {
            $('body').removeClass('has-loaded').addClass('is-loading');

            if ( data ) {
                return appData.reloadPost( url, data ).then( this.handleLoadResponse );
            }

            return appData.reloadFetch( url ).then( this.handleLoadResponse );
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