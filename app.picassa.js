//Wrapped in a namespace, because we are good javascript coders
$(document).ready(function (){
  function build_data_url(user, album) {
    return "https://picasaweb.google.com/data/feed/api/user/" + user + "/albumid/"+ album +"?alt=json&kind=photo"
  };
  window.gif_list = []
  var user = "113288886837539699792",
    album = "5898807933959509569";

  $.get(build_data_url(user, album), function(response) {
    console.log(response);
    var data_list = response.feed.entry;
    console.log(data_list);
    for(var i=0; i<data_list.length; i++){
        window.gif_list.push(data_list[i].content.src);
    };

    var copy_of_gift_list = window.gif_list.slice(0);

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    function random_element(){
        if (copy_of_gift_list.length == 0) {
            copy_of_gift_list = window.gif_list.slice(0);
        }
         
        var index = getRandomInt(0, copy_of_gift_list.length - 1);
        return copy_of_gift_list.splice(index, 1);
    };

    
    document.addEventListener('click', function() {  
      var element =  random_element();
      var image = new Image();
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
      };
      image.src = element;
    }, false);

    document.body.style.backgroundImage = 'url("' + random_element()  + '")'
});
})
