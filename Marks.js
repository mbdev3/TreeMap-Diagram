export const Marks = ({ root, onMouseEnter, onMouseOut, colorMap }) => (
  <g className="mark">
    {root.leaves().map((d, i) => {
      const name = d.data.name.split(/(?=[A-Z][^A-Z])/g);

      return (
        <>
          <rect
            className="tile"
            x={d.x0}
            y={d.y0}
            width={d.x1 - d.x0}
            height={d.y1 - d.y0}
            fill={colorMap[i]}
            onMouseEnter={(e) => onMouseEnter(d, e)}
            onMouseOut={() => onMouseOut(null)}
            data-name={d.data.name}
            data-category={d.data.category}
            data-value={d.data.value}
          ></rect>
          <text>
            {name.map((n, i) => {
              if (i < 3) {
                return (
                  <tspan x={d.x0} dx={4} y={d.y0 + i * 12 + 10} dy={4}>
                    {n}
                  </tspan>
                );
              }
            })}
          </text>
        </>
      );
    })}
  </g>
);
