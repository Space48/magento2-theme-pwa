var config = {
    config: {
        mixins: {
            'Magento_Theme/js/view/messages': {
                'Meanbee_PWA/js/view/messages-mixin': true
            }
        }
    },
    deps: [
        'Meanbee_PWA/js/knockout/virtual-html'
    ]
};