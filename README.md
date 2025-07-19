# Rust WebAssembly 极端计算场景优化演示

本项目展示了如何使用Rust编译WebAssembly (WASM)，并在浏览器中实现高性能计算场景的优化。项目通过三种不同的方法实现了斐波那契数列的计算，并对比了它们的性能差异：
1. 纯JavaScript实现
2. WebAssembly标准实现
3. WebAssembly修改实现


## 项目结构

```
wasm_rust_demo/
├── Cargo.toml          # Rust项目配置文件
├── src/
│   └── lib.rs          # Rust源代码，包含WASM导出函数
├── pkg/                # wasm-pack编译输出目录
├── server/             # Node.js服务器
│   ├── package.json    # Node.js项目配置
│   ├── server.js       # Express服务器代码
│   └── src/            # 前端源代码
│       ├── index.html  # 主页面
│       ├── worker.js   # JS Worker线程
│       ├── worker-wasm.js      # WASM Worker线程
│       └── worker-wasm-zero-copy.js  # WASM零拷贝Worker线程
└── target/             # Rust编译输出目录
```

## 编译步骤

需要有rust编译环境

### 1. 编译Rust到WebAssembly

```bash
# 安装wasm-pack（如果尚未安装）
cargo install wasm-pack

# 编译标准WASM版本
wasm-pack build --target web --out-dir server/src/pkg

# 编译零拷贝WASM版本
wasm-pack build --target web --out-dir server/src/pkg_zero_copy


可以修改lib.rs中的rust代码，然后进行打包后进行测试
```

### 2. 启动Node.js服务器

```bash
# 进入服务器目录
cd server

# 安装依赖
npm install

# 启动服务器
npm start
```

## 使用说明

1. 完成上述步骤后，打开浏览器访问 http://localhost:3000
2. 点击"开始测试"按钮，系统将同时运行三种实现方式的计算
3. 观察各个实现的性能差异，包括处理时间和内存使用情况
4. 点击"停止测试"按钮可以停止计算

## 实现细节

### Rust代码 (lib.rs)

项目实现了两种WASM方案：
1. 标准方案：直接传递数组数据
2. 修改方案：通过共享内存传递数据，减少内存拷贝开销（实际优化并不明显，还在学习）

### 服务器配置 (server.js)

为了支持SharedArrayBuffer，服务器设置了必要的HTTP头：
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Embedder-Policy: require-corp

### 前端实现

通过Web Workers在后台线程执行计算密集型任务，避免阻塞主线程：
- worker.js: 纯JavaScript实现
- worker-wasm.js: 标准WASM实现
- worker-wasm-zero-copy.js: WASM零拷贝实现

## 总结

经过，不采用wasm和采用wasm两种实现方式的性能差异显著：
1. 纯JavaScript实现：性能最差，CPU使用率高
2. 标准WASM实现：性能优于JavaScript，但仍有数据拷贝开销  （有绝对的零拷贝方案，但是还没研究出来，基于wasm memory ，实现主线程，worker，wasm共用内存块）
3. 在海量数据时，测试时采用100000个数据的累加，对于采用传递wasm memory的方式速度明显断层领先

## 注意事项

- 零拷贝方案需要浏览器支持SharedArrayBuffer（本测试采用node搭建express服务实现）
- 需要通过HTTPS或localhost访问，否则SharedArrayBuffer可能不可用
- 本示例使用的斐波那契计算故意采用了低效递归实现，以突显性能差异
