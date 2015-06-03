//Wrapped in a namespace, because we are good javascript coders
$(document).ready(function () {
  var theGif, CACHE_MAX = 10,
    albums = [
    {id: "5898807933959509569", user: "113288886837539699792",},
    {id: "5911386033286256529", user: "114337695162527210679",},
    {id: "5932806704917310497", user: "114337695162527210679",},
    {id: "5994764155968303073", user: "114337695162527210679",},
    {id: "6068692168380258801", user: "114337695162527210679",},
  ];

    theGif = {
        favicon: document.getElementById('favicon'),
        gifList: [],
        gifListCopy: [],
        initialGif: null,
        buildDataUrl: function (user, album, id) {
            var url = "https://picasaweb.google.com/data/feed/api/user/" + user;
            if (album) {
                url += "/albumid/" + album;
            };
            if (id) {
                url += '/photoid/' + id;
            }
            url += "?alt=json";
            if (!id) {
                url += "&kind=photo";
            };
            return url;
        },
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        processFeedResponse: function (response) {
            var url,
                dataList = response.feed.entry,
                i,
                l = dataList.length,
                albumId = response.feed.gphoto$id.$t,
                userId = response.feed.gphoto$user.$t;
            for (i = 0; i < l; i++) {
                var item = dataList[i],
                    data = this.buildGifMetadata(userId, albumId, item);
                if (!(this.initialGif &&
                    data.id === this.initialGif.id &&
                    albumId === this.initialGif.album &&
                    userId === this.initialGif.user)) {
                    this.gifListCopy.push(data);
                }
                this.gifList.push(data);
            }
        },
        buildGifMetadata: function(userId, albumId, item) {
            return {
                src: item.media$group.media$content[0].url,
                id: item.gphoto$id.$t,
                album: albumId,
                user: userId,
            };
        },

        run: function () {
            this.buffer = new window.Buffer({
                data_source: this.randomGif.bind(this),
                limit: CACHE_MAX,
            }),
            window.start_loading();
            $(document).click(
                this.onClick.bind(this)
            );
            $(document).on('keypress', function (e) {
                if(e.keyCode === 32 || e.charCode === 32 ) {
                    this.onClick();
                }
            }.bind(this));
            this.loadInitialGif();
            this.getAllAlbums().done(function () {
                this.buffer.start();
                if(!this.initialGif) {
                    $(document).click();
                }
            }.bind(this));
        },
        loadInitialGif: function() {
            if (window.location.hash) {
                var parts = window.location.hash.replace('#', '').split('/'),
                    album = window.Base65.decode(parts[0] || ''),
                    user = window.Base65.decode(parts[1] || ''),
                    id = window.Base65.decode(parts[2] || '');
                if (album && user && id) {
                    this.initialGif = {id: id, album: album, user: user};
                    $.get(this.buildDataUrl(user, album, id))
                    .done(function (data) {
                            var data = this.buildGifMetadata(user, album, data.feed);
                            this.buffer.loadImage(data);

                        }.bind(this)
                    ).fail(function () {
                            this.initialGif = false;
                        }.bind(this)
                    ).always(function () {
                        $(document).click();
                    })
                }
            };
        },
        onClick: function () {
            ga('send', 'event', {title: 'next' + window.location.hash});
            if (this.buffer.waiting()) {
                return;
            }
            window.start_loading();
            this.buffer.get(this.updateGif.bind(this));
        },
        updateGif: function (element) {
            var image = element.data,
                w = image.width,
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
            this.updateFragment(element)
            this.updateFavicon(image);
            window.end_loading();
            ga('send', 'event', {title: 'loaded ' + element.album + " - " +element.id});
        },
        updateFavicon: function (image) {
            document.head.removeChild(this.favicon);
            this.favicon.href = image.src;
            document.head.appendChild(this.favicon);
        },
        updateFragment: function (element) {
            var album = window.Base65.encode(element.album),
                user = window.Base65.encode(element.user),
                id = window.Base65.encode(element.id);
            window.location.hash = [album, user, id].join('/');
        },

        getRandomAlbumUrl: function () {
            var index = this.getRandomInt(0, albums.length - 1),
                album = albums.splice(index, 1)[0];
            return this.buildDataUrl(album.user, album.id);
        },
        randomGif: function () {
            var index;
            if (this.gifListCopy.length === 0) {
                this.gifListCopy = this.gifList.slice(0);
            }
            index = this.getRandomInt(0, this.gifListCopy.length - 1);
            return this.gifListCopy.splice(index, 1)[0];
        },

        getAllAlbums: function() {
            return $.get(this.getRandomAlbumUrl()).done(
                function (data) {
                    if (albums.length > 0) {
                        this.getAllAlbums();
                    }
                    this.processFeedResponse(data);
                }.bind(this));
        },
    };
    theGif.run();
    window.theGif = theGif;
});
