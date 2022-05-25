const positionLegendY = (i) => {
  if (i < 6) {
    return 0;
  }
  if (i < 12) {
    return 35;
  }
  if (i < 20) {
    return 70;
  }
};
const positionLegendX = (i) => {
  if (i < 6) {
    return i * 200;
  }
  if (i < 12) {
    return i * 200 - 200 * 6;
  }
  if (i < 20) {
    return i * 200 - 200 * 12;
  }
};
const a = Array.from(Array(20).keys());
export const Legend = ({ root, innerHeight, newColorMap }) => {
  return (
    <g id="legend" transform={`translate(${50},${innerHeight + 30})`}>
      {root.children.map((d, i) => {
        return (
          <>
            <rect
              className="legend-item"
              x={positionLegendX(i)}
              y={positionLegendY(i)}
              width={15}
              height={15}
              fill={newColorMap[i]}
            />
            <text x={positionLegendX(i)} y={positionLegendY(i)} dx={20} dy={10}>
              {d.data.name}
            </text>
          </>
        );
      })}
    </g>
  );
};
