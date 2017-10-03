declare module "uiComponent";
declare module "pageCache";
declare module "Magento_Customer/js/customer-data";
declare module "mage/apply/main";
declare module "jquery/jquery-storageapi";
declare module "Meanbee_PWA/js/app/messages";

/**
 * Cookie Storage
 */
interface JQueryStatic {
    cookieStorage: CookieStorage;
}

interface CookieStorage {
    (): JQuery;
    get(name: string | string[]): any;
    set(...args: string[]): any;
}

/**
 * Form Key widget
 */
interface JQuery {
    formKey(options?: {}): JQuery;
    formKey(method: string): JQuery;
}
