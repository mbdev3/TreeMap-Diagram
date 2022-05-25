import { useState } from "react";
import ReactDOM from "react-dom";
import { useData } from "./useData";

import { Marks } from "./Marks";
import { Legend } from "./legend";
import { scaleOrdinal, interpolateRgb, treemapResquarify, treemapBinary } from "d3";
import { Dropdown } from "./Dropdown";
const width = 1200;
const height = 540;
const margin = {
  top: 20,
  bottom: 50,
  right: 0,
  left: 0,
};
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.right - margin.left;

const dataOption = [
  { name: "Video Game Sales", desc: "", unit: "M unit", genre: "platform" },
  { name: "Movie Sales", desc: "", unit: "$", genre: "genre" },
  { name: "Kickstarter Pledges", desc: "", unit: "$", genre: "category" },
];
const App = () => {
  const [selectedData, setSelectedData] = useState("Video Game Sales");
  const data = useData(selectedData);

  const [tool, setTool] = useState([]);
  if (!data) {
    return <pre>loading..</pre>;
  }

  const fader = (color) => {
    return interpolateRgb(color)(0);
  };
  const color = scaleOrdinal().range(
    [
      "#8dd3c7",
      "#ffffb3",
      "#bebada",
      "#fb8072",
      "#80b1d3",
      "#fdb462",
      "#b3de69",
      "#fccde5",
      "#d9d9d9",
      "#bc80bd",
      "#ccebc5",
      "#ffed6f",
      "#66c2a5",
      "#fc8d62",
      "#8da0cb",
      "#e78ac3",
      "#a6d854",
      "#ffd92f",
      "#e5c494",
      "#b3b3b3",
    ].map(fader)
  );

  const treemap = d3.treemap().tile(treemapResquarify).size([innerWidth, innerHeight]).paddingInner(1);

  const root = d3
    .hierarchy(data)
    .eachBefore(function (d) {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    })
    .sum(function (d) {
      return (d.value = +d.value);
    })

    .sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });

  treemap(root);
  let len = 0;
  data.children.map((d) => {
    return (len += d.children.length);
  });

  let title = dataOption.find((d) => d.name === selectedData);

  let a = [];
  const c = () => {
    root.leaves().map((d) => {
      a.push(color(d.data.category));
    });
    return a;
  };
  const colorMap = c();
  // const newColorMap = [...new Set(colorMap)];
  let newColorMap = colorMap.filter((c, index) => {
    return colorMap.indexOf(c) === index;
  });

  const onMouseMove = (e) => {
    const [n, c, v] = tool;

    e.pageX > innerWidth / 2 ? (e.pageX = e.pageX - 150) && (e.pageY = e.pageY - 100) : e.pageX + 40;
    tooldiv
      .style("opacity", 1)
      .html(() => `<span>Name:</span> ${n}</br> <span>Categrogy:</span> ${c}</br> <span>Value:</span> ${v}`)
      .style("top", e.pageY - 40 + "px")
      .style("left", e.pageX + 40 + "px")
      .attr("data-value", v);
  };

  const onMouseEnter = (d) => {
    let n = d.data.name;
    let c = d.data.category;
    let v = d.data.value + ` ${title.unit}`;
    setTool([n, c, v]);
  };
  const onMouseOut = () => {
    tooldiv.style("opacity", 0);
  };
  return (
    <>
      <div id="title">
        <h1>{title.name}</h1>
        <p id="description">{`Top ${len} ${selectedData} grouped by ${title.genre}`}</p>
        <Dropdown
          dataOption={dataOption}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          id="data-select"
        />
      </div>

      <g>
        <svg width={width} height={height + 70} transform={`translate(${margin.left},${0})`}>
          <g width={innerWidth} height={innerHeight} onMouseMove={(e) => onMouseMove(e)}>
            <Marks
              root={root}
              color={color}
              colorMap={colorMap}
              onMouseEnter={(e, d) => onMouseEnter(e, d)}
              onMouseOut={() => onMouseOut()}
            />
          </g>

          <Legend
            color={color}
            newColorMap={newColorMap}
            root={root}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
          />
          <g className="copyright" transform={`translate(${width - 25},${height - 25 + 70}) `}>
            <text textAnchor="middle" dx={-15} dy={18}>
              By
            </text>
            <a xlink:href="https://thembdev.com">
              {" "}
              <image xlink:href="https://mbdev-utils.s3.eu-west-3.amazonaws.com/mbdev_logo_sm.svg" width={25} />
            </a>
          </g>
        </svg>
      </g>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
