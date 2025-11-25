# Refrigee 部署指南

## 项目已准备就绪! ✅

我已经完成了以下配置:
- ✅ 初始化 Git 仓库
- ✅ 添加 GitHub Actions 自动部署工作流
- ✅ 配置 Vite 以支持 GitHub Pages
- ✅ 集成 Gemini AI 功能
- ✅ 创建初始提交

## 🎯 新功能亮点

### AI 智能功能
- **智能分类**: 输入食材名称,AI 自动识别分类和保质期
- **拍照识别**: 使用相机拍摄食材,AI 自动识别并录入
- **食谱生成**: 基于库存智能推荐食谱
- **今天吃什么**: 随机推荐美味中式家常菜

### 用户自主配置
- 用户可在设置页面输入自己的 Gemini API Key
- API Key 保存在浏览器本地,安全可靠
- 未配置时自动使用 Mock AI,不影响基础功能

## 接下来的步骤

### 1. 在 GitHub 上创建仓库

1. 访问 [GitHub](https://github.com/new)
2. 仓库名称填写:`Refrigee`
3. 选择 **Public**(公开仓库,这样才能使用 GitHub Pages)
4. **不要**勾选 "Add a README file"、"Add .gitignore" 或 "Choose a license"
5. 点击 "Create repository"

### 2. 推送代码到 GitHub

在终端中运行以下命令:

```bash
cd /Users/hermitong/Desktop/AppDev/Refrigee
git push -u origin main
```

如果遇到认证问题,你可能需要:

**选项 A:使用 Personal Access Token (推荐)**
1. 访问 [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 设置名称(如 "Refrigee Deployment")
4. 勾选 `repo` 权限
5. 点击 "Generate token" 并复制生成的 token
6. 在推送时,用户名输入:`hermitong`,密码输入:你的 token

**选项 B:使用 SSH**
```bash
git remote set-url origin git@github.com:hermitong/Refrigee.git
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 推送成功后,访问你的仓库:`https://github.com/hermitong/Refrigee`
2. 点击 "Settings" 标签
3. 在左侧菜单中点击 "Pages"
4. 在 "Source" 下拉菜单中选择 "GitHub Actions"
5. 保存设置

### 4. 等待部署完成

1. 访问 `https://github.com/hermitong/Refrigee/actions`
2. 查看部署进度
3. 部署成功后,你的应用将在以下地址可访问:
   **https://hermitong.github.io/Refrigee/**

## 🔑 配置 AI 功能(用户端)

部署后,用户可以自行配置 AI 功能:

1. **获取 API Key**
   - 访问 [Google AI Studio](https://aistudio.google.com/apikey)
   - 使用 Google 账号登录
   - 点击 "Create API Key" 创建免费 API Key
   - 复制生成的 API Key

2. **在应用中配置**
   - 打开部署的应用
   - 点击底部导航栏的 "Settings"(设置)
   - 找到 "API 配置" 栏目
   - 粘贴 API Key
   - 点击 "测试连接" 验证
   - 点击 "保存"

3. **开始使用 AI 功能**
   - 添加食材时自动 AI 分类
   - 使用拍照识别功能
   - 获取 AI 生成的食谱推荐
   - 使用"今天吃什么"随机推荐

> 💡 **提示**: 未配置 API Key 时,应用会自动使用 Mock AI 提供基础功能,不影响正常使用。

## 后续更新

每次你推送代码到 `main` 分支时,GitHub Actions 会自动构建并部署最新版本。

```bash
git add .
git commit -m "你的更新说明"
git push
```

## 故障排除

### 如果 GitHub Actions 失败
1. 检查 Actions 标签页的错误日志
2. 确保 GitHub Pages 已启用
3. 确保仓库是公开的

### 如果页面显示 404
1. 检查 GitHub Pages 设置中的 Source 是否设置为 "GitHub Actions"
2. 等待几分钟让部署完成
3. 清除浏览器缓存

### 如果 AI 功能不工作
1. 确认已在设置中配置 API Key
2. 点击"测试连接"验证 API Key 是否有效
3. 检查浏览器控制台是否有错误信息
4. 确认 API Key 有足够的配额

## 项目信息

- **仓库地址**: https://github.com/hermitong/Refrigee
- **部署地址**: https://hermitong.github.io/Refrigee/
- **技术栈**: React + Vite + TailwindCSS + Framer Motion + Gemini AI
- **AI 模型**: Gemini 2.0 Flash Exp

## 📊 构建信息

- 打包大小: ~586KB (gzip: ~158KB)
- 构建工具: Vite 7
- 目标浏览器: 现代浏览器 (ES2020+)
