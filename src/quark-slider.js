(function($) {
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
                        return '<img style="width:' + opt.width + ';height:' + opt.height + ';" src="https://img.youtube.com/vi/' + vid[1] + '/0.jpg"/>';
                    } else {
                        return '<iframe style="width:' + opt.width + ';height:' + opt.height + ';" src="' + src + '" frameborder="0" allow="' + (opt.autoplay?'autoplay;':'') + 'encrypted-media" allowfullscreen></iframe>'; 
                    }
                } else {
                    return '<iframe style="width:' + opt.width + ';height:' + opt.height + ';" src="' + src + '" frameborder="0" allow="' + (opt.autoplay?'autoplay;':'') + 'encrypted-media" allowfullscreen></iframe>'; 
                }
            } else {
                return '<iframe style="width:' + opt.width + ';height:' + opt.height + ';" src="' + src + '" frameborder="0" allow="' + (opt.autoplay?'autoplay;':'') + 'encrypted-media" allowfullscreen></iframe>'; 
            } 
        } else {
            if(opt.lazyload) {
                return '<img style="width:' + opt.width + ';height:' + opt.height + ';" src=" origin-src="' + src + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="/>';
            } else {
                return '<img style="width:' + opt.width + ';height:' + opt.height + ';" src="' + src + '"/>';
            }
        }
    }

    $.fn.quarkSlider = function(options) {
        var settings = $.extend({
            type: "standard",
            dotBar: "circle",
            lazyload: false,
            navArrow: "standard",
            scrollType: "thumbnail",
            videoRatio: 4/3,
        }, options);
        
        var instance = this;
        $(this).append(sliderHTMLFrame);

        this.each(function(outerIndex, slider) {
            var sliderWidth = $(slider).width(),
                items = $(slider).find('item');

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
                    if(tVsrc != null && typeof tVsrc != undefined) {
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

        });

        (function(instance) {
            $(window).on('resize', function(ev) {
                instance.each(function(outerIndex, slider) {
                    var sliderWidth = $(slider).find('.quark-sl-m-container').width();

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

                });
            });
        })(instance);

    }
})(jQuery);
