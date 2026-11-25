import { asset } from '../asset';
import { useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { projects } from '../data';
const pageSource = p => asset('/assets/portfolio-' + String(p).padStart(2, '0') + '.webp');
function ProjectDialog({ project, onClose, onSwitch }) {
  const dialog = useRef();
  const gallery = useRef();
  useEffect(() => {
    if (!project) return;
    const el = dialog.current;
    if (!el.open) el.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [Boolean(project)]);
  useEffect(() => { if (gallery.current) gallery.current.scrollTop = 0; }, [project?.id]);
  if (!project) return null;
  const currentIndex = projects.findIndex(p => p.id === project.id);
  const next = projects[(currentIndex + 1) % projects.length];
  return <dialog ref={dialog} className="project-dialog" aria-labelledby="dialog-title" onClose={onClose} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}><div className="dialog-shell"><header className="dialog-header"><div><span>Project / {project.year}</span><h2 id="dialog-title">{project.name}</h2></div><button className="icon-button" aria-label="关闭项目详情" autoFocus onClick={() => dialog.current.close()}><X size={24} strokeWidth={1.5} /></button></header><div className="dialog-scroll" ref={gallery}><div className="dialog-description"><h3>{project.title}</h3><p>{project.intro}</p><span>{project.category}</span></div>{project.alternateImage && <details className="detail-product-views"><summary>原始多视角图片</summary><a href={asset(`/assets/${project.id}-multiview.png`)} target="_blank" rel="noreferrer"><img src={asset(`/assets/${project.id}-multiview.png`)} alt={`${project.name} 用户提供的多视角原始素材`} loading="lazy" /></a></details>}<div className="dialog-gallery">{project.id === 'huanian' && <a href={asset('/assets/huanian-cover.webp')} target="_blank" rel="noreferrer" aria-label="查看化念封面原图"><img src={asset('/assets/huanian-cover.webp')} alt="化念项目封面" /></a>}{project.pages.map((page, index) => <a key={page} href={pageSource(page)} target="_blank" rel="noreferrer" aria-label={`${project.name} 第 ${index+1} 页，打开原图`}><img src={pageSource(page)} alt={`${project.name} 作品集第 ${index+1} 页：研究、设计过程与原型展示`} loading={index === 0 ? 'eager' : 'lazy'} width="2400" height="848" /></a>)}</div><button className="next-project" onClick={() => onSwitch(next)}><span>下一个项目<strong>{next.name}</strong></span><ArrowRight size={32} strokeWidth={1.5} /></button></div></div></dialog>;
}


export default ProjectDialog;
