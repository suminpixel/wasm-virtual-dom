let moduleExports = null;
let moduleMemory = null;

const json_obj1 = {
    type: 'p',
    props: {'class': 'list'},
    children: [
        {type: 'li', props: {}, children: ['item 1']},
        {type: 'li', props: {}, children: ['item 2']},
    ],
};

const json_obj2 = {
    type: 'ul',
    props: {'class': 'list'},
    children: [
        {type: 'li', props: {}, children: ['item 1']},
        {type: 'li', props: {}, children: ['item 2']},
    ],
};

// stringfy =>
//"{\"type\":\"ul\",\"props\":{\"class\":\"list\"},\"children\":[{\"type\":\"li\",\"props\":{},\"children\":[\"item 1\"]},{\"type\":\"li\",\"props\":{},\"children\":[\"item 2\"]}]}";

const importObject = {    
    wasi_snapshot_preview1 : {
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
    env: {
        __memory_base: 0,
        __table_base: 0,
        memory: new WebAssembly.Memory({initial: 1}),
        emscripten_thread_sleep: ()=>{},
      }
};

const getWasmModule = (moduleUrl) => {
    console.log('getWasmModule');
    WebAssembly.instantiateStreaming(fetch('../cpp/json.wasm'), importObject).then(result => {
        console.log('instantiateStreaming')
        moduleExports = result.instance.exports;
        moduleMemory = moduleExports.memory;
        console.log(moduleExports);
        startTest();
    }).catch(e=> console.log(e));
};

//WASM 모듈을 통해서 비교
const getJsonDiffOfWasm = (value, value2) => {

    const str = JSON.stringify(value);
    const str2 = JSON.stringify(value2);

    const pointer1 = moduleExports.create_buffer((str.length + 1));
    const pointer2 = moduleExports.create_buffer((str2.length + 1));
    
    copyStringToMemory(str, pointer1);
    copyStringToMemory(str2, pointer2);

    const isDiff = moduleExports.diff(pointer1, pointer2);

    return isDiff;
};

//Javascript 상에서 비교
const getJsonDiffOfJs = (value, value2, times) => {

    const isDiff = JSON.stringify(value) === JSON.stringify(value2)
    return isDiff;
};

const getJsonDiffOfWasmTimes = (value, value2, times) => {

    const str = JSON.stringify(value);
    const str2 = JSON.stringify(value2);

    const pointer1 = moduleExports.create_buffer((str.length + 1));
    const pointer2 = moduleExports.create_buffer((str2.length + 1));
    
    copyStringToMemory(str, pointer1);
    copyStringToMemory(str2, pointer2);

    const time = moduleExports.diff_time(pointer1, pointer2, times);

    return time;
};


const copyStringToMemory = (value, memoryOffset) => {
    const bytes = new Uint8Array(moduleMemory.buffer);
    bytes.set(new TextEncoder().encode((value + "\0")), memoryOffset);
}

const startTest = () => {
    console.log('startTest');

    const start1 = window.performance.now();
    let res1 = null;
    for(var i = 0 ;  i < 10000 ; i++){
        res1 = getJsonDiffOfWasm(json_obj1, json_obj2);
    }
    const end1 = window.performance.now();
    console.log( `getJsonDiffOfWasm => during time : ${end1-start1} / result: ${res1}`)

    const start2 = window.performance.now();
    let res2 = null;
    for(var i = 0 ;  i < 10000 ; i++){
       res2 = getJsonDiffOfJs(json_obj1, json_obj2);
    }
    const end2 = window.performance.now();
    console.log( `getJsonDiffOfJs => during time : ${end2-start2} / result: ${res2}`)

    const time = getJsonDiffOfWasmTimes(json_obj1, json_obj2, 10000);
    console.log( `getJsonDiffOfWasm${10000}Times => during time : ${time} `)

}
