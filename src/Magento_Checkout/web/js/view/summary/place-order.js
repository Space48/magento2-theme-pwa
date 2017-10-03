define(
    [
        'jquery',
        'uiComponent',
        'ko',
        'uiRegistry',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Ui/js/modal/alert',
        'mage/translate'
    ],
    function (
        $,
        Component,
        ko,
        registry,
        quote,
        additionalValidators,
        alert,
        $t
    ) {
        'use strict';

        return Component.extend({
            placeOrder: function () {
                var paymentMethod = quote.getPaymentMethod()();
                var methodCode = paymentMethod ? paymentMethod.method : false;

                if (!methodCode) {
                    alert({content: $t('No payment method selected')});
                    return;
                }

                var methodComponent = registry.get('checkout.steps.billing-step.payment.payments-list.' + methodCode);

                if (methodComponent
                    && methodComponent.hasOwnProperty('isReviewRequired')
                    && !methodComponent.isReviewRequired()
                ) {
                    $('.payment-method._active .actions-toolbar:not([style*="display: none"]) button[type=submit]').click();
                    return;
                }

                if (!additionalValidators.validate()) {
                    return false;
                }

                if (quote.isVirtual()) {
                    this._savePaymentAndPlaceOrder();
                }
                else {
                    var shippingAddress = registry.get('checkout.steps.shipping-step.shippingAddress');
                    if (shippingAddress.validateShippingInformation()) {
                        this._savePaymentAndPlaceOrder();
                    }
                }
            },

            _savePaymentAndPlaceOrder: function () {
                $('.payment-method._active button[type=submit]').click();
            },

            isPlaceOrderActionAllowed: function () {
                return quote.paymentMethod();
            }
        });
    }
);
