

// 가상 돔 노드 생성 
// 리턴 =>
// {
//     type: 'ul',
//     props: {'class': 'list'},
//     children: [
//         {type: 'li', props: {}, children: ['item 1']},
//         {type: 'li', props: {}, children: ['item 2']},
//     ],
// }

// 리액트 
function createVirtualDOM(type, props, ...children) {
    return { type, props, children };
}

// 노드 객체(VirtualDOMObj) 를 받아 Dom Elem 으로 만듬
function createElement(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);
    node.children
        .map(createElement)
        .forEach($el.appendChild.bind($el));

    return $el;
}

// 노드 변경
// Tree 순회중 변경 사항이 있는 경우 updateElement() 동작
function updateElement($parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
        $parent.appendChild(createElement(newNode));
    } else if (!newNode) {
        $parent.removeChild($parent.childNodes[index]);
    } else if (isNodechanged(newNode, oldNode)) {
        $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
    } else if (newNode.type) {
        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < newLength || i < oldLength; i++) {
             updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
        }
    }
}
    

function isNodechanged(node1, node2) {
    return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
}
    
    
    
