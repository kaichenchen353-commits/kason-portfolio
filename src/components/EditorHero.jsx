import { asset } from '../asset';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Dices, LayoutGrid, Undo2, MessageCircle, Sticker, Download, HelpCircle, X, MousePointer2, RotateCcw, ArrowDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Draggable from './Draggable';
import FrameWalker from './FrameWalker';
import { CanvasSparks, Magnetic } from './PlayfulMotion';

const FONT_NAMES = ['Bagel Fat One', 'Archivo Black', 'Instrument Serif', 'Rubik Mono One', 'Silkscreen', 'Anton'];
const PALETTE = ['#ffffff', '#f04434', '#8b4ae9', '#58bf91', '#ff9353', '#f5d854', '#ed829b', '#4564d8'];
const LETTER_COLORS = ['#d4ec72', '#ed633d', '#15132e', '#3534b5', '#be3079'];
const INITIAL = { letters: [...'KASON'].map((char, index) => ({ char, font: [0,1,2,4,5][index], x: 0, y: 0, rotation: [-9,-5,3,-3,5][index] })), bg: '#ffffff', stickers: true, notes: [] };
const initialState = { present: INITIAL, past: [] };

function reducer(state, action) {
  if (action.type === 'undo') return state.past.length ? { present: state.past.at(-1), past: state.past.slice(0,-1) } : state;
  const present = action.type === 'reset' ? INITIAL : action.update(state.present);
  return { present, past: [...state.past.slice(-24), state.present] };
}


function CatSticker() {
  return <svg viewBox="0 0 160 150" aria-hidden="true"><path d="M18 72 20 16 61 48Q83 35 105 46L142 17l-7 66q18 48-34 56H56Q7 130 18 72Z" fill="#ef8b5a" stroke="white" strokeWidth="8" strokeLinejoin="round"/><path d="m31 44 1-13 16 15m71-2 13-14-1 18" fill="#d15d47"/><path d="M46 88q9-14 18 0m32-3q9-13 18 0" fill="none" stroke="#292324" strokeWidth="5" strokeLinecap="round"/><path d="m77 94 11-1-5 8Z" fill="#a34d44"/><path d="M83 101q-9 13-17 2m17-2q6 13 15 1M29 96 9 92m20 16-22 4m120-20 24-9m-22 21 25 1" fill="none" stroke="#292324" strokeWidth="3" strokeLinecap="round"/><path d="m65 47 5 13m12-16 4 15m12-12 3 11" stroke="#c96743" strokeWidth="5" strokeLinecap="round"/></svg>;
}

function IdBadge() {
  return <div className="id-badge"><div className="badge-strap">KASON / 2026</div><div className="badge-clip" /><div className="badge-paper"><div className="badge-meta"><span>DESIGN × PRODUCT</span><span>2026</span></div><div className="badge-avatar"><span className="avatar-sprite" role="img" aria-label="KASON 的 Q 版卡通头像" /></div><strong>KASON</strong><b>AI PRODUCT<br />MANAGER</b><p>Suzhou, China</p><div className="barcode" /></div></div>;
}


