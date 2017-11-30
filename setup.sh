#!/usr/bin/env bash

set -e # Exit on error

if [ $(find $MAGENTO_ROOT -maxdepth 0 -type d -empty 2>/dev/null) ]; then
    magento-installer

    cd $MAGENTO_ROOT

    # Add dependency extensions from git repositories (Composer does not support recursive repository definitions)
    composer config repositories.meanbee_helpers_pwa vcs git@github.com:meanbee/magento2-pwa.git
    composer require "meanbee/magento2-pwa" "@dev"

    # Add the extension via Composer
    composer config repositories.meanbee_theme_pwa '{"type": "path", "url": "/src", "options": {"symlink": true}}'

    composer require "meanbee/magento2-theme-pwa" "@dev"

    # Workaround for Magento only allowing template paths within the install root
    ln -s /src $MAGENTO_ROOT/src
fi

# Set the default store theme. Uses a magic number for the theme ID, but there's no easy way of getting it by name.
magerun2 config:store:set design/theme/theme_id 4
magento-command indexer:reindex design_config_grid

magento-command setup:upgrade
magento-command setup:di:compile
magento-command cache:flush
