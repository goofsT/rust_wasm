import init, { get_sum } from './pkg/wasm_rust_demo.js'
let sharedArray = null;


self.onmessage = async (e) => {
    try {
        // 只有第一次接收到 buffer 时初始化 wasm
        if (e.data.buffer) {
            //创建一个Int32Array，因为sharedArrayBuffer是32位整数数组
            sharedArray = new Int32Array(e.data.buffer);

            // 使用传入的 SharedArrayBuffer 构建 memory
            memory = new WebAssembly.Memory({
                initial: buffer.byteLength / 65536,
                maximum: buffer.byteLength / 65536,
                shared: true
            });

            // 将原始 buffer 填充进去
            const shared = new Uint8Array(buffer);
            const memBytes = new Uint8Array(memory.buffer);
            memBytes.set(shared);
            await init()
        }

        if (e.data.action === 'process' && sharedArray) {
            const startTime = performance.now();
            // 进行复杂计算
            const sum = get_sum(sharedArray);
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            postMessage({
                sum,
                processingTime,
                action: 'process'
            });
        } else if (e.data.action === 'terminate') {
            close()
            sharedArray=null
        }
    } catch (err) {
        // 错误处理
        postMessage({
            error: err.message || '处理过程中出现错误',
            action: 'error'
        });
        // 发生错误时也清理资源
        cleanup();
    }
};

