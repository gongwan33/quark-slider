(function($) {
    var funcQueue = {};
    var sliderHTMLFrame = `
        <div class="quark-sl-m-container">
            <div class="qs-img-window">
                <div class="qs-outer-scroll qs-scroll">

                </div>
                <div class="qs-nav qs-nav-left"><i class="far fa-angle-left"></i></div>
                <div class="qs-nav qs-nav-right"><i class="far fa-angle-right"></i></div>
            </div>
            <div class="scroll-bar">
                <div class="qs-cl-outer-scroll qs-scroll">

                </div>
                <div class="qs-nav qs-nav-left"><i class="far fa-angle-left"></i></div>
                <div class="qs-nav qs-nav-right"><i class="far fa-angle-right"></i></div>
            </div>
        </div>
    `;

    function getQSItemTag(type, src, target, opt = null) {
        $.extend({
            autoplay: false,
            height: "100%",
            lazyload: false,
            vsrc: 'youtube',
            width: 'auto',
        }, opt);

        if(type == 'video') {
            if(target == 'scroll-bar') {
                if(opt.vsrc == 'youtube') {
                    var vid = src.match(/.+\/([^\/]+)$/);
                    if(vid.length > 0) {
                        return '<img class="unselectable" unselectable="on" style="width:' + opt.width + ';height:' + opt.height + ';" src="https://img.youtube.com/vi/' + vid[1] + '/0.jpg" draggable="false" dragstart="return false;"/>';
                    } else {
                        return '<iframe class="unselectable" unselectable="on" style="width:' + opt.width + ';height:' + opt.height + ';" src="' + src + '" frameborder="0" allow="' + (opt.autoplay?'autoplay;':'') + 'encrypted-media" allowfullscreen draggable="false" dragstart="return false;"></iframe>'; 
                    }
                } else {
                    return '<iframe class="unselectable" unselectable="on" style="width:' + opt.width + ';height:' + opt.height + ';" src="' + src + '" frameborder="0" allow="' + (opt.autoplay?'autoplay;':'') + 'encrypted-media" allowfullscreen draggable="false" dragstart="return false;"></iframe>'; 
                }
            } else {
                return '<iframe class="unselectable" unselectable="on" style="width:' + opt.width + ';height:' + opt.height + ';" src="' + src + '" frameborder="0" allow="' + (opt.autoplay?'autoplay;':'') + 'encrypted-media" allowfullscreen draggable="false" dragstart="return false;"></iframe>'; 
            } 
        } else {
            if(opt.lazyload) {
                return '<img class="unselectable" unselectable="on" style="width:' + opt.width + ';height:' + opt.height + ';" src=" origin-src="' + src + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" draggable="false" dragstart="return false;"/>';
            } else {
                return '<img class="unselectable" unselectable="on" style="width:' + opt.width + ';height:' + opt.height + ';" src="' + src + '" draggable="false" dragstart="return false;"/>';
            }
        }
    }

    function setNavArrowStyle(scrollClass = 'qs-img-window', type, slider) {
        if(type == 'small') {
            $(slider).find('.' + scrollClass).find('.qs-nav').height('35px');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('border-radius', '2px');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('margin', 'auto 2px auto 2px');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('top', '0');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('bottom', '0');
        } else if(type == 'transparent') {
            $(slider).find('.' + scrollClass).find('.qs-nav').height('35px');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('border-radius', '2px');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('margin', 'auto 2px auto 2px');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('top', '0');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('bottom', '0');
            $(slider).find('.' + scrollClass).find('.qs-nav').css('background-color', 'transparent');
        }
    }

    function dealResizeEvent(slider, sliderWidth, settings) {
        if(sliderWidth < 320) {
            $(slider).find('.scroll-bar').hide();
        } else {
            $(slider).find('.scroll-bar').show();
        }

        $(slider).find('.qs-img-window').find('.qs-item').each(function(index, item) {
            var itemHeight = 'auto',
            itemWidth = 'auto',
            type = $(item).attr('type');

            if(type == 'video') {
                itemWidth = sliderWidth + 'px';
                itemHeight = sliderWidth/(settings.videoRatio) + 'px';
            } else {
                itemWidth = sliderWidth + 'px';
                itemHeight = 'auto';
            }

            $(item).width(itemWidth); 
            $(item).children().width(itemWidth); 
            $(item).height(itemHeight);
            $(item).children().height(itemHeight);
        });
    }

    function setSliderData(slider, key, value) {
        var ele = $(slider).find('.quark-sl-m-container');
        $(ele).attr(key, value);
    }

    function getSliderData(slider, key) {
        var ele = $(slider).find('.quark-sl-m-container');
        return $(ele).attr(key);
    }

    function autoFitHeight(curSlider, items, index) {
        var curItemHeight = $($(items).get(index)).height();
        $(curSlider).find('.qs-outer-scroll').height(curItemHeight + 'px');
    }

    function pushFuncQueue(queueName, func, ev, settings) {
        var param = {
            event: ev, 
            settings: settings,
        };
        var ele = {
            param: param,
            func: func,
        }

        if(typeof funcQueue[queueName] == "undefined") {
            funcQueue[queueName] = [];
        }

        funcQueue[queueName].push(ele);
    }

    function shiftFuncQueue(queueName) {
        return funcQueue[queueName].shift();
    }

    function excuteFuncQueue(queueName) {
        var lock = 'false';
        if(typeof funcQueue[queueName] == "undefined") {
            funcQueue[queueName] = [];
        }

        while(funcQueue[queueName].length > 0 && lock != 'true') {
            var ele = shiftFuncQueue(queueName);
            ele.func(ele.param.event, ele.param.settings);

            var curSlider = $(ele.param.event.target).closest('.quark-sl-m-container').parent('div');
            lock = getSliderData(curSlider, 'lock', true);
        }
    }

    function slideLeft(ev, settings) {
        var curSlider = $(ev.target).closest('.quark-sl-m-container').parent('div');
        setSliderData(curSlider, 'lock', true);

        var scroll = $(ev.target).closest('.qs-img-window').find('.qs-outer-scroll');
        var items = $(ev.target).closest('.qs-img-window').find('.qs-item');
        var itemNum = items.length;

        if(itemNum <= 1) {
            return;
        }

        var curIndex = Number(getSliderData(curSlider, 'curIndex'));
        var curLeft = Number($(curSlider).find('.qs-outer-scroll').position().left);
        var curSliderWidth = Number($(curSlider).width());

        if(curIndex >= itemNum - 1) {
            nextIndex = 0;
            $($(items).get(nextIndex)).clone().insertAfter($($(items).get(curIndex)));
        } else {
            nextIndex = curIndex + 1;
        }

        if(settings.heightMode == 'auto') {
            autoFitHeight(curSlider, items, nextIndex);
        }

        (function(scroll, curLeft, curSliderWidth, items, nextIndex, curSlider) {
            $(scroll).animate({
                left: curLeft + (-curSliderWidth) + 'px',
            }, settings.duration, function() {
                if(nextIndex == 0) {
                    $(scroll).css('left', 0);
                    $(scroll).find('.qs-item').last().remove();
                }
                setSliderData(curSlider, 'lock', false);
                excuteFuncQueue($(curSlider).attr('id'));
            });
        })(scroll, curLeft, curSliderWidth, items, nextIndex, curSlider);

        setSliderData(curSlider, 'curIndex', nextIndex);
    }

    function slideRight(ev, settings) {
        var curSlider = $(ev.target).closest('.quark-sl-m-container').parent('div');
        setSliderData(curSlider, 'lock', true);

        var scroll = $(ev.target).closest('.qs-img-window').find('.qs-outer-scroll');
        var items = $(ev.target).closest('.qs-img-window').find('.qs-item');
        var itemNum = items.length;

        if(itemNum <= 1) {
            return;
        }

        var curIndex = Number(getSliderData(curSlider, 'curIndex'));
        var curLeft = Number($(curSlider).find('.qs-outer-scroll').position().left);
        var curSliderWidth = Number($(curSlider).width());

        if(curIndex <= 0) {
            nextIndex = itemNum - 1;
            $($(items).get(nextIndex)).clone().insertBefore($($(items).get(curIndex)));
            curLeft = -curSliderWidth;
            $(scroll).css('left', curLeft + 'px');
        } else {
            nextIndex = curIndex - 1;
        }

        if(settings.heightMode == 'auto') {
            autoFitHeight(curSlider, items, nextIndex);
        }

        (function(scroll, curLeft, curSliderWidth, items, itemNum, nextIndex, curSlider) {
            $(scroll).animate({
                left: curLeft + (curSliderWidth) + 'px',
            }, settings.duration, function() {
                if(nextIndex == itemNum - 1) {
                    $(scroll).find('.qs-item').first().remove();
                    $(scroll).css('left', -$(items).last().position().left + 'px');
                }
                setSliderData(curSlider, 'lock', false);
                excuteFuncQueue($(curSlider).attr('id'));
            });
        })(scroll, curLeft, curSliderWidth, items, itemNum, nextIndex, curSlider);

        setSliderData(curSlider, 'curIndex', nextIndex);
    }

    function slideLeftEvent(ev, settings) {
        var curSlider = $(ev.target).closest('.quark-sl-m-container').parent('div');
        var lock = getSliderData(curSlider, 'lock');
        if(settings.queueable) {
            pushFuncQueue($(curSlider).attr('id'), slideLeft, ev, settings);
            if(lock != 'true') {
                excuteFuncQueue($(curSlider).attr('id'));
            } 
        } else {
            if(lock != 'true') {
                slideLeft(ev, settings);
            }
        }
    }

    function slideRightEvent(ev, settings) {
        var curSlider = $(ev.target).closest('.quark-sl-m-container').parent('div');
        var lock = getSliderData(curSlider, 'lock');
        if(settings.queueable) {
            pushFuncQueue($(curSlider).attr('id'), slideRight, ev, settings);
            if(lock != 'true') {
                excuteFuncQueue($(curSlider).attr('id'));
            }
        } else {
            if(lock != 'true') {
                slideRight(ev, settings);
            }
        }
    }

    function setSliderClickEvent(slider, settings) {
        setSliderData(slider, 'curIndex', 0);

        $(slider).find('.qs-img-window').find('.qs-nav-left').off('click');
        $(slider).find('.qs-img-window').find('.qs-nav-left').on('click', function(ev) {
            slideLeftEvent(ev, settings); 
        });

        $(slider).find('.qs-img-window').find('.qs-nav-right').off('click');
        $(slider).find('.qs-img-window').find('.qs-nav-right').on('click', function(ev) {
            slideRightEvent(ev, settings);
        });

    }

    function setSliderTimer(slider, settings) {
        (function(slider, settings) {
            window.setInterval(function() {
                var ev = {target: slider};
                slideLeftEvent(ev, settings); 
            }, settings.timer);
        })(slider, settings);
    }

    $.fn.quarkSlider = function(options) {
        var settings = $.extend({
            ctrlNavArrow: "standard",
            dotBar: "circle",
            duration: 500,
            heightMode: 'auto',
            lazyload: false,
            navArrow: "standard",
            queueable: false,
            scrollType: "thumbnail",
            timer: 0,
            type: "standard",
            videoRatio: 4/3,
        }, options);
        
        var instance = this;
        $(this).append(sliderHTMLFrame);

        this.each(function(outerIndex, slider) {
            var sliderWidth = $(slider).width(),
                items = $(slider).find('item');

            setNavArrowStyle('qs-img-window', settings.navArrow, slider);
            setNavArrowStyle('scroll-bar', settings.ctrlNavArrow, slider);

            items.each(function(index, item) {
                var type = $(item).attr('type'),
                    src = $(item).attr('src'),
                    vsrc = 'youtube',
                    itemHeight = 'auto',
                    itemWidth = 'auto',
                    ctrlHeight = 'auto',
                    ctrlWidth = 'auto';

                if(type == 'video') {
                    itemWidth = sliderWidth + 'px';
                    itemHeight = sliderWidth/(settings.videoRatio) + 'px';
                    ctrlWidth = 'auto';
                    ctrlHeight = Math.ceil(sliderWidth/10.6) + 'px';

                    tVsrc = $(item).attr('vsrc');
                    if(tVsrc != null && typeof tVsrc != "undefined") {
                        vsrc = tVsrc;
                    }
                } else {
                    itemWidth = sliderWidth + 'px';
                    itemHeight = 'auto';
                    ctrlWidth = 'auto';
                    ctrlHeight = Math.ceil(sliderWidth/10.6) + 'px';
                }

                $(slider).find('.qs-outer-scroll').append('<div type="' + type + '" class="qs-item">' + getQSItemTag(type, src, 'main',
                            {
                                autoplay: $(item).attr('autoplay'),
                                height: itemHeight,
                                lazyload: settings.lazyload,
                                vsrc: vsrc,
                                width: itemWidth,
                            }) + '</div>');

                if(settings.scrollType == 'none') {
                    $(slider).find('.qs-cl-outer-scroll').remove();
                }

                if(settings.scrollType == "thumbnail") {
                    $(slider).find('.qs-cl-outer-scroll').append('<div type="' + type + '" class="qs-item">' + getQSItemTag(type, src, 'scroll-bar', 
                                {
                                    autoplay: $(item).attr('autoplay'),
                                    height: ctrlHeight,
                                    lazyload: settings.lazyload,
                                    vsrc: vsrc,
                                    width: ctrlWidth,
                                }) + '</div>');

                }

                $(item).remove();
            });

            setSliderClickEvent(slider, settings);

            if(settings.timer > 0) {
                setSliderTimer(slider, settings);
            }
        });

        (function(instance) {
            $(window).on('resize', function(ev) {
                instance.each(function(outerIndex, slider) {
                    var sliderWidth = $(slider).find('.quark-sl-m-container').width();

                    dealResizeEvent(slider, sliderWidth, settings);
                });
            });
        })(instance);

    }
})(jQuery);
