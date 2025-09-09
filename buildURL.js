function buildURL({ name = "", status = "", gender = "", specie = "", page = 1}) {
    const baseUrl = "https://rickandmortyapi.com/api/character";
    const params = new URLSearchParams();

    if (name) params.set("name", name);
    if (status) params.set("status", status);
    if (gender) params.set("gender", gender);
    if (specie) params.set("species", specie);
    params.set("page", page);  // always set page (default 1)

    // If params is empty, just return base
    return params.toString() ? `${baseUrl}?${params}` : baseUrl;
}



// expose globally
window.buildURL = buildURL;

// Example usage:
// const url = buildURL({ name: "Rick", status: "alive" });
// console.log(url); // https://rickandmortyapi.com/api/character?name=Rick&status=alive

