//Wrapped in a namespace, because we are good javascript coders
$(document).ready(function () {
  "use strict";
  var theGif, gif_list = [],
    CACHE_MAX = 10,
    copy_of_gift_list = [],
    albums = [
        {id: "5898807933959509569", user: "113288886837539699792",},
        {id: "5911386033286256529", user: "114337695162527210679",},
        {id: "5932806704917310497", user: "114337695162527210679",},
    ];

    theGif = {
        favicon: document.getElementById('favicon'),
        gifList: [],
        gifListCopy: [],
        initialGif: null,
        buildDataUrl: function (user, album) {
            return "https://picasaweb.google.com/data/feed/api/user/" +
                user + "/albumid/" +
                album + "?alt=json&kind=photo";
        },
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        processFeedResponse: function (response) {
            var url,
                dataList = response.feed.entry,
                i,
                l = dataList.length;

            for (i = 0; i < l; i++) {
                var url = dataList[i].content.src;
                this.gifList.push(url);
                this.gifListCopy.push(url);
            }
        },
        buildGifMetadata: function(index, feed) {

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
            this.getAllAlbums().done(function () {
                this.buffer.start();
                if(!this.initialGif) {
                    $(document).click();
                }
            }.bind(this));
        },
        onClick: function () {
            if (this.buffer.waiting()) {
                return;
            }
            window.start_loading();
            this.buffer.get(this.updateGif.bind(this));
        },
        updateGif: function (image) {
            var w = image.width, h = image.height;

            if (h < 270 && w > h) {
                var size = Math.floor((270 / h) * w);
                document.body.style.backgroundSize = size + 'px';
            } else if (w < 300) {
                document.body.style.backgroundSize = '300px';
            } else {
                document.body.style.backgroundSize = 'auto';
            }
            document.body.style.backgroundImage = 'url("' + image.src  + '")';
            this.updateFavicon(image);
            window.end_loading();
        },
        updateFavicon: function (image) {
            document.head.removeChild(this.favicon);
            this.favicon.href = image.src;
            document.head.appendChild(this.favicon);
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
            return this.gifListCopy.splice(index, 1);
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
