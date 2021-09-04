//init

const obj = {
    type: 'ul',
    props: {'class': 'list'},
    children: [
        {type: 'li', props: {}, children: ['item 1']},
        {type: 'li', props: {}, children: ['item 2']},
    ],
}

const objStr = JSON.stringify(obj);

console.log(objStr);