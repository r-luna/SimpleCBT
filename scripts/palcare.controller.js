/**
 * @type {Object}
 * @return {} returns nothing
 * @name palcare.controller
 * @description The controller for the application - all events are routed through the controller's publisher which notifies subscribing controller methods
 * @namespace holds the event pub/sub system and button methods of the event in question. See palcare.init() for the event subscriptions and delegated event listeners.
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global palcare, window, jQuery, document, $, ll */

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
	 * This notifies the hashchange event subscribers.
	 * @type {Function}
     * @name palcare.controller.notifyHashChange
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.notifyHashChange = function(e){
        var cbs = _subscriptions[e.type];
		for (var i=0;i<cbs.length;i++){
			cbs[i](_events.slice(-1)[0]);
		}
    };

	/**
	 * Changes the location hash which will trigger the hashchange event which itself triggers the appropriate view update.
	 * @example
     *      &lt;div id="someButton" data-action="updateHash" data-hash="defaultView"&gt;&lt;/div&gt;
	 * @type {Function}
     * @name palcare.controller.triggerViewChange
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.triggerViewChange = function(e){
		if ($(e.target).data('action') !== 'updateHash'){
			return;
		}
        function updateHash(){
            ns.updateViewRenderState(false);
            palcare.util.destroy_iScroll();
            _events.push(e);
            window.location.hash = $(e.target).data('hash');
        }
        if ($(e.target).hasClass('btn') || $(e.target).hasClass('radioWrapper')){ // if triggered by a button or radio
            if (!$(e.target).hasClass('btn_disabled') && !$(e.target).hasClass('radio_disabled')){
                updateHash();
            }
        } else {
            updateHash();
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
	 *
	 * @type {Function}
     * @name palcare.controller.doSpecialPartsAccept
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.doBtnSelect = function(e){
		//if ($(e.target).data('action') !== 'doSpecialPartsAccept'){
        //    return;
        //}
        console.log('clicked');
    };


})(this.palcare.controller = this.palcare.controller  || {}, jQuery);
