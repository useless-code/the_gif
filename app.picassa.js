//Wrapped in a namespace, because we are good javascript coders
$(document).ready(function (){
  function build_data_url(user, album) {
    return "https://picasaweb.google.com/data/feed/api/user/" + user + "/albumid/"+ album +"?alt=json&kind=photo"
  };
  var user = "113288886837539699792",
    album = "5898807933959509569",
    gif_list = [],
    image_buffer = [],
    buffer_limit = 10,
    buffering = false,
    waiting = false;
    
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

    // image_buffering 

    function buffer_image() {
      buffering = true;
      var element =  random_element();
      console.log("putting " + element + " in buffer");
      var image = new Image();
      image.onload = function () {
        image_buffer.push(image);
        if (image_buffer.length < buffer_limit) {
            buffer_image();
        } else {
            buffering = false;
        };  
      };
      image.src = element;
    };

    //start buffering
    buffer_image();

    $(document).click(function() {
        if (waiting){
            console.log("We are loading it");
            return;
        };
    
      if (image_buffer.length > 0){
        console.log("taking image from buffer");
        var element = image_buffer.splice(0, 1)[0].src;
        console.log(element);
        if (buffering !== true){
            console.log("buffering restart");
            buffer_image();
        };
      } else {
        var element =  random_element();
      };

      var image = new Image();
      waiting = true;
      image.onload = function () {
        if (this.height < 270 && this.width > this.height) {
            var size = Math.floor((270 / this.height) * this.width);
            document.body.style.backgroundSize = size + 'px';
        } else if (this.width < 300) {
            document.body.style.backgroundSize = '300px';
        } else {
            document.body.style.backgroundSize = 'auto';
        };
        document.body.style.backgroundImage = 'url("' + element  + '")';
        waiting = false;
      };
      image.src = element;
    });

    $(document).click();
});
})
