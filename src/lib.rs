// use wasm_bindgen::prelude::*;

//方案1：直接传递数组
// #[wasm_bindgen]
// pub fn get_sum(data: &[i32]) -> i32 {
//     let mut sum=0;
//     for i in data.iter() {
//         let fib_input = (i + 15).min(25);
//         let result = fibonacci(fib_input);
//         sum += result;
//     }
//     sum
// }

// #[wasm_bindgen]
// pub fn fibonacci(n: i32) -> i32 {
//     if n <= 1 {
//         n
//     } else {
//         fibonacci(n - 1) + fibonacci(n - 2)
//     }
// }


//共享内存方案
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::console;

#[wasm_bindgen]
extern "C" {
    
    #[wasm_bindgen(js_namespace = WebAssembly)]
    static memory: JsValue;
}

#[wasm_bindgen]
pub fn get_sum(offset: u32, length: u32) -> i32 {
    //让 Rust 端通过 JS 的共享内存读取数据。
    let memory_buffer = js_sys::Uint32Array::new(&memory);

    let mut sum = 0;
    for i in 0..length {
        let val = memory_buffer.get_index((offset + i) as u32) as i32;
        let fib_input = (val + 15).min(25);
        let result = fibonacci(fib_input);
        sum += result;
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

