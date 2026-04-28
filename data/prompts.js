// ============================================
// Image2 提示词数据模板 | ES6 模块
// 说明：
// 1. 先添加分类，再在 prompts 数组中添加对应条目
// 2. id 建议使用 kebab-case，避免空格和中文
// 3. previewImage 用于站内预览图，可先留空，后续再补
// 4. 当前文件默认不提供任何真实数据，便于后续按需录入
// ============================================

export const promptsData = {
  version: "2.0.0",
  lastUpdated: "2026-04-28T07:12:00Z",

  categories: [
    {
      id: "calligraphy",
      name: "书法艺术",
      icon: "🖌️",
      color: "#7C2D12",
    },
    // 分类模板
    // {
    //   id: "portrait",
    //   name: "人像写真",
    //   icon: "📸",
    //   color: "#2563EB",
    // },
    // {
    //   id: "product",
    //   name: "产品广告",
    //   icon: "🧴",
    //   color: "#EA580C",
    // },
    // {
    //   id: "cinematic",
    //   name: "电影感场景",
    //   icon: "🎬",
    //   color: "#7C3AED",
    // },
  ],

  prompts: [
    {
      id: "traditional-chinese-calligraphy-poem",
      title: "中国传统书法古诗作品",
      description:
        "适合生成带宣纸肌理、飞白笔触与篆刻印章细节的传统古诗书法作品。",
      content:
        "请生成一幅中国传统书法艺术作品，内容为古诗《[插入诗名]》。笔触苍劲有力/飘逸流畅，墨色浓淡相宜，带有自然的飞白效果。背景为陈旧的宣纸或绢本，具有自然的泛黄岁月痕迹和水渍纹理。整体布局讲究章法留白，呈现竖排或横排的传统书写格式。不要包含任何西式画框，保持纯文书法的高雅意境。\n画面落款处盖有一至两枚传统的红色篆刻印章（朱文或白文），印泥色泽鲜红沉稳，边缘带有自然的金石残缺感和印泥渗透纸张的纹理。",
      category: "calligraphy",
      tags: ["书法", "古诗", "中国风", "宣纸", "篆刻", "传统艺术"],
      difficulty: "中级",
      createdAt: "2026-04-28T07:12:00Z",
      updatedAt: "2026-04-28T07:12:00Z",
      author: "用户提供",
      version: "1.0.0",
      language: "zh-CN",
      usageCount: 0,
      rating: 5,
      previewImage: {
        src: "./assets/images/examples/traditional-chinese-calligraphy-poem.png",
        alt: "中国传统古诗书法作品示例图",
      },
    },

    // Prompt 模板
    // {
    //   id: "portrait-soft-window-light",
    //   title: "柔光人像写真",
    //   description: "适合生成自然、干净、带有杂志感的室内人像。",
    //   content:
    //     "一位年轻女性站在窗边，柔和自然光洒在面部，浅景深，真实皮肤质感，85mm 镜头，电影级构图，极简背景，高级时尚杂志风格",
    //   category: "portrait",
    //   tags: ["人像", "自然光", "写真", "时尚"],
    //   difficulty: "中级",
    //   createdAt: "2026-04-28T08:00:00Z",
    //   updatedAt: "2026-04-28T08:00:00Z",
    //   author: "你的名字",
    //   version: "1.0.0",
    //   language: "zh-CN",
    //   usageCount: 0,
    //   rating: 5,
    //   previewImage: {
    //     src: "./assets/images/examples/portrait-soft-window-light.webp",
    //     alt: "柔和自然光的人像示例图",
    //   },
    // },
  ],
};
