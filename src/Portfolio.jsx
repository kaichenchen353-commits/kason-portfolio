import { asset } from './asset';
import { useEffect, useRef, useState } from 'react';
import { Home, Asterisk, PanelsTopLeft, Layers3, Heart, Menu, X, ArrowUpRight, ArrowUp, Copy, Check, Download, Scan, Workflow, Box, Cpu, Mail, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import EditorHero from './components/EditorHero';
import ProjectSections from './components/ProjectSections';
import ProjectDialog from './components/ProjectDialog';
import { profile, experiences, abilities } from './data';
import { ReferenceCursor, Magnetic } from './components/PlayfulMotion';

gsap.registerPlugin(useGSAP,ScrollTrigger);
const NAV=[['top','HOME',Home],['about','ABOUT',Asterisk],['work','PROJECTS',PanelsTopLeft],['experience','WORK',Layers3],['strengths','SKILLS',Box]];

function Navigation({onCopy}) {
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState('top');
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id);});},{rootMargin:'-20% 0px -60% 0px'});
    document.querySelectorAll('#top,#about,#work,#experience,#strengths,#contact').forEach(el=>observer.observe(el));
    const escape=e=>{if(e.key==='Escape')setOpen(false);};window.addEventListener('keydown',escape);
    return()=>{observer.disconnect();window.removeEventListener('keydown',escape);};
  },[]);
  return <header className="site-header"><a href="#top" className="nav-mark" data-cursor="expand" aria-label="高凯宸，返回首页"><span className="nav-avatar" role="img" aria-label="KASON 卡通头像" /></a><nav aria-label="主导航" id="navigation" className={open?'navigation is-open':'navigation'}>{NAV.map(([id,label,Icon])=><a key={id} href={`#${id}`} className={active===id?'nav-link active':'nav-link'} aria-current={active===id?'location':undefined} onClick={()=>setOpen(false)}><Icon size={19} strokeWidth={2.5}/><span>{label}</span></a>)}</nav><div className="nav-actions"><button className="nav-contact-short" onClick={onCopy} aria-label="复制邮箱">EM</button><a className="nav-contact-short" href={`tel:${profile.phone}`} aria-label="拨打电话">PH</a><a className="nav-contact" href="#contact"><Heart size={15} fill="currentColor"/>CONTACT</a><button className="menu-toggle" aria-label={open?'关闭导航':'打开导航'} aria-controls="navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button></div></header>;
}

function Ruler({ bottom=false }) { return <div className={`ruler ${bottom?'ruler-bottom':''}`} aria-hidden="true"><div>{Array.from({length:19},(_,i)=><span key={i}>{i*100}</span>)}</div></div>; }

function About() {
  const root=useRef();
  useGSAP(()=>{
    const media=gsap.matchMedia();
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)',()=>{
      const photos=root.current.querySelectorAll('.polaroid');
      gsap.fromTo(photos[0],{x:180,rotation:0},{x:0,rotation:-10,ease:'none',scrollTrigger:{trigger:root.current,start:'top 85%',end:'center center',scrub:.5}});
      gsap.fromTo(photos[1],{x:-180,rotation:0},{x:0,rotation:9,ease:'none',scrollTrigger:{trigger:root.current,start:'top 85%',end:'center center',scrub:.5}});
    });return()=>media.revert();
  },{scope:root});
  return <section id="about" className="about-section" ref={root} aria-labelledby="about-title"><div className="wrap"><div className="section-label"><h2 id="about-title">about me!</h2><span className="handwritten">what’s up ↙</span></div><div className="about-layout"><figure className="polaroid polaroid-person"><div className="polaroid-sticker sticker-notebook" role="img" aria-label="Original sketchbook sticker" /><figcaption>always sketching</figcaption></figure><div className="about-statement" data-cursor="expand"><p>Hey, I’m Kason.<br/>I make ideas<br/><span className="inline-flower">✳</span> feel real<span className="inline-bow">⌁</span>.</p></div><figure className="polaroid polaroid-workspace"><div className="polaroid-sticker sticker-plane" role="img" aria-label="Original paper airplane sticker" /><figcaption>a little curiosity</figcaption></figure></div><div className="about-ribbons"><div><span className="ribbon-yellow">Product Thinking</span><span className="ribbon-icon ribbon-yellow">❖</span><span className="ribbon-green">Prototyping</span><span className="ribbon-icon ribbon-green">✳</span></div><div><span className="ribbon-red">User Research</span><span className="ribbon-icon ribbon-red">◉</span><span className="ribbon-blue">Interaction Design</span></div></div><p className="about-summary">Soochow University · Industrial Design<br/>Southeast University · Incoming 2027</p></div></section>;
}

