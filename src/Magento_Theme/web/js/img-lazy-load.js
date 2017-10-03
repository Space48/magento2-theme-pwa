define([
    'jquery',
    "jquery/ui",
], function ( $ ) {
    'use strict';

    const _namespace = "lazyLoad";

    $.widget("meanbee." + _namespace, {
        options: {
            classes: {
                beforeLoad: 'has-resolved',
                afterLoad: 'has-loaded',
            },
            selectors: {
                target: '[data-lazy]'
            },
            config: {
                rootMargin: '20px 0px'
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
            this.targets.each( (index, target) => {
                let $image = $(target).find('img');
                
                this.observer.observe( target );
                $image.on('load', this._handleLoad.bind( this ));
            })
        },

        _create: function () {
            this.targets = this.element.find( this.options.selectors.target );
            this.targetsCount = this.targets.length;

            if ( !( 'IntersectionObserver' in window ) ) {
                this._loadImage( this.targets );
            } else {
                this._bind();
            }
        },

        _loadImage: function( collection ) {
            $(collection).each( (index, item) => {
                let $item = $(item),
                    $img = $(item).find('img'),
                    src = $img.data('src');

                fetch(src).then( () => {
                    $item.addClass( this.options.classes.beforeLoad );
                    $img.data('src') && $img.prop('src', $img.data('src'));
                    $img.attr('data-src', '');

                    this.targetsCount--;
                    this.observer.unobserve( $item.get(0) );
                });
            });
        },

        _sync: function() {
            this._disconnect();
            this.targets = this.element.find( this.options.selectors.target );
            this.targetsCount = this.targets.length;
            this._createObservers();
        },

        _disconnect: function() {
            this.observer && this.observer.disconnect();
        },

        _handleIntersection: function( entries, observer ) {
            entries.forEach( entry  => {
                if ( this.targetsCount <= 0 ) {
                    this._disconnect();
                }

                if ( entry.intersectionRatio > 0 ) {
                    this._loadImage( entry.target );
                }
            });
        },

        _handleLoad: function( event ) {
            let $image = $(event.currentTarget);

            $image.addClass( this.options.classes.afterLoad );
        },

        destroy: function() {
            this._disconnect();
        }

    });

    return $.meanbee[_namespace];
});
