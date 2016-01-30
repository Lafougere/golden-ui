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
