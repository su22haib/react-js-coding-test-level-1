import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import SearchBar from "./SearchBar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CANVAS_OPTIONS = {
  height: window.outerHeight + window.innerHeight,
  windowHeight: window.outerHeight + window.innerHeight,
  scrollY: -window.scrollY,
  useCORS: true,
};

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Pokemon Stats",
    },
  },
};

function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  //Print a PDF from the pokedex.
  const downloadAsPDF = () => {
    const printArea = document.getElementById("div2");

    html2canvas(printArea, CANVAS_OPTIONS).then((canvas) => {
      const dataURL = canvas.toDataURL();
      const pdfFile = new jsPDF("p", "mm", "a4");

      pdfFile.addImage(dataURL, "JPEG", 0, 0, 200, 360);

      pdfFile.save("saved.pdf");
    });
  };

  const onPokemonSelect = (pokemon) => {
    axios
      .get(pokemon.url)
      .then((res) => {
        const _labels = res.data.stats.map((item) => item.stat.name);
        const _data = res.data.stats.map((item) => item.base_stat);

        setChartData({
          labels: _labels,
          datasets: [
            {
              label: "stats",
              data: _data,
              backgroundColor: [
                "#ffbb11",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
            },
          ],
        });

        setPokemonDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //This useEffect runs when the page renders, using it to fetch the pokemon list.
  useEffect(() => {
    setIsLoading(true);

    axios
      .get("https://pokeapi.co/api/v2/pokemon")
      .then((res) => {
        setPokemons(res.data.results);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      color: "black",
      height: "700px",
      width: "800px",
    },
    overlay: { backgroundColor: "grey" },
  };

  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className="App-header">
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex,
              and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>
              when hover on the list item , change the item color to yellow.
            </li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
            <li>
              If you do more than expected (E.g redesign the page / create a
              chat feature at the bottom right). it would be good.
            </li>
          </ul>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="App-header">
        {isLoading ? (
          <>
            <div className="App">
              <ReactLoading />
            </div>
          </>
        ) : (
          <>
            <h1 className="padding">Suhaib's Pokedex!</h1>
            <div className="padding">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1280px-International_Pok%C3%A9mon_logo.svg.png"
                width="400px"
              />
            </div>

            <div className="padding">
              <SearchBar
                placeholder="Search the Pokedex.."
                data={pokemons}
                access={onPokemonSelect}
              />
            </div>
          </>
        )}
      </header>
      {pokemonDetail && (
        <div className="html2canvas-container">
          <Modal
            id="Pokemon-info"
            isOpen={pokemonDetail}
            contentLabel={pokemonDetail?.name || ""}
            onRequestClose={() => {
              setPokemonDetail(null);
            }}
            style={customStyles}
          >
            <div id="div2">
              <img
                src={pokemonDetail.sprites.front_default}
                height="200px"
                width="200px"
              />
              <ul>
                <table>
                  <thead>
                    <div>Pokemon: {pokemonDetail.name}</div>
                  </thead>
                  <tbody>
                    {pokemonDetail.stats.map((item) => (
                      <tr className="pokemon-stat">
                        <td>{item.stat.name}</td>
                        <td>{item.base_stat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Bar
                  options={CHART_OPTIONS}
                  data={chartData}
                  width={40}
                  height={15}
                ></Bar>
              </ul>
            </div>
            <div>
              <button onClick={downloadAsPDF}>Download</button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default PokeDex;
