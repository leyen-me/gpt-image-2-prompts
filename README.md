# ✨ Image2 Prompt Gallery

> 专注图像生成领域的 Image2 提示词整理站，适合沉淀人像、产品、海报、场景与风格类 Prompt

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 📖 项目简介

Image2 Prompt Gallery 是一个面向图像生成场景的提示词展示平台。它更强调示例图、图像分类、风格标签和后续持续补录，适合把常用的 Image2 Prompt 做成可浏览、可搜索、可分享的资料库。

### ✨ 核心特性

- 🔍 **图像导向搜索** - 支持标题、标签、分类的全文检索，快速定位所需 Image2 Prompt
- 🎨 **现代化设计** - 采用 Apple、Linear、Notion 风格的极简设计语言
- 🌓 **深色模式** - 完整支持浅色/暗色主题切换，自动适配系统偏好
- 📱 **响应式布局** - 完美适配桌面、平板、移动端等多种设备
- ⚡ **高性能** - 纯静态页面，无需构建工具，加载速度极快
- 🏷️ **标签筛选** - 通过分类和标签快速过滤图像提示词
- 🔗 **URL 分享** - 支持生成带参数的分享链接，直达特定 Prompt
- ⌨️ **键盘快捷键** - 支持 ⌘K / Ctrl+K 快速聚焦搜索框
- 📋 **一键复制** - 点击即可复制完整提示词内容到剪贴板
- ♿ **可访问性** - 完整的 ARIA 支持，键盘导航，色彩对比度符合 WCAG AA 标准

## 🚀 快速开始

### 在线访问

直接访问：[GitHub Pages 地址](https://github.com/leyen-me/prompt)

### 本地运行

1. **克隆仓库**

```bash
git clone https://github.com/leyen-me/prompt
cd prompt
```

2. **启动本地服务器**

由于是纯静态项目，可以使用任意 HTTP 服务器：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (http-server)
npx http-server -p 8000

# 使用 PHP
php -S localhost:8000
```

3. **访问页面**

打开浏览器访问：`http://localhost:8000`

## 📁 项目结构

```
prompt/
├── index.html              # 首页
├── prompts.html            # Prompt 列表页
├── data/
│   └── prompts.js          # Prompt 数据文件
├── assets/
│   ├── styles/
│   │   ├── global.css      # 全局样式和 CSS 变量
│   │   ├── components.css  # 组件样式
│   │   └── animations.css  # 动画定义
│   ├── scripts/
│   │   ├── main.js         # 公共逻辑（主题切换、工具函数）
│   │   ├── home.js         # 首页逻辑
│   │   └── prompts.js      # 列表页逻辑
│   └── images/
│       └── prompt-covers/  # Prompt 示例封面图
├── ui.md                   # UI 设计指南
└── README.md               # 项目文档
```

## 💡 使用指南

### 浏览 Image2 Prompt

1. 访问首页，点击「探索 Image2 Prompt」按钮
2. 在列表页使用搜索框输入关键词
3. 通过分类标签筛选特定图像方向的 Prompt
4. 点击卡片查看完整内容

### 复制提示词

1. 点击卡片打开详情弹窗
2. 阅读完整内容和元信息
3. 点击「复制提示词」按钮
4. 粘贴到您的 AI 对话工具中使用

### 分享提示词

1. 打开 Prompt 详情弹窗
2. 点击「分享」按钮
3. 分享链接会自动复制到剪贴板
4. 分享给他人，对方打开链接会直接显示该图像提示词

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `⌘K` / `Ctrl+K` | 快速聚焦搜索框 |
| `ESC` | 关闭弹窗 / 清空搜索 |
| `Tab` | 在交互元素间切换焦点 |

## 🎨 设计系统

### 色彩系统

- **主色调**：`#8B5CF6`（紫色）
- **辅助色**：`#3B82F6`（蓝色）
- **成功色**：`#10B981`（绿色）
- **警告色**：`#F59E0B`（橙色）
- **错误色**：`#EF4444`（红色）

### 设计原则

- 现代极简（Modern Minimalism）
- 克制美学（Restrained Aesthetics）
- 呼吸感留白（Breathing Space）
- 柔和渐变（Soft Gradients）
- 流畅动画（Smooth Animations）

## 📝 添加新提示词

### 数据格式

编辑 `data/prompts.js`，按模板添加新的 Image2 Prompt。当前仓库已经清空真实数据，只保留了分类模板和单条 Prompt 模板注释。

建议流程：

1. 先在 `categories` 中添加分类
2. 再在 `prompts` 中复制模板对象并填写内容
3. 如果暂时没有示例图，可以先不填 `previewImage`
4. 等真实出图完成后，再补 `previewImage.src` 和 `previewImage.alt`

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | String | ✓ | 唯一标识符，建议使用 kebab-case |
| `title` | String | ✓ | Prompt 标题 |
| `content` | String | ✓ | 完整图像提示词内容 |
| `description` | String | - | 简短描述（建议 100 字以内） |
| `category` | String | ✓ | 分类 ID，需要和 `categories` 中的某项对应 |
| `tags` | Array | ✓ | 标签数组（建议 3-8 个） |
| `difficulty` | String | - | 难度等级（初级/中级/高级） |
| `createdAt` | String | ✓ | 创建时间（ISO 8601 格式） |
| `updatedAt` | String | - | 更新时间（ISO 8601 格式） |
| `author` | String | - | 作者名称 |
| `version` | String | - | 版本号 |
| `language` | String | - | 语言（zh-CN/en-US） |
| `usageCount` | Number | - | 使用次数 |
| `rating` | Number | - | 评分（1-5） |
| `previewImage` | Object | - | 示例图片配置，包含 `src` 与 `alt` |

## 🛠️ 技术栈

- **前端框架**：无框架（Vanilla JavaScript）
- **样式方案**：原生 CSS（CSS Variables + Flexbox + Grid）
- **数据格式**：JSON
- **图标方案**：Emoji + SVG
- **字体方案**：系统字体栈

### 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 贡献指南

欢迎贡献优质的 Image2 图像提示词。

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/new-prompt`)
3. 在 `data/prompts.js` 中添加新的 Image2 Prompt
4. 提交更改 (`git commit -m 'Add: 新增 XXX Prompt'`)
5. 推送到分支 (`git push origin feature/new-prompt`)
6. 创建 Pull Request

### 贡献规范

- 确保 Prompt 内容高质量、实用、适合图像生成
- 填写完整的元信息
- 选择合适的分类和标签
- 描述简洁明了
- 遵循项目代码风格

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- 设计灵感来自 [Apple](https://apple.com)、[Linear](https://linear.app)、[Notion](https://notion.so)
- 感谢所有贡献者的支持

## 📮 联系方式

- **Issues**：[GitHub Issues](https://github.com/your-username/prompt-collection/issues)
- **Email**：672228275@qq.com

---

**如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！**
