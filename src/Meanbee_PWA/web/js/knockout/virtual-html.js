define([
    'ko',
    'underscore',
    'mage/apply/main',
    'Magento_Ui/js/lib/knockout/template/renderer'
], function (ko, _, mage, renderer) {
    'use strict';

    /**
     * Set html to virtual element.
     *
     * @param {HTMLElement} el - Virtual element to apply bindings to.
     * @param {Function} html - Observable html content.
     */
    function setHtml(el, html) {
        ko.virtualElements.emptyNode(el);
        html = ko.utils.unwrapObservable(html);

    if (!_.isNull(html) && !_.isUndefined(html)) {
            if (!_.isString(html)) {
                html = html.toString();
            }

            html = document.createRange().createContextualFragment(html);
                ko.virtualElements.prepend(el, html);
        }
    }

    /**
     * Apply bindings and call magento attributes parser.
     *
     * @param {HTMLElement} el - Element to apply bindings to.
     * @param {ko.bindingContext} ctx - Instance of ko.bindingContext, passed to binding initially.
     */
    function applyComponents(el, ctx) {
        ko.utils.arrayForEach(ko.virtualElements.childNodes(el), ko.cleanNode);
        ko.applyBindingsToDescendants(ctx, el);
        mage.apply();
    }

    ko.bindingHandlers.virtualHtml = {
        /**
         * Scope binding's init method.
         *
         * @returns {Object} - Knockout declaration for it to let binding control descendants.
         */
        init: function () {
            return {
                controlsDescendantBindings: true
            };
        },

        /**
         * Reads params passed to binding.
         * Set html to node element, apply bindings and call magento attributes parser.
         *
         * @param {HTMLElement} el - Element to apply bindings to.
         * @param {Function} valueAccessor - Function that returns value, passed to binding.
         * @param {Object} allBindings - Object, which represents all bindings applied to element.
         * @param {Object} viewModel - Object, which represents view model binded to el.
         * @param {ko.bindingContext} bindingContext - Instance of ko.bindingContext, passed to binding initially.
         */
        update: function (el, valueAccessor, allBindings, viewModel, bindingContext) {
            setHtml(el, valueAccessor());
            applyComponents(el, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.virtualHtml = true;
    renderer.addAttribute('virtualHtml');
});
