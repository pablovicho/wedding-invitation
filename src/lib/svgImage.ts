/**
 * Convierte el <svg> que se está mostrando en un Image para dibujarlo en el canvas.
 * Los colores de los adornos provienen de clases de Tailwind + variables CSS, que se pierden al
 * serializar el SVG — así que los colores calculados se copian a los atributos de cada elemento.
 */
const PROPS = ['fill', 'stroke', 'opacity', 'fill-opacity', 'stroke-opacity', 'stroke-width'] as const;

export async function svgToImage(svg: SVGSVGElement, width: number): Promise<HTMLImageElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const src = [svg, ...svg.querySelectorAll('*')];
  const dst = [clone, ...clone.querySelectorAll('*')];
  src.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const out = dst[i] as SVGElement;
    for (const p of PROPS) {
      const v = cs.getPropertyValue(p);
      if (v) out.setAttribute(p, v);
    }
    out.removeAttribute('class');
    out.removeAttribute('style');
    // Las animaciones CSS (ej. balanceo) no se incluyen; los atributos transform del SVG se conservan
  });
  const vb = svg.viewBox.baseVal;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(Math.round((width * vb.height) / vb.width)));
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
  await img.decode();
  return img;
}
