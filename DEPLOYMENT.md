# GitHub Pages 发布

子目录生产构建与浏览器检查通过。源码仓库：https://github.com/kaichenchen353-commits/kason-portfolio 。部署状态请查看仓库 Actions 和 Settings → Pages。

## 自动发布

项目已包含 `.github/workflows/deploy.yml`。工作流在 main 分支更新时构建 Vite 并发布到 GitHub Pages。依赖由 pnpm-lock.yaml 锁定；Node.js 22、pnpm 10。

仓库名称默认建议 `kason-portfolio`。GitHub Actions 自动从 GITHUB_REPOSITORY 读取仓库名称并设置 Vite base，因此适配 `https://用户名.github.io/kason-portfolio/`；个人根站仓库也会自动使用 `/`。

首次需要在仓库 Settings → Pages 将 Source 设置为 GitHub Actions。也可通过经过授权的 GitHub CLI / API 配置。

## 本地验证

- `pnpm build`：根目录构建。
- PowerShell：`$env:VITE_BASE_PATH='/kason-portfolio/'; pnpm build`：模拟仓库子目录构建。
- 所有动态产品图、作品集原稿、简历使用 `src/asset.js` 跟随 BASE_URL；CSS 字体与贴纸路径由 Vite 处理。
- 已在本机生产预览的 `/kason-portfolio/` 路径验证字体、头像、产品图、简历路径、中文项目说明和详情原稿路径；控制台无 error/warn。

## 发布后验证

等待 GitHub Actions 部署成功后，以返回的 Pages 地址为准；不能把仓库网址当作网站网址。检查 HTTPS 首页、产品图、字体、简历下载以及交互。国内网络可用性需要使用未开启代理的网络实测，未承诺所有运营商均稳定。

## 官方参考

- https://vite.dev/guide/static-deploy.html#github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
