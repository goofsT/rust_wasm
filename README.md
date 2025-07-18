# Rust WebAssembly 极端计算场景优化演示

本项目展示了如何使用Rust编译WebAssembly (WASM)，并在浏览器中实现高性能计算场景的优化。项目通过三种不同的方法实现了斐波那契数列的计算，并对比了它们的性能差异：
1. 纯JavaScript实现
2. WebAssembly标准实现
3. WebAssembly零拷贝优化实现

## 环境要求

- [Rust](https://www.rust-lang.org/tools/install) (推荐1.70.0或更高版本)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) (用于编译Rust到WebAssembly)
- [Node.js](https://nodejs.org/) (推荐16.0.0或更高版本)
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

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

### 1. 编译Rust到WebAssembly

```bash
# 安装wasm-pack（如果尚未安装）
cargo install wasm-pack

# 编译标准WASM版本
wasm-pack build --target web --out-dir server/src/pkg

# 编译零拷贝WASM版本
wasm-pack build --target web --out-dir server/src/pkg_zero_copy
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
2. 零拷贝方案：通过共享内存传递数据，减少内存拷贝开销

### 服务器配置 (server.js)

为了支持SharedArrayBuffer，服务器设置了必要的HTTP头：
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Embedder-Policy: require-corp

### 前端实现

通过Web Workers在后台线程执行计算密集型任务，避免阻塞主线程：
- worker.js: 纯JavaScript实现
- worker-wasm.js: 标准WASM实现
- worker-wasm-zero-copy.js: WASM零拷贝实现

## 性能对比

在大量数据的极端计算场景下，三种实现方式的性能差异显著：
1. 纯JavaScript实现：性能最差，CPU使用率高
2. 标准WASM实现：性能优于JavaScript，但仍有数据拷贝开销
3. 零拷贝WASM实现：性能最佳，几乎没有数据拷贝开销

## 注意事项

- 零拷贝方案需要浏览器支持SharedArrayBuffer
- 需要通过HTTPS或localhost访问，否则SharedArrayBuffer可能不可用
- 本示例使用的斐波那契计算故意采用了低效递归实现，以突显性能差异
