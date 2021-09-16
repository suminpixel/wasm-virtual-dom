/** @jsx h */
function h(type, props, ...children) {
    return { type, props, children: children.flat() };
}
  
function createElement(node) {
    if (typeof node === 'string') {
        // text node를 만들어서 반환한다.
        return document.createTextNode(node);
    }

    // tag에 대한 element를 만든다.
    const $el = document.createElement(node.type);

    // 정의한 속성을 삽입한다.
    Object.entries(node.props || {})
        .filter(([attr, value]) => value)
        .forEach(([attr, value]) => (
            $el.setAttribute(attr, value)
        ));
    
    // node의 children virtual dom을 dom으로 변환한다.
    // 즉, 모든 VirtualDOM을 순회한다.
    const children = node.children.map(createElement);
    
    // $el에 변환된 children dom을 추가한다.
    children.forEach(child => $el.appendChild(child));
    
    // 변환된 dom을 반환한다.
    return $el;
}

  
  // diff case
  // 0 : return false
  // 1 : remove child node
  // 1 : append new child node
  // 2 : text
  // 3 : different tag
  // 4 : same tag => attribute diff  
  // 5 : oldNode와 newNode의 태그 이름(type)이 같을 경우
  // default: newNode와 oldNode의 모든 자식 태그를 순회하며 반복
  function checkAndUpdateDom (type, parent, newNode, oldNode, index) {
    console.log(type);
    switch (type){
        case 0: break;
        case 1: parent.removeChild(parent.childNode[index]); break;
        case 2: parent.appendChild(createElement(newNode)); break;
        case 3: parent.replaceChild(
            createElement(newNode),
            parent.childNodes[index]
          ); 
          break;
        default: updateChilds(parent, newNode, oldNode, index);
    }
  }

  function updateChilds (parent, newNode, oldNode, index) {
    // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
    updateAttributes(
        parent.childNodes[index],
        newNode.props || {},
        oldNode.props || {}
    );
    
    // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
    const maxLength = Math.max(
        newNode.children.length,
        oldNode.children.length,
    );

    for (let i = 0; i < maxLength; i++) {
        updateElement(
            parent.childNodes[index],
            newNode.children[i],
            oldNode.children[i],
            i
        )
    }
  }

function updateElement (parent, newNode, oldNode, index = 0) {
    const type = diffNode(parent, newNode, oldNode, index);
    checkAndUpdateDom(type, parent, newNode, oldNode, index);
}

function diffNode (parent, newNode, oldNode, index = 0) {
    // 1. oldNode만 있는 경우
    if (!newNode && oldNode) {
        return 1;
    }
    // 2. newNode만 있는 경우
    if (newNode && !oldNode) {
        return 2
    }
    // 3. oldNode와 newNode 모두 text 타입일 경우
    if (typeof newNode === "string" && typeof oldNode === "string") {
        if (newNode === oldNode) return 0;
        return 3;
    }
    // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
    if (newNode.type !== oldNode.type) {
        return 4;
    }
}

// 5 - newNode와 oldNode의 attribute를 비교하여 변경된 부분만 반영한다.
function updateAttributes(target, newProps, oldProps) {
    // 달라지거나 추가된 Props를 반영
    for (const [attr, value] of Object.entries(newProps)) {

    if (oldProps[attr] === newProps[attr]) continue;
        target.setAttribute(attr, value);
    }

    // 없어진 props를 attribute에서 제거
    for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) continue;
        target.removeAttribute(attr)
    }
}

const oldState = [
    { id: 1, completed: false, content: 'todo list item 1' },
    { id: 2, completed: true, content: 'todo list item 2' },
];

const newState = [
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
        { state.map(({ completed, content }) => (
            <li class={completed ? 'completed' : null}>
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

console.log(oldNode);
console.log(newNode)
const $root = document.createElement('app');

document.body.appendChild($root);

updateElement($root, oldNode);

console.log(`start time `);

const start = window.performance.now();
updateElement($root, newNode, oldNode);
const end = window.performance.now();

console.log(`updateElement during time : ${end-start}`);

// setTimeout(() => 
//     {
//         const start = Date.now();
//         updateElement($root, newNode, oldNode);
//         const end = Date.now();

//         console.log(`during time : ${end-start}`);
//     }, 1000); 
    