function Experience() {
  return <section id="experience" className="experience-section" aria-labelledby="experience-title"><div className="wrap"><div className="experience-intro"><p className="handwritten">learning by doing.</p><h2 id="experience-title">实践经历</h2><div className="education-stamp"><strong>3.74<small>/4.00</small></strong><span>GPA</span><strong>20</strong><span>设计奖项</span></div></div><div className="experience-list">{experiences.map((exp,i)=><details className="experience" key={exp.company}><summary><span className="experience-index">0{i+1}</span><div><strong>{exp.company}</strong><span>{exp.role}</span></div><time>{exp.time}</time><span className="experience-expand">+</span></summary><p>{exp.text}</p></details>)}<div className="experience-research"><span className="handwritten">research & experiments</span><p>MIT Media Lab 海外导师课程 · VR 冥想体验</p><p>驾驶情绪干预研究 · 脑电、气味与声音</p></div></div></div></section>;
}

function Strengths() {
  const icons={research:Scan,product:Workflow,design:Box,prototype:Cpu};
  return <section className="strengths-section" id="strengths" aria-labelledby="strengths-title"><div className="wrap"><div className="strengths-heading"><p className="handwritten">a few things I do.</p><h2 id="strengths-title">我的能力</h2></div><div className="ability-grid">{abilities.map((a,i)=>{const Icon=icons[a.icon];return <article className={`ability-card ability-${i}`} key={a.en}><span className="ability-tape"/><div className="ability-top"><Icon size={28} strokeWidth={1.5}/></div><h3>{a.title}</h3><p>{a.text}</p><div className="ability-tools">{a.tools.map(t=><span key={t}>{t}</span>)}</div></article>;})}</div></div></section>;
}

function Contact({onCopy,copied}) {
  const [hover,setHover]=useState(false);
  return <footer id="contact" className="contact-section" aria-labelledby="contact-title"><div className="wrap"><div className="contact-main"><h2 id="contact-title" data-cursor="expand" aria-label="Let’s talk">{[..."LET'S TALK"].map((char,i)=><span key={i} className={char===' '?'contact-space':''}>{char===' '?'\u00a0':char}</span>)}</h2><p>Have an idea? Let’s make it real.</p><div className="contact-action"><Magnetic href={`mailto:${profile.email}`} onPointerEnter={()=>setHover(true)} onPointerLeave={()=>setHover(false)} onFocus={()=>setHover(true)} onBlur={()=>setHover(false)}><span>Say hello</span><ArrowUpRight size={28}/></Magnetic><div className={`contact-comment ${hover?'visible':''}`}><span className="comment-dot"/><div><strong>KASON</strong><p>Open to internships<br/>and interesting ideas.</p></div></div></div></div><div className="contact-details"><button onClick={onCopy} className="contact-email"><Mail size={18}/>{profile.email}{copied?<Check size={16}/>:<Copy size={16}/>}</button><a href={`tel:${profile.phone}`}><Phone size={18}/>+86 158 5025 1235</a><a href={asset('/gaokaichen-resume.pdf')} download><Download size={18}/>Resume</a></div><div className="footer-bottom"><span>KASON</span><span>© {new Date().getFullYear()}</span><a href="#top">Back to top <ArrowUp size={16}/></a></div></div><Ruler bottom/></footer>;
}


export default function Portfolio() {
  const [project,setProject]=useState(null);
  const [copied,setCopied]=useState(false);
  const [status,setStatus]=useState('');
  const timer=useRef();
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  useEffect(()=>{document.fonts.ready.then(()=>ScrollTrigger.refresh());},[]);
  useEffect(()=>{
    const navigate=event=>{
      const anchor=event.target.closest?.('a[href^="#"]');
      if(!anchor||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const href=anchor.getAttribute('href');
      const target=document.getElementById(decodeURIComponent(href.slice(1)));
      if(!target)return;
      event.preventDefault();
      history.pushState(null,'',href);
      target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    };
    window.addEventListener('click',navigate);
    return()=>window.removeEventListener('click',navigate);
  },[]);
  async function copyEmail(){
    clearTimeout(timer.current);let timeout;
    try{
      try{await Promise.race([navigator.clipboard.writeText(profile.email),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Clipboard timeout')),1200);})]);}
      catch{const el=document.createElement('textarea');el.value=profile.email;el.style.position='fixed';el.style.opacity='0';el.setAttribute('readonly','');document.body.appendChild(el);const focus=document.activeElement;el.select();const ok=document.execCommand('copy');el.remove();focus?.focus({preventScroll:true});if(!ok)throw new Error('Clipboard unavailable');}
      setCopied(true);setStatus('Email copied.');
    }catch{setStatus(`Copy this email: ${profile.email}`);}finally{clearTimeout(timeout);}
    timer.current=setTimeout(()=>{setCopied(false);setStatus('');},3500);
  }
  return <><a className="skip-link" href="#main">跳转到主要内容</a><Navigation onCopy={copyEmail}/><main id="main"><Ruler/><EditorHero/><About/><ProjectSections onOpen={setProject}/><Experience/><Strengths/></main><Contact onCopy={copyEmail} copied={copied}/><ProjectDialog project={project} onClose={()=>setProject(null)} onSwitch={setProject}/><ReferenceCursor/><div className={status?'toast is-visible':'toast'} role="status">{status}</div></>;
}
