define([
    'jquery',
    "jquery/ui",
], function ( $ ) {
    'use strict';

    const _namespace = "lazyLoad";

    $.widget("meanbee." + _namespace, {
        options: {
            classes: {
                loaded: 'has-lazy-loaded'
            },
            selectors: {
                target: '[data-lazy]'
            },
            config: {
                rootMargin: '50px 0px'
            },
            observedEvents: []
        },

        _bind: function() {
            this.observer = new IntersectionObserver( this._handleIntersection.bind(this), this.options.config );
            this._createObservers();

            if ( this.options.observedEvents.length ) {
                this.options.observedEvents.forEach( item => {
                    this.element.on( item, this._sync.bind(this) );
                });
            }
        },

        _createObservers: function() {
            this.images.each( (index, image) => this.observer.observe( image ) );
        },

        _create: function () {
            this.images = this.element.find( this.options.selectors.target );
            this.imageCount = this.images.length;

            if ( !( 'IntersectionObserver' in window ) ) {
                this._loadImage( this.images );
            } else {
                this._bind();
            }
        },

        _loadImage: function( collection ) {
            $(collection).each( (index, item) => {
                let $item = $(item),
                    src = $item.data('src');

                fetch(src).then( () => {
                    $item.data('src') && $item.prop('src', $item.data('src'));
                    $item.addClass( this.options.classes.loaded );
                    $item.removeData('src');

                    this.imageCount--;
                    this.observer.unobserve( $item.get(0) );
                });
            });
        },

        _sync: function() {
            this._disconnect();
            this.images = this.element.find( this.options.selectors.target );
            this.imageCount = this.images.length;
            this._createObservers();
        },

        _disconnect: function() {
            this.observer && this.observer.disconnect();
        },

        _handleIntersection: function( entries, observer ) {
            entries.forEach( entry  => {
                if ( this.imageCount <= 0 ) {
                    this._disconnect();
                }

                if ( entry.intersectionRatio > 0 ) {
                    this._loadImage( entry.target );
                }
            });
        },

        destroy: function() {
            this._disconnect();
        }

    });

    return $.meanbee[_namespace];
});
