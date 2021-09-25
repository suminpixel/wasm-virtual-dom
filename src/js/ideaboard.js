const old_dom = {
    type: 'ul',
    props: {'class': 'list', key: 1},
    children: [
        {type: 'li', props: {key: 2}, children: ['item 1']},
        {type: 'li', props: {key: 3}, children: ['item 2']},
    ],
};

const new_dom = {
  type: 'ul',
  props: {'class': 'list2', key: 1},
  children: [
      {type: 'li', props: {key: 2}, children: ['item 1']},
      {type: 'li', props: {}, children: ['item 2']},
  ],
};

const root = document.getElementById('app');
let func_pointer = -1;

let append_pointer = -1;
const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

let OnDomUpdateIndex = -1;
let OnDomUpdateCallbacks = { resolve: null, reject: null };

let moduleMemory = null;
let moduleExports = null;
let moduleTable = null;

const importObject = {    
    wasi_snapshot_preview1 : {
      proc_exit: (value) => {},
      fd_close: ()=>{},
      fd_write: ()=>{},
      fd_seek: ()=>{},
    },
    __table_base: 0,
    memory: moduleMemory,
    __table_base: 0,
    table: moduleTable,
    abort: function(e) {throw new Error(e)}
};


const getWasmModule = (moduleUrl) => {

    moduleTable = new WebAssembly.Table({ element: "anyfunc", initial: 1 });
  
    console.log('getWasmModule');
    WebAssembly.instantiateStreaming(fetch('../modules/ideaboard.wasm'), importObject).then(result => {
        console.log('instantiateStreaming');
        
        moduleExports = result.instance.exports;
        moduleMemory = moduleExports.memory;
        moduleTable = moduleExports.__indirect_function_table;
        func_pointer = addToTable(appendTextToDom, 'v');
        moduleExports.append_text_to_dom(func_pointer);

        initDom(old_dom, new_dom);
        diffAllDom();
        diffDom();
        //moduleTable = moduleExports.__indirect_function_table;

        //OnDomUpdateIndex = addToTable(appendTestNode, 'v');

        //console.log(OnDomUpdateIndex);

        //moduleExports.act_js_func(OnDomUpdateIndex);
        
        //const pointer2 = moduleExports.create_buffer(JSON.stringify(dom_json).length + 1);

    }).catch(e=> console.log(e));
};

// old dom / new dom 을 담은 포인터 세팅 및 wasm module에 전달
const initDom = (old_dom, new_dom) => {
  const old_value = JSON.stringify(old_dom);
  const new_value = JSON.stringify(new_dom);
  const old_pointer = moduleExports.create_buffer((old_value.length + 1));
  const new_pointer = moduleExports.create_buffer((new_value.length + 1));
  
  copyStringToMemory(old_value, old_pointer);
  copyStringToMemory(new_value, new_pointer);

  moduleExports.init_dom(old_pointer, new_pointer);
};

// old dom / new dom 을 출력 (테스트용)
const getDom = () => {
  const result_pointer = moduleExports.create_buffer(256);
  moduleExports.get_dom(result_pointer);
  const result_dom = getStringFromMemory(result_pointer);
  console.log(result_dom);
};

// old dom / new dom 을 비교 (테스트용)
const diffAllDom = () => {
  const result = moduleExports.diff_all_dom();
  console.log(result);
};

const diffDom = () => {
  const result = moduleExports.diff_dom();
  console.log(result);
};


// node에 text 추가
const appendTextToDom = (node_id, text) => {
  console.log(node_id, text);
  const root = document.getElementById('text');
  root.innerHTML = 'text';
}

// const appendTestNode = (text) => {
//   const root = document.getElementById('app');
//   root.innerHTML = text;
// }

function addToTable(jsFunction, signature) {
    const index = moduleTable.length;
    moduleTable.grow(1); 
    moduleTable.set(index, convertJsFunctionToWasm(jsFunction, signature));
    return index;
  }
  
  function getStringFromMemory(memoryOffset) {
    let returnValue = "";

    console.log('getStringFromMemory');
  
    const size = 256;
    const bytes = new Uint8Array(moduleMemory.buffer, memoryOffset, size);
    
    let character = "";
    for (let i = 0; i < size; i++) {
      character = String.fromCharCode(bytes[i]);
      if (character === "\0") { break;}
      
      returnValue += character;
    }
  
    return returnValue;
  }

const copyStringToMemory = (value, memoryOffset) => {
    const bytes = new Uint8Array(moduleMemory.buffer);
    bytes.set(new TextEncoder().encode((value + "\0")), memoryOffset);
}

function convertJsFunctionToWasm(func, sig) {
    // The module is static, with the exception of the type section, which is
    // generated based on the signature passed in.

    console.log('convertJsFunctionToWasm');
    var typeSection = [
      0x01, // id: section,
      0x00, // length: 0 (placeholder)
      0x01, // count: 1
      0x60, // form: func
    ];
    var sigRet = sig.slice(0, 1);
    var sigParam = sig.slice(1);
    var typeCodes = {
      'i': 0x7f, // i32
      'j': 0x7e, // i64
      'f': 0x7d, // f32
      'd': 0x7c, // f64
    };
  
    // Parameters, length + signatures
    typeSection.push(sigParam.length);
    for (var i = 0; i < sigParam.length; ++i) {
      typeSection.push(typeCodes[sigParam[i]]);
    }
  
    // Return values, length + signatures
    // With no multi-return in MVP, either 0 (void) or 1 (anything else)
    if (sigRet == 'v') {
      typeSection.push(0x00);
    } else {
      typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
    }
  
    // Write the overall length of the type section back into the section header
    // (excepting the 2 bytes for the section id and length)
    typeSection[1] = typeSection.length - 2;
  
    // Rest of the module is static
    var bytes = new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
      0x01, 0x00, 0x00, 0x00, // version: 1
    ].concat(typeSection, [
      0x02, 0x07, // import section
        // (import "e" "f" (func 0 (type 0)))
        0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
      0x07, 0x05, // export section
        // (export "f" (func 0 (type 0)))
        0x01, 0x01, 0x66, 0x00, 0x00,
    ]));
  
     // We can compile this wasm module synchronously because it is very small.
    // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
    var module = new WebAssembly.Module(bytes);
    var instance = new WebAssembly.Instance(module, {
      e: {
        f: func
      }
    });
    var wrappedFunc = instance.exports.f;
    return wrappedFunc;
  }
