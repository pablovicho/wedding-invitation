/**
 * Ubah <svg> yang sedang tampil menjadi Image untuk digambar ke canvas.
 * Warna ornamen berasal dari class Tailwind + CSS variable, yang hilang saat SVG
 * diserialisasi — jadi warna hasil komputasi disalin ke atribut tiap elemen.
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
    // Animasi CSS (mis. ayunan) tidak ikut; transform atribut SVG tetap dipertahankan
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
