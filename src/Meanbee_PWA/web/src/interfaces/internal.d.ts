interface AppConfig {
    router: RouterConfig;
}

interface RouterConfig {
    history: HistoryConfig;
}

interface HistoryConfig {
    root: RootConfig;
}

interface RootConfig {
    state: {};
    title: string;
    url: URL;
}

interface BlockConfig {
    clean: boolean;
    cleanElement: string;
    key: string;
}

interface RouteCallback {
    [name: string]: { [action in keyof Action]: Function[] };
}

type Action = "before" | "after";

interface RouteConfig {
    path: string;
    action: Action;
    callback: Function;
}

/**
 * Server request for PWA response
 */
interface DataStoreRequest {
    url: string;
    method?: string;
    data?: JQuery.NameValuePair[];
}

interface HistoryEntry {
    url: URL;
    title: string;
    state: {
        scrollY?: number;
    };
}

interface LocationEvent {
    href: string;
    func: any;
}

/**
 * PWA result type
 */
interface PWA_JSON extends _.Dictionary<string | {}> {
    meta: PWA_Meta;
    head: string;
    bodyClass: string;
    content: string;
    assets: string;
}

interface PWA_Meta {
    url: string;
    title: string;
}

/**
 * Additional response keys from Magento
 */
interface PWA_JSON {
    backUrl: string;
}

declare module "spa";
