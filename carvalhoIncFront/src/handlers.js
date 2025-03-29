import {
  show_popover,
  make_product,
  make_search_helper,
  make_pre_tag,
} from "./components.js";
import { callScraper } from "./utils.js";

function searchHandler(e) {
  e.preventDefault();
  let term = e.target.querySelector("input[type='text']").value;
  let rawdata_checkbox = e.target.querySelector("input[type='checkbox']");

  if (term === "") {
    show_popover("Please enter a search term", 3000);
    return;
  }

  // calling the scraper on the backend
  callScraper(term).then((data) => {
    // if the backend return 422 for empty querystring, or aws returns an error it should be catched here and shown to the user
    if (data.data.status !== 200) {
      show_popover(data.data.message, -1);
      return;
    }
    // if the backend returns an empty array, it should show a popover with a message
    if (data.data.data.length === 0) {
      show_popover("No results found", 3000);
      return;
    }
    // this help user keep track of what results are present on the page, and also to remove any search results from the page
    document
      .querySelector("section#search-history")
      .append(make_search_helper(term));

    // this will add the search results to the page
    // if the checkbox is marked, the results are shown as json
    if (rawdata_checkbox.checked) {
      // console.log(data.data.data);
      document
        .querySelector("main#scrape-results")
        .prepend(make_pre_tag(data.data.data, term));
      // otherwise the results are shown as cards much like in the amazon page
    } else {
      data.data.data.map((product) => {
        document
          .querySelector("main#scrape-results")
          .prepend(make_product(product, term));
      });
    }
  });
}

function searchHistoryHandler(e) {
  if (e.target.tagName !== "SPAN") return;
  else {
    e.target.parentElement.remove();
    const term = e.target.parentElement.dataset.searchTerm;
    const itens = document.querySelectorAll(`[data-search-term=${term}]`);
    Array.from(itens).map((item) => item.remove());
  }
}

export { searchHandler, searchHistoryHandler };
