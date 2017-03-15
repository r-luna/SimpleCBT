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
    
	// cache templates
    var _templates = {
        content:null,
        multi:null,
        bool:null,
        modal:null,
        endscreen: null
    };
    
    var _data = null;
    
    var _scores = [];
    
	/**
	 * Saves the app's state to localstorage
	 * @function
	 * @type {Function}
	 * @name cbt.model.saveToClient
	 * @param {String} str - the quiz ID
	 * @returns {} returns nothing
	 */
	function saveToClient(){
		// build state object
		var quizState = {
			id: _data.app._id,
			currentSlide: _currentSlide,
			scores: _scores
		};
		// insert
		if (window.localStorage){
			localStorage.setItem(_data.app._id,JSON.stringify(quizState));
		} else {
			window.alert('Your browser doesn\'t support localstorage');
		}
	}
	
	/**
	 * Retrives the app's state from the client
	 * @function
	 * @type {Function}
	 * @name cbt.model.readFromCient
	 * @param {}
	 * @returns {Boolean} true/false for success/failure, assume failure to be that the object doesnt exist
	 */
	function readFromCient(){
		// is there a previou state?
		var state = localStorage.getItem(_data.app._id);
		if (!!state){
			_currentSlide = state.currentSlide;
			_scores = state.scores;
			return true;
		} else {
			return false;
		}
	}
	
	
    // PUBLIC

    /**
	 * Keeps track of the user's score.
	 * @method
	 * @type {Function}
	 * @name cbt.model.setScore()
	 * @param {Number} slidendx - the number of the current slide
     * @param {String} answer - the selected answer, values can be boolan or multiplechoice (a, b, c, d)
     * @param {Boolean} iscorrect - is the answer correct
	 * @return {} Returns nothing
	 */    
    ns.setScore = function(iscorrect,answerndx){
        _scores.push({slidendx: _currentSlide, iscorrect:iscorrect, answerndx:answerndx});
		saveToClient();
    };
    
    /**
	 * Returns the current final score.
	 * @method
	 * @type {Function}
	 * @name cbt.model.getScore()
	 * @return {Number} Returns a number
	 */    
    ns.getScore = function(){
		var totalCorrect = 0;
		var totalQuestions = 0;
		var totalIncorrect = 0;
		var slideType = null;
		var score = 0;
		
		console.log(_scores);
		
		// find total correct & wrong
		for (var i=0;i<_scores.length;i++){
			if (_scores[i].iscorrect){
				totalCorrect++;
			} else {
				totalIncorrect++;
			}
		}
		
		// find total questions... number of answers is technically also the number of questions but lets not rely on that...
		for (var j=0;j<_data.slides.slide.length;j++){
			slideType = _data.slides.slide[j]._slidetype;
			if (slideType !== 'content'){
				totalQuestions++;
			}
		}
		score = Math.floor(totalCorrect / _scores.length * 100);
		// determine score
		return {
			correct: totalCorrect,
			wrong: totalIncorrect,
			questions: totalQuestions,
			score: isNaN(score) ? 0 : score,
			obj: _scores
		};
    };
	
    /**
	 * Gets the score per the given slide index.
	 * @method
	 * @type {Function}
	 * @name cbt.model.getSpecificScore()
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
            _templates.bool = $('<div></div>').append($($.parseHTML(template)).find('#interactive').html());
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


