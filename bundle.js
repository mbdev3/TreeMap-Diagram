(function (react, ReactDOM, d3$1) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  var jsonUrl = {
    "Video Game Sales": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    "Movie Sales": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
    "Kickstarter Pledges":
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
  };
  var useData = function (option) {
    var ref = react.useState(null);
    var data = ref[0];
    var setData = ref[1];

    react.useEffect(function () {
      d3$1.json(jsonUrl[option]).then(function (data) {
        setData(data);
      });
    }, [option]);
    return data;
  };

  var Marks = function (ref) {
    var root = ref.root;
    var onMouseEnter = ref.onMouseEnter;
    var onMouseOut = ref.onMouseOut;
    var colorMap = ref.colorMap;

    return (
    React.createElement( 'g', { className: "mark" },
      root.leaves().map(function (d, i) {
        var name = d.data.name.split(/(?=[A-Z][^A-Z])/g);

        return (
          React.createElement( React.Fragment, null,
            React.createElement( 'rect', {
              className: "tile", x: d.x0, y: d.y0, width: d.x1 - d.x0, height: d.y1 - d.y0, fill: colorMap[i], onMouseEnter: function (e) { return onMouseEnter(d, e); }, onMouseOut: function () { return onMouseOut(null); }, 'data-name': d.data.name, 'data-category': d.data.category, 'data-value': d.data.value }),
            React.createElement( 'text', null,
              name.map(function (n, i) {
                if (i < 3) {
                  return (
                    React.createElement( 'tspan', { x: d.x0, dx: 4, y: d.y0 + i * 12 + 10, dy: 4 },
                      n
                    )
                  );
                }
              })
            )
          )
        );
      })
    )
  );
  };

  var positionLegendY = function (i) {
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
  var positionLegendX = function (i) {
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
  Array.from(Array(20).keys());
  var Legend = function (ref) {
    var root = ref.root;
    var innerHeight = ref.innerHeight;
    var newColorMap = ref.newColorMap;

    return (
      React.createElement( 'g', { id: "legend", transform: ("translate(" + (50) + "," + (innerHeight + 30) + ")") },
        root.children.map(function (d, i) {
          return (
            React.createElement( React.Fragment, null,
              React.createElement( 'rect', {
                className: "legend-item", x: positionLegendX(i), y: positionLegendY(i), width: 15, height: 15, fill: newColorMap[i] }),
              React.createElement( 'text', { x: positionLegendX(i), y: positionLegendY(i), dx: 20, dy: 10 },
                d.data.name
              )
            )
          );
        })
      )
    );
  };

  var Dropdown = function (ref) {
    var dataOption = ref.dataOption;
    var setSelectedData = ref.setSelectedData;
    var selectedData = ref.selectedData;
    var id = ref.id;

    return (
    React.createElement( 'select', { name: "data", id: id, onChange: function (e) { return setSelectedData(e.target.value); } }, 
      dataOption.map(function (value) {
        return (
          React.createElement( 'option', { value: value.name, selected: value.name === selectedData }, 
            value.name
          )
        );
      })
    )
  );
  };

  var width = 1200;
  var height = 540;
  var margin = {
    top: 20,
    bottom: 50,
    right: 0,
    left: 0,
  };
  var innerHeight = height - margin.top - margin.bottom;
  var innerWidth = width - margin.right - margin.left;

  var dataOption = [
    { name: "Video Game Sales", desc: "", unit: "M unit", genre: "platform" },
    { name: "Movie Sales", desc: "", unit: "$", genre: "genre" },
    { name: "Kickstarter Pledges", desc: "", unit: "$", genre: "category" } ];
  var App = function () {
    var ref = react.useState("Video Game Sales");
    var selectedData = ref[0];
    var setSelectedData = ref[1];
    var data = useData(selectedData);

    var ref$1 = react.useState([]);
    var tool = ref$1[0];
    var setTool = ref$1[1];
    if (!data) {
      return React.createElement( 'pre', null, "loading.." );
    }

    var fader = function (color) {
      return d3$1.interpolateRgb(color)(0);
    };
    var color = d3$1.scaleOrdinal().range(
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
        "#b3b3b3" ].map(fader)
    );

    var treemap = d3.treemap().tile(d3$1.treemapResquarify).size([innerWidth, innerHeight]).paddingInner(1);

    var root = d3
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
    var len = 0;
    data.children.map(function (d) {
      return (len += d.children.length);
    });

    var title = dataOption.find(function (d) { return d.name === selectedData; });

    var a = [];
    var c = function () {
      root.leaves().map(function (d) {
        a.push(color(d.data.category));
      });
      return a;
    };
    var colorMap = c();
    // const newColorMap = [...new Set(colorMap)];
    var newColorMap = colorMap.filter(function (c, index) {
      return colorMap.indexOf(c) === index;
    });

    var onMouseMove = function (e) {
      var n = tool[0];
      var c = tool[1];
      var v = tool[2];

      e.pageX > innerWidth / 2 ? (e.pageX = e.pageX - 150) && (e.pageY = e.pageY - 100) : e.pageX + 40;
      tooldiv
        .style("opacity", 1)
        .html(function () { return ("<span>Name:</span> " + n + "</br> <span>Categrogy:</span> " + c + "</br> <span>Value:</span> " + v); })
        .style("top", e.pageY - 40 + "px")
        .style("left", e.pageX + 40 + "px")
        .attr("data-value", v);
    };

    var onMouseEnter = function (d) {
      var n = d.data.name;
      var c = d.data.category;
      var v = d.data.value + " " + (title.unit);
      setTool([n, c, v]);
    };
    var onMouseOut = function () {
      tooldiv.style("opacity", 0);
    };
    return (
      React.createElement( React.Fragment, null,
        React.createElement( 'div', { id: "title" },
          React.createElement( 'h1', null, title.name ),
          React.createElement( 'p', { id: "description" }, ("Top " + len + " " + selectedData + " grouped by " + (title.genre))),
          React.createElement( Dropdown, {
            dataOption: dataOption, selectedData: selectedData, setSelectedData: setSelectedData, id: "data-select" })
        ),

        React.createElement( 'g', null,
          React.createElement( 'svg', { width: width, height: height + 70, transform: ("translate(" + (margin.left) + "," + (0) + ")") },
            React.createElement( 'g', { width: innerWidth, height: innerHeight, onMouseMove: function (e) { return onMouseMove(e); } },
              React.createElement( Marks, {
                root: root, color: color, colorMap: colorMap, onMouseEnter: function (e, d) { return onMouseEnter(e); }, onMouseOut: function () { return onMouseOut(); } })
            ),

            React.createElement( Legend, {
              color: color, newColorMap: newColorMap, root: root, innerWidth: innerWidth, innerHeight: innerHeight }),
            React.createElement( 'g', { className: "copyright", transform: ("translate(" + (width - 25) + "," + (height - 25 + 70) + ") ") },
              React.createElement( 'text', { textAnchor: "middle", dx: -15, dy: 18 }, "By"),
              React.createElement( 'a', { href: "https://thembdev.com" },
                " ",
                React.createElement( 'image', { href: "https://mbdev-utils.s3.eu-west-3.amazonaws.com/mbdev_logo_sm.svg", width: 25 })
              )
            )
          )
        )
      )
    );
  };

  var rootElement = document.getElementById("root");
  ReactDOM__default["default"].render(React.createElement( App, null ), rootElement);

})(React, ReactDOM, d3);
//# sourceMappingURL=bundle.js.map
