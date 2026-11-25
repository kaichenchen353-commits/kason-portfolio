import { Fragment, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Plus, Rotate3D, Check, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '../data';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function CircleLink({ onClick, label }) {
  const id = `circle-${Array.from(label, char => char.codePointAt(0).toString(16)).join('-')}`;
  return <button className="case-circle" data-cursor="see" onClick={onClick} aria-label={`查看 ${label} 项目`}><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id={id} d="M60,60m-44,0a44,44 0 1,1 88,0a44,44 0 1,1-88,0"/></defs><text><textPath href={`#${id}`} textLength="275">VIEW CASE STUDY · VIEW CASE STUDY · </textPath></text></svg><ArrowUpRight size={30} strokeWidth={1.8}/></button>;
}

function ProjectCard({ project, index, onOpen }) {
  const [view, setView] = useState('front');
  const [expanded, setExpanded] = useState(-1);
  const stage = useRef();
  const p = project;
  function move(event) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${(event.clientX-box.left-box.width/2)*.025}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${(event.clientY-box.top-box.height/2)*.025}px`);
  }
  return <article className={`folder-project folder-${p.id}`} id={`${p.id}-card`} style={{ '--project-color':p.color,'--project-index':index }} aria-labelledby={`${p.id}-heading`}>
    <a className="folder-tab" href={`#${p.id}`}><span>{String(index+1).padStart(2,'0')}</span> {p.name}</a>
    <div className="folder-body">
      <header className="folder-heading"><div><span className="project-number">{String(index+1).padStart(2,'0')}</span><div><h3 id={`${p.id}-heading`}>{p.name}</h3><p>{p.year} / {p.category}</p></div></div><div className="project-tags">{p.tags.slice(0,2).map(tag=><span key={tag}>{tag}</span>)}</div></header>
      <div className="product-stage" ref={stage} onPointerMove={move} onPointerLeave={event=>{event.currentTarget.style.setProperty('--pointer-x','0px');event.currentTarget.style.setProperty('--pointer-y','0px');}}>
        <div className="project-watermark" aria-hidden="true"><span>{p.watermark}</span><i>✦</i><span>{p.watermark}</span></div>
        <svg className="callout-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><path d="M180 100C290 100 320 160 455 160M800 115C700 115 680 175 555 175M790 320C700 320 650 300 550 300"/><circle cx="455" cy="160" r="6"/><circle cx="555" cy="175" r="6"/><circle cx="550" cy="300" r="6"/></svg>
        <div className="product-scroll"><button className="product-sway" data-cursor="see" onClick={()=>onOpen(p)} aria-label={`打开 ${p.name} 作品详情`}><img key={view} className="floating-product" src={view==='front'?p.productImage:p.alternateImage} alt={`${p.name} ${view==='front'?'主视角':'背面视角'}独立产品渲染图`} loading="lazy" width="1024" height="1200" draggable="false"/><span className="product-shadow" aria-hidden="true"/></button></div>
        {p.callouts.map((note,i)=><button key={note.title} className={`product-callout callout-${i+1} ${expanded===i?'is-expanded':''}`} aria-expanded={expanded===i} onClick={()=>setExpanded(expanded===i?-1:i)}><span className="callout-meta"><i/> {['设计细节','关键洞察','体验设计'][i]} <Plus size={10}/></span><strong>{note.title}</strong><span className="callout-copy">{note.text}</span></button>)}
        {p.alternateImage&&<div className="view-switch" role="group" aria-label={`${p.name} 产品视角`}><Rotate3D size={15}/><button className={view==='front'?'active':''} aria-pressed={view==='front'} onClick={()=>setView('front')}>正面</button><span>/</span><button className={view==='back'?'active':''} aria-pressed={view==='back'} onClick={()=>setView('back')}>{p.id==='heritage'?'掌心':'背面'}</button></div>}
      </div>
      <div className="folder-bottom"><div><h4>{p.title}</h4><p>{p.intro}</p></div><CircleLink label={p.name} onClick={()=>onOpen(p)}/></div>
    </div>
  </article>;
}

export default function ProjectSections({ onOpen }) {
  const root = useRef();
  useGSAP(()=>{
    const media=gsap.matchMedia();
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)',()=>{
      const cards=gsap.utils.toArray('.folder-project', root.current);
      cards.forEach((card,i)=>{
        const body=card.querySelector('.folder-body');
        if(cards[i+1]) gsap.to(body,{scale:.96,filter:'brightness(.88)',transformOrigin:'center top',ease:'none',scrollTrigger:{trigger:cards[i+1],start:'top 85%',end:'top 130px',scrub:true}});
        gsap.fromTo(card.querySelector('.product-scroll'),{y:28,rotation:-6},{y:-8,rotation:1,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'top 100px',scrub:.45}});
        gsap.from(card.querySelectorAll('.product-callout'),{autoAlpha:0,y:10,stagger:.14,duration:.55,ease:'power2.out',scrollTrigger:{trigger:card,start:'top 65%',toggleActions:'play none none reverse'}});
        gsap.to(card.querySelector('.project-watermark'),{xPercent:-12,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:true}});
      });
    });
    return ()=>media.revert();
  },{scope:root});
  return <section id="work" className="work-section" ref={root} aria-labelledby="work-title"><div className="wrap"><div className="work-intro"><div className="work-intro-copy"><p className="handwritten">explore my work!</p><h2 id="work-title">Selected<br/>work<span>(04)</span></h2><p>从用户研究，到可以体验的产品。<br/>点击卡片，了解项目。</p><a className="pick-prompt" href="#air-flick"><span/> 选择项目 / 向下浏览 <ArrowDown size={15}/></a></div><div className="project-deck"><p className="handwritten deck-pick">pick one →</p>{projects.map((p,i)=><a key={p.id} href={`#${p.id}`} className="deck-card" data-cursor="see" style={{'--project-color':p.color,'--deck-index':i}} aria-label={`跳转到 ${p.name}`}><span className="deck-number">{String(i+1).padStart(2,'0')}</span><img src={p.productImage} alt="" loading="lazy" draggable="false"/><strong>{p.name}</strong><div><span>{p.category}</span><span>{p.year}</span></div></a>)}</div></div><div className="project-stack">{projects.map((p,i)=><Fragment key={p.id}><span className="project-anchor" id={p.id} aria-hidden="true"/><ProjectCard project={p} index={i} onOpen={onOpen}/></Fragment>)}</div><div className="work-end"><p className="handwritten">behind the details.</p><a href="#strengths">了解我的能力 <ArrowDown size={18}/></a></div></div></section>;
}
