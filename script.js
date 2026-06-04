// ── Variablen ─────────────────────────────────────────────────
const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let allPokemons = []; // alle geladenen Pokemon gespeichert (Cache)
let currentOffset = 0; // wo fangen wir beim Laden an
let currentIndex = 0; // welches Pokemon ist gerade im Dialog offen
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
  normal: "#adb5bd",
  fighting: "#d62828",
  poison: "#7b2d8b",
  ground: "#d4a373",
  flying: "#90e0ef",
  bug: "#606c38",
  rock: "#6c757d",
  ghost: "#4a4e69",
  steel: "#dee2e6",
};

// ── Init ──────────────────────────────────────────────────────
async function init() {
  await loadPokemons();
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

// ── Pokemon laden ─────────────────────────────────────────────

async function fetchPokemonWithTypes(i) {
  let data = await fetchPokemon(i + 1);
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
      allPokemons[i] = await fetchPokemonWithTypes(i);}
    renderCard(allPokemons[i], i);}
  currentOffset += LOAD_COUNT;
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
  renderAftersearch(main);
  btn.disabled = false;
}

function renderAftersearch(main) {
  if (contentRendered) return;
  main.innerHTML = "";
  allPokemons.forEach((p, i) => renderCard(p, i));
  contentRendered = true;
}

function renderResults(results, main) {
  main.innerHTML = "";
  if (results.length === 0) {
    main.innerHTML = `<p data-id="not-found" class="not_found">Sorry, no Pokémon found! 😢</p>`;
    return;
  }
  results.forEach((p) => renderCard(p, allPokemons.indexOf(p)));
}

function searchPokemon() {
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
  let results = allPokemons.filter((p) => p && p.name.includes(input));
  renderResults(results, main);
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
