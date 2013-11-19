window.start_loading = function () {
  "use strict";
  $('.brand').hide();
  $('.loader').show();
};

window.end_loading = function () {
  "use strict";
  $('.brand').show();
  $('.loader').hide();
};

$(document).ready(function () {
  "use strict";
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
  });
  $(".fb").overlay({
    target: $(".fb-container"),
    closeOnClick: true,
    mask: {
      color: '#fafafa',
      opacity: 0,
    }
  });
});
