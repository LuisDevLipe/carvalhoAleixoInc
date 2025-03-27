import axios from "axios";
import { JSDOM } from "jsdom";
import { iURL, iSCRAPE, iPRODUCT } from "./types.ts";
export default async function scraper(resource: object): Promise<iSCRAPE> {
  const amazonRequest = await axios(resource);
  // if the search doens't return a 2xx status ill return the code
  if (amazonRequest.status >= 300 && amazonRequest.status < 200) {
    return {
      status: amazonRequest.status,
      message: "Error",
    };
  }
  // here i'm using jsdom to parse the html from the request and querying the elements with the product information i need
  const dom = new JSDOM(amazonRequest.data);
  const document = dom.window.document;
  const products = document.querySelectorAll(
    '[data-component-type="s-search-result"]',
  );
  // i'm making the Node into an array to iterate over it using map.
  // the query used was solely based on the structure of the page, if the page ever changes the query will need to be updated
  const data: iPRODUCT[] = Array.from(products).map((product: any) => {
    const data: iPRODUCT = {
      title: product?.querySelector("a > h2 > span")?.textContent || "",
      rating:
        product?.querySelector('[data-cy="reviews-ratings-slot"]')?.firstChild
          ?.textContent || "0 out of 5 stars",
      reviews: parseInt(
        product
          ?.querySelector(
            '[data-component-type="s-client-side-analytics"] span',
          )
          ?.textContent?.replace(",", ".") || "0",
      ),
      image: product?.querySelector("img")?.getAttribute("src") || "",
    };
    return data;
  });

  return {
    status: 200,
    message: "Success",
    data,
  };

  // the return of the map is an array of objects with the iPRODUCT interface
}
