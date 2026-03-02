# 📝 通用表单样式

一套轻量级、支持浅色/深色双主题的现代表单样式系统，基于 SCSS 构建。

## ✨ 特性

- 🌓 **双主题支持** - 内置浅色/深色主题，一键切换
- 🏷️ **标签优先** - 默认样式直接作用于 HTML 标签，无需额外类名
- 📐 **尺寸可控** - 通过 `.small` / `.large` 类名快速切换尺寸
- 🎨 **类型丰富** - 支持输入框、文本域、下拉框、按钮、复选框、单选框、开关等
- ⚡ **轻量易用** - 纯 CSS 实现，无 JavaScript 依赖
- 🔧 **可定制** - 基于 SCSS 变量，易于扩展和自定义

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 编译样式

```bash
pnpm run build:css
```

### 3. 引入样式

在 HTML 文件中引入编译后的 CSS：

```html
<link rel="stylesheet" href="./css/style.css">
```

### 4. 设置主题

在 `<html>` 或任意父元素上添加主题类名：

```html
<!-- 浅色主题 -->
<html class="theme-light">

<!-- 深色主题 -->
<html class="theme-dark">
```

### 5. 切换主题（JavaScript）

```javascript
// 切换到深色主题
document.documentElement.classList.remove('theme-light');
document.documentElement.classList.add('theme-dark');

// 或切换主题
document.documentElement.classList.toggle('theme-light');
document.documentElement.classList.toggle('theme-dark');
```

## 📦 组件概览

### 输入框 (Input)

```html
<!-- 默认样式 -->
<input type="text" placeholder="请输入...">

<!-- 尺寸 -->
<input type="text" class="small" placeholder="小号">
<input type="text" class="large" placeholder="大号">

<!-- 状态 -->
<input type="text" class="is-error" placeholder="错误">
<input type="text" class="is-success" placeholder="成功">
<input type="text" class="is-warning" placeholder="警告">
```

### 文本域 (Textarea)

```html
<textarea placeholder="请输入多行文本..."></textarea>
<textarea class="small"></textarea>
<textarea class="large"></textarea>
```

### 下拉框 (Select)

```html
<select>
  <option>选项一</option>
  <option>选项二</option>
</select>
```

### 按钮 (Button)

```html
<!-- 类型 -->
<button class="primary">主要</button>
<button class="default">默认</button>
<button class="danger">危险</button>
<button class="text">文字</button>

<!-- 尺寸 -->
<button class="primary small">小号</button>
<button class="primary">中号</button>
<button class="primary large">大号</button>
```

### 复选框 (Checkbox)

```html
<input type="checkbox" checked>
<input type="checkbox" class="small">
<input type="checkbox" class="large">
<input type="checkbox" class="round">
```

### 单选框 (Radio)

```html
<input type="radio" name="group" checked>
<input type="radio" name="group" class="small">
<input type="radio" name="group" class="large">
```

### 开关 (Switch)

```html
<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>

<!-- 尺寸 -->
<label class="switch small">...</label>
<label class="switch large">...</label>
```

### 表单组 (Form Group)

```html
<div class="form-group">
  <label class="is-required">用户名</label>
  <input type="text" placeholder="请输入用户名">
  <div class="form-hint">提示信息</div>
</div>

<div class="form-group">
  <label class="is-required">邮箱</label>
  <input type="email" class="is-error">
  <div class="form-error-msg">错误信息</div>
</div>
```

## 📁 文件结构

```
.
├── css/                    # 编译后的 CSS 文件
├── scss/                   # SCSS 源文件
│   ├── style.scss         # 主入口文件
│   ├── theme.scss         # 主题变量
│   ├── form.scss          # 表单基础样式
│   └── checkbox.scss      # 复选框样式
├── index.html             # 文档和演示页面
├── package.json           # 项目配置
└── README.md              # 本文件
```

## 🛠️ 开发指南

### 修改主题颜色

编辑 `scss/theme.scss` 中的 `$themes` 映射：

```scss
$themes: (
  light: (
    bg-body: #ffffff,
    form-border: #d9d9d9,
    // ... 更多变量
  ),
  dark: (
    bg-body: #121212,
    form-border: #434343,
    // ... 更多变量
  )
);
```

### 添加新组件

1. 在 `scss/` 目录下创建新的 SCSS 文件
2. 在 `scss/style.scss` 中引入：`@import './new-component.scss';`
3. 运行 `pnpm run build:css` 编译

### 添加新主题

1. 在 `scss/theme.scss` 的 `$themes` 中添加新主题配置
2. 在 HTML 中使用：`<html class="theme-newtheme">`

## 📄 许可证

ISC
