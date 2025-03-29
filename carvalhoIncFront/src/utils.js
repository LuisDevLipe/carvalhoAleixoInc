import axios from "axios";
let api_path = "http://localhost:3000";
import { make_product, make_search_helper, make_pre_tag, show_popover } from "./components.js";

async function callScraper(term) {
    return await axios({
        method: "get",
        url: "/api/scrape",
        baseURL: api_path,
        params: {
            keyword: term,
        },
    });
}
function show_data_as_JSON(JSONData, term) {
    try {
        document.querySelector("main#scrape-results").append(make_pre_tag(JSONData, term));
    } catch (e) {
        show_popover(`Error: ${e.message}`, 3000);
    }
}

function show_data_as_cards(JSONData, term) {
    try {
        JSONData.map((product) => {
            document.querySelector("main#scrape-results").prepend(make_product(product, term));
        });
    } catch (e) {
        show_popover(`Error: ${e.message}`, 3000);
    }
}
function add_to_search_history(term) {
    document.querySelector("section#search-history").append(make_search_helper(term));
}
function handleErrors(error) {
    if (error.status === 404) return show_popover("No results found");
    else show_popover(error.response?.message || error.message);
}
export { callScraper, show_data_as_JSON, show_data_as_cards, add_to_search_history, handleErrors };
