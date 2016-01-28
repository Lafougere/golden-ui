'use strict';

$(document.body).on('click.slot-slider', '.slot-slider .prev', function (e) {
   e.stopPropagation();
   var $this = $(this);
   var index = $this.parents(".slot-slider").data('index') || 0;
   var $ul = $this.next().find('ul');
   var max = 0;
   if (index + 1 > 0) return;
   index++;
   $this.parents(".slot-slider").data('index', index);
   $ul.css('left', index * 88);
});

$(document).on('click.slot-slider', '.slot-slider .next', function (e) {
   e.stopPropagation();
   var $this = $(this);
   var index = $this.parents(".slot-slider").data('index') || 0;
   var $ul = $this.prev().find('ul');
   var min = -($ul.children().length - 3);
   if (index - 1 < min) return;
   index--;
   $this.parents(".slot-slider").data('index', index);
   $ul.css('left', index * 88);
});
//# sourceMappingURL=golden-ui-slot-slider.js.map
