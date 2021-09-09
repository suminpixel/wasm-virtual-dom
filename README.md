# wasm-virtual-dom


### How to use wasm module in Javascript, React Environment

- install emscripten compiler (https://emscripten.org/docs/getting_started/downloads.html) 
(windows: emsdk / macOS: brew)

- Write a cpp code 

- Using Emcc, Compiler the cpp file to wasm 
```
//Windows Command 
emcc -O{flag} -std=c++{version} {targerFile.cpp} -s EXPORTED_FUNCTIONS=_{func1},_{func2} -o {filename.wasm}

//MacOS Command 
emcc -O{flag} -std=c++{version} {targerFile.cpp} -s "EXPORTED_RUNTIME_METHODS=['func1','func2']" -o {filename.wasm}

//예시) emcc factorial.cpp -s STANDALONE_WASM -O1 -s --no-entry -o factorial2.wasm 
//from https://emscripten.org/docs/getting_started/FAQ.html

```

- Fetch

```
const importObject = {    
  wasi_snapshot_preview1 : {
    proc_exit: (value) => {}
  }
};

// 중략

fetch('./test.wasm').then(response =>
        response.arrayBuffer()
    ).then(bytes =>
        WebAssembly.instantiate(bytes, importObject)
    ).then(result =>
    {
        setWasmModule(result.instance.exports); //인스턴스화 된 모듈의 익스포트를 참조하는 레퍼런스 할당
        setMemory(module.memory);
        console.log(result.instance.exports)
    }
);


// javascript
//  WebAssembly.instantiateStreaming(fetch("./validate.wasm"), importObject).then(result => {
//   console.log(result);
//   setWasmModule(result.instance.exports); //인스턴스화 된 모듈의 익스포트를 참조하는 레퍼런스 할당
//   setMemory(module.memory);
// }).catch(e => console.log(e));

```

- useWasm
```

import { useEffect, useState } from 'react';

const importObject = {
    imports: {
      imported_func: function(arg) {
        console.log(arg);
      },
      wasi_unstable: () => {}
    }
  };
 
const useWasm = (adr, importObject = {}) => {

    const [address, setAddress] = useState(adr);
    const [module, setModule] = useState(null);

    const fetchModule = (adr) => {
        console.log('useWasm', 'fetchModule', adr)
        fetch(adr).then(response =>
            response.arrayBuffer()
          ).then(bytes =>
            WebAssembly.instantiate(bytes, importObject)
          ).then(result =>
            {
              setModule(result.instance.exports); //인스턴스화 된 모듈의 익스포트를 참조하는 레퍼런스 할당
              console.log(result.instance.exports)
            }
          );
    }
    
    useEffect(()=>{
        fetchModule(address)
      },[address])

    return [module, setAddress];
}

export default useWasm;
```