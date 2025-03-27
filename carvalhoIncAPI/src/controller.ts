import scraper from "./scraper.ts";
import { iURL } from "./types.ts";

export default class AmazonScraper {
  static searchScrape(req, res) {
    // if the client doens't provide a keyword i'll return a message to the client with a 422 status (Unprocessable Entity)
    if (!req.query.keyword) {
      return res.status(422).send("No term provided");
    }
    const resource = {
      baseURL: "https://www.amazon.com",
      url: "/s",
      params: {
        keyword: req.query.keyword,
      },
    };

    const scraped = scraper(resource);

    scraped.then((doc) => {
      return res.status(doc.status).send(doc);
    });
  }
}
