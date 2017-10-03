define([
    "require",
    "jquery",
    "matchMedia"
], function ( require, $, mediaCheck ) {
    'use strict';

    return function( config, element ) {
        mediaCheck({
            media: '(max-width: 640px)',
            entry: function () {
                // Destroy our dropdown instance
                if ( $(element).is( ":data('mageDropdownDialog')" ) ) {
                    $(element).dropdownDialog('destroy');
                    // Forgive me for I have sinned. This is because the dropdownDialog
                    // widget does not namespace it's observed events OR destroy
                    // their functionality correctly :^(
                    $('.showcart').off('click');
                }

                $(element).addClass('is-hidden');
            },
        });

        mediaCheck({
            media: '(min-width: 640px)',
            entry: function () {
                // Create our dropdown instance
                require(['mage/dropdown'], function () {
                    $(element).dropdownDialog(config).removeClass('is-hidden');
                });
            }
        });
    };
});
