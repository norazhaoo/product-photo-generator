
export type ArtisticStyle = 
  | '极致奢华' | '斯堪的纳维亚极简' | 'VOGUE 封面' | '黑色电影' 
  | '工业包豪斯' | '70s 经典复古' | '自然侘寂' | '超现实幻想' 
  | '莫兰迪高级灰' | '白金纯净' | '波普艺术' | '东方意境' 
  | '赛博霓虹' | '古典油画' | '法式优雅' | '和风物语' 
  | '蒸汽朋克' | '孟菲斯现代' | '多巴胺能量' | '冷淡北欧';

export type SceneEnvironment = 
  | '森林' | '海滩' | '沙漠' | '专业棚拍' | '大理石殿堂' | '城市夜景'
  | '火山岩石' | '水下世界' | '现代画廊' | '巴黎露台' | '冰穴' | '无尽虚空'
  | '丝绸衬底' | '悬浮空间' | '雨后街道' | '云端之上' | '废旧工厂' | '图书馆'
  | '清晨草坪' | '波光水面' | '红土荒原' | '木质工作台' | '金属实验室' | '繁花簇拥';

export type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';

export interface GenerationResult {
  id: string;
  url: string;
  style: string;
  scene: string;
  timestamp: number;
}
