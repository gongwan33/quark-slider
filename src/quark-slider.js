(function($) {
    var sliderHTMLFrame = `
        <div class="quark-sl-m-container">
            <div class="qs-img-window">
                <div class="qs-outer-scroll qs-scroll">

                </div>
            </div>
            <div class="scroll-bar">
                <div class="qs-cl-outer-scroll qs-scroll">

                </div>
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
            scrollType: "thumbnail",
            dotBar: "circle",
            navArrow: "standard",
            lazyload: false,
        }, options);
        
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
                    itemHeight = sliderWidth/4*3 + 'px';
                    ctrlWidht = sliderWidth/8 + 'px';
                    ctrlHeight = sliderWidth/10.6 + 'px';

                    tVsrc = $(item).attr('vsrc');
                    console.log(tVsrc);
                    if(tVsrc != null && typeof tVsrc != undefined) {
                        vsrc = tVsrc;
                    }
                } else {
                    itemWidth = sliderWidth + 'px';
                    itemHeight = 'auto';
                    ctrlWidht = sliderWidth/8 + 'px';
                    ctrlHeight = sliderWidth/10.6 + 'px';
                }

                $(slider).find('.qs-outer-scroll').append('<div class="qs-item">' + getQSItemTag(type, src, 'main',
                            {
                                autoplay: $(item).attr('autoplay'),
                                height: itemHeight,
                                lazyload: settings.lazyload,
                                vsrc: vsrc,
                                width: itemWidth,
                            }) + '</div>');

                if(settings.scrollType == "thumbnail") {
                    $(slider).find('.qs-cl-outer-scroll').append('<div class="qs-item">' + getQSItemTag(type, src, 'scroll-bar', 
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
        
    }
})(jQuery);
