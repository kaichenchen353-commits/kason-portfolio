# KASON · Interactive portfolio

React + Vite 个人作品集。当前版本采用浅色设计画布、可交互字母、Q 版人物与独立透明产品图。

## 运行

```sh
pnpm install
pnpm dev
```

本机预览：http://127.0.0.1:5173/ 。需要 Node.js 20.19+ 或 22.12+。

```sh
pnpm build
pnpm preview
```

## 当前内容

- 首页英文名统一为 KASON；字母支持点击换字体、鼠标拖动与方向键微调。
- 画布支持换色、贴纸开关、便签、Remix、Tidy 与 Undo。
- Q 版角色沿名字框上沿来回走动，带交替步态；悬停、键盘聚焦和拖动时暂停，点击打招呼。
- 首页和介绍区保留简短英文，项目说明、实习经历和能力使用中文；介绍区采用原创草图本、纸飞机贴纸。
- 鼠标参考原站的四种状态：16px 圆点 + You、Drag、80px See 圆形、350px 四角方形展开。
- Remix 与联系按钮支持轻量磁吸，点击字母、人物和 Remix 会出现短促纸屑反馈。
- 真实个人照片已从网页源素材与生产构建中移除。
- 4 个项目采用独立透明 PNG，前三个支持正面与背面／掌心切换。
- 项目详情保留原作品集页面和用户提供的多视角原图。
- 最大内容版心为 1700px；提供手机与平板的适配样式。

## 源码位置

- `src/Portfolio.jsx`：导航、介绍、经历、能力与联系方式。
- `src/components/EditorHero.jsx`：可交互的 KASON 字母与画布工具。
- `src/components/FrameWalker.jsx`：框上走动、步态、暂停与回应。
- `src/components/PlayfulMotion.jsx`：参考站鼠标状态、磁吸与点击纸屑。
- `src/components/Draggable.jsx`：可拖动元素。
- `src/components/ProjectSections.jsx`：项目卡组、叠放与滚动动画、视角切换。
- `src/components/ProjectDialog.jsx`：项目详情与原稿画廊。
- `src/data.js`：项目、经历与能力文案。
- `src/canvas.css`、`src/avatar.css`、`src/motion.css`：布局、动画与响应式样式。

## 生成素材

使用内置 image_gen 生成，PNG 已验证为具有真实 alpha 通道的 RGBA 图片。

- `public/assets/air-flick-product-v2.png`、`air-flick-alternate.png`
- `public/assets/bitebuddy-product-v2.png`、`bitebuddy-alternate.png`
- `public/assets/heritage-product-v2.png`、`heritage-alternate.png`
- `public/assets/huanian-product.png`
- `public/assets/kason-avatar-sprite.png`：站立、招手、思考三种 Q 版姿态。
- `public/assets/kason-stickers.png`：草图本、咖啡杯、纸飞机。

产品图片参照用户设计素材重渲染；前三个项目采用用户新提供的多视角图校准。人物是高度简化的卡通形象，照片只作为生成参考，未作为网站图片交付。

生成提示词保留在本地交付包中，不随公开仓库发布。

## 验证

- 生产构建通过。
- 41 个本地公共素材全部返回 HTTP 200。
- 已检查字体切换、换色与撤销、Remix、方向键移动、便签、人物回应、产品背面切换、详情打开和 Esc 关闭。
- 浏览器截图目视检查了首页、介绍区、项目卡片，控制台无 error 或 warn。
- 本轮浏览器的视口尺寸覆盖未生效；窄屏样式已审查与修正，未声称完成手机截图验证。
- GitHub Pages 子目录生产构建通过；静态发布包根目录直接为 index.html 与 assets 等文件。
- 最新浏览器验证覆盖中文项目说明、鼠标展开 / Drag、小人回应、字体切换、背面切换和详情弹窗；控制台无 error / warn。
- 已配置 GitHub Pages 工作流与子目录资源路径。

## 参考与依赖

布局与主要交互以 https://akshattt.com/ 为参考，使用原创 React 代码实现。

GSAP、@gsap/react、Lucide 和 Fontsource 用于动画、图标与字体。字体包括 Space Grotesk、Bagel Fat One、Archivo Black、Instrument Serif、Silkscreen、Anton、Rubik Mono One 与 Caveat。

此前安装的 Unslop、Taste 与 GSAP 官方 8 个 skills 保留在 Codex 的 skills 目录。设计过程参考 Unslop，由 Damir Sokolovsky 创作，CC BY 4.0，https://heydamir.design/unslop 。

## 新增交互参考

鼠标形态参照 https://akshattt.com/ 公开组件的 Default / Expand / See / Drag 四种状态，以原创 React / CSS 重新实现。磁吸和点击反馈参考 React Bits Magnet / ClickSpark 的交互思路，以本地轻量代码实现，没有增加远程运行时依赖。

## GitHub Pages

自动发布配置位于 `.github/workflows/deploy.yml`，发布步骤见 `DEPLOYMENT.md`。最新子目录生产预览验证通过。首次发布地址以 GitHub Pages 返回值为准。
