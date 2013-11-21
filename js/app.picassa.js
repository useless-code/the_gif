//Wrapped in a namespace, because we are good javascript coders
$(document).ready(function () {
  "use strict";
  function build_data_url(user, album) {
    return "https://picasaweb.google.com/data/feed/api/user/" +
          user + "/albumid/" +
          album + "?alt=json&kind=photo";
  }
  var gif_list = [],
    copy_of_gift_list = [];
  var albums = [
    {id: "5898807933959509569", user: "113288886837539699792",},
    {id: "5911386033286256529", user: "114337695162527210679",},
    {id: "5932806704917310497", user: "114337695162527210679",},
  ];

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  function process_response(response) {
    var data_list = response.feed.entry;
    for (var i = 0; i < data_list.length; i++) {
      var url = data_list[i].content.src;
      gif_list.push(url);
      copy_of_gift_list.push(url);
    }
  }

  function random_gif() {
    var index;

    if (copy_of_gift_list.length === 0) {
      copy_of_gift_list = gif_list.slice(0);
    }
    index = getRandomInt(0, copy_of_gift_list.length - 1);

    return copy_of_gift_list.splice(index, 1);
  }

  var buffer = new window.Buffer({
    data_source: random_gif,
    limit: 10,
  });

  function get_random_album() {
    var index = getRandomInt(0, albums.length - 1);
    var album = albums.splice(index, 1)[0];
    return build_data_url(album.user, album.id);
  }

  function process_next(response) {
    if (albums.length > 0) {
      $.get(get_random_album(), process_next);
    }
    process_response(response);
  }


  $.get(get_random_album(), function (response) {

    process_next(response);
    buffer.start();

    var favicon = document.getElementById('favicon');
    $(document).click(function () {
      if (buffer.waiting()) {
        return;
      }
      window.start_loading();
      buffer.get(function (image) {
        if (image.height < 270 && image.width > image.height) {
          var size = Math.floor((270 / image.height) * image.width);
          document.body.style.backgroundSize = size + 'px';
        } else if (image.width < 300) {
          document.body.style.backgroundSize = '300px';
        } else {
          document.body.style.backgroundSize = 'auto';
        }
        document.body.style.backgroundImage = 'url("' + image.src  + '")';
        document.head.removeChild(favicon);
        favicon.href = image.src;
        document.head.appendChild(favicon);
        window.end_loading();
      });
    });
    $(document).click();
  });
});