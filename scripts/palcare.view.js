/**
 * @type {Object}
 * @return {} returns nothing
 * @name palcare.view
 * @description View for the palliative care app.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global jQuery, palcare, data */

    function _renderTrueFalseSlide(o){
        var tpl = palcare.model.getTemplate('truefalse');
        tpl.find('#questionTitle').html(o.title);
        tpl.find('#textBox2').html(o.text);
        $('#interactive').html(tpl.html());
        palcare.controller.setIsViewRendered(true);
    }
    
    function _renderMultiSlide(o){
        var tpl = palcare.model.getTemplate('multi');
        tpl.find('#questionSubTitle').html(o.subtitle);
        tpl.find('#questionMainTitle').html(o.title);
        tpl.find('#questiontext').html(o.question);
        for (var i=0;i<o.answers.length;i++){
            tpl.find('#answer' + i).html(o.answers[i].answertext);
        }
        
        $('#interactive').html(tpl.html());
        palcare.controller.setIsViewRendered(true);
    }
    
    function _renderContentSlide(o){
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
            _renderTrueFalseSlide(slide);
        } else if (slide.slidetype === 'multi'){ // chekc to see if the slide is a multiple choice slide
            _renderMultiSlide(slide);
        } else { // else the slide must be a content-only slide
            _renderContentSlide(slide);
        }
    };



})(this.palcare.view = this.palcare.view || {},jQuery);


