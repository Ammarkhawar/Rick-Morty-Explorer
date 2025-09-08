console.log("Script loaded.");

// DOM helpers
const els = {
  container: () => document.querySelector('.character-container'),
};

// Fetch 20 characters per page (API default)
async function fetchCharacters(page = 1) {
  const url = `https://rickandmortyapi.com/api/character?page=${page}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const data = await response.json();
  return data; // { info, results }
}

// Render character cards into the grid
function renderCharacters(characters) {
  const container = els.container();
  container.innerHTML = '';

  characters.forEach((character) => {
    const card = document.createElement('div');
    card.className = 'character-card p-2 lg:w-1/3 md:w-1/2 w-full';

    const statusColor = character.status === 'Alive'
      ? 'bg-green-50 text-green-700 inset-ring inset-ring-green-600/20'
      : character.status === 'Dead'
        ? 'bg-red-400/10 text-red-400 inset-ring inset-ring-red-400/20'
        : 'bg-gray-400/10 text-gray-400 inset-ring inset-ring-gray-400/20';

    const originColor = character.origin?.name === 'unknown'
      ? 'bg-gray-400/10 text-gray-400 inset-ring inset-ring-gray-400/20'
      : 'bg-purple-400/10 text-purple-400 inset-ring inset-ring-purple-400/30';

    card.innerHTML = `
      <div class="h-full flex border-gray-200 border p-4 rounded-lg">
        <img alt="avatar" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-3" src="${character.image}">
        <div class="flex-grow gap-2 flex flex-col">
          <h2 class="text-gray-900 title-font font-medium">${character.name}</h2>
          <div class="flex gap-2 items-center">
            <div class="flex gap-1 items-center">
              <p class="text-sm">Status:</p>
              <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColor}">${character.status}</span>
            </div>
            <div class="flex gap-1 items-center">
              <p class="text-sm">Species:</p>
              <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 inset-ring inset-ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:inset-ring-blue-400/30">${character.species}</span>
            </div>
          </div>
          <div class="flex gap-1 items-center">
            <p class="text-sm">Origin:</p>
            <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${originColor}">${character.origin?.name ?? 'Unknown'}</span>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Instantiate paginator (from pagination.js) and connect it
const paginator = new Paginator({
  perPage: 20,
  selectors: {
    prev: '#prev-page',
    next: '#next-page',
    numbers: '#pagination-numbers',
    pageStart: '#page-start',
    pageEnd: '#page-end',
    totalResults: '#total-results',
  },
  onPageChange: (page) => loadPage(page),
});

async function loadPage(page = 1) {
  try {
    const data = await fetchCharacters(page);
    renderCharacters(data.results ?? []);
    paginator.apply(page, data.info?.count ?? 0, data.info?.pages ?? 1);
  } catch (err) {
    console.error(err);
  }
}

// Initial load
loadPage(1);
