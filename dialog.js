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
                <img src="${pokemon.typeIconUrl[0]}" alt="${pokemon.name} Type" width="30px">
                ${pokemon.typeIconUrl[1] ? `<img src="${pokemon.typeIconUrl[1]}" alt="${pokemon.name} Type" width="30px">` : ""}
                 
               
                  
            </div>
            <p class="dialog_stat"><span>HP:</span> <span>${pokemon.stats[0].base_stat}</span></p>
            <p class="dialog_stat"><span>Attack:</span> <span>${pokemon.stats[1].base_stat}</span></p>
            <p class="dialog_stat"><span>Defense:</span> <span>${pokemon.stats[2].base_stat}</span></p>
            <p class="dialog_stat"><span>Speed:</span> <span>${pokemon.stats[5].base_stat}</span></p>
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



