window.start_loading = function () {
  $('.brand').hide();
  $('.loader').show();
}

window.end_loading = function () {
  $('.brand').show();
  $('.loader').hide();
}

$(document).ready(function (){
  var $rollover = $('.rollover');
  $rollover.hover(function (evt) {
    var anim_params = {
      duration: 800,
      queue: false,
    };
    if (evt.type === 'mouseenter') {
      $rollover.animate({left: 0}, anim_params);
    } else {
      $rollover.animate({left: -136}, anim_params);
    }
  })
})
