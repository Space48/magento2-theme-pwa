/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    "jquery",
    "matchMedia",
    "jquery/ui",
    "jquery/jquery.mobile.custom",
    "mage/translate"
], function ($, mediaCheck) {
    'use strict';

    /**
     * Menu Widget - this widget is a wrapper for the jQuery UI Menu
     */
    $.widget('mage.customMenu', $.ui.menu, {
        options: {
            responsive: false,
            expanded: false,
            delay: 300
        },
        _create: function () {
            var self = this;

            this._super();
            $(window).on('resize', function () {
                self.element.find('.submenu-reverse').removeClass('submenu-reverse');
            });
        },

        _init: function () {
            this._super();
            this.delay = this.options.delay;

            if (this.options.expanded === true) {
                this.isExpanded();
            }

            if (this.options.responsive === true) {
                mediaCheck({
                    media: '(max-width: 640px)',
                    entry: $.proxy(function () {
                        this._toggleMobileMode();
                    }, this),
                    exit: $.proxy(function () {
                        this._toggleDesktopMode();
                    }, this)
                });
            }

            this._assignControls()._listen();
        },

        _assignControls: function () {
            this.controls = {
                toggleBtn: $('[data-action="toggle-nav"]'),
                swipeArea: $('.nav-sections')
            };

            return this;
        },

        _listen: function () {
            var controls = this.controls;
            var toggle = this.toggle;

            this._on(controls.toggleBtn, {'click': toggle});
            this._on(controls.swipeArea, {'swipeleft': toggle});
        },

        toggle: function () {
            if ($('html').hasClass('nav-open')) {
                $('html').removeClass('nav-open');
                setTimeout(function () {
                    $('html').removeClass('nav-before-open');
                }, 300);
            } else {
                $('html').addClass('nav-before-open');
                setTimeout(function () {
                    $('html').addClass('nav-open');
                }, 42);
            }
        },

        //Add class for expanded option
        isExpanded: function () {
            var subMenus = this.element.find(this.options.menus),
                expandedMenus = subMenus.find('ul');

            expandedMenus.addClass('expanded');
        },

        _activate: function (event) {
            this.active.find('> a').click();
            this.collapseAll(event);
        },

        _keydown: function (event) {

            var match, prev, character, skip, regex,
                preventDefault = true;

            function escape(value) {
                return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            }

            if (this.active.closest('ul').attr('aria-expanded') != 'true') {

                switch (event.keyCode) {
                    case $.ui.keyCode.PAGE_UP:
                        this.previousPage(event);
                        break;
                    case $.ui.keyCode.PAGE_DOWN:
                        this.nextPage(event);
                        break;
                    case $.ui.keyCode.HOME:
                        this._move("first", "first", event);
                        break;
                    case $.ui.keyCode.END:
                        this._move("last", "last", event);
                        break;
                    case $.ui.keyCode.UP:
                        this.previous(event);
                        break;
                    case $.ui.keyCode.DOWN:
                        if (this.active && !this.active.is(".ui-state-disabled")) {
                            this.expand(event);
                        }
                        break;
                    case $.ui.keyCode.LEFT:
                        this.previous(event);
                        break;
                    case $.ui.keyCode.RIGHT:
                        this.next(event);
                        break;
                    case $.ui.keyCode.ENTER:
                    case $.ui.keyCode.SPACE:
                        this._activate(event);
                        break;
                    case $.ui.keyCode.ESCAPE:
                        this.collapse(event);
                        break;
                    default:
                        preventDefault = false;
                        prev = this.previousFilter || "";
                        character = String.fromCharCode(event.keyCode);
                        skip = false;

                        clearTimeout(this.filterTimer);

                        if (character === prev) {
                            skip = true;
                        } else {
                            character = prev + character;
                        }

                        regex = new RegExp("^" + escape(character), "i");
                        match = this.activeMenu.children(".ui-menu-item").filter(function () {
                            return regex.test($(this).children("a").text());
                        });
                        match = skip && match.index(this.active.next()) !== -1 ?
                            this.active.nextAll(".ui-menu-item") :
                            match;

                        // If no matches on the current filter, reset to the last character pressed
                        // to move down the menu to the first item that starts with that character
                        if (!match.length) {
                            character = String.fromCharCode(event.keyCode);
                            regex = new RegExp("^" + escape(character), "i");
                            match = this.activeMenu.children(".ui-menu-item").filter(function () {
                                return regex.test($(this).children("a").text());
                            });
                        }

                        if (match.length) {
                            this.focus(event, match);
                            if (match.length > 1) {
                                this.previousFilter = character;
                                this.filterTimer = this._delay(function () {
                                    delete this.previousFilter;
                                }, 1000);
                            } else {
                                delete this.previousFilter;
                            }
                        } else {
                            delete this.previousFilter;
                        }
                }
            } else {
                switch (event.keyCode) {
                    case $.ui.keyCode.DOWN:
                        this.next(event);
                        break;
                    case $.ui.keyCode.UP:
                        this.previous(event);
                        break;
                    case $.ui.keyCode.RIGHT:
                        if (this.active && !this.active.is(".ui-state-disabled")) {
                            this.expand(event);
                        }
                        break;
                    case $.ui.keyCode.ENTER:
                    case $.ui.keyCode.SPACE:
                        this._activate(event);
                        break;
                    case $.ui.keyCode.LEFT:
                    case $.ui.keyCode.ESCAPE:
                        this.collapse(event);
                        break;
                    default:
                        preventDefault = false;
                        prev = this.previousFilter || "";
                        character = String.fromCharCode(event.keyCode);
                        skip = false;

                        clearTimeout(this.filterTimer);

                        if (character === prev) {
                            skip = true;
                        } else {
                            character = prev + character;
                        }

                        regex = new RegExp("^" + escape(character), "i");
                        match = this.activeMenu.children(".ui-menu-item").filter(function () {
                            return regex.test($(this).children("a").text());
                        });
                        match = skip && match.index(this.active.next()) !== -1 ?
                            this.active.nextAll(".ui-menu-item") :
                            match;

                        // If no matches on the current filter, reset to the last character pressed
                        // to move down the menu to the first item that starts with that character
                        if (!match.length) {
                            character = String.fromCharCode(event.keyCode);
                            regex = new RegExp("^" + escape(character), "i");
                            match = this.activeMenu.children(".ui-menu-item").filter(function () {
                                return regex.test($(this).children("a").text());
                            });
                        }

                        if (match.length) {
                            this.focus(event, match);
                            if (match.length > 1) {
                                this.previousFilter = character;
                                this.filterTimer = this._delay(function () {
                                    delete this.previousFilter;
                                }, 1000);
                            } else {
                                delete this.previousFilter;
                            }
                        } else {
                            delete this.previousFilter;
                        }
                }
            }

            if (preventDefault) {
                event.preventDefault();
            }
        },

        _toggleMobileMode: function () {
            $(this.element).off('mouseenter mouseleave');
            this._on({
                "click .ui-menu-item:has(a)": function (event) {
                    var target = $(event.target).parent().hasClass('level0');

                    if (target) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        $('html').removeClass('nav-open');
                    }
                }
            });

            var subMenus = this.element.find('.level-top');
            $.each(subMenus, $.proxy(function (index, item) {
                var category = $(item).find('> a span').not('.ui-menu-icon').text(),
                    categoryUrl = $(item).find('> a').attr('href'),
                    menu = $(item).find('> .ui-menu');

                this.categoryLink = $('<a>')
                    .attr('href', categoryUrl)
                    .text($.mage.__('All ') + category);

                this.categoryParent = $('<li>')
                    .addClass('ui-menu-item all-category')
                    .html(this.categoryLink);

                if (menu.find('.all-category').length === 0) {
                    menu.prepend(this.categoryParent);
                }

            }, this));
        },

        _toggleDesktopMode: function () {
            this._on({
                // Prevent focus from sticking to links inside menu after clicking
                // them (focus should always stay on UL during navigation).
                "mousedown .ui-menu-item > a": function (event) {
                    event.preventDefault();
                },
                "click .ui-state-disabled > a": function (event) {
                    event.preventDefault();
                },
                "click .ui-menu-item:has(a)": function (event) {
                    var target = $(event.target).closest(".ui-menu-item");
                    if (!this.mouseHandled && target.not(".ui-state-disabled").length) {
                        this.select(event);

                        // Only set the mouseHandled flag if the event will bubble, see #9469.
                        if (!event.isPropagationStopped()) {
                            this.mouseHandled = true;
                        }

                        // Open submenu on click
                        if (target.has(".ui-menu").length) {
                            this.expand(event);
                        } else if (!this.element.is(":focus") && $(this.document[0].activeElement).closest(".ui-menu").length) {

                            // Redirect focus to the menu
                            this.element.trigger("focus", [true]);

                            // If the active item is on the top level, let it stay active.
                            // Otherwise, blur the active item since it is no longer visible.
                            if (this.active && this.active.parents(".ui-menu").length === 1) {
                                clearTimeout(this.timer);
                            }
                        }
                    }
                },
                "mouseenter .ui-menu-item": function (event) {
                    var target = $(event.currentTarget),
                        ulElement,
                        ulElementWidth,
                        width,
                        targetPageX,
                        rightBound;

                    if (target.has('ul')) {
                        ulElement = target.find('ul');
                        ulElementWidth = target.find('ul').outerWidth(true);
                        width = target.outerWidth() * 2;
                        targetPageX = target.offset().left;
                        rightBound = $(window).width();

                        if ((ulElementWidth + width + targetPageX) > rightBound) {
                            ulElement.addClass('submenu-reverse');
                        }
                        if ((targetPageX - ulElementWidth) < 0) {
                            ulElement.removeClass('submenu-reverse');
                        }
                    }

                    // Remove ui-state-active class from siblings of the newly focused menu item
                    // to avoid a jump caused by adjacent elements both having a class with a border
                    target.siblings().children(".ui-state-active").removeClass("ui-state-active");
                    this.focus(event, target);
                },
                "mouseleave": function (event) {
                    this.collapseAll(event, true);
                },
                "mouseleave .ui-menu": "collapseAll"
            });

            var categoryParent = this.element.find('.all-category'),
                html = $('html');

            categoryParent.remove();

            if (html.hasClass('nav-open')) {
                html.removeClass('nav-open');
                setTimeout(function () {
                    html.removeClass('nav-before-open');
                }, 300);
            }
        },
        _delay: function(handler, delay) {
            var instance = this,
                handlerProxy = function () {
                return (typeof handler === "string" ? instance[handler] : handler)
                    .apply(instance, arguments);
            };
            
            return setTimeout(handlerProxy, delay || 0);
        }
    });

    return {
        customMenu: $.mage.customMenu,
    };
});
