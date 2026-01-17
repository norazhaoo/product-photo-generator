
import React, { useState } from 'react';
import { ArtisticStyle, SceneEnvironment, GenerationResult, AspectRatio } from './types';
import { generateProductImage } from './services/geminiService';

const STYLES: ArtisticStyle[] = [
  '极致奢华', '斯堪的纳维亚极简', 'VOGUE 封面', '黑色电影', 
  '工业包豪斯', '70s 经典复古', '自然侘寂', '超现实幻想', 
  '莫兰迪高级灰', '白金纯净', '波普艺术', '东方意境', 
  '赛博霓虹', '古典油画', '法式优雅', '和风物语', 
  '蒸汽朋克', '孟菲斯现代', '多巴胺能量', '冷淡北欧'
];

const SCENES: SceneEnvironment[] = [
  '森林', '海滩', '沙漠', '专业棚拍', '大理石殿堂', '城市夜景',
  '火山岩石', '水下世界', '现代画廊', '巴黎露台', '冰穴', '无尽虚空',
  '丝绸衬底', '悬浮空间', '雨后街道', '云端之上', '废旧工厂', '图书馆',
  '清晨草坪', '波光水面', '红土荒原', '木质工作台', '金属实验室', '繁花簇拥'
];

const RATIOS: AspectRatio[] = ['1:1', '4:5', '16:9', '9:16'];

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<ArtisticStyle>('极致奢华');
  const [selectedScene, setSelectedScene] = useState<SceneEnvironment>('专业棚拍');
  const [ratio, setRatio] = useState<AspectRatio>('4:5');
  const [customKeyword, setCustomKeyword] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [previewImage, setPreviewImage] = useState<GenerationResult | null>(null);

  const handleGenerate = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    try {
      const url = await generateProductImage(images, selectedStyle, selectedScene, ratio, customKeyword);
      setResults(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        url,
        style: selectedStyle,
        scene: selectedScene,
        timestamp: Date.now()
      }, ...prev]);
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#000000] text-[#FFFFFF] font-sans selection:bg-white selection:text-black antialiased">
      {/* 控制中心 */}
      <aside className="w-full lg:w-[380px] lg:h-screen lg:fixed left-0 top-0 bg-black border-r border-white/5 z-40 flex flex-col p-10 space-y-10 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-[0.4em] uppercase">Visionaire</h1>
          <p className="text-[9px] text-white/30 tracking-[0.6em] uppercase">The Art Of Studio</p>
        </div>

        {/* 资产 */}
        <div className="space-y-4 pt-8 border-t border-white/10">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Product Image</span>
            <span className="text-[8px] font-mono text-white/20">RAW_MODE</span>
          </div>
          <div className="relative w-full aspect-square bg-[#050505] border border-white/5 rounded-[24px] overflow-hidden group hover:border-white/20 transition-all duration-700">
            {images[0] ? (
              <div className="relative h-full w-full group">
                <img src={images[0]} className="w-full h-full object-contain p-8" />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-md">
                  <button onClick={() => setImages([])} className="text-[9px] font-bold px-8 py-3 bg-white text-black rounded-full uppercase tracking-widest">Replace Asset</button>
                </div>
              </div>
            ) : (
              <label className="inset-0 absolute flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all group">
                <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/20 group-hover:border-white/40 transition-all">
                  <span className="text-xl font-light">+</span>
                </div>
                <span className="text-[9px] mt-6 text-white/20 font-bold tracking-[0.4em] uppercase">Import Subject</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if(f) {
                    const r = new FileReader();
                    r.onload = () => setImages([r.result as string]);
                    r.readAsDataURL(f);
                  }
                }} />
              </label>
            )}
          </div>
        </div>

        {/* 核心配置 */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Aesthetic Style</span>
            <div className="relative">
              <select 
                value={selectedStyle} 
                onChange={e => setSelectedStyle(e.target.value as any)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
              >
                {STYLES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Environment</span>
            <div className="relative">
              <select 
                value={selectedScene} 
                onChange={e => setSelectedScene(e.target.value as any)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
              >
                {SCENES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Canvas Ratio</span>
            <div className="flex gap-2">
              {RATIOS.map(r => (
                <button key={r} onClick={() => setRatio(r)} className={`flex-1 py-3 text-[10px] font-bold rounded-xl border transition-all ${ratio === r ? 'bg-white text-black border-white' : 'bg-[#050505] border-white/10 text-white/30 hover:text-white/60'}`}>{r}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Director's Notes</span>
              <span className="text-[7px] text-green-500 font-bold px-2 py-0.5 bg-green-500/10 rounded">PRIORITY_HIGH</span>
            </div>
            <textarea 
              value={customKeyword} 
              onChange={e => setCustomKeyword(e.target.value)} 
              placeholder="输入材质要求、光影细节或特定视觉指令... (例如：加强金属边缘反光，增加细微水珠)"
              className="w-full bg-[#050505] border border-white/10 rounded-2xl p-5 text-[11px] font-medium outline-none focus:border-white/30 h-32 resize-none placeholder:text-white/10 transition-all leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-6">
          <button 
            disabled={images.length === 0 || isGenerating} 
            onClick={handleGenerate} 
            className={`w-full py-6 rounded-[24px] font-bold text-[11px] tracking-[0.6em] uppercase transition-all ${images.length > 0 && !isGenerating ? 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
          >
            {isGenerating ? 'Rendering Artist Scope...' : 'Curate Artwork'}
          </button>
        </div>
      </aside>

      {/* 展览区 */}
      <main className="flex-1 lg:ml-[380px] p-10 lg:p-24 overflow-y-auto lg:h-screen custom-scrollbar bg-black">
        {results.length === 0 && !isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-12">
            <div className="w-[1px] h-40 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[1.5em] text-white/10 ml-[1.5em]">Awaiting Creation</p>
              <p className="text-[8px] font-mono text-white/5 uppercase">Studio Ready for Deployment</p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-32">
            {isGenerating && (
              <div className="aspect-[4/5] max-w-xl mx-auto bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center space-y-12 rounded-[48px] animate-pulse">
                <div className="w-16 h-[1px] bg-white/20"></div>
                <div className="space-y-4 text-center">
                   <p className="text-[9px] font-bold uppercase tracking-[1em] text-white/40 ml-[1em]">Refining Physical Assets</p>
                   <p className="text-[7px] font-mono text-white/10 uppercase tracking-widest">Sensing textures and light</p>
                </div>
              </div>
            )}
            
            {results.map((res) => (
              <div key={res.id} className="group relative max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div 
                  className={`relative overflow-hidden rounded-[48px] shadow-[0_60px_120px_rgba(0,0,0,0.9)] cursor-zoom-in transition-all duration-1000 hover:scale-[1.03] ${ratio === '1:1' ? 'aspect-square' : ratio === '16:9' ? 'aspect-video' : ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-[4/5]'}`}
                  onClick={() => setPreviewImage(res)}
                >
                  <img src={res.url} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[25s] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-[0.8em] border border-white/20 px-16 py-6 bg-black/20 rounded-full">Explore Texture</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end px-8">
                   <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        <h2 className="text-[16px] font-bold uppercase tracking-[0.4em]">{res.style}</h2>
                      </div>
                      <div className="flex items-center space-x-6">
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">Env: {res.scene}</p>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">Hasselblad X2D</p>
                      </div>
                   </div>
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const a = document.createElement('a');
                      a.href = res.url;
                      a.download = `Visionaire-${res.id}.png`;
                      a.click();
                    }}
                    className="w-14 h-14 flex items-center justify-center border border-white/10 hover:border-white hover:bg-white hover:text-black rounded-full transition-all duration-700 group"
                   >
                     <svg className="w-5 h-5 opacity-40 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 预览模态 */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/99 flex flex-col p-12 md:p-24 animate-in fade-in duration-1000" onClick={() => setPreviewImage(null)}>
          <div className="flex justify-between items-center mb-16 max-w-6xl mx-auto w-full">
             <div className="space-y-3">
               <span className="text-[9px] font-bold uppercase tracking-[1em] text-white/20">Final Selection</span>
               <h3 className="text-xl font-bold uppercase tracking-[0.4em]">{previewImage.style}</h3>
             </div>
             <button className="w-14 h-14 flex items-center justify-center rounded-full border border-white/5 hover:border-white transition-all">
                <span className="text-2xl font-light">×</span>
             </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-hidden max-w-6xl mx-auto w-full" onClick={e => e.stopPropagation()}>
             <img src={previewImage.url} className="max-w-full max-h-full object-contain rounded-[32px] shadow-[0_0_150px_rgba(0,0,0,1)]" alt="Artwork" />
          </div>
          <div className="mt-16 flex justify-center" onClick={e => e.stopPropagation()}>
             <button onClick={() => {
                const a = document.createElement('a');
                a.href = previewImage.url;
                a.download = `Visionaire-${previewImage.id}.png`;
                a.click();
             }} className="bg-white text-black px-32 py-7 rounded-full font-bold text-[11px] tracking-[0.7em] uppercase hover:scale-105 transition-all">Export Curated Output</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        .custom-scrollbar-mini::-webkit-scrollbar { width: 1px; }
        .custom-scrollbar-mini::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); }
        body { background: #000; overflow-x: hidden; }
        img { image-rendering: -webkit-optimize-contrast; }
        select option { background-color: #000 !important; color: #fff !important; }
      `}} />
    </div>
  );
};

export default App;
