// ── Variablen ─────────────────────────────────────────────────
const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let allPokemons = []; // alle geladenen Pokemon gespeichert (Cache)
let allPokemonNames = []; // alle Pokemon-Namen für die Suche
let currentSearchResults = []; // aktuelle Suchergebnisse
let currentOffset = 0; // wo fangen wir beim Laden an
let currentIndex = 0; // welches Pokemon ist gerade im Dialog offen
let loadedCount = 0; // maximale Anzahl der tatsächlich geladenen Pokemon
let contentRendered = false; // ob der Inhalt bereits gerendert wurde
const LOAD_COUNT = 20; // wie viele auf einmal laden


// Typ-Farben
const typeColors = {
  fire: "#e63946",
  water: "#457b9d",
  grass: "#2d6a4f",
  electric: "#f4a261",
  psychic: "#9b2226",
  ice: "#a8dadc",
  dragon: "#6d6875",
  dark: "#343a40",
  fairy: "#f4acb7",
  normal: "#6b7279",
  fighting: "#d62828",
  poison: "#7b2d8b",
  ground: "#d4a373",
  flying: "#3d5a80",
  bug: "#606c38",
  rock: "#6c757d",
  ghost: "#4a4e69",
  steel: "#dee2e6",
};


// ── Init ──────────────────────────────────────────────────────
async function init() {
  await loadAllPokemonNames();
  await loadPokemons();
}

async function loadAllPokemonNames() {
  let response = await fetch(`${BASE_URL}?limit=100000`);
  let data = await response.json();
  allPokemonNames = data.results.map((pokemon) => pokemon.name);
}


// ── Einzelnes Pokemon von API holen ──────────────────────────
async function fetchPokemon(id) {
  let response = await fetch(BASE_URL + id);
  return await response.json();
}


async function fetchPokemontype(url) {
  let response = await fetch(url);
  return await response.json();
}

function getGermanNameFromSpecies(speciesData) {
  let germanEntry = speciesData.names.find((nameEntry) => nameEntry.language.name === "de");
  return germanEntry ? germanEntry.name : null;
}

// ── Pokemon laden ─────────────────────────────────────────────

async function fetchPokemonWithTypes(iOrName) {
  let data = await fetchPokemon(iOrName);
  let speciesResponse = await fetch(data.species.url);
  let speciesData = await speciesResponse.json();
  data.displayName = getGermanNameFromSpecies(speciesData) || capitalize(data.name);

  let typePromises = data.types.map(async (t) => {
    let typeData = await fetchPokemontype(t.type.url);
    return typeData.sprites["generation-viii"]["sword-shield"].symbol_icon;
  });
  data.typeIconUrl = await Promise.all(typePromises);
  return data;
}


async function loadPokemons() {
  let btn = document.querySelector('[data-id="load-more-button"]');
  btn.disabled = true;
  btn.innerText = "Loading...";
  showLoadingScreen();

  for (let i = currentOffset; i < currentOffset + LOAD_COUNT; i++) {
    if (!allPokemons[i]) {
      allPokemons[i] = await fetchPokemonWithTypes(i + 1);
    }
    renderCard(allPokemons[i], i);
  }

  currentOffset += LOAD_COUNT;
  loadedCount = currentOffset;
  btn.disabled = false;
  btn.innerText = "Load More";
  hideLoadingScreen();
}


function showError(input) {
  let err = document.querySelector('[data-id="search-error"]');
  err.textContent = input.length === 0 ? "" : "min. 3 Buchstaben eingeben";
}


function handleShortInput(input, main, btn) {
  showError(input);
  currentSearchResults = [];
  renderLoadedPokemons();
  btn.disabled = false;
}


function renderLoadedPokemons() {
  let list = document.querySelector('[data-id="pokemon-list"]');
  list.innerHTML = "";
  for (let i = 0; i < loadedCount; i++) {
    if (allPokemons[i]) {
      renderCard(allPokemons[i], i);
    }
  }
  contentRendered = true;
}


function renderAftersearch(main) {
  renderLoadedPokemons();
}


function renderResults(results, main) {
  let list = document.querySelector('[data-id="pokemon-list"]');
  list.innerHTML = "";
  if (results.length === 0) {
    list.innerHTML = `<p data-id="not-found" class="not_found">Sorry, no Pokémon found! 😢</p>`;
    return;
  }
  results.forEach(p => {
    list.innerHTML += `<li>${renderContentpokemon(p, typeColors[p.types[0].type.name] || "#333", allPokemons.indexOf(p))}</li>`;
  });
}


async function searchPokemon() {
  let input = document.querySelector('[data-id="search-input"]').value.toLowerCase();
  let main = document.querySelector('[data-id="content"]');
  let btn = document.querySelector('[data-id="load-more-button"]');
  btn.disabled = true;

  if (input.length < 3) {
    handleShortInput(input, main, btn);
    return;
  }

  document.querySelector('[data-id="search-error"]').textContent = "";
  contentRendered = false;

  let loadedResults = allPokemons.filter(
    (p) =>
      p &&
      (p.name.toLowerCase().includes(input) || p.displayName?.toLowerCase().includes(input))
  );

  let missingNames = allPokemonNames
    .filter((name) => name.includes(input))
    .filter((name) => !loadedResults.some((p) => p.name === name))
    .slice(0, 10);

  let missingResults = await Promise.all(
    missingNames.map(async (name) => {
      try {
        return await fetchPokemonWithTypes(name);
      } catch (error) {
        return null;
      }
    })
  );

  missingResults
    .filter(Boolean)
    .forEach((pokemon) => {
      let index = pokemon.id - 1;
      if (!allPokemons[index]) {
        allPokemons[index] = pokemon;
      }
    });

  let results = [...loadedResults, ...missingResults.filter(Boolean)];
  currentSearchResults = results;
  renderResults(results, main);
  btn.disabled = false;
}


async function loadMore() {
  await loadPokemons();
  await hideLoadingScreen();
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
    }


function showLoadingScreen() {
  document.querySelector('[data-id="loading-screen"]').style.display = "flex";
  document.querySelector('[data-id="search-input"]').disabled = true;
}


function hideLoadingScreen() {
  document.querySelector('[data-id="loading-screen"]').style.display = "none";
  document.querySelector('[data-id="search-input"]').disabled = false;
}
