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
      fd_read: ()=>{},
      environ_sizes_get: ()=>{},
      environ_get: ()=>{},
      proc_exit: (value) => {},
      clock_time_get: ()=>{}, 
      emscripten_thread_sleep: ()=>{},
    },
    __table_base: 0,
    memory: moduleMemory,
    __table_base: 0,
    table: moduleTable,
    abort: function(e) {throw new Error(e)}
};

const getWasmModule = async () => {

    moduleTable = new WebAssembly.Table({ element: "anyfunc", initial: 1 });
  
    console.log('getWasmModule');
    await WebAssembly.instantiateStreaming(fetch('../modules/dom_engine.wasm'), importObject).then(result => {
        console.log('instantiateStreaming')
        moduleExports = result.instance.exports;
        moduleMemory = moduleExports.memory;
        moduleTable = moduleExports.__indirect_function_table;
        console.log('moduleExports', moduleExports)
        //console.log(moduleTable);
        //OnDomUpdateIndex = addToTable(appendTestNode, 'v');
        //console.log(OnDomUpdateIndex);
        //moduleExports.act_js_func(OnDomUpdateIndex);
    }).catch(e=> console.log(e));
};


const appendTestNode = (text) => {
  const root = document.getElementById('app');
  root.innerHTML = text;
}

function addToTable(jsFunction, signature) {
    
    console.log('addToTable');
    const index = moduleTable.length;
    console.log(index);
    moduleTable.grow(1); 
    console.log('addToTable');
    moduleTable.set(index, convertJsFunctionToWasm(jsFunction, signature));
  
    // Tell the caller the index of JavaScript function in the Table
    return index;
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

function copyStringToMemory(value, memoryOffset) {
    const bytes = new Uint8Array(moduleMemory.buffer);
    bytes.set(new TextEncoder().encode((value + "\0")), memoryOffset);
}
