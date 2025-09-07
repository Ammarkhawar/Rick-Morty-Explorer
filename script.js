console.log("Script loaded.");

async function fetchCharacters() {
  console.log("Fetching characters...");
  let response = await fetch('https://rickandmortyapi.com/api/character');
  let data = await response.json();
  console.log("data: ", data);
  console.log("data.results: ", data.results);
  return data.results;
}

async function displayCharacters() {
  let characters = await fetchCharacters();
  let characterContainer = document.querySelector('.character-container');
  characterContainer.innerHTML = '';
  console.log("characterContainer: ", characterContainer);

  characters.forEach(character => {
    let card = document.createElement('div');
    card.className = 'character-card p-2 lg:w-1/3 md:w-1/2 w-full';
    if (character.status === 'Alive') {
      card.innerHTML = `
      <div class="h-full flex border-gray-200 border p-4 rounded-lg">
                        <!-- Image -->
                        <img alt="team"
                            class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-3"
                            src="${character.image}">
                        <!-- Text Content -->
                        <div class="flex-grow gap-2 flex flex-col">
                            <!-- Name -->
                            <h2 class="text-gray-900 title-font font-medium">${character.name}</h2>
                            <!-- Status and Species -->
                            <div class="flex gap-2 items-center">
                                <!-- Status -->
                                <div class="flex gap-1 items-center">
                                    <p class="text-sm">Status:</p>
                                    <span
                                        class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20">${character.status}</span>
                                </div>
                                <!-- Species -->
                                <div class="flex gap-1 items-center">
                                    <p class="text-sm">Species:</p>
                                    <span
                                        class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 inset-ring inset-ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:inset-ring-blue-400/30">${character.species}</span>
                                </div>
                            </div>
                            <!-- Origin -->
                            <div class="flex gap-1 items-center">
                                <p class="text-sm">Origin:</p>
                                <span
                                    class="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 inset-ring inset-ring-purple-400/30">${character.origin.name}</span>
                            </div>
                        </div>
                    </div>
    `;

    }
    else if (character.status === 'Dead') {

      card.innerHTML = `
      <div class="h-full flex border-gray-200 border p-4 rounded-lg">
                        <!-- Image -->
                        <img alt="team"
                            class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-3"
                            src="${character.image}">
                        <!-- Text Content -->
                        <div class="flex-grow gap-2 flex flex-col">
                            <!-- Name -->
                            <h2 class="text-gray-900 title-font font-medium">${character.name}</h2>
                            <!-- Status and Species -->
                            <div class="flex gap-2 items-center">
                                <!-- Status -->
                                <div class="flex gap-1 items-center">
                                    <p class="text-sm">Status:</p>
                                    <span
                                        class="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 inset-ring inset-ring-red-400/20">${character.status}</span>
                                </div>
                                <!-- Species -->
                                <div class="flex gap-1 items-center">
                                    <p class="text-sm">Species:</p>
                                    <span
                                        class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 inset-ring inset-ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:inset-ring-blue-400/30">${character.species}</span>
                                </div>
                            </div>
                            <!-- Origin -->
                            <div class="flex gap-1 items-center">
                                <p class="text-sm">Origin:</p>
                                <span
                                    class="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 inset-ring inset-ring-purple-400/30">${character.origin.name}</span>
                            </div>
                        </div>
                    </div>
    `;

    }
    else {
      card.innerHTML = `
      <div class="h-full flex border-gray-200 border p-4 rounded-lg">
                        <!-- Image -->
                        <img alt="team"
                            class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-3"
                            src="${character.image}">
                        <!-- Text Content -->
                        <div class="flex-grow gap-2 flex flex-col">
                            <!-- Name -->
                            <h2 class="text-gray-900 title-font font-medium">${character.name}</h2>
                            <!-- Status and Species -->
                            <div class="flex gap-2 items-center">
                                <!-- Status -->
                                <div class="flex gap-1 items-center">
                                    <p class="text-sm">Status:</p>
                                    <span
                                        class="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 inset-ring inset-ring-gray-400/20">${character.status}</span>
                                </div>
                                <!-- Species -->
                                <div class="flex gap-1 items-center">
                                    <p class="text-sm">Species:</p>
                                    <span
                                        class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 inset-ring inset-ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:inset-ring-blue-400/30">${character.species}</span>
                                </div>
                            </div>
                            <!-- Origin -->
                            <div class="flex gap-1 items-center">
                                <p class="text-sm">Origin:</p>
                                <span
                                    class="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 inset-ring inset-ring-purple-400/30">${character.origin.name}</span>
                            </div>
                        </div>
                    </div>
    `;
    }
    
    characterContainer.appendChild(card);
  })
}

displayCharacters();