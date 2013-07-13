//Wrapped in a namespace, because we are good javascript coders
$(document).ready(function (){
  function build_data_url(user, album) {
    return "https://picasaweb.google.com/data/feed/api/user/" + user + "/albumid/"+ album +"?alt=json&kind=photo"
  };
  var user = "113288886837539699792",
    album = "5898807933959509569",
    gif_list = [];
    
  $.get(build_data_url(user, album), function(response) {
    var data_list = response.feed.entry;
    for(var i=0; i<data_list.length; i++){
        gif_list.push(data_list[i].content.src);
    };

    var copy_of_gift_list = gif_list.slice(0);

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    function random_element(){
        if (copy_of_gift_list.length == 0) {
            copy_of_gift_list = gif_list.slice(0);
        };
        var index = getRandomInt(0, copy_of_gift_list.length - 1);
        return copy_of_gift_list.splice(index, 1);
    };

    var buffer = new window.Buffer({
        data_source: random_element, 
        limit: 10,
    });

    buffer.start();
    $load_bar = $("#fadingBarsG");
    var favicon = document.getElementById('favicon');
    $(document).click(function() {
        if (buffer.waiting()){
            console.log("We are loading it");
            return;
        };
        $load_bar.show();
        buffer.get( function (image) {
          if (image.height < 270 && image.width > image.height) {
            var size = Math.floor((270 / image.height) * image.width);
            document.body.style.backgroundSize = size + 'px';
          } else if (image.width < 300) {
            document.body.style.backgroundSize = '300px';
          } else {
            document.body.style.backgroundSize = 'auto';
          };
          document.body.style.backgroundImage = 'url("' + image.src  + '")';
          document.head.removeChild(favicon);
          favicon.href = image.src;
          document.head.appendChild(favicon);
          $load_bar.hide();
      });
    });
    $(document).click();
});
})
