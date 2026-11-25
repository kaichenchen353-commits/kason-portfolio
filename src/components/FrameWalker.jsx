import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Draggable from './Draggable';

export default function FrameWalker(props) {
  const route = useRef();
  const timeline = useRef();
  const timer = useRef();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fact, setFact] = useState(0);
  const facts = ['hey there!', 'Sketch. Build. Repeat.', 'A little curiosity.', 'Nice to meet you!'];
  const paused = hovered || focused || greeting || dragging || !visible;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 641px) and (prefers-reduced-motion: no-preference)', () => {
      const node = route.current;
      const walk = () => { node.dataset.walking = 'true'; };
      const rest = () => { node.dataset.walking = 'false'; };
      timeline.current = gsap.timeline({ repeat: -1 })
        .call(walk)
        .to(node, { left: '76%', duration: 11, ease: 'none' })
        .call(rest).to({}, { duration: 2.5 })
        .call(walk)
        .to(node, { left: '24%', duration: 11, ease: 'none' })
        .call(rest).to({}, { duration: 2.5 });
      timeline.current.paused(pausedRef.current);
      return () => { timeline.current = null; node.dataset.walking = 'false'; };
    });
    return () => media.revert();
  }, { scope: route });

  useEffect(() => {
    timeline.current?.paused(paused);
    route.current.dataset.paused = String(paused);
  }, [paused]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(route.current);
    return () => { observer.disconnect(); clearTimeout(timer.current); };
  }, []);
  const greet = () => {
    setFact(i => (i + 1) % facts.length);
    setGreeting(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setGreeting(false), 900);
  };

  return <div className="frame-walker" ref={route}>
    <Draggable {...props} as="button" type="button" className={`avatar-character ${greeting ? 'is-greeting' : ''}`} aria-label="KASON 小人：沿名字框走动，悬停停下，点击打招呼，也可以拖动" onClick={greet} onDragStateChange={setDragging} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocus={event => setFocused(event.currentTarget.matches(':focus-visible'))} onBlur={() => setFocused(false)}>
      <span className="walker-art" style={{ '--pose': `${greeting || hovered || focused ? 50 : 0}%` }} aria-hidden="true">
        <span className="avatar-sprite walker-body"/>
        <span className="avatar-sprite walker-leg walker-leg-left"/>
        <span className="avatar-sprite walker-leg walker-leg-right"/>
      </span>
      <span className={`avatar-speech ${paused ? 'is-talking' : ''}`} aria-live="polite">{facts[fact]}<i/></span>
      <span className="avatar-hint">say hi</span>
    </Draggable>
  </div>;
}
