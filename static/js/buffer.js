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
        var self = this;
        var image = new Image();
        image.onload = function () {
          element.data = this;
          if (self.defer_callback) {
            self.defer_callback(element);
            self.defer_callback = undefined;
          } else {
            self.queue.push(element);
          }

          if (self.queue.length < self.limit) {
            self.fill();
          } else {
            self.buffering = false;
          }
        };
        image.src = element.src;
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
