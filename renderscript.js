// ── Rendern ───────────────────────────────────────────────────

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

// ── Karte rendern ─────────────────────────────────────────────
function renderCard(pokemon, index) {
  let main = document.querySelector('[data-id="content"]');
  let type = pokemon.types[0].type.name;
  let color = typeColors[type] || "#333";

  main.innerHTML += renderContentpokemon(main, pokemon, color, index);
}


