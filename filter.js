console.log("Filter script loaded.");

// DOM helpers for filter options
const dom = {
    genders: () => document.querySelectorAll('input[name="gender"]'),
    statuses: () => document.querySelectorAll('input[name="status"]'),
    species: () => document.querySelectorAll('input[name="species"]'),
    searchInput: () => document.querySelector('input[name="search-input"]'),
    searchButton: () => document.querySelector('button[name="search-button"]'),
};

// ---- Readers (no listeners here) ----
function readFilters() {
    const name = dom.searchInput()?.value.trim() || "";

    const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    const status = document.querySelector('input[name="status"]:checked')?.value || "";
    const specie = document.querySelector('input[name="species"]:checked')?.value || "";

    return { name, gender, status, specie };
}



// ---- Wire up events once ----
function initFilters() {
    const input = dom.searchInput();
    const button = dom.searchButton();

    button.addEventListener("click", () => loadPage(1));
    // Enter to search
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            loadPage(1);
        }
    });

    // Optional: auto-search when radios change
    dom.genders().forEach(el => el.addEventListener("change", () => loadPage(1)));
    dom.statuses().forEach(el => el.addEventListener("change", () => loadPage(1)));
    dom.species().forEach(el => el.addEventListener("change", () => loadPage(1)));
}

// Boot
initFilters();

// expose globally
window.readFilters = readFilters;
