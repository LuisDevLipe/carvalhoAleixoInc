import scraper from "./scraper.ts";
import { logger } from "./utils.ts";

export default class AmazonScraper {
    static searchScrape(req, res) {
        // if the client doens't provide a keyword i'll return a message to the client with a 422 status (Unprocessable Entity)
        if (!req.query.keyword) {
            return res
                .status(422)
                .send(
                    "No term provided or malformed url. Expected: " +
                        Object.entries(req.query).reduce((acc, [key, value]) => acc + `${key}=${value}&`, "?") +
                        "to equal ?keyword=yourSeachTerm (url encoded)"
                );
        }
        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        };
        const resource = {
            baseURL: "https://www.amazon.com",
            url: "/s",
            params: {
                keyword: req.query.keyword,
            },
            headers,
        };

        const scraped = scraper(resource);

        scraped
            .then((doc) => {
                return res.status(doc.status).send(doc);
            })
            .catch((err) => {
                logger(err.message, err.status);
                return res.status(err.status || 500).send(err.message);
            });
    }
}
