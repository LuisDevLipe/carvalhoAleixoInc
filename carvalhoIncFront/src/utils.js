import axios from "axios";

let api_path = "http://localhost:3000";
async function callScraper(term) {
    const response = await axios({
        method: "get",
        url: "/api/scrape",
        baseURL: api_path,
        params: {
            keyword: term,
        },
    });
    return response;
}

export { callScraper };
