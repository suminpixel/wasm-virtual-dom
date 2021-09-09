



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