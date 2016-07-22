(function ($) {
    'use strict';
    // using '.class-name' instead of $('.class-name') so the variables can be used in the .on() event handlers
    var topButton = '.back-to-top';
    var scrollableAreaTop = '.sg-jump-top';
    var scrollableLinks = '.sg-section-nav a';
    var windowPosition;
    var footerPosition;
    var buttonPosition;
    var scrollableAreaTopOffset;
    var windowTop;
    var showTopButtonDistance;
    var throttleInterval = 100;

    // Throttle function from https://remysharp.com/2010/07/21/throttling-function-calls
    var throttle = function (fn, threshhold, scope) {
        if (threshhold || (threshhold = 250)) {
            var last;
            var deferTimer;
            return function () {
                var context = scope || this;
                var now = Number(new Date());
                var args = arguments;
                if (last && now < last + threshhold) {
                    // hold on to it
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function () {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold + last - now);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        }
    };

    var setUpTopButton = function () {
        windowTop = $(window).scrollTop();
        windowPosition = $(window).scrollTop() + $(window).height();
        footerPosition = $(document).height() - $('.sg-footer').height();
        buttonPosition = 'absolute';

        if (windowTop < showTopButtonDistance) {
            $(topButton).hide();
        } else {
            if (windowPosition < footerPosition) {
            buttonPosition = 'fixed'; }
            $(topButton).css('position', buttonPosition).fadeIn('medium');
        }
    };

    var performScroll = function (target) {
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 'medium');
        setUpTopButton();
    };

    $(document).ready(function () {

        if (!$('body').hasClass('style-guide-page')) {
            return;
        }

        scrollableAreaTopOffset = $(scrollableAreaTop).offset().top;
        showTopButtonDistance = scrollableAreaTopOffset + $(topButton).height();

        setUpTopButton();

        $(window).on('scroll', throttle(setUpTopButton, throttleInterval));

        $(document).on('click', scrollableLinks, function (e) {
            e.preventDefault();
            performScroll($(this).attr('href'));
        });

        $(document).on('click', topButton, function () {
            performScroll(scrollableAreaTop);
        });

        $(window).on('resize', throttle(function () {
            setUpTopButton();
        }, throttleInterval));
    });
}(window.jQuery));
