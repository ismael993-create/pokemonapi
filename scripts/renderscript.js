// ── Rendern ───────────────────────────────────────────────────

function renderContentpokemon(pokemon, color, index) {
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
               <img src="${pokemon.typeIconUrl[0]}" alt="${pokemon.name} Type" width="30px">
                ${pokemon.typeIconUrl[1] ? `<img src="${pokemon.typeIconUrl[1]}" alt="${pokemon.name} Type" width="30px">` : ""}
            </div>
        </button>`;
}


// ── Karte rendern ─────────────────────────────────────────────
function renderCard(pokemon, index) {
  let list = document.querySelector('[data-id="pokemon-list"]');
  let type = pokemon.types[0].type.name;
  let color = typeColors[type] || "#333";
  list.innerHTML += `<li>${renderContentpokemon(pokemon, color, index)}</li>`;
}

