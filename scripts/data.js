var data = {
    app:{
        name:               'title of app'
    },
    slides:[
        {
            slidetype:      'content',
            title:          'title of slide',
            text:           'slide text goes here'
        },
        {
            slidetype:      'truefalse',
            title:          'title of slide',
            answer:         true
        },
        {
            slidetype:      'multi',
            title:          'title of slide',
            subtitle:       'subtitle of slide',
            question:       'question text here',
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
            answer:         true
        },
        {
            slidetype:      'multi',
            title:          'Eating Lumch',
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