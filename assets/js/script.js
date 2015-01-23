$(function () {
    // focus on search input with '/' key.
    $("body").on("keyup", function (e) {
        e.stopPropagation();
        var slashKeys = [47, 111, 191];
        if (slashKeys.some(function (value) { return e.keyCode == value })) {
            $("#search").focus();
        }
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
