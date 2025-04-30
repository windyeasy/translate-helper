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

```sh
npm install @neutralinojs/neu -g

neu update
# 安装extensions依赖
cd ./extensions/hotkey
pnpm install 
cd ../..
neu run
```

## build

```sh
neu build
```

## License

It is MIT.
