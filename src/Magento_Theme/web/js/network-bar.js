define([
    'jquery',
    "jquery/ui",
], function ( $ ) {
    'use strict';

    const _namespace = "networkBar";

    $.widget("meanbee." + _namespace, {
        options: {
            classes: {
                offline: 'is-offline'
            }
        },

        _create: function () {
            this._bind();
        },

        _bind: function() {
            $(window).on('offline.' + _namespace, this._setOffline.bind(this));
            $(window).on('online.' + _namespace, this._setOnline.bind(this));
        },

        _destroy: function() {
            $(window).off('offline.' + _namespace);
            $(window).off('online.' + _namespace);
        },

        _setOnline: function( event ) {
            this.element.removeClass( this.options.classes.offline );
        },

        _setOffline: function( event ) {
            this.element.addClass( this.options.classes.offline );
        },

    });

    return $.meanbee.networkBar;
});