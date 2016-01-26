/**
 * @type {Object}
 * @return {} returns nothing
 * @name audi
 * @description Holds the INIT for the app, sets up everything, such as event subscriptions, event listeners, and renders the desired view.
 * @namespace Holds all functionality
 */
;(function(ns,$){ // d
    /* js:option explicit*/
    /* global jQuery, document */

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
        palcare.controller.subscribe('mouseup',palcare.controller.doNextSlide);
        palcare.controller.subscribe('mouseup',palcare.controller.doPreviousSlide);
        palcare.controller.subscribe('mouseup',palcare.controller.doQuestionBtn);
        //palcare.controller.subscribe('mousedown',palcare.controller.changeButtonState);

        //palcare.controller.subscribe('keydown',palcare.controller.doKeyEvents);

        // setup listeners
        $('body').on('mouseup','.btn',palcare.controller.notify);
        //$('body').on('mousedown','.btn',palcare.controller.notify);
        //$('body').on('keydown','input',palcare.controller.notify);

        $.ajaxSetup({error:
            function(xhr, status, error){
                console.log('?',status,error);
            }
        });

        palcare.model.loadTemplates();
        palcare.model.loadData();
        palcare.model.checkForCompleteLoad();
    };
    
    $(function(){palcare.init();});

})(this.palcare = this.palcare || {},jQuery);



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
	 * Sets the value for "_isViewRendered - helps prevent click spamming of ui elements when views are being loaded;
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
	 * Removes subscribers from the _subscriptions array.
	 * @type {Function}
     * @name palcare.controller.unsubscribe
	 * @param {String} eType - the event type
	 * @param {Object} cb - the function reference
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.unsubscribe = function(){
        console.log('palcar.controller.unsibscrobe');
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
        var slidesLen = palcare.model.getData().slides.slide.length;
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
	 * Handles the user's answer by handing the event to the slide object's "answer" method.
	 * @type {Function}
     * @name palcare.controller.doQuestionBtn()
	 * @param {Object} e - the event object
	 * @return {} Returns nothing
	 * @see palcare.init()
	 */
    ns.doQuestionBtn = function(e){
        if ($(e.target).data('action') !== 'doQuestionBtn'){
            return;
        }
        palcare.view.sendAnswer(e);
    };
    
})(this.palcare.controller = this.palcare.controller  || {}, jQuery);

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
	 * @name palcare.model.setScore()
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
	 * @name palcare.model.setScore()
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
	 * @name palcare.model.loadData()
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
	 * @name palcare.model.getCurrentSlide()
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
	 * @name palcare.model.getData()
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
	 * @name palcare.model.loadTemplates()
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
            window.setTimeout(palcare.model.checkForCompleteLoad,200);
            return;
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



