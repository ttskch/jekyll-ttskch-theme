/*!
 * minimal sharer - v1.0.0 (2013-07-12)
 *
 * @author creasty
 * @url http://github.com/creasty/minimal-sharer
 * @copyright 2013 creasty
 * @license MIT
 */
(function() {
  var $, Services, Sharer;

  $ = jQuery;

  Services = {
    twitter: {
      link: 'https://twitter.com/intent/tweet?text={%title}&url={%url}&via={%twitter}',
      click: 'toolbar=0, status=0, width=650, height=360'
    },
    facebook: {
      count: 'http://graph.facebook.com/{%url}',
      link: 'http://www.facebook.com/sharer.php?u={%url}',
      filter: function(data) {
        return data.shares;
      },
      click: 'toolbar=0, status=0, width=600, height=300'
    },
    gplus: {
      count: '?service=gplus&id={%url}',
      link: 'https://plusone.google.com/_/+1/confirm?hl={%lang}&url={%url}',
      dataType: 'text',
      click: 'toolbar=0, status=0, width=480, height=500'
    },
    hatena: {
      count: 'http://api.b.st-hatena.com/entry.count?url={%url}&callback=?',
      link: 'http://b.hatena.ne.jp/entry/{url}'
    },
    pinterest: {
      count: 'http://api.pinterest.com/v1/urls/count.json?url={%url}&callback=?',
      link: 'http://pinterest.com/pin/create/button/?url={%url}&media={%image}&description={%description}',
      filter: function(data) {
        return data.count;
      }
    },
    linkedin: {
      count: '?service=linkedin&id={%url}',
      link: 'http://www.linkedin.com/shareArticle?mini=true&url={%url}&title={%title}&source={%site}',
      click: 'toolbar=0, status=0, width=600, height=400',
      filter: function(data) {
        return data.count;
      }
    },
    stumble: {
      count: '?service=stumble&id={%url}',
      link: 'http://www.stumbleupon.com/submit?url={%url}&title={%title}',
      filter: function(data) {
        return data.result.views;
      }
    },
    tumblr: {
      link: 'http://www.tumblr.com/share?v=3&u={%url}&t={%title}&s='
    },
    mail: {
      link: 'mailto:?body={%title} {%url}'
    },
    evernote: {
      init: function() {
        if (window.Evernote) {
          return;
        }
        return $('head').append('<script src="http://static.evernote.com/noteit.js" async="async"></script>');
      },
      click: function(btn, config) {
        var _ref;
        if (!window.Evernote) {
          return;
        }
        return Evernote.doClip({
          providerName: config.site,
          url: config.url,
          title: config.title,
          contentId: (_ref = config.contentId) != null ? _ref : 'main'
        });
      }
    }
  };

  Sharer = {
    meta: null,
    init: function() {
      var $meta, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (this.meta) {
        return;
      }
      $meta = $('meta');
      return this.meta = {
        url: (_ref = (_ref1 = $meta.filter('[property=og\\:url]').attr('content')) != null ? _ref1 : $meta.filter('[name=canonical]').attr('content')) != null ? _ref : window.location.href,
        title: (_ref2 = $meta.filter('[property=og\\:title]').attr('content')) != null ? _ref2 : document.title,
        site: (_ref3 = $meta.filter('[property=og\\:site_name]').attr('content')) != null ? _ref3 : '',
        image: (_ref4 = $meta.filter('[property=og\\:image]').attr('content')) != null ? _ref4 : '',
        lang: (_ref5 = $('html').attr('lang')) != null ? _ref5 : 'ja',
        twitter: (_ref6 = (_ref7 = $meta.filter('[name=twitter\\:site]').attr('content')) != null ? _ref7.replace(/^\@/, '') : void 0) != null ? _ref6 : ''
      };
    },
    bind: function(tpl, hash) {
      return tpl.replace(/\{(%)?(\w+)\}/g, function(_0, esacpe, key) {
        var val, _ref;
        val = (_ref = hash[key]) != null ? _ref : '';
        if (esacpe) {
          return encodeURIComponent(val);
        } else {
          return val;
        }
      });
    },
    getCount: function(btn, config) {
      var _ref;
      return $.ajax({
        dataType: (_ref = btn.service.dataType) != null ? _ref : 'json',
        url: this.bind(btn.service.count, config),
        success: function(data) {
          btn.$btn.addClass('has-counter');
          if (btn.service.filter) {
            data = btn.service.filter(data);
          }
          return btn.$counter.text(data || '0').show();
        },
        error: function() {
          return btn.$counter.hide();
        }
      });
    },
    click: function(btn, config) {
      var _this = this;
      return btn.$link.click(function(e) {
        if (btn.$counter) {
          btn.$counter.text(parseInt(btn.$counter.text(), 10) + 1);
        }
        if ($.isFunction(btn.service.click)) {
          e.preventDefault();
          return btn.service.click(btn, config);
        } else if (btn.service.click) {
          e.preventDefault();
          return window.open(_this.bind(btn.service.link, config), null, btn.service.click);
        }
      });
    },
    create: function($target, config) {
      var btn, label, service, _base, _ref, _ref1, _results;
      _ref = config.buttons;
      _results = [];
      for (service in _ref) {
        label = _ref[service];
        btn = {
          service: Services[service]
        };
        if (!(btn.service && label)) {
          continue;
        }
        btn.$btn = $("<li class=\"" + service + "\"><a href=\"#\" class=\"link\">" + label + "</a></li>").appendTo($target);
        btn.$link = btn.$btn.children('.link');
        if ('?' === ((_ref1 = btn.service.count) != null ? _ref1.charAt(0) : void 0)) {
          btn.service.count = !config.script ? null : config.script + btn.service.count;
        }
        if (typeof (_base = btn.service).init === "function") {
          _base.init(btn, config);
        }
        if (btn.service.count) {
          btn.$counter = $('<span class="counter">0</span>').hide().appendTo(btn.$btn);
          this.getCount(btn, config);
        }
        if (btn.service.link) {
          btn.$link.attr('href', this.bind(btn.service.link, config));
          btn.$link.attr('target', (btn.service.link.match(/^https?:/i) ? '_blank' : '_self'));
        }
        _results.push(this.click(btn, config));
      }
      return _results;
    }
  };

  $.fn.minimalSharer = function(config) {
    if (!config.buttons) {
      return this;
    }
    Sharer.init();
    config = $.extend({}, Sharer.meta, config);
    return this.each(function() {
      return Sharer.create($(this), config);
    });
  };

  $.minimalSharer = {
    extend: function(settings) {
      return $.extend(Services, settings);
    }
  };

}).call(this);
