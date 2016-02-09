/* =========================================================
 * bootstrap-numberfield.js v0.1
 *
 * =========================================================
 * Copyright 2014 Axel Glorieux
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ){

	"use strict"

	/* NUMBERFIELD CLASS DEFINITION
	* ====================== */

	var NumberField = function (input, options) {

		this.options = $.extend({}, $.fn.numberfield.defaults, options)
		this.options.step = parseFloat(this.options.step)
		this.options.min = parseFloat(this.options.min)
		this.options.max = parseFloat(this.options.max)
		this.$input = $(input)

		this.$minus = $('<a class="numberfield minus">')
		this.$plus = $('<a class="numberfield plus">')

		this.$input.before(this.$minus).after(this.$plus)

		this.$minus.on('mousedown.numberfield.minus', $.proxy(this.handleMinusMouseDown, this))
		this.$plus.on('mousedown.numberfield.plus', $.proxy(this.handlePlusMouseDown, this))

		if (typeof this.options.min !== 'undefined' && parseFloat(this.$input.val()) <= this.options.min) this.$minus.addClass('disabled')
		if (typeof this.options.max !== 'undefined' && parseFloat(this.$input.val()) >= this.options.max) this.$plus.addClass('disabled')
	}

	NumberField.prototype = {

		constructor: NumberField,
		handleMouseUp: function(e){
			this.isMouseDown = false
			clearTimeout(this.timeout)
		},
		handleMinusMouseDown: function(e){
			e.stopPropagation()
			e.preventDefault()
			this.iterations = 0
			this.delay = 500
			this.isMouseDown = true
			this.$minus.on('mouseleave mouseup', $.proxy(this.handleMouseUp, this))
			this.timeout = setTimeout($.proxy(this.handleMinusMouseHold, this), this.delay)
			this.substract()
		},
		handlePlusMouseDown: function(e){
			e.stopPropagation()
			e.preventDefault()
			this.iterations = 0
			this.delay = 500
			this.isMouseDown = true
			this.$plus.one('mouseup mouseleave', $.proxy(this.handleMouseUp, this))
			this.timeout = setTimeout($.proxy(this.handlePlusMouseHold, this), this.delay)
			this.add()
		},
		add: function(){
			var newVal = parseFloat(this.$input.val() || 0) + this.options.step
			if (this.$plus.hasClass('disabled')) return
			if (this.options.max && newVal + this.options.step > this.options.max) this.$plus.addClass('disabled')
			this.$minus.removeClass('disabled')
			this.$input.val(newVal)
		},
		substract: function(){
			var newVal = parseFloat(this.$input.val() || 0) - this.options.step
			if (this.$minus.hasClass('disabled')) return
			if (typeof this.options.min !== 'undefined' && newVal - this.options.step < this.options.min) this.$minus.addClass('disabled')
			this.$plus.removeClass('disabled')
			this.$input.val(newVal)
		},
		handleMinusMouseHold: function(){
			this.substract()
			if (this.isMouseDown){
				this.delay = Math.max(50, 400 - this.iterations++ * 30)
				this.timeout = setTimeout($.proxy(this.handleMinusMouseHold, this), this.delay)
			}
		},
		handlePlusMouseHold: function(){
			this.add()
			if (this.isMouseDown){
				this.delay = Math.max(50, 400 - this.iterations++ * 30)
				this.timeout = setTimeout($.proxy(this.handlePlusMouseHold, this), this.delay)
			}
		},


	}

 /* NUMBERFIELD PLUGIN DEFINITION
  * ======================= */

	$.fn.numberfield = function ( option ) {
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('numberfield')
				, options = typeof option == 'object' && option
			if (!data) $this.data('numberfield', (data = new NumberField(this, options)))
			if (typeof option == 'string') return data[option]()
			//else data.show()
		})
	}

	$.fn.numberfield.defaults = {
		step: 1
	}

	$.fn.numberfield.Constructor = NumberField


 /* NUMBERFIELD DATA-API
  * ============== */
	$(function () {
		$('[data-toggle="numberfield"]').each(function(){
			var opts = {
				min: $(this).data('min'),
				max: $(this).data('max'),
				step: $(this).data('step')
			}
			$(this).numberfield(opts);
		})

	})
}( window.jQuery )

