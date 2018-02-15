/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global some */

some.Accordion = new Class({

	Extends: some.Elements,

	op: {
		fixedHeight: false,
		fixedWidth: false,
		display: 0,
		show: false,
		height: true,
		width: false,
		opacity: true,
		alwaysHide: false,
		trigger: 'click',
		initialDisplayFx: true,
		resetHeight: true,
		keepOpen: false
	},

	init: function(){
		var defined = function(obj){
			return obj != null;
		};

		var params = Array.link(arguments, {
			'container': Type.isElement,
			'op': Type.isObject,
			'togglers': defined,
			'elements': defined
		});
		this.parent(params.elements, params.op);

		var op = this.op,
			togglers = this.togglers = $$(params.togglers);

		this.previous = -1;
		this.internalChain = new Chain();

		if (op.alwaysHide) this.op.link = 'chain';

		if (op.show || this.op.show === 0){
			op.display = false;
			this.previous = op.show;
		}

		if (op.start){
			op.display = false;
			op.show = false;
		}

		var effects = this.effects = {};

		if (op.opacity) effects.opacity = 'fullOpacity';
		if (op.width) effects.width = op.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (op.height) effects.height = op.fixedHeight ? 'fullHeight' : 'scrollHeight';

		for (var i = 0, l = togglers.length; i < l; i++) this.addSection(togglers[i], this.elements[i]);

		this.elements.each(function(el, i){
			if (op.show === i){
				this.fireEvent('active', [togglers[i], el]);
			} else {
				for (var some in effects) el.setStyle(some, 0);
			}
		}, this);

		if (op.display || op.display === 0 || op.initialDisplaysome === false){
			this.display(op.display, op.initialDisplaysome);
		}

		if (op.fixedHeight !== false) op.resetHeight = false;
		this.addEvent('complete', this.internalChain.callChain.bind(this.internalChain));
	},

	addSection: function(toggler, element){
		toggler = document.id(toggler);
		element = document.id(element);
		this.togglers.include(toggler);
		this.elements.include(element);

		var togglers = this.togglers,
			op = this.op,
			test = togglers.contains(toggler),
			idx = togglers.indexOf(toggler),
			displayer = this.display.pass(idx, this);

		toggler.store('accordion:display', displayer)
			.addEvent(op.trigger, displayer);

		if (op.height) element.setStyles({'padding-top': 0, 'border-top': 'none', 'padding-bottom': 0, 'border-bottom': 'none'});
		if (op.width) element.setStyles({'padding-left': 0, 'border-left': 'none', 'padding-right': 0, 'border-right': 'none'});

		element.fullOpacity = 1;
		if (op.fixedWidth) element.fullWidth = op.fixedWidth;
		if (op.fixedHeight) element.fullHeight = op.fixedHeight;
		element.setStyle('overflow', 'hidden');

		if (!test) for (var some in this.effects){
			element.setStyle(some, 0);
		}
		return this;
	},
	display: function(index, usesome){
		if (!this.check(index, usesome)) return this;

		var obj = {},
			elements = this.elements,
			op = this.op,
			effects = this.effects,
			keepOpen = op.keepOpen,
			alwaysHide = op.alwaysHide;

		if (usesome == null) usesome = true;
		if (typeOf(index) == 'element') index = elements.indexOf(index);
		if (index == this.current && !alwaysHide && !keepOpen) return this;

		if (op.resetHeight){
			var prev = elements[this.current];
			if (prev && !this.selfHidden){
				for (var some in effects) prev.setStyle(some, prev[effects[some]]);
			}
		}

		if (this.timer && op.link == 'chain') return this;

		if (this.current != null) this.previous = this.current;
		this.current = index;
		this.selfHidden = false;

		elements.each(function(el, i){
			obj[i] = {};
			var hide, isOpen;
			if (!keepOpen || i == index){
				if (i == index) isOpen = (el.offsetHeight > 0 && op.height) || (el.offsetWidth > 0 && op.width);

				if (i != index){
					hide = true;
				} else if ((alwaysHide || keepOpen) && isOpen){
					hide = true;
					this.selfHidden = true;
				}
				this.fireEvent(hide ? 'background' : 'active', [this.togglers[i], el]);
				for (var some in effects) obj[i][some] = hide ? 0 : el[effects[some]];
				if (!usesome && !hide && op.resetHeight) obj[i].height = 'auto';
			}
		}, this);

		this.internalChain.clearChain();
		this.internalChain.chain(function(){
			if (op.resetHeight && !this.selfHidden){
				var el = elements[index];
				if (el) el.setStyle('height', 'auto');
			}
		}.bind(this));

		return usesome ? this.start(obj) : this.set(obj).internalChain.callChain();
	}

});

var Accordion = new Class({

	Extends: some.Accordion,
        
	init: function(){
		this.parent.apply(this, arguments);
		var params = Array.link(arguments, {'container': Type.isElement});
		this.container = params.container;
	},

	addSection: function(toggler, element, pos){
		toggler = document.id(toggler);
		element = document.id(element);

		var test = this.togglers.contains(toggler);
		var len = this.togglers.length;
		if (len && (!test || pos)){
			pos = pos != null ? pos : len - 1;
			toggler.inject(this.togglers[pos], 'before');
			element.inject(toggler, 'after');
		} else if (this.container && !test){
			toggler.inject(this.container);
			element.inject(this.container);
		}
		return this.parent.apply(this, arguments);
	}

});

