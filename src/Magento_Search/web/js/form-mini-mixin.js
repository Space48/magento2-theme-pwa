define([
    'jquery',
    'mage/template',
], function ( $, mageTemplate ) {
    'use strict';

    return function (widget) {
        /**
         * Check wether the incoming string is not empty or if doesn't consist of spaces.
         *
         * @param {String} value - Value to check.
         * @returns {Boolean}
         */
        function isEmpty(value) {
            return (value.length === 0) || (value == null) || /^\s+$/.test(value);
        }

        $.widget('mage.quickSearch', widget, {
            _create: function () {
                this._super();

                $.extend(this.options, {
                    trigger: '.minisearch__trigger',
                    clearBtn: '.minisearch__clear',
                    backBtn: '.minisearch__back'
                });

                this.triggerBtn = this.searchForm.find(this.options.trigger);
                this.clearBtn = this.searchForm.find(this.options.clearBtn);
                this.backBtn = this.searchForm.find(this.options.backBtn);

                this.triggerBtn.on('click', this._toggleSearchForm.bind( this, true ));
                this.backBtn.on('click', this._toggleSearchForm.bind( this, false ));

                this.clearBtn.on('click', function(e) {
                    e.preventDefault();
                    this.element.val('');
                    this.autoComplete.hide();
                }.bind(this));
            },

            _toggleSearchForm: function( state, event ) {
                event.preventDefault();
                this.searchForm.toggleClass( 'is-active', state );
            },
            /**
             * Executes when the value of the search input field changes. Executes a GET request
             * to populate a suggestion list based on entered text. Handles click (select), hover,
             * and mouseout events on the populated suggestion list dropdown.
             * @private
             */
            _onPropertyChange: function () {
                var searchField = this.element,
                    clonePosition = {
                        position: 'absolute',
                        // Removed to fix display issues
                        // left: searchField.offset().left,
                        // top: searchField.offset().top + searchField.outerHeight(),
                        width: searchField.outerWidth()
                    },
                    source = this.options.template,
                    template = mageTemplate(source),
                    dropdown = $('<ul role="listbox"></ul>'),
                    value = this.element.val();

                this.submitBtn.disabled = isEmpty(value);

                if (value.length >= parseInt(this.options.minSearchLength, 10)) {
                    $.get(this.options.url, {q: value}, $.proxy(function (data) {
                        var val = this.element.val();
                        $.each(data, function(index, element) {
                            var match = function(value) {
                                return value.map( item => {
                                    var ob = {};
                                    if (item === val) {
                                        ob['match'] = true;
                                    }
                                    ob['string'] = item;
                                    return ob;
                                });
                            }

                            var splitDelimiter = function(value) {
                                return value.split(new RegExp('%%', 'gi'));
                            }

                            var addDelimiter = function(value) {
                                return value.replace(new RegExp(val, 'gi'), '%%$&%%');
                            }

                            var transformTitle = _.compose(
                                match,
                                splitDelimiter,
                                addDelimiter
                            );

                            element.title = transformTitle(element.title);

                            element.index = index;
                            var html = template({
                                data: element
                            });
                            dropdown.append(html);
                        }.bind(this));
                        this.responseList.indexList = this.autoComplete.html(dropdown)
                            .css(clonePosition)
                            .show()
                            .find(this.options.responseFieldElements + ':visible');

                        this._resetResponseList(false);
                        this.element.removeAttr('aria-activedescendant');

                        if (this.responseList.indexList.length) {
                            this._updateAriaHasPopup(true);
                        } else {
                            this._updateAriaHasPopup(false);
                        }

                        this.responseList.indexList
                            .on('click', function (e) {
                                this.responseList.selected = $(e.currentTarget);
                                this.searchForm.trigger('submit');
                            }.bind(this))
                            .on('mouseenter mouseleave', function (e) {
                                this.responseList.indexList.removeClass(this.options.selectClass);
                                $(e.target).addClass(this.options.selectClass);
                                this.responseList.selected = $(e.target);
                                this.element.attr('aria-activedescendant', $(e.target).attr('id'));
                            }.bind(this))
                            .on('mouseout', function (e) {
                                if (!this._getLastElement() && this._getLastElement().hasClass(this.options.selectClass)) {
                                    $(e.target).removeClass(this.options.selectClass);
                                    this._resetResponseList(false);
                                }
                            }.bind(this));
                    }, this));
                } else {
                    this._resetResponseList(true);
                    this.autoComplete.hide();
                    this._updateAriaHasPopup(false);
                    this.element.removeAttr('aria-activedescendant');
                }
            }
        });

        return $.mage.quickSearch;
    }
});
