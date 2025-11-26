# Refrigee - 智能冰箱管理器

## 🎉 新功能: 多AI服务商支持

现在支持配置多个AI服务商,包括:
- 🔷 Google Gemini
- 🤖 OpenAI
- 🧠 DeepSeek
- 🎓 智谱AI
- 🫘 豆包(字节跳动)

### 🚀 快速开始

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **配置AI服务商**
   - 打开应用,进入Settings页面
   - 点击"添加服务商"选择你想使用的AI服务商
   - 输入对应的API Key
   - 点击"测试连接"验证
   - 点击"启用"激活服务商

### 🔑 获取API Key

- **Gemini**: [Google AI Studio](https://aistudio.google.com/apikey)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **DeepSeek**: [DeepSeek Platform](https://platform.deepseek.com/)
- **智谱AI**: [智谱开放平台](https://open.bigmodel.cn/)

> ⚠️ **注意**: API Key存储在浏览器的localStorage中,不会被提交到代码库。请妥善保管你的API Key。

### 📦 部署

```bash
npm run build
```

构建产物在`dist`目录中,可以部署到任何静态网站托管服务。

### 🛡️ 安全提示

- ✅ API Key仅存储在浏览器本地
- ✅ 不会被提交到Git仓库
- ✅ 支持多个服务商,可以随时切换
- ✅ 未配置API时自动使用Mock AI

### 📚 更多信息

查看[实施计划](docs/implementation_plan.md)了解技术架构和详细功能说明。

---

## 原有功能

智能冰箱管理器,帮助你:
- 📝 记录食材库存
- ⏰ 过期提醒
- 🍳 AI食谱推荐
- 🎯 减少食物浪费

**技术栈**: React + Vite + TailwindCSS + AI (Gemini/OpenAI/DeepSeek等)
