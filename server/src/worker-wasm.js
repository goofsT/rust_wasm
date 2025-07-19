import init, { get_sum } from './pkg/wasm_rust_demo.js'

let wasmInitialized = false;

// 初始化WebAssembly模块
async function initializeWasm() {
    if (!wasmInitialized) {
        try {
            await init();
            wasmInitialized = true;
            self.postMessage({action:'ready'})
            return true;
        } catch (error) {
            console.error("WASM初始化错误:", error);
            return false;
        }
    }
    return true;
}

self.onmessage = async (e) => {
    try {
        if (e.data.action === 'process') {
            // 确保WASM已初始化
            if (!wasmInitialized) {
                const success = await initializeWasm();
                if (!success) {
                    return;
                }
            }

            const buffer = e.data.buffer;
            // 将SharedArrayBuffer转换为Int32Array
            const inputArray = new Int32Array(buffer);
            const startTime = performance.now();
            // 调用WASM函数进行计算
            const sum = get_sum(inputArray);
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            
            postMessage({
                sum,
                processingTime,
                action: 'process'
            });
        } else if (e.data.action === 'terminate') {
            close();
        }
    } catch (err) {
        // 错误处理
        postMessage({
            error: err.message || '处理过程中出现错误',
            action: 'error'
        });
    }
};

// 立即初始化WASM
initializeWasm().then(() => {}).catch(error => {
    postMessage({
        error: error.message || 'WASM初始化失败',
        action: 'error'
    });
});

