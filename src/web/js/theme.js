/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'domReady!'
], function ( $ ) {
    'use strict';

    if ( !$('body').hasClass('pwa-shell-index-index') ) {
        $(document).on('locationChange', function( event, data ) {
            if ( data && typeof( data.func ) == 'function' ) {
                data.func();
            }
        });
    }
});