/* =========================================================
 * bootstrap-scrollpane.js v0.1
 *
 * =========================================================
 * Copyright 2015 Axel Glorieux
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ){

	"use strict"

	/* SCROLLPANE CLASS DEFINITION
	* ====================== */

	var ScrollPane = function (element, options) {

		var that = this

		this.options = $.extend({}, $.fn.scrollpane.defaults, options)
		this.$element = $(element).addClass('scroll-pane')
		this.sliceId = 0

		this.$parent = options.parent ? this.$element.parents(options.parent) : this.$element.parent()
		this.$bar = $('<div class="scrollbar">')
		this.$track = $('<div class="scrollbar-track">').appendTo(this.$bar)
		this.$arrowUp = $('<a class="scrollbar-arrow up">').appendTo(this.$track).addClass('disabled')
		this.$handle = $('<div class="scrollbar-handle">').appendTo(this.$track)
		this.$arrowDown = $('<a class="scrollbar-arrow down">').appendTo(this.$track)
		this.$element.after(this.$bar)

		this.$handle.on('mousedown.scrollpane.handle', $.proxy(this.onHandleMouseDown, this))
		$('body').on('mouseup.scrollpane', $.proxy(this.onMouseUp, this))
		this.$arrowUp.on('mousedown.scrollpane.arrowUp', $.proxy(this.onArrowUpClick, this))
		this.$arrowDown.on('mousedown.scrollpane.arrowDown', $.proxy(this.onArrowDownClick, this))
		this.$track.on('click.scrollpane.track', $.proxy(this.onTrackClick, this))
		this.$bar.on('mousemove', $.proxy(this.onMouseMove, this))
		this.$element.on('mousewheel', $.proxy(this.onMouseWheel, this))
		this.$parent.on('show', $.proxy(this.computeSize, this))
		this.$parent.on('hide', $.proxy(this.computeSize, this))
		this.$element.parents('.modal').on('shown.bs.modal', $.proxy(this.computeSize, this))
		this.computeSize()
	}

	ScrollPane.prototype = {

		constructor: ScrollPane,
		onMouseUp: function(e){
			this.isMouseDown = false
            this.isArrowDown = false
            clearTimeout(this.timeout)
            e.stopPropagation()
		},
		onMouseMove: function(e){
			if (this.isMouseDown){
				this.computeSize()
				this.isDragging = true
				var newTop = Math.min(this.startPos + (e.clientY - this.dragStart), this.$track.height() - this.$handle.height())
				newTop = Math.max(0, newTop)
				this.$handle.css('top', newTop).css('transition', "none")
				var ratio = newTop / (this.$track.height() - this.$handle.height())
				//$this.animate({scrollTop:maxScroll*ratio}, 220)
				this.$element.scrollTop((this.scrollHeight - this.containerHeight) * ratio)
				this.sliceId = Math.round(this.slices * ratio)
				this.updateArrowStatus()
                this.$handle.css('transition', "all .2s linear")
			}
		},
		onHandleMouseDown: function(e){
			this.isMouseDown = true
			this.dragStart = e.clientY
			this.startPos = parseInt(this.$handle.css('top'))
		},
		onArrowUpClick: function(e){
            this.iterations = 0
			this.delay = 220
			this.computeSize()
			this.sliceId = Math.max(0, this.sliceId - 1)
			this.$handle.css({top:this.sliceId * this.handleIncrement})
			this.$element.animate({scrollTop:this.contentIncrement * this.sliceId}, 200)
			e.stopPropagation()
			this.updateArrowStatus()
            this.isArrowDown = true
            this.isDragging = true
            this.timeout = setTimeout($.proxy(this.handleArrowUpHold, this), 400)
		},
        handleArrowUpHold: function(e){
            this.computeSize()
			this.sliceId = Math.max(0, this.sliceId - 1)
			this.$handle.css({top:this.sliceId * this.handleIncrement})
			this.$element.animate({scrollTop:this.contentIncrement * this.sliceId}, 200)
			if (e) e.stopPropagation()
			this.updateArrowStatus()
			if (this.isArrowDown){
				this.delay = Math.max(50, 400 - this.iterations++ * 30)
				this.timeout = setTimeout($.proxy(this.handleArrowUpHold, this), 200)
			}
        },
		onArrowDownClick: function(e){
            this.iterations = 0
			this.delay = 220
			this.computeSize()
			this.sliceId = Math.min(this.slices, this.sliceId + 1)
			this.$handle.css({top:this.sliceId * this.handleIncrement})
			this.$element.animate({scrollTop:this.contentIncrement * this.sliceId}, 200)
			e.stopPropagation()
			this.updateArrowStatus()
            this.isArrowDown = true
            this.isDragging = true
            this.timeout = setTimeout($.proxy(this.handleArrowDownHold, this), 400)
		},
        handleArrowDownHold: function(e){
            this.computeSize()
			this.sliceId = Math.min(this.slices, this.sliceId + 1)
			this.$handle.css({top:this.sliceId * this.handleIncrement})
			this.$element.animate({scrollTop:this.contentIncrement * this.sliceId}, 200)
			if (e) e.stopPropagation()
			this.updateArrowStatus()
			if (this.isArrowDown){
				this.delay = Math.max(50, 400 - this.iterations++ * 30)
				this.timeout = setTimeout($.proxy(this.handleArrowDownHold, this), 200)
			}
        },
		onTrackClick: function(e){
			if (this.isDragging || this.isArrowDown){
				this.isDragging = false
                this.isArrowDown = false
				return false
			}
			this.computeSize()
			var newTop = Math.min(e.offsetY, this.$track.height() - this.$handle.height())
			newTop = Math.max(0, newTop)
			this.$handle.css({top: newTop})
			var ratio = newTop / (this.$track.height() - this.$handle.height())
			this.$element.animate({scrollTop:(this.scrollHeight - this.containerHeight) * ratio}, 200)
			this.sliceId = Math.round(this.slices * ratio)
			this.updateArrowStatus()
		},
		onMouseWheel: function(e){
			this.computeSize()
			if (e.originalEvent.deltaY > 0){
				this.sliceId = Math.min(this.slices, this.sliceId + 1)
			}
			else {
				this.sliceId = Math.max(0, this.sliceId - 1)
			}
			if (this.sliceId > 0 && this.sliceId < this.slices){
				e.preventDefault()
				e.stopPropagation()
			}
			this.$handle.css('top', this.sliceId * this.handleIncrement).css('transition', "none")
			this.$element.scrollTop(this.contentIncrement * this.sliceId)
			this.updateArrowStatus()
            this.$handle.css('transition', "all .2s linear")
		},
		updateArrowStatus: function(){
			if (this.sliceId == 0){
				this.$arrowUp.addClass('disabled')
				this.$arrowDown.removeClass('disabled')
			}
			else if (this.sliceId == this.slices){
				this.$arrowDown.addClass('disabled')
				this.$arrowUp.removeClass('disabled')
			}
			else {
				this.$arrowUp.removeClass('disabled')
				this.$arrowDown.removeClass('disabled')
			}
		},
		computeSize: function(){
			this.containerHeight = this.$element.height()
			this.scrollHeight = this.$element.get(0).scrollHeight
			if (this.scrollHeight <= this.containerHeight) this.$parent.addClass('hide-scrollbar')
			else this.$parent.removeClass('hide-scrollbar')
			this.slices = Math.ceil((this.scrollHeight - this.containerHeight) / this.options.scrollIncrement)
			this.handleIncrement = (this.$track.height()-this.$handle.height()) / this.slices
			this.maxScroll = this.scrollHeight - this.containerHeight
			this.contentIncrement = (this.scrollHeight - this.containerHeight) / this.slices
		},

	}

 /* SCROLLPANE PLUGIN DEFINITION
  * ======================= */

	$.fn.scrollpane = function ( option ) {
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('scrollpane')
				, options = typeof option == 'object' && option
			if (!data) $this.data('scrollpane', (data = new ScrollPane(this, options)))
			if (typeof option == 'string') return data[option]()
			//else data.show()
		})
	}

	$.fn.scrollpane.defaults = {
		external: false,
		scrollIncrement: 73
	}

	$.fn.scrollpane.Constructor = ScrollPane


 /* SCROLLPANE DATA-API
  * ============== */
	$(function () {
		$('[data-toggle="scrollpane"]').each(function(){
			var opts = {
				external: $(this).data('external'),
				scrollIncrement: $(this).data('scroll-increment'),
				parent: $(this).data('parent')
			}
			$(this).scrollpane(opts);
		})

	})
}( window.jQuery )

$(document.body).on('click.slot-slider', '.slot-slider .prev', function(e){
	e.stopPropagation()
    var $this = $(this)
    var index = $this.parents(".slot-slider").data('index') || 0
    var $ul = $this.next().find('ul')
    var max =  0
    if (index + 1 > 0) return
    index++
    $this.parents(".slot-slider").data('index', index)
    $ul.css('left', index * 88)
})

$(document).on('click.slot-slider', '.slot-slider .next', function(e){
	e.stopPropagation()
    var $this = $(this)
    var index = $this.parents(".slot-slider").data('index') || 0
    var $ul = $this.prev().find('ul')
    var min =  - ($ul.children().length - 3)
    if (index - 1 < min) return
    index--
    $this.parents(".slot-slider").data('index', index)
    $ul.css('left', index * 88)
})

// jshint devel:true
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
    $('[data-toggle="popover"]').popover()
})
