# translate-helper

简体中文 | [English](./README.md)

一个跨平台桌面翻译辅助工具，当前仅支持Windows平台，使用[Neutralinojs](https://neutralino.js.org/)实现。

## Features

- [x] 快捷键打开隐藏

## TODO LIST

- [x] 实现翻译布局和翻译功能
- [x] 切换功能，打开关闭，拷贝复制输入框
- [ ] action
- [ ] auto-start
- [ ] 快捷键设置
- [ ] 如何将node的服务打包入到neuralinojs中？
  - [ ] 测试打包

## 运行

- 使用node 16.0及以上的版本

```sh
npm install @neutralinojs/neu -g

neu update
# 安装extensions依赖
cd ./extensions/node-extensions
npm install 

cd ../vue-src
pnpm install

cd ../..
neu run
```

### 注意

- 一些功能`Neutralinojs`不支持，可以扩展并使用`node`实现，由于`neutralinojs`打包会将`node`的`node_modules`打包进`neutralinojs`中，使用`pnpm`不能使用，需要重新安装依赖，所以切换为npm安装node的依赖。

## build

```sh
neu build
```

## License

It is [MIT](./LICENSE).
