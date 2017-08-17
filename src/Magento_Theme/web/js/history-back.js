define([
    'jquery'
], function ( $ ) {

    return function( config, element ) {
        'use strict';

        const _namespace = "historyBack";

        $(element).on('click.' + _namespace, function() {
            history.back();
        });
    }

});
