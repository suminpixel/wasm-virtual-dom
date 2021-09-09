
const appendChildJs = () => {
    const rootNode = Document.getElementById("app");
    const textNode = document.createTextNode("What-!");
    rootNode.appendChild(textNode);
}

let moduleMemory = null;
let moduleExports = null;

const initializePage = () => {
    console.log('initializePage');
   
    const importObject = {    
        wasi_snapshot_preview1 : {
            fd_close: ()=>{},
            fd_write: ()=>{},
            fd_seek: ()=>{},
            proc_exit: (value) => {}
        },
    };

    WebAssembly.instantiateStreaming(fetch("../cpp/dom.wasm"), importObject).then(result => {
        moduleExports = result.instance.exports;
        moduleMemory = moduleExports.memory;
        console.log(moduleExports);
        console.log(moduleExports.console_log());
        console.log(moduleExports.diff_dom('d'));
    }).catch(e=> console.log(e));

}
const dom_str = "{\"type\":\"ul\",\"props\":{\"class\":\"list\"},\"children\":[{\"type\":\"li\",\"props\":{},\"children\":[\"item 1\"]},{\"type\":\"li\",\"props\":{},\"children\":[\"item 2\"]}]}";
const dom_str_2 = "{\"type\":\"ul\",\"props\":{\"class\":\"list\"},\"children\":[{\"type\":\"li\",\"props\":{},\"children\":[\"item 1\"]},{\"type\":\"li\",\"props\":{},\"children\":[\"item 3\"]}]}";

const diffDom = () => {
    moduleExports.diff_dom(dom_str, dom_str_2)
}

function getStringFromMemory(memoryOffset) {
    let returnValue = "";
  
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