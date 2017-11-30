define([
    'jquery',
    'mage/translate',
], function ( $, $t ) {
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

                this.options.flyout = '.js-ajaxcart-flyout';
                this.options.flyoutMessage = '.js-ajaxcart-message';
            },

            enableAddToCartButton: function(form) {
                var addToCartButtonTextAdded = this.options.addToCartButtonTextAdded || $t('Added');
                var self = this,
                    addToCartButton = $(form).find(this.options.addToCartButtonSelector);
    
                addToCartButton.find('span').text(addToCartButtonTextAdded);
                addToCartButton.attr('title', addToCartButtonTextAdded);
    
                setTimeout(function() {
                    var addToCartButtonTextDefault = self.options.addToCartButtonTextDefault || $t('Add to Cart');
                    addToCartButton.removeClass(self.options.addToCartButtonDisabledClass);
                    addToCartButton.find('span').text(addToCartButtonTextDefault);
                    addToCartButton.attr('title', addToCartButtonTextDefault);
                }, 1000);

                var flyout = this.element.find(this.options.flyout);
                var flyoutMessage = flyout.find(this.options.flyoutMessage);

                flyout.addClass("is-active");
                flyoutMessage.text($t('Added to cart'));
            }
        });

        return $.mage.catalogAddToCart;
    };
});
