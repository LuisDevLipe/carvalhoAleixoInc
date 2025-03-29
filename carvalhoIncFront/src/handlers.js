import { show_popover } from "./components.js";
import { callScraper, show_data_as_JSON, show_data_as_cards, add_to_search_history, handleErrors } from "./utils.js";

async function searchHandler(e) {
    e.preventDefault();
    const form_data = new FormData(e.target);
    const search_term = form_data.get("term");

    if (form_data.get("term") === "") {
        show_popover("Please enter a search term", 3000);
        return;
    }
    const data = await callScraper(search_term)
        .then((response) => {
            // if the backend return 422 for empty querystring, or aws returns an error it should be catched here and shown to the user
            if (response.data.status !== 200) throw new Error(response.data.message);
            // if the backend returns an empty array, it should show a popover with a message
            else if (response.data.data.length === 0) throw new Error("No results found");

            return response;
        })
        .catch((error) => {
            console.error(error);
            handleErrors(error);
        });
    if (!data) return;
    const JSONData = data.data.data;

    // this help user keep track of what results are present on the page, and also to remove any search results from the page
    add_to_search_history(search_term);

    switch (form_data.get("show-raw-data")) {
        // this will add the search results to the page
        case "on" || "true":
            // if the checkbox is marked, the results are shown as json
            show_data_as_JSON(JSONData, search_term);
            break;
        default:
            // otherwise the results are shown as cards much like in the amazon page
            show_data_as_cards(JSONData, search_term);
            return;
    }
}
function searchHistoryHandler(e) {
    if (e.target.tagName !== "SPAN") {
        return null;
    } else {
        e.target.parentElement.remove();
        const term = e.target.parentElement.dataset.searchTerm;
        const itens = document.querySelectorAll(`[data-search-term=${term}]`);
        Array.from(itens).map((item) => item.remove());
    }
}

export { searchHandler, searchHistoryHandler };
