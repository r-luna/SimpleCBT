/**
 * @type {Object}
 * @return {} returns nothing
 * @name cbt.view
 * @description View for the CBT app.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global jQuery, cbt, window */

    var _currentSlideObj = null;
    var _globalContentFadeInterval = 500; // ms
	var _globalPauseToEnableInterval = 1000; //ms
    
    var _classes = {
            content:function(){
                var that = this;
                this.contentObj = null;
                this.pageIndex = 0;
                this.contentIndex = 0;
                this.timer = null;
                this.canFadeContent = true;
                function hideSynchedContent(){
                    $('#textBox').removeClass('fadeIn');
                    that.timer = window.setTimeout(showSynchedContent,_globalContentFadeInterval);
                }
                var RemovePreviousPage = function(el){
                    var that = this;
                    this.elm = el;
                    this.fadeOutElm = function(){
                        $(that.elm).removeClass('fadeIn');
                        window.setTimeout(that.removeElm,_globalContentFadeInterval);
                    };
                    this.removeElm = function(){
                        $(that.elm).remove();
                    };
                };
                function showSynchedContent(){
                    var pageLen = that.contentObj.pages.page.length;
                    
					if (that.contentObj.pages.page.content){
						var contentLen = that.contentObj.pages.page.content.length;
					} else {
						var contentLen = that.contentObj.pages.page[that.pageIndex].content.length;
					}
					
                    var slide = null;
					
                    if (that.contentIndex < contentLen){
                        if (that.contentObj.pages.page.content){
							slide = that.contentObj.pages.page.content[that.contentIndex];
						} else {
							slide = that.contentObj.pages.page[that.pageIndex].content[that.contentIndex];
						}
                        that.contentIndex++;
                    } else {
                        turnThePage();
                        return;
                    }
					
                    $('<li>' + slide.toString() + '</li>').appendTo('#list');
                    $('#textBox').addClass('fadeIn');
                    
                    window.setTimeout(function(){
                        $('#list li').last().addClass('fadeIn'); 
                    },10);

                    if (that.pageIndex === (that.contentObj.pages.page.length - 1) && that.contentIndex === contentLen || that.contentObj.pages.page.content && that.contentIndex === contentLen){
						window.setTimeout(function(){
							cbt.view.enableControls(true);
						},_globalPauseToEnableInterval);
                       return;
                    }
                    that.timer = window.setTimeout(showSynchedContent,parseInt(slide._time));
                }
                function turnThePage(){
                    var pageLen = that.contentObj.pages.page.length;
                    that.pageIndex++;
                    that.contentIndex = 0;
                    if (that.pageIndex < pageLen){
                        // hide the previous bullets
                        $('#list li').each(function(i){
                            var obj = $(this);
                            var temp = new RemovePreviousPage(obj);
                            temp.fadeOutElm();
                        });
                        // pause to allow previous bullet itmes to fade out from the screen
                        window.setTimeout(showSynchedContent,_globalContentFadeInterval);
                    } 
                }
                function renderContentSlide(){
                    var tpl = cbt.model.getTemplate('content');
                    tpl.find('#topHeaderWrapper').html(that.contentObj._title);
                    $('#interactive').html(tpl.html());
                    cbt.controller.setIsViewRendered(true);
                }
                this.pause = function(){
                    if (that.timer){
                        window.clearTimeout(that.timer);
                        that.timer = null;
                    } else {
                        that.resume();
                    }
                };
                this.resume = function(){
                    var content = that.contentObj.pages.page[that.pageIndex].content[that.contentIndex];
                    if (content !== void 0){
                        that.timer = window.setTimeout(showSynchedContent,content._time);
                    } else {
                        turnThePage();
                    }
                };
                this.unload = function(){
                    window.clearInterval(that.timer);
                    that.timer = null;
                };
                this.init = function(content){
                    that.contentObj = content; // that.contentObj.pages.page[]
					if (that.contentObj.pages.page.content){ // no nested pages so the xml2json parse considers this an object, not an array
						var slide = that.contentObj.pages.page.content[that.contentIndex];
					} else {
						var slide = that.contentObj.pages.page[that.pageIndex].content[that.contentIndex];
					}
                    $('#interactive').addClass('fadeIn');
                    renderContentSlide();
                    that.timer = window.setTimeout(showSynchedContent,parseInt(slide._time));
                    
                };
            },
            boolean: function(){
                var that = this;
                this.answered = false;
                this.contentObj = null;

                function renderBooleanSlide(){
                    var tpl = $(cbt.model.getTemplate('boolean')).clone();
                    tpl.find('#questionTitle').html(that.contentObj._title);
                    tpl.find('#textBox2').html(that.contentObj.question.toString());
                    tpl.find('#answer0').attr('data-isanswer',(that.contentObj._answer === 'true' ? true : false));
                    tpl.find('#answer1').attr('data-isanswer',(that.contentObj._answer === 'true' ? false : true));
                    $('#interactive').html(tpl.html());
                    $('#interactive').addClass('fadeIn');
                    cbt.controller.setIsViewRendered(true);
                }
                this.unload = function(){
                    // needs to be here
                };
                this.handleAnswer = function(e){
                    if (that.answered){
                        return;
                    }
                    var isCorrect = $(e.target).data('isanswer');
                    var answerndx = $(e.target).data('answerndx');
                    var responseObj = {};
					
					if (isCorrect){
						if ($(e.target).hasClass('trueBtn')){
							$('.trueBtn:first').addClass('correct');
							$('.falseBtn:first').addClass('disabled');
						} else {
							$('.falseBtn:first').addClass('correct');
							$('.trueBtn:first').addClass('disabled');
						}
					} else {
						if ($(e.target).hasClass('trueBtn')){
							$('.trueBtn:first').addClass('incorrect');
							$('.falseBtn:first').addClass('disabled');
						} else {
							$('.falseBtn:first').addClass('incorrect');
							$('.trueBtn:first').addClass('disabled');
						}
					}
					// assemble the response object so that we can respond appropriately to the user's selection
					responseObj.responseText = that.contentObj.responses.response[answerndx].responsetext.toString();
					responseObj.correct = isCorrect;
					// insert the response modal
					cbt.view.insertResponse(responseObj);
					// ensure the user cannot change their answer
                    that.answered = true;
					// record the scroe
					cbt.model.setScore(isCorrect,answerndx);
					// enable the controls
					cbt.view.enableControls(true);
                };
                this.init = function(content){
                    that.contentObj = content;
                    renderBooleanSlide();
                };
            },
            multiplechoice: function(){
                var that = this;
                this.answered = false;
                this.contentObj = null;
                function renderMultiplecCoiceSlide(){
                    var tpl = $(cbt.model.getTemplate('multi')).clone();
                    var answers = that.contentObj.answers.answer;
                    tpl.find('#questionSubTitle').html(that.contentObj.subtitle);
                    tpl.find('#questionMainTitle').html(that.contentObj._title);
                    tpl.find('#questiontext').html(that.contentObj.question.toString());
                    for (var i=0;i<answers.length;i++){
                        tpl.find('#answer' + i).html(answers[i].toString());
                        tpl.find('#answerWrapper' + i).attr('data-isanswer',answers[i]._iscorrect); // attr() is necessary
                        tpl.find('#answerWrapper' + i).attr('data-answerndx', (answers[i]._iscorrect ? 1 : 0) ); // attr() is necessary
                    }

                    $('#interactive').html(tpl.html());
                    $('#interactive').addClass('fadeIn');
                    cbt.controller.setIsViewRendered(true);
                }
                this.handleAnswer = function(e){
                    if (that.answered){
                        return;
                    }
					var responseObj = {};
                    var isCorrect = $(e.target).data('isanswer');
                    var answerndx = $(e.target).data('answerndx');
                    cbt.model.setScore(isCorrect,answerndx);
					
					responseObj.responseText = that.contentObj.responses.response[answerndx].responsetext.toString();
					
					// assemble the response object so that we can respond appropriately to the user's selection
					//responseObj.responseText = that.contentObj.responses.response[answerndx].responsetext.toString();
					responseObj.correct = isCorrect;
					// insert the response modal
					cbt.view.insertResponse(responseObj);
					// ensure the user cannot change their answer
                    that.answered = true;
					// record the scroe
					cbt.model.setScore(isCorrect,answerndx);
					// enable the controls
					cbt.view.enableControls(true);
                };
                this.unload = function(){
                    // needs to be here nonetheless
                };
                this.init = function(content){
                    that.contentObj = content;
                    renderMultiplecCoiceSlide();
                };
            },
            endscreen: function(){
                var that = this;
                this.results = null;
                function renderSlide(){
                    var tpl = cbt.model.getTemplate('endscreen');
                    tpl.find('#summary').html('You correctly answered ' + that.results.correct + ' out of ' + that.results.questions + ' questions.');
					tpl.find('#score').html('Total Score: ' + that.results.score + '%');
                    $('#interactive').html(tpl.html());
                    $('#interactive').addClass('fadeIn');
                    cbt.controller.setIsViewRendered(true);
                }
                this.unload = function(){
                    // needs to be here nonetheless
                };
                this.init = function(resultsObject){
                    that.results = resultsObject;
                    renderSlide();
                };
            }
        };
    
    
    // PUBLIC

    /**
	 * Loads the content for the app.
	 * @method
	 * @type {Function}
	 * @name cbt.view.loadSlide()
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.loadSlide = function(){
        var slide = cbt.model.getData().slides.slide[cbt.model.getCurrentSlide()];
		cbt.view.enableControls(false);
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
	 * Pause the slide so the timer doesnt keep running.
	 * @method
	 * @type {Function}
	 * @name cbt.view.pauseSlide()
	 * @param {}
	 * @return {} Returns nothing
	 */    
    ns.pauseSlide = function(){
        _currentSlideObj.pause();
    };

    /**
	 * Pass the selected answer to the slide object.
	 * @method
	 * @type {Function}
	 * @name cbt.view.sendAnswer()
	 * @param {}
	 * @return {} Returns nothing
	 */
    ns.sendAnswer = function(e){
		_currentSlideObj.handleAnswer(e);
    };
	
    /**
	 * Load the summary slide and display the results.
	 * @method
	 * @type {Function}
	 * @name cbt.view.doSummary()
	 * @param {}
	 * @return {} Returns nothing
	 */
	ns.doSummary = function(){
        $('#interactive').removeClass('fadeIn');
		
        if (_currentSlideObj !== null){
            _currentSlideObj.unload(); 
        }
        window.setTimeout(function(){
            _currentSlideObj = new _classes.endscreen();
            _currentSlideObj.init(cbt.model.getScore());
        },_globalContentFadeInterval);
		
	};
	
    /**
	 * This method enables or disables the cbt controls.
	 * @method
	 * @type {Function}
	 * @name cbt.view.enableControls()
	 * @param {Boolean} bool - true or false to enable or disable the cbt controls
	 * @return {} Returns nothing
	 */
	ns.enableControls = function(bool){
		if (bool){
			$('#leftBtn').removeClass('disabled');
			$('#rightBtn').removeClass('disabled');
			$('#pauseBtn').removeClass('disabled');
		} else {
			$('#leftBtn').addClass('disabled');
			$('#rightBtn').addClass('disabled');
			$('#pauseBtn').addClass('disabled');
		}
	};
	
    /**
	 * Inserts a modal that contains feedback to the user re the answer that they have selected.
	 * @method
	 * @type {Function}
	 * @name cbt.view.insertResponse()
	 * @param {Object} o - the response object
	 * @return {} Returns nothing
	 */
	ns.insertResponse = function(o){
		var tpl = cbt.model.getTemplate('modal');
		tpl.find('#modalResponse').html(o.responseText);
		if (o.correct){
			tpl.find('#modalCorrect').removeClass('hidden');
			tpl.find('#modalIncorrect').addClass('hidden');
			tpl.find('#modalPassFailBox').removeClass('fail');
			tpl.find('#modalPassFailBox').addClass('pass');
		} else {
			tpl.find('#modalIncorrect').removeClass('hidden');
			tpl.find('#modalCorrect').addClass('hidden');
			tpl.find('#modalPassFailBox').addClass('pass');
			tpl.find('#modalPassFailBox').addClass('fail');
		}
		tpl.find().html();
		if ($('#dimmed').length === 0){
			$('body').append(tpl.html());
			window.setTimeout(function(){
				$('#dimmed').addClass('fadeIn');
			},0);
			window.setTimeout(function(){
				$('#modalWrapper').addClass('fadeIn');
			},300);
		}
	}
	
	ns.removeResponse = function(){
		$('#dimmed').removeClass('fadeIn');
		$('#modalWrapper').removeClass('fadeIn');
		setTimeout(function(){
			$('#dimmed').remove();
			$('#modalWrapper').remove();
		},_globalContentFadeInterval);
	}

})(this.cbt.view = this.cbt.view || {},jQuery);


