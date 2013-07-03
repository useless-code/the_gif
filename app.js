//Wrapped in a namespace, because we are good javascript coders
(function(window, document, undefined){
    var copy_of_gift_list = window.gif_list.slice(0);

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    function random_element(){
        if (copy_of_gift_list.length == 0) {
            copy_of_gift_list = window.gif_list.slice(0);
        }
         
        var index = getRandomInt(0, copy_of_gift_list.length - 1);
        console.log(index)        
        return copy_of_gift_list.splice(index, 1);
    };

    
    document.addEventListener('click', function() {  
      var element =  random_element();
      var image = new Image();
      image.onload = function () {
        if (this.height < 270 && this.width > this.height) {
            console.log()
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
})(window, document)
