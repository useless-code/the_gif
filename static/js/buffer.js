// Wrapping all in a namespace
(function (window, document, undefined) {
  "use strict";
  window.Buffer = function Buffer(params) {
    params = params || {};
    this.data_source = params.data_source;
    this.limit = params.limit || 1;
    this.queue = [];
    this.buffering = false;
    this.start = function () {
      this.fill();
    };
    this.fill =  function () {
      if (this.data_source) {
        this.buffering =  true;
        var element = this.data_source();
        if (element) {
            this.loadImage(element);
        };
      }
    };
    this.loadImage = function (element) {
        var image = new Image();
        image.album = element[0]
        image.gifId = element[1]
        image.onload = function () {
          if (this.defer_callback) {
            this.defer_callback(image);
            this.defer_callback = undefined;
          } else {
            this.queue.push(image);
          }

          if (this.queue.length < this.limit) {
            this.fill();
          } else {
            this.buffering = false;
          }
        }.bind(this);
        image.src = element[2];
    };
    this.get = function (callback) {
      if (this.queue.length > 0) {
        // We have a loaded image
        var image = this.queue.splice(0, 1);
        callback(image[0]);
      } else {
        // Buffer is empty, we have to wait
        this.defer_callback = callback;
      }

      if (!this.buffering) {
        this.fill();
      }
    };

    this.waiting = function () {
      return this.defer_callback !== undefined;
    };
  };
})(window, document);
/*
buffer = new Buffer({limit: 10})
buffer_2 = new Buffer()
console.log(buffer.limit);
console.log(buffer_2.limit);
*/
