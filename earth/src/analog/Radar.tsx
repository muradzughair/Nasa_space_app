import { type Dimension, type DimId, type DimScore, percent } from "./data";

const SIZE = 240;
const CENTRE = SIZE / 2;
const REACH = 78;
/** Extra width on each side so the left and right axis labels are not clipped. */
const MARGIN = 36;

/**
 * Similarity of one Earth site to the target on every dimension. The outer
 * ring is the target itself (identical on every axis); the filled shape is
 * how close the Earth site comes. A dimension with no data is drawn at the
 * centre and labelled "n/a".
 */
export function Radar({ dimensions, scores }: { dimensions: Dimension[]; scores: Record<DimId, DimScore> }) {
  const point = (index: number, radius: number): [number, number] => {
    const angle = (index / dimensions.length) * 2 * Math.PI - Math.PI / 2;
    return [CENTRE + Math.cos(angle) * radius, CENTRE + Math.sin(angle) * radius];
  };
  const ring = (fraction: number) => dimensions.map((_, i) => point(i, REACH * fraction).join(",")).join(" ");
  const shape = dimensions.map((d, i) => point(i, REACH * Math.max(scores[d.id].score ?? 0, 0.03)).join(",")).join(" ");
  const summary = dimensions.map((d) => `${d.label} ${percent(scores[d.id].score)}`).join(", ");

  return (
    <svg className="radar" viewBox={`${-MARGIN} 0 ${SIZE + 2 * MARGIN} ${SIZE}`} role="img" aria-label={`Similarity to the target: ${summary}`}>
      {[0.25, 0.5, 0.75].map((f) => (
        <polygon key={f} className="radar-grid" points={ring(f)} />
      ))}
      <polygon className="radar-target" points={ring(1)} />
      {dimensions.map((d, i) => {
        const [x, y] = point(i, REACH);
        return <line key={d.id} className="radar-grid" x1={CENTRE} y1={CENTRE} x2={x} y2={y} />;
      })}
      <polygon className="radar-site" points={shape} />
      {dimensions.map((d, i) => {
        const [x, y] = point(i, REACH + 13);
        const anchor = Math.abs(x - CENTRE) < 8 ? "middle" : x > CENTRE ? "start" : "end";
        return (
          <text key={d.id} className={`radar-label${scores[d.id].score == null ? " is-missing" : ""}`} x={x} y={y} textAnchor={anchor} dominantBaseline="middle">
            {d.label}
            {scores[d.id].score == null && " (n/a)"}
          </text>
        );
      })}
    </svg>
  );
}
