
import { GoogleGenAI } from "@google/genai";
import { ArtisticStyle, SceneEnvironment, AspectRatio } from '../types';

// Fix: Initialize with named parameter 'apiKey'
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getStyleDirectives = (style: ArtisticStyle) => {
  const styles: Record<ArtisticStyle, string> = {
    '极致奢华': "Tom Ford式的高反差光影，深邃的黑色细节与锐利的金属光泽，展现昂贵的性感。",
    '斯堪的纳维亚极简': "极致的自然采光，空气感十足，利用负空间构建纯净的几何美学。",
    'VOGUE 封面': "先锋摄影视角，大胆的构图与色彩对比，具有强烈的视觉统治力。",
    '黑色电影': "伦勃朗式布光，明暗截止线极其迷人，赋予产品叙事性的灵魂。",
    '工业包豪斯': "冷峻的形式主义，强调钢、木、石的原始肌理，结构感极强。",
    '70s 经典复古': "温暖的柯达胶片色调，带有迷人的镜头眩光与微弱的色散细节。",
    // Fix: Corrected typo '自然企寂' to '自然侘寂' to match the ArtisticStyle type
    '自然侘寂': "不对称的平衡美，展现粗糙材质表面的微妙细节，静谧且有张力。",
    '超 surreal 幻想': "梦幻的体积光与非真实的物理折射，在现实与虚幻间寻找审美的平衡。",
    '超现实幻想': "梦幻的体积光与非真实的物理折射，在现实与虚幻间寻找审美的平衡。",
    '莫兰迪高级灰': "低饱和度的艺术平衡，色调温润丝滑，展现极致的克制美。",
    '白金纯净': "通透、洁净的高调布光，产品仿佛在圣光中呼吸，极其雅致。",
    '波普艺术': "Andy Warhol式的强烈色块，保留印刷油墨的真实质感，前卫跳跃。",
    '东方意境': "水墨留白的现代演绎，虚实结合，光影通过竹帘或屏风产生动人破碎感。",
    '赛博霓虹': "物理渲染的真实霓虹光效，冷暖对比色在产品表面产生的流动光感。",
    '古典油画': "沉厚的影调，类似大画幅胶片的细节深度，画面具有博物馆珍藏质感。",
    '法式优雅': "午后慵懒的自然光，光影斑驳，散发出精致的慵懒与生活气息。",
    '和风物语': "自然木材与障子纸过滤后的柔光，展现一种平衡、宁env 静的东方哲学。",
    '蒸汽朋克': "黄铜的氧化细节与厚重皮革的磨损，展现机械时代的精密审美。",
    '孟菲斯现代': "跳跃的几何图形与高饱和色彩，展现后现代设计的幽默与张力。",
    '多巴胺能量': "极具冲击力的鲜活色彩，画面充满律动与生命力，绝非廉价滤镜。",
    '冷淡北欧': "极低色温下的极致清晰，画面清冷通透，仿佛冰晶般的视觉质感。"
  };
  return styles[style] || "";
};

export const generateProductImage = async (
  images: string[],
  style: ArtisticStyle,
  scene: SceneEnvironment,
  aspectRatio: AspectRatio,
  customKeyword?: string
): Promise<string> => {
  const styleInstruction = getStyleDirectives(style);
  
  const systemPrompt = `你是一位追求极致审美、拒绝任何“AI廉价感”的全球顶级艺术总监。
你的任务是将产品照片升华为具有【策展级美学】的商业杰作。

核心准则：
1. 【自定义优先级】：如果用户提供了自定义指令（${customKeyword || '无'}），请将其作为最高审美指引，并将其细节融入材质渲染中。
2. 【影调结构】：实现复杂的非线性明暗过渡。严禁均匀补光。利用阴影的厚度来塑造产品的“贵重感”。
3. 【光学纹理】：模拟哈苏（Hasselblad）中画幅的光学成像。保留真实的、增加质感的微小瑕疵（如极其微弱的灰尘颗粒、感光元件的细腻噪点）。
4. 【艺术构图】：利用黄金分割或动态对称，确保产品在场景中不仅清晰，而且具有艺术张力。
5. 【背景叙事】：场景（${scene}）必须与产品产生物理上的光影纠缠，而非简单的抠图叠加。

风格详情：${styleInstruction}
输出要求：8k分辨率感、大师级调色、绝对真实的物理反射。`;

  const parts: any[] = images.map(img => ({
    inlineData: {
      data: img.replace(/^data:image\/\w+;base64,/, ''),
      mimeType: img.match(/data:(.*?);base64/)?.[1] || 'image/png'
    }
  }));

  parts.push({ text: systemPrompt });

  try {
    // Fix: Updated to recommended model name 'gemini-2.5-flash-image' and correct parameter structure
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: { parts },
      config: {
        imageConfig: { aspectRatio: aspectRatio as any }
      }
    });

    // Fix: Iterating candidates and parts as recommended
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("渲染失败。");
  } catch (error: any) {
    throw new Error(error.message || "生成引擎繁忙。");
  }
};
