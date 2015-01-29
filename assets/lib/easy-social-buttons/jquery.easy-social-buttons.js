/*
 * 	Easy Social Buttons 0.2 - jQuery plugin
 *	written by cyokodog
 *
 *	Copyright (c) 2014 cyokodog
 *		http://www.cyokodog.net/
 *		http://d.hatena.ne.jp/cyokodog/)
 *		http://cyokodog.tumblr.com/
 *	MIT LICENCE
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */


;(function($){

	var plugin = $.esb = $.easySocialButtons = function(option ){
		var callee = arguments.callee;
		if(!(this instanceof callee)) return new callee(option );
		var o = this, c = o.config = $.extend(true, {}, callee.defaults, option);
		c.orders = option.orders || c.orders;
		c.buttons = $('<div class="easy-social-buttons-container"/>');
		if(c.inverseColor) c.buttons.addClass('esb-inverse');
		$.each(c.orders, function(){
			var sname = this.toString();
			var api = c[sname] = $.esb[sname](option );
			api.getButton().appendTo(c.buttons);
		});
	}
	$.extend(plugin.prototype, {
		getButtons : function(){ // ボタンの取得
			var o = this, c = o.config;
			return c.buttons;
		},
		getButtonAPI : function(name ){ // API の取得
			var o = this, c = o.config;
			return c[name];
		}
	});
	$.extend(plugin, {
		defaults : {
			autoAdd : true, // true でボタンの自動挿入を行う
			addMethod : 'insertAfter', // ボタンの挿入メソッドを指定
			callback : function(api ){}, // プラグイン実行後のコールバック処理
			orders : ['hatebu','twitter', 'facebook', 'googleplus'], // ボタンの表示順
			labels : { // サービスの表示名
				'hatebu' : 'B!',
				'twitter' : 'ｔ',
				'facebook' : 'ｆ',
				'googleplus' : 'G+'
			}
		},
		version : '0.2',
		id : 'easy-social-buttons',
		name : 'Easy Social Buttons'
	});

	$.fn.easySocialButtons = function(option ){
		var c = $.extend(true, {}, plugin.defaults, option);
		if(option) c.orders = option.orders || c.orders;
		return this.each(function(){
			var t = $(this);
			c.url = t.prop('href') || t.data('href') || t.data('url') || c.url;
			if(!c.url){
				c.url = location.href;
				c.addMethod = 'appendTo';
			}
			var api = $.easySocialButtons(c);
			if(c.autoAdd){
				api.getButtons(c)[c.addMethod](t);
			}
			c.callback.apply(t[0], [api]);
		});
	}

	var DF = plugin.defaults;
	$.each(DF.orders, function(idx){
		var sname = this.toString();
		var f = $.esb[sname] = function(option ){
			var callee = arguments.callee;
			if(!(this instanceof callee)) return new callee(option );
			var o = this, c = o.config = $.extend(true, {}, callee.defaults, callee.overwrite[sname] || {}, option, option[sname]);
			c.url = c.url || location.href;
			c.button = $(c.tempalte);
			c.wrapper = c.button.hasClass('esb') ? c.button : c.button.find('.esb');
			c.label = c.wrapper.find('.esb-label').html(c.label);
			c.counter = c.wrapper.find('.esb-counter').html(c.waitCounter);
			c.entryLink = c.wrapper.find('a.esb-entry');
			c.searchLink = c.wrapper.find('a.esb-search');
			if(c.useBrandColor) c.wrapper.addClass('esb-' + sname);
			if($.si){
				var SI = $.si[sname];
				if(c.counter.size() && SI.getEntryCount){
					SI.getEntryCount(c.url, function(count ){
						c.counter.text(count);
					});
				}
				!SI.getEntryUrl || c.entryLink.prop('href', SI.getEntryUrl(c.url, c.pageTitle )).prop('title', c.entryTitle);
				!SI.getSearchUrl || c.searchLink.prop('href', SI.getSearchUrl(c.url )).prop('title', c.searchTitle);
			}
		}
		$.extend(f.prototype, {
			getButton : function(){
				var o = this, c = o.config;
				return c.button;
			}
		});
		$.extend(f, {
			id : sname,
			defaults : {
				url : '',
				label : DF.labels[sname],
				entryTitle : '投稿する', // esb-entry クラスを持つ要素に割り当てる title 属性値
				searchTitle : '検索する', // esb-search クラスを持つ要素に割り当てる title 属性値
				waitCounter : '<span>&nbsp;</span>', // Web API の取得結果待ち時に表示するマークアップ
				tempalte : '<span class="esb"><a class="esb-label esb-search" target="_blank"></a><a class="esb-counter esb-entry" target="_blank"></a></span>', // ボタンのテンプレート
				useBrandColor : true, // ブランドカラーの使用
				inverseColor : false // ブランドカラー未使用時の配色の反転
			},
			overwrite : {
				hatebu : {
					entryTitle : 'ブックマークする'
				}
			}
		});
	});
})(jQuery);
