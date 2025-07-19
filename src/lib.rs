//对应server下pkg_1
//传入WebAssemably memory
// 更加适合共享内存 js与wasm之间的数据传递
use wasm_bindgen::prelude::*;

use js_sys::{Uint32Array, WebAssembly};

#[wasm_bindgen]
pub fn get_sum(memory: &WebAssembly::Memory, offset: usize, length: usize) -> u32 {
    let buffer = memory.buffer();
    let data = Uint32Array::new(&buffer)
        .subarray(offset as u32, (offset + length) as u32);
    let mut sum = 0;
    for i in 0..length {
        let val = data.get_index(i as u32) as i32;  // 读取时转为i32
        let fib_input = (val + 15).min(25);
        sum += fibonacci(fib_input) as u32;  // 结果累加为u32
    }
    sum
}


#[wasm_bindgen]
pub fn fibonacci(n: i32) -> i32 {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}