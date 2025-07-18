import init, { get_sum } from './pkg_zero_copy/wasm_rust_demo.js'

// 零拷贝方案
//在 WebAssembly 和 JavaScript 之间传递内存指针或偏移量时，通常使用 u32 是因为：
// 1. 类型安全：u32 是 32 位无符号整数，可以表示非常大的偏移量，而不会溢出。
// 2. 内存对齐：u32 是 4 字节对齐的，可以确保在内存中正确对齐。
// 3. 兼容性：u32 是 JavaScript 中常见的整数类型，可以方便地在两者之间传递。
// 3. wasm线性内存是以字节为单位，而u32是4字节对齐的，可以方便地进行内存对齐。

// WebAssembly 中的线性内存（WebAssembly.Memory）是一个连续的字节数组（ArrayBuffer），其最大大小为 4GB（2^32 = 4294967296 字节），因此：
// 所有内存地址（即偏移量）必须是 无符号 32 位整数（u32）。
// 如果你要在 Rust 里暴露函数来访问这段内存，你必须用 u32 来告诉 WebAssembly 从哪个偏移开始读取数据。


let memory = null;
let wasmReady = false;

const bufferSize = 10000;
const sharedBuffer = new SharedArrayBuffer(bufferSize * 4);

memory = new WebAssembly.Memory({
    initial: Math.ceil(sharedBuffer.byteLength / 65536),
    maximum: Math.ceil(sharedBuffer.byteLength / 65536),
    shared: true,
});

async function start() {
    await init({ env: { memory } });
    wasmReady = true;
    postMessage({ sum:0, action: 'process' ,processingTime:0});
}
start();

self.onmessage = (e) => {
    try {
        if (!wasmReady) return;
        if (e.data.action === 'process') {
            const buffer=e.data.buffer
            const startTime = performance.now();
            const inputArray = new Uint32Array(buffer);

            // 这里写数据到 wasm 内存
            const wasmMemArray = new Uint32Array(memory.buffer);
            wasmMemArray.set(inputArray);

            const sum = get_sum(0, inputArray.length);
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            postMessage({data:inputArray})
            postMessage({ sum, action: 'process' ,processingTime:processingTime});
        }
    } catch (err) {
        postMessage({
            error: err.message || '处理过程中出现错误',
            action: 'error'
        });
        // 发生错误时也清理资源
        memory=null
        wasmReady=false
        sharedBuffer=null
        close();
    }
};