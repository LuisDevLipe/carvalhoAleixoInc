import express from "express";
import cors from "cors";
import Scraper from "./controller.ts";
const app = express();
const port: number = 3000;

// cors is a middleware that allows a client request from a different domain.
// Without it, the client being hosted on a domain differente from the api server would not reach the server.
// This is a security measure and should be treated like so.
// In this environment we are telling the server to accept requests from any domain.
// Of course this shouldn't be used in a production environment.
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hi there c:...");
});

app.get("/api/scrape", Scraper.searchScrape);

app.listen(port, () => {
  console.log(`App http://localhost:${port}`);
});
