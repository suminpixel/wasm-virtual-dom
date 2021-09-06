// https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Virtual-DOM/#_3-virtualdom-%E2%86%92-realdom
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
function updateElement (parent, newNode, oldNode, index = 0) {
    if (!newNode && oldNode) return parent.removeChild(parent.childNode[index]);
    if (newNode && !oldNode) return parent.appendChild(createElement(newNode));
    if (typeof newNode === "string" && typeof oldNode === "string") {
      if (newNode === oldNode) return;
      return parent.replaceChild(
        createElement(newNode),
        parent.childNodes[index]
      )
    }
    if (newNode.type !== oldNode.type) {
      return parent.replaceChild(
        createElement(newNode),
        parent.childNodes[index]
      )
    }
  
    updateAttributes(
      parent.childNodes[index],
      newNode.props || {},
      oldNode.props || {},
    );
    
    const maxLength = Math.max(newNode.children.length, oldNode.children.length);
    
    for (let i = 0; i < maxLength; i++) {
      updateElement(
        parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
  
  function updateAttributes(target, newProps, oldProps) {
    for (const [attr, value] of Object.entries(newProps)) {
      if (oldProps[attr] === newProps[attr]) continue;
      target.setAttribute(attr, value);
    }
  
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
  ];
  
  const render = (state) => (
    <div id="app">
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

  const render2 = (state) => (
    <div id="app">
     
    </div>
  );
  
  const oldNode = render(oldState);
  const newNode = render2(newState);
  
  const $root = document.createElement('div');
  
  document.body.appendChild($root);
  updateElement($root, oldNode);
  setTimeout(() => 
    updateElement($root, newNode, oldNode),
    1000
  ); // 1초 뒤에 DOM 변경