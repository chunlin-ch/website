# Cloudflare R2 图片存储配置指南

本指南帮助你配置 Cloudflare R2 作为旅行照片的 CDN 存储。

## 前置条件

- 你已有 Cloudflare 账号（用于部署网站）
- 域名 `chunlin.ch` 已在 Cloudflare DNS

## 第一步：安装 Wrangler CLI

```bash
npm install -g wrangler
```

登录 Cloudflare：

```bash
wrangler login
```

会打开浏览器让你授权。

## 第二步：创建 R2 Bucket

```bash
wrangler r2 bucket create chunlin-travel
```

验证创建成功：

```bash
wrangler r2 bucket list
```

你应该看到 `chunlin-travel` 在列表中。

## 第三步：配置公共访问（自定义域名）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → **R2 Object Storage**
3. 点击 `chunlin-travel` bucket
4. 点击 **Settings** 标签
5. 找到 **Public access** 部分
6. 点击 **Connect a domain**
7. 输入：`img.chunlin.ch`
8. Cloudflare 会自动创建 DNS 记录

配置完成后，R2 中的文件可以通过 `https://img.chunlin.ch/文件路径` 公开访问。

## 第四步：配置 CORS（允许网站访问图片）

在 R2 bucket Settings 中，找到 **CORS Policy**，点击 **Add CORS policy**。

> [!IMPORTANT]
> R2 的 CORS 不支持端口通配符（如 `http://localhost:*`），需要写具体端口。

```json
[
  {
    "AllowedOrigins": [
      "https://chunlin.ch",
      "https://www.chunlin.ch",
      "http://localhost:5173"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

如果用 Dashboard UI 填写（非 JSON 模式），则逐项填入：
- **Allowed Origins**: `https://chunlin.ch`, `https://www.chunlin.ch`, `http://localhost:5173`
- **Allowed Methods**: `GET`, `HEAD`
- **Allowed Headers**: `*`
- **Max Age**: `86400`

## 第五步：配置防盗链（可选但推荐）

在 **Settings** → **Access** 中，你可以设置：

1. **Cache-Control**：设为 `public, max-age=31536000`（图片缓存一年）
2. 在 Cloudflare 主域名的 **Scrape Shield** → **Hotlink Protection** 中，添加 `img.chunlin.ch`

## 第六步：测试上传

```bash
# 创建测试目录
mkdir -p photos-staging/test-location

# 放一张测试图片进去
cp /path/to/any/photo.jpg photos-staging/test-location/

# 先用 dry-run 预览
npm run upload-photos -- --dry-run

# 真正上传
npm run upload-photos
```

上传成功后，测试访问：

```
https://img.chunlin.ch/travel/test-location/photo.jpg
```

## 日常使用流程

```bash
# 1. 从 iCloud 导出照片到暂存目录
#    photos-staging/
#      tokyo-2023/
#        cover.jpg
#        IMG_001.jpg
#        IMG_002.jpg

# 2. 上传到 R2
npm run upload-photos

# 3. 提取 EXIF 信息，生成/更新 travel-data.json
npm run process-photos

# 4. 在网站管理页面编辑地点信息
npm run dev
# 访问 http://localhost:5173/travel/admin

# 5. 提交并部署
git add src/data/travel-data.json
git commit -m "add: tokyo-2023 travel photos"
git push
```

## 费用估算

Cloudflare R2 免费额度：

| 项目 | 免费额度 | 
|------|----------|
| 存储 | 10 GB/月 |
| Class A 操作（写入）| 100 万次/月 |
| Class B 操作（读取）| 1000 万次/月 |
| 出站流量 | **0 元**（无出站费用！）|

10,000 张照片（平均 300KB/张 web 尺寸）≈ 3GB，远在免费额度内。
