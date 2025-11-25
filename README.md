# Refrigee - 智能冰箱管理助手 🧊

一个现代化的智能冰箱库存管理应用,帮助你减少食物浪费,轻松规划饮食。

## ✨ 核心功能

### 📦 智能库存管理
- **AI 智能分类**: 输入食材名称,AI 自动识别分类和保质期
- **拍照识别**: 使用相机拍摄食材,AI 自动识别并录入
- **过期提醒**: 可视化显示即将过期的食材
- **便捷管理**: 快速添加、删除和查看库存

### 🍳 AI 食谱推荐
- **智能推荐**: 基于现有库存生成食谱建议
- **今天吃什么**: 随机推荐美味中式家常菜
- **食材匹配**: 显示每个食谱的食材匹配度
- **详细步骤**: 提供完整的烹饪指导

### ⚙️ 灵活配置
- **API 配置**: 在设置中输入自己的 Gemini API Key
- **智能降级**: 未配置 API Key 时自动使用 Mock AI
- **数据本地化**: 所有数据保存在浏览器本地

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/hermitong/Refrigee.git
cd Refrigee
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:5173`

### 配置 AI 功能

1. 获取 Gemini API Key
   - 访问 [Google AI Studio](https://aistudio.google.com/apikey)
   - 创建免费 API Key

2. 在应用中配置
   - 打开应用,进入"设置"页面
   - 在"API 配置"栏目输入 API Key
   - 点击"测试连接"验证
   - 点击"保存"

> 💡 **提示**: 未配置 API Key 时,应用会自动使用 Mock AI 提供基础功能

## 📦 构建部署

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### GitHub Pages 部署

项目已配置 GitHub Actions 自动部署,推送到 `main` 分支即可自动部署到 GitHub Pages。

详细部署步骤请参考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🛠️ 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 7
- **样式方案**: TailwindCSS 4
- **动画库**: Framer Motion
- **AI 服务**: Google Gemini API
- **图标库**: Lucide React

## 📝 功能特性

- ✅ 响应式设计,移动端优先
- ✅ 真实 AI 集成 (Gemini 2.0 Flash)
- ✅ 拍照识别食材
- ✅ 智能食谱生成
- ✅ 本地数据持久化
- ✅ 优雅的降级策略
- ✅ GitHub Pages 自动部署

## 📄 许可证

MIT License

## 🙏 致谢

- [Google Gemini](https://ai.google.dev/) - AI 能力支持
- [Lucide Icons](https://lucide.dev/) - 图标库
- [Framer Motion](https://www.framer.com/motion/) - 动画效果
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
