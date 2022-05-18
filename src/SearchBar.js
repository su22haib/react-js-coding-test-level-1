import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";

import "./SearchBar.css";

function SearchBar({ placeholder, data, access }) {
  //Props: data is the actual list of pokemons, and access is allowing us to set the selected pokemon.

  const [filteredData, setfilteredData] = useState([]);

  const filterHandler = (event) => {
    const query = event.target.value;
    const newFilter = data.filter((value) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });

    query === "" ? setfilteredData([]) : setfilteredData(newFilter); //If the query string is empty reset the filteredDataArray so the the list does not show uncessarily.
  };

  return (
    <div className="search">
      <div className="searchInput">
        <input type="text" placeholder={placeholder} onChange={filterHandler} />
      </div>
      {filteredData.length != 0 && (
        <div className="results">
          {filteredData.map((value, key) => {
            return (
              <a className="dataItem" onClick={() => access(value)}>
                <p>{value.name}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
