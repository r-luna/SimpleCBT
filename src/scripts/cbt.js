/**
 * @type {Object}
 * @return {} returns nothing
 * @name audi
 * @description Holds the INIT for the app, sets up everything, such as event subscriptions, event listeners, and renders the desired view.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global jQuery, document */

    // PUBLIC

    /**
	 * Description.
	 * @method
	 * @private
	 * @type {Function}
	 * @name cbt.init
	 * @param {}
	 * @return {} Returns nothing
	 */  
    ns.init = function(){
        document.ontouchmove = function(e) {e.preventDefault();};

        // create subscriptions
        cbt.controller.subscribe('mouseup',cbt.controller.doNextSlide,'doNextSlide');
        cbt.controller.subscribe('mouseup',cbt.controller.doPreviousSlide,'doPreviousSlide');
        cbt.controller.subscribe('mouseup',cbt.controller.doQuestionBtn,'doQuestionBtn');
        cbt.controller.subscribe('mouseup',cbt.controller.doPauseBtn,'doPauseSlide');
        //cbt.controller.subscribe('mousedown',cbt.controller.changeButtonState);

        //cbt.controller.subscribe('keydown',cbt.controller.doKeyEvents);

        // setup listeners
        $('body').on('mouseup','.btn',cbt.controller.notify);
        //$('body').on('mousedown','.btn',cbt.controller.notify);
        //$('body').on('keydown','input',cbt.controller.notify);

        $.ajaxSetup({error:
            function(xhr, status, error){
                console.log('?',status,error);
            }
        });

        cbt.model.loadTemplates();
        cbt.model.loadData();
        cbt.model.checkForCompleteLoad();
    };
    
    $(function(){cbt.init();});

})(this.cbt = this.cbt || {},jQuery);


