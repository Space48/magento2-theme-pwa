define([
    'jquery',
    'Magento_Ui/js/modal/confirm'
], function ( $, confirm ) {
    'use strict';

    return function (widget) {
        $.widget('mage.address', widget, {
            _addAddress: function() {
                this.element.trigger('locationChange', {
                    href: this.options.addAddressLocation,
                    func: function() {
                        window.location = this.options.addAddressLocation;
                    }
                })
            },

            /**
             * Delete the address whose id is specified in a data attribute after confirmation from the user.
             * @private
             * @param {Event}
             * @return {Boolean}
             */
            _deleteAddress: function(e) {
                var self = this;

                confirm({
                    content: this.options.deleteConfirmMessage,
                    actions: {
                        confirm: function() {
                            if (typeof $(e.target).parent().data('address') !== 'undefined') {
                                var location = self.options.deleteUrlPrefix + $(e.target).parent().data('address')
                                    + '/form_key/' + $.mage.cookies.get('form_key');
                            }
                            else {
                                var location = self.options.deleteUrlPrefix + $(e.target).data('address')
                                    + '/form_key/' + $.mage.cookies.get('form_key');
                            }

                            this.element.trigger('locationChange', {
                                href: location,
                                func: function() {
                                    window.location = location
                                }
                            });
                        }.bind(this)
                    }
                });

                return false;
            }
        });
        
        return $.mage.address;
    }
});
