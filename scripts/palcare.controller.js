/**
 * @type {Object}
 * @return {} returns nothing
 * @name palcare.controller
 * @description The controller for the application - all events are routed through the controller's publisher which notifies subscribing controller methods
 * @namespace holds the event pub/sub system and button methods of the event in question. See palcare.init() for the event subscriptions and delegated event listeners.
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global palcare, jQuery */

    // PRIVATE


	/**
     * holds all event subscriptions
     * @private
     */
	var _subscriptions = {};

    /**
     * @private
     */
    var _isViewRendered = false; //This variable is used to prevent UI interaction if views have not yet been rendered.

    // PUBLIC

	/**
	 * Sets the value for "_isViewRendered"" - helps prevent click spamming of ui elements when views are being loaded;
	 * @type {Function}
     * @name palcare.controller.setIsViewRendered
	 * @param {String} eType - the event type
	 * @param {Object} cb - the function reference
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.setIsViewRendered = function(bool){
        _isViewRendered = bool;   
    };
    
	/**
	 * This handles the event subscriptions. Subscribers pass the event type and the callback.
	 * @type {Function}
     * @name palcare.controller.subscribe
	 * @param {String} eType - the event type
	 * @param {Object} cb - the function reference
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
	ns.subscribe = function(eType,cb){
		if (!_subscriptions.hasOwnProperty(eType)){
			_subscriptions[eType] = [];
		}
		_subscriptions[eType].push(cb);
	};

	/**
	 * This notifies the event subscribers (hashchange has a separate publisher). When an event fires all subscribers to the event are notified. The subscribers
     * inspect the event target to see if the event is something that they are expected to act upon.
	 * @type {Function}
     * @name palcare.controller.notify
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
	ns.notify = function(e){
		if (!$(e.target).data('action')){
            // if e.target does not have a data action search through a max of 5 parents to find it
            var obj = e.target;
            var max = 0;
            while (!$(obj).data('action') && max != 5){
                obj = $(obj).parent();
                ++max;
            }
            if (!$(obj).data('action')){
                return;
            } else {
                e.target = obj;
            }
		}
        if (!_isViewRendered){
            e.preventDefault();
            return;
        }

		var cbs = _subscriptions[e.type];
		for (var i=0;i<cbs.length;i++){
            cbs[i](e);
		}

	};

	/**
	 * Handles touchstart / mousedown events for btn elements.
	 * @type {Function}
     * @name palcare.controller.doChangeButtonState
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
	ns.changeButtonState = function(e){
		if ($(e.type) !== 'touchstart' || $(e.type) !== 'mousedown'){
			if (!$(e.target).hasClass('btn')){
				return;
			}
		}
        if (!$(e.target).hasClass('btn_disabled')){
            palcare.util.doChangeButtonState(e);
        }
	};

	/**
	 * Handles touchend / mouseup events for btn elements.
	 * @type {Function}
     * @name palcare.controller.revertButtonState
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
	ns.revertButtonState = function(e){
		if (e.type === 'touchend' || e.type === 'mouseup'){
            palcare.util.doRevertButtonState(e);
		}
	};


	/**
     * Advances the cbt to the next slide
	 * @type {Function}
     * @name palcare.controller.doSpecialPartsAccept
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.doNextSlide = function(e){
        var currentSlide = palcare.model.getCurrentSlide();
        var slidesLen = data.slides.length;
		if ($(e.target).data('action') !== 'doNextSlide' || currentSlide + 1 === slidesLen){
            return;
        }
        ns.setIsViewRendered(false);
        palcare.model.setNextSlide();
        palcare.view.loadSlide();
    };

	/**
	 * Move the cbt back to the previous slide
	 * @type {Function}
     * @name palcare.controller.doPreviousSlide
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.doPreviousSlide = function(e){
        var currentSlide = palcare.model.getCurrentSlide();
		if ($(e.target).data('action') !== 'doPreviousSlide' || currentSlide === 0){
            return;
        }
        //ns.setIsViewRendered(false);
        palcare.model.setPreviousSlide();
        palcare.view.loadSlide();
    };

	/**
	 * Move the cbt back to the previous slide
	 * @type {Function}
     * @name palcare.controller.doPreviousSlide
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.doCheckStatement = function(e){
		if ($(e.target).data('action') !== 'doCheckStatement'){
            return;
        }
        console.log($(e.target).data('value'));
        palcare.model.checkSlideForTruthfulness();
    };
    
})(this.palcare.controller = this.palcare.controller  || {}, jQuery);
