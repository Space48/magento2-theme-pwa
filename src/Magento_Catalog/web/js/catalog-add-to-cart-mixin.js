define([
    'jquery'
], function ( $ ) {
    'use strict';

    return function (widget) {
        "use strict";

        $.widget('mage.catalogAddToCart', widget, {

            _bindSubmit: function() {
                var self = this;
                this.element.on('submit', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.submitForm($(this));
                });
            }
        });

        return $.mage.catalogAddToCart;
    };
});
