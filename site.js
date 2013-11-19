$(document).ready(function (){
  var $rollover = $('.rollover');
  $rollover.hover(function (evt) {
    if (evt.type === 'mouseenter') {
      $rollover.animate({left: 0}, 800);
    } else {
      $rollover.animate({left: -136}, 800);
    }
  })
})
