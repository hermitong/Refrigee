# Refrigee - 智能冰箱管理器

一个基于 React 的智能食品库存管理应用，帮助您减少食物浪费并简化膳食规划。

## 🌟 主要功能

- **智能库存管理**: 快速记录购买的食品，AI 自动分类和保质期预测
- **过期提醒**: 视觉化显示即将过期的食品，避免食物浪费
- **食谱推荐**: 基于现有食材推荐美味食谱
- **移动端优化**: 响应式设计，完美适配手机和桌面设备

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装运行

```bash
# 克隆项目
git clone https://github.com/your-username/refrigee.git
cd refrigee

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🛠 技术栈

- **前端框架**: React 19 + Vite
- **样式**: Tailwind CSS + Framer Motion (动画)
- **图标**: Lucide React
- **数据持久化**: localStorage (MVP 版本)
- **国际化**: 自定义 React Context + 语言包

## 📱 主要功能特性

### 🏠 仪表板
- 总览冰箱物品数量
- 显示即将过期和已过期物品统计
- 快捷操作入口

### 🥬 库存管理
- 按过期时间排序的物品列表
- 直观的过期状态显示（绿色/黄色/红色）
- 删除过期物品功能

### 👨‍🍳 食谱推荐
- 基于现有食材的智能匹配
- 可调节用餐人数
- 匹配度可视化显示

### ➕ 添加物品
- AI 自动分类和表情符号推荐
- 支持多种计量单位
- 默认保质期建议

## 🌐 国际化支持

应用支持中文和英文两种语言，可通过 `LanguageProvider` 轻松切换默认语言。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
