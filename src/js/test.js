const old_obj = {
        type: 'ul',
        props: {'class': 'list'},
        children: [
            {type: 'li', props: {}, children: ['item 1']},
            {type: 'li', props: {}, children: ['item 2']},
        ],
    };

const new_obj = {
    type: 'ul',
    props: {'class': 'list'},
    children: [
        {type: 'li', props: {}, children: ['item 1']},
        {type: 'li', props: {}, children: ['item 2']},
    ],
};
     
const start = window.performance.now();
console.log(old_obj === old_obj); //0.1~0.2 thousandth of a millisecond
const end = window.performance.now();
console.log(`during time : ${end-start}`);