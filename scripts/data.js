var data = {
    app:{
        name:               'title of app'
    },
    slides:[
        {
            slidetype:      'content',
            title:          'title of slide',
            text:           'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
            slidetype:      'truefalse',
            title:          'title of slide',
            text:           'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            answer:         true
        },
        {
            slidetype:      'multi',
            title:          'title of slide',
            subtitle:       'subtitle of slide',
            question:       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
            answers: [
                {
                    answertext: 'answer 1 text here',
                    iscorrect:  false
                },
                {
                    answertext: 'answer 2 text here',
                    iscorrect:  false   
                },
                {
                    answertext: 'answer 3 text here',
                    iscorrect:  true
                },
                {
                    answertext: 'answer 4 text here',
                    iscorrect:  false
                }
            ]
        },
        {
            slidetype:      'truefalse',
            title:          'is the sky blue?',
            text:           'question text here',
            answer:         true
        },
        {
            slidetype:      'multi',
            title:          'Eating Lunch',
            subtitle:       'Scenario 1',
            question:       'Which one of these places serves hamburgers?',
            answers: [
                {
                    answertext: 'Taco Bell',
                    iscorrect:  false
                },
                {
                    answertext: 'Hardee\'s',
                    iscorrect:  true   
                },
                {
                    answertext: 'Olive Garden',
                    iscorrect:  false
                },
                {
                    answertext: 'Tommy Chan\'s Super Good Big Time A#1 Sushi',
                    iscorrect:  false
                }
            ]
        }
    ]
};