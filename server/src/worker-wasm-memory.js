import init, { get_sum } from './pkg_2/wasm_rust_demo.js'

let wasmMemory = null;//wasm共享内存
let wasmReady = false;
let size = 0;//数据个数

self.onmessage = async (e) => {
    try {
        if (e.data.action === 'init') {
            wasmMemory = e.data.buffer;
            size=e.data.size
            // 初始化 WASM 模块，并注入内存
            // 将WebAssembly.Memory实例作为全局变量传递给WASM模块
            await init({
                env: {memory: wasmMemory},
            });
            wasmReady = true;
            self.postMessage({ action: 'ready' });
        }

        if (e.data.action === 'process' && wasmReady) {
            const startTime = performance.now();
            // 调用WASM函数，传递偏移量和长度
            const sum = get_sum(wasmMemory,0,size);
            const endTime = performance.now();
            postMessage({
                sum,
                action: 'process',
                processingTime: endTime - startTime,
            });
        }
    } catch (err) {
        postMessage({
            error: err || '处理过程中出现错误',
            action: 'error'
        });
    }
};
