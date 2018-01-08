/**
 * Application base class
 */

"use strict";

import $ = require("jquery");
import DataStore = require("./dataStore");
import Router = require("./router");
import CartRoute = require("./routes/cart");
import Debugger = require("./debugger");

// References
import HistoryTracker = require("./history");

const routerConfig = {
    history: {
        root: {
            state: {},
            title: "",
            url: new URL(location.origin)
        }
    }
};

Debugger.enable();

const ds = new DataStore();
const router = new Router(routerConfig).setDataStore(ds);

const App = {
    store: ds,
    router: router,

    state: {
        title: null,
        url: null
    },

    /**
     * App initialization
     */
    initialize() {
        this.router.routes([
            {
                path: "checkout/cart",
                action: "before",
                callback: function() {
                    CartRoute();
                }
            }
        ]);

        this._trackDocumentTitle();
        this._trackBodyClasses();
    },

    start() {
        const router = this.getRouter();
        router.start();

        return this;
    },

    /**
     * Update document title on data change
     */
    _trackDocumentTitle() {
        const routerMeta = this.store.get("meta");

        routerMeta.subscribe((updatedState: PWA_Meta) => {
            const title = updatedState && updatedState.title;

            if (!title) {
                return;
            }

            document.title = decodeEntities(title);
        });

        function decodeEntities(encodedString: string) {
            var textArea = document.createElement("textarea");
            textArea.innerHTML = encodedString;
            return textArea.value;
        }
    },

    /**
     * Update body classes on data change
     */
    _trackBodyClasses() {
        const routerClasses = this.store.get("bodyClass");

        routerClasses.subscribe((data: [string]) => {
            $("body")
                .removeClass()
                .addClass(data.join(" "));
        });
    },

    /**
     * Get Router instance
     *
     * @returns {Router}
     */
    getRouter(): Router {
        return this.router;
    },

    /**
     * Get DataStore instance
     *
     * @returns {DataStore}
     */
    getDataStore(): DataStore {
        return this.store;
    },

    /**
     * Get History instance
     *
     * @returns {HistoryTracker}
     */
    getHistory(): HistoryTracker {
        return this.getRouter().getHistory();
    }
};

export = App;
