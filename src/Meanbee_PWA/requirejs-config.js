var config = {
    config: {
        mixins: {
            'Magento_Theme/js/view/messages': {
                'Meanbee_PWA/js/app/view/messages-mixin': true
            }
        }
    },
    map: {
        "*": {
            "spa": "Meanbee_PWA/js/app/app"
        }
    },
    deps: [
        'Meanbee_PWA/js/knockout/bootstrap-head',
        'Meanbee_PWA/js/knockout/virtual-html',
        'Meanbee_PWA/js/spa-init'
    ]
};