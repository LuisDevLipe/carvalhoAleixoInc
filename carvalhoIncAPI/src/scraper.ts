import axios from "axios";
import { JSDOM } from "jsdom";
import { iURL, iSCRAPE, iPRODUCT } from "./types.ts";

export default async function scraper(resource: iURL): Promise<iSCRAPE> {
    const response = await get_data(resource);
    if (response instanceof Error) {
        throw new Error(`The request returned an error: ${response.message}`);
    }
    const { status } = response;
    // if the search doens't return a 2xx status ill return the code
    if (status < 200 && status >= 300) {
        throw new Error(`The request returned a status code of ${status}`);
    }
    return {
        status: 200,
        message: "Success",
        data: extract_data(response),
    };
    // the return of the map is an array of objects with the iPRODUCT interface
}

function extract_data(data: any): Array<iPRODUCT> {
    // here i'm using jsdom to parse the html from the request and querying the elements with the product information i need
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const products = document.querySelectorAll('[data-component-type="s-search-result"]');
    if (!products.length) {
        throw new Error("No products found");
    }
    // i'm making the Node into an array to iterate over it using map.
    // the query used was solely based on the structure of the page, if the page ever changes the query will need to be updated
    const dataObjectArray: iPRODUCT[] = Array.from(products).map((product: any) => {
        const dataObject: iPRODUCT = {
            title: product?.querySelector("a > h2 > span")?.textContent || "",
            rating:
                product?.querySelector('[data-cy="reviews-ratings-slot"]')?.firstChild?.textContent ||
                "0 out of 5 stars",
            reviews: parseInt(
                product
                    ?.querySelector('[data-component-type="s-client-side-analytics"] span')
                    ?.textContent?.replace(",", ".") || "0"
            ),
            image: product?.querySelector("img")?.getAttribute("src") || "",
        };
        return dataObject;
    });
    return dataObjectArray;
}

async function get_data(resource: any): Promise<any> {
    return await axios(resource)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 503) {
                    throw new Error("aws is blocking the request");
                }
                throw new Error(error.response?.statusText || error.message || "An axios error occurred");
            }
            throw new Error(error.message || "An error occurred");
        });
}
