const newState = [
    { id: 1, completed: true, content: 'todo list item 1 update' },
    { id: 2, completed: true, content: 'todo list item 2' },
    { id: 3, completed: false, content: 'todo list item 3' },
    { id: 3, completed: false, content: 'todo list item 4' },
    { id: 3, completed: false, content: 'todo list item 5' },
    { id: 3, completed: false, content: 'todo list item 6' },
];

const oldState = [
    { id: 1, completed: true, content: 'todo list item 1 update' },
    { id: 2, completed: true, content: 'todo list item 2' },
    { id: 3, completed: false, content: 'todo list item 3' },
    { id: 3, completed: false, content: 'todo list item 4' },
    { id: 3, completed: false, content: 'todo list item 5' },
    { id: 3, completed: false, content: 'todo list item 6' },
];
  
  
const render = (state) => (
    <div>
        <ul>
        { state.map(({ completed, content }, index) => (
            <li class={completed ? 'completed' : null} key={index}>
            <input type="checkbox" class="toggle" checked={completed} />
            { content }
            <button class="remove">삭제</button>
            </li>
        )) }
        </ul>
        <form>
        <input type="text" />
        <button type="submit">추가</button>
        </form>
    </div>
);

const oldNode = render(oldState);
const newNode = render(newState);

const $root = document.createElement('app');
document.body.appendChild($root);


(async() => {
    await getWasmModule();

    const pointer1 = moduleExports.create_buffer((oldNode.length + 1));
    const pointer2 = moduleExports.create_buffer((newNode.length + 1));

    copyStringToMemory(oldNode, pointer1);
    copyStringToMemory(newNode, pointer2);


    console.log(moduleExports.diff_json(pointer1, pointer2))
    console.log(moduleExports.diff_node($root, pointer1, pointer2));
  })();