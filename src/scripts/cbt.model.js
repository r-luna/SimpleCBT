/**
 * @type {Object}
 * @return {} returns nothing
 * @name cbt.model
 * @description Model for the CBT app.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global window, jQuery, cbt */

    // PRIVATE
    
    var _currentSlide = 0;
    
    var _templates = {
        content:null,
        multi:null,
        boolean:null,
        modal:null,
        endscreen: null
    };
    
    var _data = null;
    
    var _scores = {};
    
    // PUBLIC

    /**
	 * Keeps track of the user's score.
	 * @method
	 * @type {Function}
	 * @name cbt.model.setScore()
	 * @param {Number} slidendx - the number of the current slide
     * @param {String} answer - the selected answer,values can be boolan or multiplechoice (a, b, c, d)
     * @param {Boolean} iscorrect - is the answer correct
	 * @return {} Returns nothing
	 */    
    ns.setScore = function(iscorrect,answerndx){
        _scores['slide' + _currentSlide] = {slidendx: _currentSlide, iscorrect:iscorrect,answerndx:answerndx};
        console.log(_scores);
    };
    
    /**
	 * Keeps track of the user's score.
	 * @method
	 * @type {Function}
	 * @name cbt.model.setScore()
	 * @param {Number} slidendx - the number of the current slide
	 * @return {} Returns nothing
	 */    
    ns.getSpecificScore = function(ndx){
        return _scores['slide'+ndx];  
    };
    
    /**
	 * Loads the coontent data.
	 * @method
	 * @type {Function}
	 * @name cbt.model.loadData()
	 * @param {Number} num - the number of the current slide
	 * @return {} Returns nothing
	 */
    ns.loadData = function(){
        $.ajax({
            type: 'GET',
            url: 'scripts/data.xml',
            cache: false,
            dataType: 'text',
            success: function(responseData,status,xhr){
                var xobj = new X2JS();
                _data = xobj.xml_str2json(responseData).data;
            }
        });
    };
    
    /**
	 * Returns the current slide number.
	 * @method
	 * @type {Function}
	 * @name cbt.model.getCurrentSlide()
	 * @param {Number} num - the number of the current slide
	 * @return {} Returns nothing
	 */
    ns.getCurrentSlide = function(){
        return _currentSlide;   
    };
    
    /**
	 * Returns content data.
	 * @method
	 * @type {Function}
	 * @name cbt.model.getData()
	 * @param {Number} num - the number of the current slide
	 * @return {} Returns nothing
	 */
    ns.getData = function(){
        return _data;  
    };
    
    /**
	 * Sets the current slide number.
	 * @method
	 * @type {Function}
	 * @name cbt.model.setNextSlide()
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
	 * @name cbt.model.setNextSlide()
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
	 * @name cbt.model.loadTemplates()
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.loadTemplates = function(){
        $.get('./templates/content_tpl.html', function(template){
            _templates.content = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
        $.get('./templates/modal_tpl.html', function(template){
            _templates.modal = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
        $.get('./templates/multiple_choice_tpl.html', function(template){
            _templates.multi = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
        $.get('./templates/boolean_tpl.html', function(template){
            _templates.boolean = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
        $.get('./templates/end_screen_tpl.html', function(template){
            _templates.endscreen = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
        });
    };
    
    /**
	 * Recursive function that checks all properties of the _templates object to ensure that all templates have been loaded
	 * @method
	 * @type {Function}
	 * @name cbt.model.loadTemplates()
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.checkForCompleteLoad = function(){
        var loaded = true;
        for (var p in _templates){
            if (!_templates[p]){
                loaded = false;
            }
        }
        if (_data === null){
            loaded = false;
        }
        if (!loaded){
            console.log('loading...');
            window.setTimeout(cbt.model.checkForCompleteLoad,200);
            return;
        }
        cbt.view.loadSlide();
    };

    /**
	 * Loads the content for the app.
	 * @method
	 * @type {Function}
	 * @name cbt.model.setCurrentSlide()
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
	 * @name cbt.model.getCurrentSlide()
	 * @param {String} str - the string representing the desired template to return.
	 * @return {} Returns nothing
	 */
    ns.getTemplate = function(str){
        return _templates[str];
    };
    
})(this.cbt.model = this.cbt.model || {},jQuery);


