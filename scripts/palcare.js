/**
 * @type {Object}
 * @return {} returns nothing
 * @name audi
 * @description Holds the INIT for the app, sets up everything, such as event subscriptions, event listeners, and renders the desired view.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global window, jQuery, document */

    // PUBLIC

    /**
	 * Description.
	 * @method
	 * @private
	 * @type {Function}
	 * @name palcare.init
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.init = function(){
        document.ontouchmove = function(e) {e.preventDefault();};

        // create subscriptions
        palcare.controller.subscribe('click',palcare.controller.doBtnSelect);
        //palcare.controller.subscribe('mousedown',palcare.controller.changeButtonState);

        palcare.controller.subscribe('keydown',palcare.controller.doKeyEvents);

        // setup listeners
        $('body').on('click','.btn',palcare.controller.notify);
        $('body').on('mousedown','.btn',palcare.controller.notify);
        $('body').on('keydown','input',palcare.controller.notify);

    };

    /**
	 * Inits the app.
	 * @method
	 * @type {Function}
	 * @name palcare.init
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.init = function(){
        palcare.model.loadTemplates();
        palcare.model.checkForCompleteLoad();
    };
    
    $(function(){palcare.init();});

})(this.palcare = this.palcare || {},jQuery);


