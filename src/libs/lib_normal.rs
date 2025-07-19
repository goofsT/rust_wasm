//对应server下pkg
//调用时需要 JS 端或外部代码构造切片 使用比较少
//传入一个连续的 i32 数组的借用引用，但长度在运行时动态决定，不是固定大小数组。
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn get_sum(data: &[i32]) -> i32 {
    let mut sum=0;
    for i in data.iter() {
        let fib_input = (i + 15).min(25);
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