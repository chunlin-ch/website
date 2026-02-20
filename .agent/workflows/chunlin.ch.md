---
name: chunlin.ch 个人网站操作手册
description: chunlin.ch 项目的完整开发、部署、内容管理操作指南。适用于 AI Agent 和人类开发者。
---

# chunlin.ch 个人网站操作手册

## 项目概述

陈春林 (Chen Chunlin) 的个人学术/技术网站，展示科研、项目、旅行摄影、博客等内容。

- **线上地址**: https://chunlin.ch
- **代码仓库**: git@github.com:chunlin-ch/website.git
- **托管平台**: Cloudflare Pages（项目名 `chunlin-ch`）
- **图片 CDN**: Cloudflare R2（bucket `chunlin-travel`，域名 `img.chunlin.ch`）
- **Cloudflare Account ID**: `8937d4abe2c393f4227393a216b3c647`

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Vite + React 19 + TypeScript | SPA 单页应用 |
| 样式 | TailwindCSS 3 | 自定义暗色主题 |
| 路由 | react-router-dom 7 | 客户端路由 |
| 地图 | Leaflet + react-leaflet | 旅行页面交互地图 |
| 图标 | lucide-react | 全站图标库 |
| 动画 | framer-motion | 页面过渡动画 |
| 博客 | Markdown + gray-matter | 构建时生成 JSON |
| 部署 | Cloudflare Pages + GitHub Actions | 推送到 main 自动部署 |

---

## 目录结构

```
chunlin.ch/
├── .github/workflows/
│   └── deploy.yml            # CI/CD：push → build → deploy
├── content/
│   └── posts/                # Markdown 博客文章
│       └── hello-world.md
├── docs/
│   └── r2-setup.md           # R2 图片存储配置指南
├── public/
│   └── travel/demo/          # Demo 旅行照片（临时）
├── scripts/
│   ├── generate-blog.js      # Markdown → JSON（构建时自动运行）
│   ├── process-photos.js     # EXIF 提取 → travel-data.json
│   └── upload-photos.js      # 照片上传到 R2
├── src/
│   ├── App.tsx               # 路由配置
│   ├── Home.tsx              # 首页（含终端选择器）
│   ├── BlogList.tsx          # 博客列表（支持 tag 过滤）
│   ├── BlogPost.tsx          # 博客详情
│   ├── Travel.tsx            # 旅行主页（地图 + 卡片）
│   ├── TravelLocation.tsx    # 地点详情（Gallery + Lightbox）
│   ├── TravelAdmin.tsx       # 旅行数据管理 UI
│   ├── index.css             # 全局样式 + Leaflet 覆盖
│   ├── main.tsx              # 入口
│   └── data/
│       ├── posts.json        # [生成] 博客数据
│       └── travel-data.json  # 旅行地点数据
├── tailwind.config.js        # 主题色、字体配置
├── vite.config.ts
└── package.json
```

---

## 主题设计系统

```
颜色:
  bg:        #18181B  (Zinc 950 - 背景)
  surface:   #27272A  (Zinc 800 - 卡片/面板)
  text:      #F4F4F5  (Zinc 100 - 正文)
  muted:     #A1A1AA  (Zinc 400 - 次要文字)
  border:    #3F3F46  (Zinc 700 - 边框)
  primary:   #2DD4BF  (Teal 400 - 主强调色/科技感)
  secondary: #FB923C  (Orange 400 - 暖色/人文)
  accent:    #8B5CF6  (Violet 500 - 创意)

字体:
  sans:  Inter       (正文)
  serif: Lora        (标题)
  mono:  JetBrains Mono (代码/终端)
```

> **风格定位**: 暗色终端美学 + 学术气质。首页模拟命令行界面，使用 `font-mono` + `>` 命令前缀 + 绿色/橙色高亮。

---

## npm 命令速查

```bash
# 本地开发（自动生成 blog JSON + 启动 dev server）
npm run dev

# 构建生产版本
npm run build

# 构建 + 部署到 Cloudflare Pages
npm run deploy

# 预览生产版本
npm run preview

# 处理照片 EXIF → 生成 travel-data.json
npm run process-photos              # R2 URL 模式
npm run process-photos -- --local   # 本地路径模式

# 上传照片到 R2
npm run upload-photos               # 正式上传
npm run upload-photos -- --dry-run  # 预览模式

# 生成博客 JSON（通常不需要手动运行，dev/build 会自动执行）
npm run generate-blog

# 代码检查
npm run lint
```

---

## 路由表

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `Home.tsx` | 首页 |
| `/blog` | `BlogList.tsx` | 博客列表，支持 `?tag=xxx` 过滤 |
| `/blog/:slug` | `BlogPost.tsx` | 博客详情 |
| `/travel` | `Travel.tsx` | 旅行主页（地图 + 卡片网格）|
| `/travel/admin` | `TravelAdmin.tsx` | 旅行数据管理 UI |
| `/travel/:locationId` | `TravelLocation.tsx` | 地点照片 Gallery |

---

## 常见操作

### 操作 1: 写一篇新博客

1. 在 `content/posts/` 创建 Markdown 文件：

```markdown
---
title: "文章标题"
date: "2026-02-20"
description: "简短描述"
tags: ["History", "WebDev"]      # 可选: History, WebDev, AI, Research...
published: true                   # false = 草稿，不会显示
---

正文内容...
```

