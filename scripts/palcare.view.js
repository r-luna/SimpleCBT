/**
 * @type {Object}
 * @return {} returns nothing
 * @name palcare.view
 * @description View for the palliative care app.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global window, jQuery, document, palcare */

    function _drawBooleanSlide(o){
        var tpl = palcare.model.getTemplate('truefalse');
    }
    
    function _drawMultiSlide(o){
        var tpl = palcare.model.getTemplate('multi');
    }
    
    function _drawContentSlide(o){
        var tpl = palcare.model.getTemplate('content');
        tpl.find('#topHeaderWrapper').html(o.title);
        tpl.find('#textBox').html(o.text);
        $('#interactive').html(tpl.html());
        palcare.controller.setIsViewRendered(true);
    }
    
    
    // PUBLIC

    /**
	 * Loads the content for the app.
	 * @method
	 * @type {Function}
	 * @name palcare.init
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.loadSlide = function(){
        var currentSlide = palcare.model.getCurrentSlide();
        var slide = data.slides[currentSlide];
        
        if (slide.slidetype === 'truefalse'){ // check to see if the slide is a "true / false" slide
            _drawBooleanSlide(slide);
        } else if (slide.slidetype === 'multi'){ // chekc to see if the slide is a multiple choice slide
            _drawMultiSlide(slide);
        } else { // else the slide must be a content-only slide
            _drawContentSlide(slide);
        }
    };



})(this.palcare.view = this.palcare.view || {},jQuery);