export default function EditorHero() {
  const root = useRef();
  const frame = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const editor = state.present;
  const [noteMode, setNoteMode] = useState(false);
  const [noteDraft, setNoteDraft] = useState(null);
  const [help, setHelp] = useState(false);
  const [clock, setClock] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [stickerPositions, setStickerPositions] = useState({});
  const edit = update => dispatch({ type: 'edit', update });
  useEffect(() => {
    const update = () => setClock(new Intl.DateTimeFormat('en-GB', { timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',second:'2-digit' }).format(new Date()));
    update(); const interval = setInterval(update,1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setDimensions(`${Math.round(entry.contentRect.width)} × ${Math.round(entry.contentRect.height)}`));
    if (frame.current) observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.letter-face', { y: 100, rotation: -15, opacity: 0, stagger: .075, duration: .9, ease: 'back.out(1.35)', clearProps: 'transform,opacity' });
      gsap.from('.hero-sticker, .hero-status, .hero-skill-tags', { opacity: 0, y: 14, duration: .65, stagger: .08, delay: .55, clearProps: 'all' });
    });
    return () => media.revert();
  }, { scope: root });
  function changeLetter(index) {
    edit(previous => ({ ...previous, letters: previous.letters.map((letter,i) => i === index ? { ...letter, font: (letter.font+1)%FONT_NAMES.length } : letter) }));
  }
  function remix() {
    const mixed = editor.letters.map(letter => ({ ...letter, font: Math.floor(Math.random()*FONT_NAMES.length), rotation: Math.round(Math.random()*20-10) }));
    edit(previous => ({ ...previous, letters: mixed }));
  }
  function tidy() { dispatch({ type:'reset' }); setStickerPositions({}); setNoteMode(false); setNoteDraft(null); }
  function noteClick(event) {
    if (!noteMode || event.target.closest('a,button,input,textarea,form,[data-sticker]')) return;
    const box = root.current.getBoundingClientRect();
    setNoteDraft({ x: Math.max(5,Math.min(78,(event.clientX-box.left)/box.width*100)), y: Math.max(5,Math.min(65,(event.clientY-box.top)/box.height*100)) });
  }
  function addNote(event) {
    event.preventDefault();
    const text = new FormData(event.currentTarget).get('note').trim();
    if (!text) return;
    edit(previous => ({ ...previous, notes: [...previous.notes, { ...noteDraft, text, id: Date.now(), dx:0, dy:0 }] }));
    setNoteDraft(null); setNoteMode(false);
  }
  function stickerProps(id) { return { x: stickerPositions[id]?.x || 0, y: stickerPositions[id]?.y || 0, onDrop: (x,y) => setStickerPositions(p=>({...p,[id]:{x,y}})), 'data-sticker':true }; }
  return <section id="top" ref={root} className={`editor-hero ${noteMode ? 'note-mode' : ''}`} style={{ '--canvas-color': editor.bg }} onClick={noteClick} aria-labelledby="hero-title">
    <h1 id="hero-title" className="sr-only">高凯宸，拥有设计师背景的 AI 产品经理</h1>
    <div className="hero-clock" aria-label="北京时间">{clock}<span>Beijing time</span></div>
    {editor.stickers && <>
      <Draggable {...stickerProps('todo')} className="todo-note hero-sticker"><span className="paper-tape" /><h2>to-do</h2><label><input type="checkbox" defaultChecked /><span>ask questions</span></label><label><input type="checkbox" defaultChecked /><span>make things</span></label><label><input type="checkbox" /><span>work with you</span></label><svg className="paper-fold" viewBox="0 0 32 32" aria-hidden="true"><path d="M0 32 32 0v32Z" fill="#d9b94b"/></svg></Draggable>
      <Draggable {...stickerProps('badge')} className="badge-holder hero-sticker"><IdBadge /></Draggable>
      <Draggable {...stickerProps('cat')} className="cat-sticker hero-sticker"><CatSticker /></Draggable>
      <Draggable {...stickerProps('coffee')} className="coffee-sticker hero-sticker"><span className="sticker-sprite sticker-coffee" role="img" aria-label="Coffee doodle sticker" /></Draggable>
      <Draggable {...stickerProps('year')} className="year-sticker hero-sticker">2026</Draggable>
      <Draggable {...stickerProps('resume')} className="resume-sticker hero-sticker"><a href={asset('/gaokaichen-resume.pdf')} target="_blank" rel="noreferrer"><span className="pdf-icon">PDF</span><strong>resume</strong><span className="download-square"><Download size={22}/></span></a><p>one page, a little me</p></Draggable>
    </>}
    <div className="name-stage"><p className="name-eyebrow">my name is</p><div ref={frame} className="word-frame" aria-label="点击字母更换字体，拖动字母重新排版">{editor.stickers && <FrameWalker {...stickerProps('avatar')} />}<div className="selection-corners" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i}/>)}</div><div className="letter-row">{editor.letters.map((letter,index)=><Draggable as="button" key={index} type="button" x={letter.x} y={letter.y} className="letter" style={{ '--letter-color': LETTER_COLORS[index], '--letter-rotation': `${letter.rotation}deg` }} aria-label={`字母 ${letter.char}，当前字体 ${FONT_NAMES[letter.font]}，点击换字体`} onClick={()=>changeLetter(index)} onDrop={(x,y)=>edit(p=>({...p,letters:p.letters.map((l,i)=>i===index?{...l,x,y}:l)}))} onKeyDown={event=>{ if(event.key.startsWith('Arrow')) { event.preventDefault(); const dx=event.key==='ArrowLeft'?-10:event.key==='ArrowRight'?10:0,dy=event.key==='ArrowUp'?-10:event.key==='ArrowDown'?10:0; edit(p=>({...p,letters:p.letters.map((l,i)=>i===index?{...l,x:l.x+dx,y:l.y+dy}:l)})); } }}><span className={`letter-face font-${letter.font}`} style={{fontFamily:`'${FONT_NAMES[letter.font]}'`}}>{letter.char}</span></Draggable>)}</div><span className="dimension-tag" aria-hidden="true">{dimensions}</span></div></div>
    <a className="hero-status" href="#contact"><span className="status-dot"/>OPEN FOR <strong>INTERNSHIPS</strong></a>
    <div className="hero-skill-tags"><a href="#strengths" className="skill-tape tape-red">USER RESEARCH</a><a href="#strengths" className="skill-tape tape-ink">PRODUCT THINKING</a><a href="#strengths" className="skill-tape tape-blue">INTERACTION DESIGN</a><a href="#strengths" className="skill-tape tape-green">PROTOTYPING</a></div>
    <a className="hero-down" href="#about" aria-label="向下了解高凯宸"><ArrowDown size={18}/></a>
    {editor.notes.map(note=><Draggable key={note.id} x={note.dx} y={note.dy} onDrop={(dx,dy)=>edit(p=>({...p,notes:p.notes.map(n=>n.id===note.id?{...n,dx,dy}:n)}))} className="canvas-note" style={{left:`${note.x}%`,top:`${note.y}%`}} data-sticker><button aria-label="删除便签" onClick={()=>edit(p=>({...p,notes:p.notes.filter(n=>n.id!==note.id)}))}><X size={14}/></button><p>{note.text}</p></Draggable>)}
    {noteDraft && <form className="note-composer" style={{left:`${noteDraft.x}%`,top:`${noteDraft.y}%`}} onSubmit={addNote}><label htmlFor="canvas-note-input">Leave a note</label><textarea name="note" id="canvas-note-input" autoFocus maxLength={100} required placeholder="A little thought…"/><div><button type="button" onClick={()=>setNoteDraft(null)}>Cancel</button><button type="submit">Add note</button></div></form>}
    <div className="canvas-dock" role="toolbar" aria-label="画布工具栏"><div className="dock-top"><span>{noteMode?'Click anywhere to add a note':'Click a letter. Make it yours.'}</span><button className="help-button" aria-label="查看画布操作说明" aria-expanded={help} onClick={()=>setHelp(!help)}><HelpCircle size={15}/></button><div className="color-swatches" role="group" aria-label="画布背景色">{PALETTE.map((color,i)=><button key={color} style={{background:color}} className={editor.bg===color?'selected':''} aria-label={`背景色 ${['白纸','朱红','紫色','薄荷','橘色','黄色','粉色','蓝色'][i]}`} aria-pressed={editor.bg===color} onClick={()=>edit(p=>({...p,bg:color}))}/>)}</div></div><div className="dock-actions"><button className={editor.stickers?'is-on':''} aria-pressed={editor.stickers} onClick={()=>edit(p=>({...p,stickers:!p.stickers}))}><Sticker size={19}/><span>Stickers</span></button><button className={noteMode?'is-on':''} aria-pressed={noteMode} onClick={()=>{setNoteMode(!noteMode);setNoteDraft(null);}}><MessageCircle size={19}/><span>Note</span></button><Magnetic as="button" className="remix-button" onClick={remix}><Dices size={20}/><span>Remix</span></Magnetic><button onClick={tidy}><LayoutGrid size={19}/><span>Tidy</span></button><button disabled={!state.past.length} onClick={()=>dispatch({type:'undo'})}><Undo2 size={19}/><span>Undo</span></button></div>{help&&<div className="dock-help"><strong>Your little canvas.</strong><p>Click letters to restyle. Drag to move. Remix to shuffle. Tidy to reset.</p><button onClick={()=>setHelp(false)}>Got it <MousePointer2 size={14}/></button></div>}</div>
    <CanvasSparks canvasRef={root} />
    <svg className="hero-pencil-line" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 78Q600-8 1460 66" fill="none" stroke="#17171a" strokeWidth="1"/></svg>
  </section>;
}