2. 提交推送：

```bash
git add content/posts/my-article.md
git commit -m "blog: 新文章标题"
git push
```

> `generate-blog.js` 会在 build 时自动将 Markdown 转为 `src/data/posts.json`。

### 操作 2: 添加旅行照片

**完整流程：**

```bash
# 1. 从 iCloud/相册导出照片到暂存目录
mkdir -p photos-staging/tokyo-2023
cp ~/Photos/tokyo/*.jpg photos-staging/tokyo-2023/

# 2. 上传到 R2（增量，跳过已存在的）
npm run upload-photos
# 或先预览: npm run upload-photos -- --dry-run

# 3. 提取 EXIF → 生成/更新 travel-data.json
npm run process-photos

# 4. 可视化编辑地点信息（可选）
npm run dev
# 访问 http://localhost:5173/travel/admin
# 编辑名称、描述、坐标 → Export JSON
# 将下载的 JSON 覆盖 src/data/travel-data.json

# 5. 手动补充（如果 EXIF 缺 GPS 数据）
# 编辑 travel-data.json 中 coordinates 字段
# 或在 /travel/admin 页面点击地图定位

# 6. 提交部署
git add src/data/travel-data.json
git commit -m "travel: 添加东京照片"
git push
```

**照片命名规则：**
- `cover.jpg` 或排序第一个文件自动作为封面
- 文件名中的 `_` 和 `-` 会转为空格作为默认 caption

### 操作 3: 手动部署

```bash
# 方式 1: 通过 npm (推荐)
npm run deploy

# 方式 2: 直接用 wrangler
CLOUDFLARE_API_TOKEN=xxx npx wrangler pages deploy dist --project-name=chunlin-ch

# 方式 3: git push 自动触发
git push origin main
# GitHub Actions 会自动 build + deploy
```

### 操作 4: 修改首页内容

首页位于 `src/Home.tsx`，主要区块：

| 区块 | 找哪 | 说明 |
|------|------|------|
| 个人信息 | 搜 `Senior Experimentalist` | 姓名、头衔、简介 |
| 研究方向 | 搜 `research-areas` 或 `> cat research` | 研究领域列表 |
| 项目 | 搜 `> ls projects/` | 项目卡片 |
| 经历 | 搜 `> history` | 时间线条目 |
| 兴趣 | `INTERESTS` 常量 + `InterestsSelector` 组件 | 终端选择器 |

**兴趣选择器配置**在文件顶部 `INTERESTS` 数组中，每项包含：
- `label`: 显示名
- `suffix`: 后缀（如 `(Pitcher)`）
- `hint`: 右侧提示
- `icon`: 图标 key（`camera` / `baseball` / `book`）
- `href`: 导航目标
- `external`: 是否新窗口打开

---

## travel-data.json 数据格式

```jsonc
{
  "id": "tokyo-2023",          // URL 路径标识（唯一）
  "name": "东京 · Tokyo",      // 显示名
  "country": "日本",            // 国家
  "coordinates": [35.67, 139.65],  // [纬度, 经度]
  "date": "2023-10",           // 拍摄年月
  "coverImage": "https://img.chunlin.ch/travel/tokyo-2023/cover.jpg",
  "photos": [
    {
      "src": "https://img.chunlin.ch/travel/tokyo-2023/IMG_001.jpg",
      "caption": "浅草寺雷门",   // 图片说明
      "autoGeo": true           // 是否从 EXIF 自动提取
    }
  ],
  "description": "秋季东京之旅",
  "blogSlug": "tokyo-trip",    // 关联博客文章 slug（null = 无）
  "autoGeo": true              // 地点坐标是否 EXIF 自动提取
}
```

---

## CI/CD 流程

```
git push origin main
       │
       ▼
GitHub Actions (.github/workflows/deploy.yml)
       │
       ├─ checkout 代码
       ├─ npm ci
       ├─ npm run build
       │    ├─ generate-blog.js → posts.json
       │    ├─ tsc 类型检查
       │    └─ vite build → dist/
       │
       └─ wrangler pages deploy dist
              │
              ▼
        Cloudflare Pages
        chunlin.ch ✅
```

**所需 Secret**: GitHub repo → Settings → Secrets → `CLOUDFLARE_API_TOKEN`

---

## 注意事项与陷阱

1. **SPA 路由**: Cloudflare Pages 默认支持 SPA 回退（`/travel/xxx` 等路径不会 404）
2. **照片不进 Git**: `photos-staging/` 在 `.gitignore` 中，照片通过 R2 CDN 托管
3. **Demo 照片**: `public/travel/demo/` 里的是生成的占位图，正式使用时应替换为 R2 URL
4. **build 前先 generate-blog**: `npm run build` 已自动包含此步骤，不需手动
5. **EXIF 缺失**: 部分照片（尤其截图、微信保存的）没有 GPS EXIF，需手动设坐标
6. **R2 CORS**: 不支持端口通配符 `localhost:*`，需写具体端口如 `localhost:5173`
7. **Leaflet CSS**: 已在 `index.css` 中覆盖了 popup 样式为暗色主题
8. **反下载保护**: Gallery 页面禁用了右键和拖拽，但这只是前端层面的防护
9. **环境变量**: R2 base URL 硬编码在 `process-photos.js` 顶部 `R2_BASE_URL` 常量中
