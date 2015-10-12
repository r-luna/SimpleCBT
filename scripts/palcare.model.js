/**
 * @type {Object}
 * @return {} returns nothing
 * @name palcare.model
 * @description Model for the palliative care app.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global window, jQuery, palcare */

    // PRIVATE
    
    var _currentSlide = 0;
    
    var _templates = {
        content:null,
        multi:null,
        truefalse:null,
        modal:null
    };
    
    // PUBLIC

    /**
	 * Returns the current slide number.
	 * @method
	 * @type {Function}
	 * @name palcare.model.getCurrentSlide()
	 * @param {Number} num - the number of the current slide
	 * @return {} Returns nothing
	 */
    ns.getCurrentSlide = function(){
        return _currentSlide;   
    };
    
    /**
	 * Sets the current slide number.
	 * @method
	 * @type {Function}
	 * @name palcare.model.setNextSlide()
	 * @param {} 
	 * @return {} Returns nothing
	 */
    ns.setNextSlide = function(){
        _currentSlide++;  
    };
    
    /**
	 * Sets the current slide to the previous number.
	 * @method
	 * @type {Function}
	 * @name palcare.model.setNextSlide()
	 * @param {} 
	 * @return {} Returns nothing
	 */
    ns.setPreviousSlide = function(){
        _currentSlide--;  
    };
    
    /**
	 * Caches the template files.
	 * @method
	 * @type {Function}
	 * @name palcare.model.loadTemplates()
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.loadTemplates = function(){
        $.get('templates/content_tpl.html', function(template){
            _templates.content = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
        $.get('templates/modal_tpl.html', function(template){
            _templates.modal = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
        $.get('templates/multiple_choice_tpl.html', function(template){
            _templates.multi = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
        $.get('templates/true_false_tpl.html', function(template){
            _templates.truefalse = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
    };
    
    /**
	 * Setinterval that checks all properties of the _templates object to ensure that all templates have been loaded
	 * @method
	 * @type {Function}
	 * @name palcare.model.loadTemplates()
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.checkForCompleteLoad = function(){
        for (p in _templates){
            if (!_templates[p]){
                console.log('loading...');
                window.setTimeout(palcare.model.checkForCompleteLoad,200);
                return;
            }
        }
        palcare.view.loadSlide();
    };

    /**
	 * Loads the content for the app.
	 * @method
	 * @type {Function}
	 * @name palcare.model.setCurrentSlide()
	 * @param {Number} num - the number representing the current slide
	 * @return {} Returns nothing
	 */
    ns.setCurrentSlide = function(num){
        _currentSlide = num;
    };

    /**
	 * Loads the content for the app.
	 * @method
	 * @type {Function}
	 * @name palcare.model.getCurrentSlide()
	 * @param {String} str - the string representing the desired template to return.
	 * @return {} Returns nothing
	 */
    ns.getTemplate = function(str){
        return _templates[str];
    };
    
})(this.palcare.model = this.palcare.model || {},jQuery);


