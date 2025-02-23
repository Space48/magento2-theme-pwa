window.mediaCheck = function(options) {
    var mq;

    function mqRun(mq, options) {
        if (mq.matches) {
            if (typeof options.entry === "function") {
                options.entry();
            }
        }
    }

    function mqChange(mq, options) {
        if (mq.matches) {
            if (typeof options.entry === "function") {
                options.entry();
            }
        } else if (typeof options.exit === "function") {
            options.exit();
        }
    };

    mq = window.matchMedia(options.media);

    mq.addListener(function() {
        mqChange(mq, options);
    });

    mqRun(mq, options);
};