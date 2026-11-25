import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

// Original, bounded implementations inspired by React Bits' Magnet / ClickSpark.
export function Magnetic({ as: Tag = 'a', className = '', children, ...props }) {
  function reset(event) {
    event.currentTarget.style.setProperty('--magnet-x', '0px');
    event.currentTarget.style.setProperty('--magnet-y', '0px');
  }
  return <Tag {...props} className={`magnetic ${className}`} onPointerMove={event => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const clamp = n => Math.max(-9, Math.min(9, n));
    event.currentTarget.style.setProperty('--magnet-x', `${clamp((event.clientX - box.left - box.width / 2) * .15)}px`);
    event.currentTarget.style.setProperty('--magnet-y', `${clamp((event.clientY - box.top - box.height / 2) * .15)}px`);
  }} onPointerLeave={event => { reset(event); props.onPointerLeave?.(event); }} onBlur={event => { reset(event); props.onBlur?.(event); }}>{children}</Tag>;
}

export function ReferenceCursor() {
  const root = useRef();
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const node = root.current;
      const label = node.querySelector('.cursor-tag');
      const moveX = gsap.quickTo(node, 'x', { duration: .18, ease: 'power3.out' });
      const moveY = gsap.quickTo(node, 'y', { duration: .18, ease: 'power3.out' });
      let visible = false;
      const hide = () => { node.style.opacity = '0'; visible = false; document.documentElement.classList.remove('has-contrast-cursor'); };
      const move = event => {
        if (event.pointerType !== 'mouse' || document.querySelector('dialog[open]')) { hide(); return; }
        if (!visible) {
          gsap.set(node, { x: event.clientX, y: event.clientY });
          visible = true;
          node.style.opacity = '1';
          document.documentElement.classList.add('has-contrast-cursor');
        }
        moveX(event.clientX); moveY(event.clientY);
        const target = event.target.closest('[data-cursor]');
        const drag = event.target.closest('.draggable');
        node.dataset.kind = drag ? 'drag' : target?.dataset.cursor || 'default';
        label.textContent = drag ? 'Drag' : 'You';
      };
      const press = () => { node.dataset.pressed = 'true'; };
      const release = () => { node.dataset.pressed = 'false'; };
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerdown', press);
      window.addEventListener('pointerup', release);
      window.addEventListener('pointercancel', release);
      window.addEventListener('blur', hide);
      document.documentElement.addEventListener('pointerleave', hide);
      document.addEventListener('visibilitychange', hide);
      return () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerdown', press);
        window.removeEventListener('pointerup', release);
        window.removeEventListener('pointercancel', release);
        window.removeEventListener('blur', hide);
        document.documentElement.removeEventListener('pointerleave', hide);
        document.removeEventListener('visibilitychange', hide);
        hide();
      };
    });
    return () => media.revert();
  }, { scope: root });
  return <div className="contrast-cursor" ref={root} aria-hidden="true"><div className="cursor-shape"><span className="cursor-base"/><i/><i/><i/><i/><b className="cursor-see">See</b><span className="cursor-tag">You</span></div></div>;
}

export function CanvasSparks({ canvasRef }) {
  const layer = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = layer.current;
    const animations = new Set();
    const colors = ['#d4ec72', '#ed633d', '#6254db', '#be3079'];
    const burst = event => {
      if (!event.detail || !event.target.closest('.letter,.remix-button,.avatar-character') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const box = host.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const bit = document.createElement('i');
        bit.style.left = `${event.clientX - box.left}px`;
        bit.style.top = `${event.clientY - box.top}px`;
        bit.style.background = colors[i % colors.length];
        host.appendChild(bit);
        const angle = i * Math.PI / 3;
        const animation = bit.animate([
          { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
          { transform: `translate(${Math.cos(angle) * 40}px,${Math.sin(angle) * 40}px) rotate(100deg) scale(.1)`, opacity: 0 }
        ], { duration: 450, easing: 'cubic-bezier(.15,.65,.35,1)' });
        animations.add(animation);
        animation.finished.catch(() => {}).finally(() => { animations.delete(animation); bit.remove(); });
      }
    };
    canvas.addEventListener('click', burst);
    return () => { canvas.removeEventListener('click', burst); animations.forEach(animation => animation.cancel()); host.replaceChildren(); };
  }, [canvasRef]);
  return <div className="canvas-sparks" ref={layer} aria-hidden="true" />;
}
