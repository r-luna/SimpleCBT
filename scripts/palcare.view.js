/**
 * @type {Object}
 * @return {} returns nothing
 * @name palcare.view
 * @description View for the palliative care app.
 * @namespace Holds all functionality
 */
;(function(ns,$){
    /* js:option explicit*/
    /* global jQuery, palcare, data, window */

    var _currentSlideObj;
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
        void 0 !== _currentSlideObj && (_currentSlideObj.unload());
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


