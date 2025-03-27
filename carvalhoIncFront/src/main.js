
import { searchHandler, searchHistoryHandler } from "./handlers.js";

const form = document.querySelector("nav > form");
const search_history = document.querySelector("section#search-history");

form.addEventListener("submit", searchHandler);
search_history.addEventListener("click", searchHistoryHandler);

