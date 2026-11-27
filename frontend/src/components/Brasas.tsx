import { useEffect, useRef } from 'react';

type Brasa = { x: number; y: number; v: number; l: number; a: number; d: number };

/** Fagulhas subindo, como na tela de título. Para quando a pessoa prefere menos movimento. */
export function Brasas({ quantidade = 70 }: { quantidade?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const cx = cv?.getContext('2d');
    if (!cv || !cx) return;
    const calma = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const brasas: Brasa[] = Array.from({ length: quantidade }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.0006 + Math.random() * 0.0016,
      l: 4 + Math.random() * 12,
      a: 0.25 + Math.random() * 0.6,
      d: (Math.random() - 0.5) * 0.0006,
    }));
    let w = 0;
    let h = 0;
    const medir = () => {
      w = cv.width = cv.offsetWidth;
      h = cv.height = cv.offsetHeight;
    };
    medir();
    window.addEventListener('resize', medir);
    let quadro = 0;
    const desenhar = () => {
      cx.clearRect(0, 0, w, h);
      for (const b of brasas) {
        if (!calma) {
          b.y -= b.v;
          b.x += b.d + 0.0004;
          if (b.y < -0.05) {
            b.y = 1.05;
            b.x = Math.random();
          }
        }
        const x = b.x * w;
        const y = b.y * h;
        cx.strokeStyle = `rgba(242,${120 + Math.round(b.a * 60)},70,${b.a * (0.3 + 0.7 * b.y)})`;
        cx.lineWidth = 1.6;
        cx.beginPath();
        cx.moveTo(x, y);
        cx.lineTo(x - b.l * 0.35, y + b.l);
        cx.stroke();
      }
      if (!calma) quadro = requestAnimationFrame(desenhar);
    };
    desenhar();
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener('resize', medir);
    };
  }, [quantidade]);

  return <canvas ref={ref} className="brasas" aria-hidden="true" />;
}
