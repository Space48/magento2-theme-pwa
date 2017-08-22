define([
    'ko',
    'Magento_Ui/js/lib/knockout/template/engine',
    'knockoutjs/knockout-es5',
    'Magento_Ui/js/lib/knockout/bindings/bootstrap',
    'Magento_Ui/js/lib/knockout/extender/observable_array',
    'Magento_Ui/js/lib/knockout/extender/bound-nodes',
    'domReady!'
], function (ko) {
    'use strict';

    // Apply knockout bindings to the head element. 
    // Knockout only applies bindings to body unless explicitly called
    ko.applyBindings({}, document.head);
});
