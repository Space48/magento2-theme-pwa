# Magento Progressive Web App Theme

## Installation

Install this extension via Composer:

```
composer config repositories.meanbee-theme-pwa vcs https://github.com/meanbee/magento2-theme-pwa
composer require meanbee/magento2-theme-pwa
```

## Development

### Setting up a development environment

A Docker development environment is included with the project:

```
mkdir magento
docker-compose up -d db # Allow a few seconds for the db to initalise
docker-compose run --rm cli bash /src/setup.sh
docker-compose up -d
```


# PWA

## Application Shell

- Used magento2-svg helper to embed SVG's into shell
- Used magento2-css-preload to load any non critical css asynchronously
- Created endpoint to return shell
- 

## Router

- Shell gets returned from service worker as the default on navigate
- Shell initialises router, content and app-data components
- Router hijacks navigates, 

### Problems

- Hardcoded location.search, location.href, location.reload & location.assign. These cannot be intercepted and so cause a full page reload. Each of these occurances had to be changed to trigger an event with the original location data so that the original method can be called for non sw supporting browsers & the router can handle sw supporting browsers.
- Redirects. jQuery does not expose redirect headers on responses so the native fetch API had to be used here. Magento also does not forward request params in redirects, so the sw param was not passed on.
- Nested knockout components with data-mage-init.
- Global event delegated handlers. Magento places a considerable amount of event handlers on the document because it preaches event bubbling (maybe a little too excessively). This means that when partial views are loaded, data-mage-init is processed and handlers are applied to the document, all these handlers stick around. These event handlers are also not namespaced, making it very difficult to uniquely identify handlers and perform cleanups for non application shell components.

### Improvements

Navigation events should not need to be hijacked. It works but it feels like some glue holding components together, glue that shouldn't be necessary. Routing should be integrated in a way similar to react-router where all links are passed through the Link component. History API & ajax loads are more transparent in this way. Magento could have integrated something like (knockout router)[https://www.npmjs.com/package/ko-component-router]. 

##