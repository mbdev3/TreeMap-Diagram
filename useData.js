import { useState, useEffect } from "react";
import { json } from "d3";

const jsonUrl = {
  "Video Game Sales": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  "Movie Sales": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  "Kickstarter Pledges":
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
};
export const useData = (option) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(jsonUrl[option]).then((data) => {
      setData(data);
    });
  }, [option]);
  return data;
};
