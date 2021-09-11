
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
            fd_read: ()=>{},
            environ_sizes_get: ()=>{},
            environ_get: ()=>{},
            proc_exit: (value) => {}
        },
    };

    WebAssembly.instantiateStreaming(fetch("../cpp/dom.wasm"), importObject).then(result => {
        console.log('instantiateStreaming...')
        moduleExports = result.instance.exports;
        moduleMemory = moduleExports.memory;
        console.log(moduleExports);
        //diffString();
        diffDom();
    }).catch(e=> console.log(e));

}
const diffString = () => {
    const dom_str = "1";
    const dom_str_2 = "2";
    
    const pointer1 = moduleExports.create_buffer((dom_str.length + 1));
    const pointer2 = moduleExports.create_buffer((dom_str_2.length + 1));

    copyStringToMemory(dom_str, pointer1);
    copyStringToMemory(dom_str_2, pointer2);
  
    const isSame = moduleExports.diff_string(pointer1, pointer2);
  
    console.log(isSame)
}


const diffDom = () => {
    const dom_str = "{\"type\":\"ul\",\"props\":{\"class\":\"list\"},\"children\":[{\"type\":\"li\",\"props\":{},\"children\":[\"item 1\"]},{\"type\":\"li\",\"props\":{},\"children\":[\"item 2\"]}]}";
    const dom_str_2 = "{\"type\":\"ul\",\"props\":{\"class\":\"list\"},\"children\":[{\"type\":\"li\",\"props\":{},\"children\":[\"item 1\"]},{\"type\":\"li\",\"props\":{},\"children\":[\"item 2\"]}]}";
    
    const pointer1 = moduleExports.create_buffer((dom_str.length + 1));
    const pointer2 = moduleExports.create_buffer((dom_str_2.length + 1));

    //copyStringToMemory(dom_str, pointer1);
    //copyStringToMemory(dom_str_2, pointer2);
    copyStringToMemory(dom_str, pointer1);
    copyStringToMemory(dom_str_2, pointer2);
  
    const isSame = moduleExports.diff_dom(pointer1, pointer2);

    moduleExports.free_buffer(pointer1);
    moduleExports.free_buffer(pointer2);

    console.log(isSame)
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

function copyStringToMemory(value, memoryOffset) {
    const bytes = new Uint8Array(moduleMemory.buffer);
    bytes.set(new TextEncoder().encode((value + "\0")), memoryOffset);
}