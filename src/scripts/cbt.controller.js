/**
 * @type {Object}
 * @return {} returns nothing
 * @name cbt.controller
 * @description The controller for the application - all events are routed through the controller's publisher which notifies subscribing controller methods
 * @namespace holds the event pub/sub system and button methods of the event in question. See cbt.init() for the event subscriptions and delegated event listeners.
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global cbt, jQuery */

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
	 * Sets the value for "_isViewRendered - helps prevent click spamming of ui elements when views are being loaded;
	 * @type {Function}
     * @name cbt.controller.setIsViewRendered
	 * @param {String} eType - the event type
	 * @param {Object} cb - the function reference
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
    ns.setIsViewRendered = function(bool){
        _isViewRendered = bool;   
    };
    
	/**
	 * This handles the event subscriptions. Subscribers pass the event type and the callback.
	 * @type {Function}
     * @name cbt.controller.subscribe
	 * @param {String} eType - the event type
	 * @param {Object} cb - the function reference
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
	ns.subscribe = function(eType,cb,action){
        var subscriberObj = {cb:cb,action:action};
		if (!_subscriptions.hasOwnProperty(eType)){
			_subscriptions[eType] = [];
		}
		_subscriptions[eType].push(subscriberObj);
	};

	/**
	 * Removes subscribers from the _subscriptions array.
	 * @type {Function}
     * @name cbt.controller.unsubscribe
	 * @param {String} eType - the event type
	 * @param {Object} cb - the function reference
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
    ns.unsubscribe = function(){
        console.log('palcar.controller.unsibscrobe');
    };
    
    
	/**
	 * This notifies the event subscribers (hashchange has a separate publisher). When an event fires all subscribers to the event are notified. The subscribers
     * inspect the event target to see if the event is something that they are expected to act upon.
	 * @type {Function}
     * @name cbt.controller.notify
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
	ns.notify = function(e){
		if ($(e.target).hasClass('disabled')){
			return;
		}
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
            if ($(e.target).data('action') === cbs[i].action){
                cbs[i].cb(e);
            }
		}

	};

	/**
	 * Handles touchstart / mousedown events for btn elements.
	 * @type {Function}
     * @name cbt.controller.doChangeButtonState
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
	ns.changeButtonState = function(e){
		if ($(e.type) !== 'touchstart' || $(e.type) !== 'mousedown'){
			if (!$(e.target).hasClass('btn')){
				return;
			}
		}
        if (!$(e.target).hasClass('btn_disabled')){
            cbt.util.doChangeButtonState(e);
        }
	};

	/**
	 * Handles touchend / mouseup events for btn elements.
	 * @type {Function}
     * @name cbt.controller.revertButtonState
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
	ns.revertButtonState = function(e){
		if (e.type === 'touchend' || e.type === 'mouseup'){
            cbt.util.doRevertButtonState(e);
		}
	};


	/**
     * Advances the cbt to the next slide
	 * @type {Function}
     * @name cbt.controller.doSpecialPartsAccept
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
    ns.doNextSlide = function(e){
        var currentSlide = cbt.model.getCurrentSlide();
        var slidesLen = cbt.model.getData().slides.slide.length;
		if (currentSlide + 1 === slidesLen){
			$('#controlsWrapper').hide();
			cbt.view.doSummary();
            return;
        }
        ns.setIsViewRendered(false);
		cbt.view.removeResponse();
        cbt.model.setNextSlide();
        cbt.view.loadSlide();
    };

	/**
	 * Move the cbt back to the previous slide
	 * @type {Function}
     * @name cbt.controller.doPreviousSlide
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
    ns.doPreviousSlide = function(e){
        var currentSlide = cbt.model.getCurrentSlide();
		if (currentSlide === 0){
            return;
        }
        //ns.setIsViewRendered(false);
		cbt.view.removeResponse();
        cbt.model.setPreviousSlide();
        cbt.view.loadSlide();
    };
    
	/**
	 * Handles the user's answer by handing the event to the slide object's "answer" method.
	 * @type {Function}
     * @name cbt.controller.doQuestionBtn()
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
    ns.doQuestionBtn = function(e){
        cbt.view.sendAnswer(e);
    };
    
	/**
	 * Handles the "pause slide" btn.
	 * @type {Function}
     * @name cbt.controller.doPauseSlide()
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see cbt.init()
	 */
    ns.doPauseBtn = function(e){
        cbt.view.pauseSlide();
    };
    
})(this.cbt.controller = this.cbt.controller  || {}, jQuery);
