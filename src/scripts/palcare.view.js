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
                this.pageIndex = 0;
                this.contentIndex = 0;
                this.timer = null;
                this.canFadeContent = true;
                function subscribeToEvents(){
                    //palcare.controller.subscribe('mouseup',palcare.controller.doNextSlide);
                }
                function unsubscribeToEvents(){
            
                }
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
                    var contentLen = that.contentObj.pages.page[that.pageIndex].content.length;
                    var slide = null;
                    if (that.contentIndex < contentLen){
                        slide = that.contentObj.pages.page[that.pageIndex].content[that.contentIndex];
                        that.contentIndex++;
                    } else {
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
                            return;
                        } else {
                            console.log('done, no more pages');
                            return;
                        } 
                    }
                    
                    $('<li>' + slide.toString() + '</li>').appendTo('#list');
                    $('#textBox').addClass('fadeIn');
                    
                    window.setTimeout(function(){
                        $('#list li').last().addClass('fadeIn'); 
                    },10);
                    
                    if (that.pageIndex === pageLen -1 && that.contentIndex === contentLen){
                       return;
                    }
                    that.timer = window.setTimeout(showSynchedContent,parseInt(slide._time));
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
                    var slide = that.contentObj.pages.content[that.pageIndex];
                    that.timer = window.setTimeout(hideSynchedContent,slide._time);
                };
                this.unload = function(){
                    window.clearInterval(that.timer);
                    that.timer = null;
                };
                this.init = function(content){
                    that.contentObj = content; // that.contentObj.pages.page[]
                    console.log(content);
                    var slide = that.contentObj.pages.page[that.pageIndex].content[that.contentIndex];
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


