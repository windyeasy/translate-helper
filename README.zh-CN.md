<br>
<br>
<p align="center">
<img src="./src/assets/logo.svg" width="140" height="140" align="center" />
</p>

<h1 align="center">TranslateHelper</sup></h1>

<p align="center">
一个桌面翻译辅助工具，支持一次翻译多个语言。
</p>

简体中文 | [English](./README.md)

<img width="862" src="./docs/assets/demo1.png">

## 介绍

一个桌面翻译辅助工具，当前仅支持Windows平台，使用[Tauri2](https://v2.tauri.app/)实现。参考[raycast-multi-translate](https://github.com/antfu/raycast-multi-translate)进行开发。

为什么重新写一个？

- 是因为[raycast-multi-translate](https://github.com/antfu/raycast-multi-translate)不支持windows平台，我使用的是windows平台，所以重新实现一个。

## 运行

- Node > 18.0

前置条件，安装依赖与编译环境：[https://v2.tauri.app/start/prerequisites](https://v2.tauri.app/start/prerequisites)

```sh
pnpm install
pnpm run tauri-dev
```

## build

```sh
pnpm run tauri-build
```

## 特性

### 多个翻译目标

支持一次翻译多个语言。通过点击设置按钮，可以添加多个翻译目标。

![多个翻译目标](./docs/assets/demo2.png)

### i18n

支持中文和英文。

![i18n](./docs/assets/demo3.png)
![i18n](./docs/assets/demo4.png)

### 全局快捷键监听操作

- 可以通过快捷键快速隐藏和打开应用
- 使用另一个快捷键打开后会自动读取剪切板内容进行翻译，可以搭配`Ctrl+C`一起使用。
  - 这也是和[raycast-multi-translate](https://github.com/antfu/raycast-multi-translate)的区别，它支持快捷键打开时，获取选中文本。当有选中的文本时快捷键打开后直接进行翻译。但是[Neutralinojs](https://neutralino.js.org/)不支持获取外部的选中文本。

## License

It is [MIT](./LICENSE).
