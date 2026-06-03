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

// ── Pokemon laden ─────────────────────────────────────────────
async function loadPokemons() {
  let btn = document.querySelector('[data-id="load-more-button"]');
  btn.disabled = true;
  btn.innerText = "Loading...";
  showLoadingScreen();

  for (let i = currentOffset; i < currentOffset + LOAD_COUNT; i++) {
    if (!allPokemons[i]) {
      let data = await fetchPokemon(i + 1);
      allPokemons[i] = data;
    }
    
    renderCard(allPokemons[i], i);
  }
  

  currentOffset += LOAD_COUNT;
  btn.disabled = false;
  btn.innerText = "Load More";
  hideLoadingScreen();
}


// ── Einzelnes Pokemon von API holen ──────────────────────────
async function fetchPokemon(id) {
  let response = await fetch(BASE_URL + id);
  return await response.json();
}

// ── Karte rendern ─────────────────────────────────────────────
function renderCard(pokemon, index) {
  let main = document.querySelector('[data-id="content"]');
  let type = pokemon.types[0].type.name;
  let color = typeColors[type] || "#333";

  main.innerHTML += renderContentpokemon(main, pokemon, color, index);
}

function renderContentpokemon(main, pokemon, color, index) {
  return `
        <button data-id="card" class="pokemon_card" 
                style="background-color: ${color}"
                onclick="openDialog(${index})">
            <div class="card_header">
                <span>#${pokemon.id}</span>
                <span>${capitalize(pokemon.name)}</span>
            </div>
            <div class="card_img">
                <img data-id="card-image" 
                     src="${pokemon.sprites.other["official-artwork"].front_default}" 
                     alt="${pokemon.name}">
            </div>
            <div class="card_types">
                ${pokemon.types
                  .map(
                    (t) => `
                    <span class="type_badge">${t.type.name}</span>`,
                  )
                  .join("")}
            </div>
        </button>`;
}

// ── Dialog öffnen ─────────────────────────────────────────────
function openDialog(index) {
  currentIndex = index;
  let pokemon = allPokemons[index];
  let dialog = document.querySelector('[data-id="dialog"]');
  let type = pokemon.types[0].type.name;
  let color = typeColors[type] || "#333";

  document.querySelector('[data-id="overlay-pokemon-name"]').innerHTML = `
        <button class="dialog_closebutton" data-id="close-dialog-button" onclick="closeDialog()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="rgb(255, 255, 255)" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg></button>
        <div style="background:${color}; border-radius:12px; padding:20px; text-align:center;">
            <h2>${capitalize(pokemon.name)}</h2>
            <img data-id="dialog-image" 
                 src="${pokemon.sprites.other["official-artwork"].front_default}" 
                 alt="${pokemon.name}" width="200px">
                  <div class="card_types">
                ${pokemon.types
                  .map(
                    (t) => `
                    <span class="type_badge">${t.type.name}</span>`,
                  )
                  .join("")}
            </div>
            <p>HP: ${pokemon.stats[0].base_stat}</p>
            <p>Attack: ${pokemon.stats[1].base_stat}</p>
            <p>Defense: ${pokemon.stats[2].base_stat}</p>
            <p>Speed: ${pokemon.stats[5].base_stat}</p>
        </div>
        <div class="dialog_nav">
            <button class="dialog_nav_button" style="background:${color};" data-id="prev-button" onclick="prevPokemon()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <use href="#chevron-left"></use>
                </svg>
            </button>
            <button class="dialog_nav_button" style="background:${color};" data-id="next-button" onclick="nextPokemon()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <use href="#chevron-right"></use>
                </svg>
            </button>
        </div>
    `;

  dialog.showModal();
  dialog.addEventListener("click", closeOnBackdrop);
  document.body.style.overflow = "hidden";
}

// ── Dialog schließen ──────────────────────────────────────────
function closeDialog() {
  let dialog = document.querySelector('[data-id="dialog"]');
  dialog.close();
  document.body.style.overflow = "";
}

function closeOnBackdrop(e) {
  let dialog = document.querySelector('[data-id="dialog"]');
  if (e.target === dialog) closeDialog();
}

// ── Navigation im Dialog ──────────────────────────────────────
function nextPokemon() {
  if (currentIndex < allPokemons.length - 1) openDialog(currentIndex + 1);
}

function prevPokemon() {
  if (currentIndex > 0) openDialog(currentIndex - 1);
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
  let input = document
    .querySelector('[data-id="search-input"]')
    .value.toLowerCase();
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
}

function hideLoadingScreen() {
    document.querySelector('[data-id="loading-screen"]').style.display = "none";
  
}
