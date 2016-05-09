(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals (root is window)
    root.modal = factory(root.jQuery);
  }
})(this, function ($) {

  'use strict';

  /**
   * Default Modal Options
   * @type {Object}
   */
  var modalDefaultOptions = {
    name: 'custom-modal',
    appendTo: 'body',
  };

  /**
   * Base Modal Object
   * @type {Object}
   */
  var modalObj = {
    opts: {},
    dom: {},
    /*
     * Check if user is on mobile
     */
    isMobile: navigator.userAgent.match(/mobile/i) || false,
    init: function (options) {
      //merge options
      this.opts = $.extend({}, modalDefaultOptions, options);
      this.build();

      return this;
    },
    /*
     * Create template and append to body by default
     */
    build: function () {
      var template = [
        '<div class="' + this.opts.name + '">',
          '<div class="wrapper">',
            '<button class="close-button">',
              'close',
            '</button>',
            '<div class="content">',
            '</div>',
          '</div>',
        '</div>',
      ].join('');

      $(this.opts.appendTo).append($(template));
      this.setVars();
    },
    /*
     * Set vars to be used in the object
     */
    setVars: function () {
      this.dom.modal = $('.' + this.opts.name);
      this.dom.content = this.dom.modal.find('.content');
      this.dom.closeButton = this.dom.modal.find('.close-button');
    },
    /*
     * Event Binding
     */
    bindEvents: function (buttons) {
      var _this = this;

      buttons.on({
        click: function (e) {
          if (_this.isMobile)
            return;

          _this.stopEvents(e);

          var href = $(e.currentTarget).prop('href');
          var containerId = $(e.currentTarget).data('containerId');

          _this.getAjaxContent(href, containerId);
        },
      });

      _this.dom.closeButton.on({
        click: function (e) {
          _this.stopEvents(e);
          _this.closeModal();
        },
      });

      $('body').on({
        keydown: function (e) {
          e = e || window.event;
          if (e.keyCode == 27) {
            _this.stopEvents(e);
            _this.closeModal();
          }
        },
      });

      return _this;
    },
    /*
     * Stop default events
     */
    stopEvents: function (e) {
      e.stopPropagation();
      e.preventDefault();
    },

    /*
     * Get content by AjaxCall
     */
    getAjaxContent: function (href, containerId) {
      var _this = this;
      $.ajax({ url: href, dataType: 'html' })
        .done(function (response) {
          var content = _this.filterContent(response, containerId);

          _this.clearContent();
          _this.setContent(content);

          _this.openModal();
        });
    },

    openModal: function () {
      this.dom.modal.addClass('active');
    },

    closeModal: function () {
      this.dom.modal.removeClass('active');
    },

    filterContent: function (response, containerId) {
      var data = $(response).find('#' + containerId)[0] || $(response).filter('#' + containerId)[0];
      return data.outerHTML;
    },

    setContent: function (content) {
      this.dom.content.append(content);
    },

    clearContent: function () {
      this.dom.content.empty();
    },
  };

  $.fn.customModal = function (options) {
    // Initialize modal
    return modalObj.init(options).bindEvents(this);
  };

  $.fn.customModal.open = function() {
    modalObj.closeModal();
  }
});
