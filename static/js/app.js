(function () {
    "use strict";
    var CACHE_MAX = 10;
    var randInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

    var theGif = {
        firstGif: null,
        gifList: [],
        gifListCopy: [],
        run: function (collectionUrl, album, gifId, url) {
            this.buffer = new window.Buffer({
                data_source: this.randomGif.bind(this),
                limit: CACHE_MAX,
            });
            window.start_loading();
            if (album && gifId && url) {
                //An initial background was provided
                this.firstGif = [album, gifId, url];
                this.loadInitialImage(url);
            }
            this.loadCollection(collectionUrl).done(function () {
                this.buffer.start();
                if (!this.firstGif) {
                    this.changeGif();
                }
                this.setupKeyBindings();
            }.bind(this));
        },
        setupKeyBindings: function () {
            $(document).click(function () {
                this.changeGif();
                this.logEvent('mouse', 'click', 'user requested new gif using mouse');
            }.bind(this));
            $(document).on('keypress', function (e) {
                if (e.keyCode === 32 || e.charCode === 32) {
                    this.changeGif();
                    this.logEvent('mouse', 'click', 'user requested new gif using keyboard');
                }
            }.bind(this));
        },
        changeGif: function () {
            if (this.buffer.waiting()) {
                this.logEvent('buffer', 'waiting', 'buffer waiting');
                return;
            }
            window.start_loading();
            this.buffer.get(this.updateGif.bind(this));
        },
        randomGif: function () {
            var index;
            if (this.gifListCopy.length === 0) {
                this.gifListCopy = this.gifList.slice(0);
            }
            index = randInt(0, this.gifListCopy.length - 1);
            return this.gifListCopy.splice(index, 1)[0];
        },
        loadCollection: function (collectionUrl) {
            return $.getJSON(collectionUrl).done(function (data) {
                this.gifList = data;
            }.bind(this));
        },
        loadInitialImage: function (url) {
            var image = new Image();
            image.onload = function () {
                this.updateGif(image);
            }.bind(this);
            image.src = url;
        },
        updateGif: function (image) {
            var w = image.width,
                h = image.height,
                max_h = $(window).height(),
                max_w = $(window).width(),
                min_h = Math.min(270, max_h),
                min_w = Math.min(300, max_h),
                out_w;

            if (h < min_h && w > h) {
                out_w = Math.floor((min_h / h) * w);
            } else if (w < min_w) {
                out_w = Math.floor(min_w);
            } else {
                out_w = w;
            }
            document.body.style.backgroundSize = Math.min(out_w, max_w) + 'px';
            document.body.style.backgroundImage = 'url("' + image.src  + '")';
            document.body.style.backgroundPosition = '0 0';
            document.body.style.backgroundRepeat = 'repeat';
            if (image.gifId && image.album) {
                this.updateLocation(image.album, image.gifId);
            }
            this.logEvent('images', 'loaded', 'gif loaded');
            window.end_loading();
        },
        updateLocation: function (album, gifId) {
            window.history.pushState({}, "The Gif", "/g/" + album + "/" + gifId + "/");
            this.logPageView();
        },
        logEvent: function (category, action, label) {
            if (this.ga) {
                this.ga('send', 'event', category, action, label);
            }
        },
        logPageView: function () {
            if (this.ga) {
                this.ga('send', 'pageview');
            }
        },
    };
    window.theGif = theGif;
})();