/**
 * @type {Object}
 * @return {} returns nothing
 * @name palcare.view
 * @description View for the palliative care app.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global jQuery, palcare, window */

    var _currentSlideObj = null;
    var _globalContentFadeInterval = 500; // ms
    
    var _classes = {
            content:function(){
                var that = this;
                this.contentObj = null;
                this.synchedIndex = 0;
                this.timer = null;
                function subscribeToEvents(){
                    //palcare.controller.subscribe('mouseup',palcare.controller.doNextSlide);
                }
                function unsubscribeToEvents(){
            
                }
                function hideSynchedContent(){
                    var slide = that.contentObj.synchedcontent.content[that.synchedIndex];
                    $('#textBox').removeClass('fadeIn');
                    that.timer = window.setTimeout(showSynchedContent,_globalContentFadeInterval);
                }
                function showSynchedContent(){
                    var slide = that.contentObj.synchedcontent.content[that.synchedIndex];
                    var slideLen = that.contentObj.synchedcontent.content.length;
                    $('#textBox').html(slide.toString());
                    $('#textBox').addClass('fadeIn');
                    if (that.synchedIndex !== slideLen-1){
                        that.synchedIndex++;
                        that.timer = window.setTimeout(hideSynchedContent,parseInt(slide._time));
                    } else {
                        console.log('done');
                    }
                }
                function renderContentSlide(){
                    var tpl = palcare.model.getTemplate('content');
                    tpl.find('#topHeaderWrapper').html(that.contentObj._title);
                    $('#interactive').html(tpl.html());
                    palcare.controller.setIsViewRendered(true);
                }
                this.pause = function(){
                    window.clearTimeout(that.timer);
                };
                this.resume = function(){
                    var slide = that.contentObj.synchedcontent.content[that.synchedIndex];
                    that.timer = window.setTimeout(hideSynchedContent,slide._time);
                };
                this.unload = function(){
                    window.clearInterval(that.timer);
                    that.timer = null;
                };
                this.init = function(content){
                    that.contentObj = content;
                    console.log(content); 
                    var slide = that.contentObj.synchedcontent.content[that.synchedIndex];
                    $('#interactive').addClass('fadeIn');
                    renderContentSlide();
                    
                    that.timer = window.setTimeout(showSynchedContent,parseInt(slide._time));
                    //_subscribeToEvents();
                };
            },
            boolean: function(){
                var that = this;
                var answered = false;
                this.contentObj = null;

                function renderBooleanSlide(){
                    var tpl = palcare.model.getTemplate('boolean');
                    tpl.find('#questionTitle').html(that.contentObj._title);
                    tpl.find('#textBox2').html(that.contentObj.question.toString());
                    tpl.find('#answer0').attr('data-isanswer',(that.contentObj.answer === 'true' ? true : false));
                    tpl.find('#answer1').attr('data-isanswer',(that.contentObj.answer === 'true' ? false : true));
                    $('#interactive').html(tpl.html());
                    $('#interactive').addClass('fadeIn');
                    palcare.controller.setIsViewRendered(true);
                }
                this.unload = function(){
                    // needs to be here
                };
                this.handleAnswer = function(e){
                    if (answered){
                        return;
                    }
                    var isCorrect = $(e.target).data('isanswer');
                    var answerndx = $(e.target).data('answerndx');
                    palcare.model.setScore(isCorrect,answerndx);
                    answered = true;
                };
                this.init = function(content){
                    that.contentObj = content;
                    renderBooleanSlide();
                    console.log(content);
                };
            },
            multiplechoice: function(){
                var that = this;
                var answered = false;
                this.contentObj = null;
                function renderMultiplechoiceSlide(){
                    var tpl = palcare.model.getTemplate('multi');
                    var answers = that.contentObj.answers.answer;
                    tpl.find('#questionSubTitle').html(that.contentObj.subtitle);
                    tpl.find('#questionMainTitle').html(that.contentObj._title);
                    tpl.find('#questiontext').html(that.contentObj.question.toString());
                    for (var i=0;i<answers.length;i++){
                        tpl.find('#answer' + i).html(answers[i].toString());
                        tpl.find('#answerWrapper' + i).attr('data-isanswer',answers[i]._iscorrect); // attr() is necessary
                        tpl.find('#answerWrapper' + i).attr('data-answerndx',i); // attr() is necessary
                    }

                    $('#interactive').html(tpl.html());
                    $('#interactive').addClass('fadeIn');
                    palcare.controller.setIsViewRendered(true);
                }
                this.handleAnswer = function(e){
                    if (answered){
                        return;
                    }
                    var isCorrect = $(e.target).data('isanswer');
                    var answerndx = $(e.target).data('answerndx');
                    palcare.model.setScore(isCorrect,answerndx);
                    answered = true;
                };
                this.unload = function(){
                    // needs to be here nonetheless
                };
                this.init = function(content){
                    that.contentObj = content;
                    renderMultiplechoiceSlide();
                };
            }
        };
    
    
    // PUBLIC

    /**
	 * Loads the content for the app.
	 * @method
	 * @type {Function}
	 * @name palcare.view.loadSlide()
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.loadSlide = function(){
        var slide = palcare.model.getData().slides.slide[palcare.model.getCurrentSlide()];
        $('#interactive').removeClass('fadeIn');
        if (_currentSlideObj !== null){
            _currentSlideObj.unload(); 
        }
        window.setTimeout(function(){
            _currentSlideObj = new _classes[slide._slidetype]();
            _currentSlideObj.init(slide);
        },_globalContentFadeInterval);
    };

    /**
	 * Pass the selected answer to the slide object.
	 * @method
	 * @type {Function}
	 * @name palcare.view.sendAnswer()
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.sendAnswer = function(e){
        _currentSlideObj.handleAnswer(e);  
    };
    
    ns.insertModal = function(){
        
    };
    
})(this.palcare.view = this.palcare.view || {},jQuery);


