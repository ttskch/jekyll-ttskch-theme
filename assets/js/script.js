$(function () {
    // focus on search input with '/' key.
    $("body").on("keyup", function (e) {
        e.stopPropagation();
        var slashKeys = [47, 111, 191];
        if (slashKeys.some(function (value) { return e.keyCode == value })) {
            $("#search").focus();
        }
    });

    // add `target="_blank"` into all outer links.
    var host = document.location.host;
    $("a[href]").each(function() {
        var re = new RegExp(host, "g");
        if ($(this).attr("href").match(/\/\//) && !$(this).attr("href").match(re)) {
            $(this).attr("target", "_blank");
        }
    });

    // center all images.
    $("article img").closest("p").css("text-align", "center");

    // stick aside.
    var topSpacing = $(".site-aside").css("padding-top").replace(/px/, "");
    console.log(topSpacing);
    $(".site-aside .inner").sticky({
        topSpacing: parseInt(topSpacing)
    });

    // social buttons.
    // @see https://github.com/creasty/minimal-sharer
    $(".minimal-sharer").each(function () {
        var settings = {
            buttons: {
                'twitter': 'Tweet',
                'facebook': 'Facebook',
                'hatena': 'Hatena',
                'gplus': '+1'
            }
        };
        var url = $(this).closest("article").data("url");
        var title = $(this).closest("article").data("title");
        if (url) {
            settings['url'] = url;
        }
        if (title) {
            settings['title'] = title;
        }
        $(this).minimalSharer(settings);
    });
});
