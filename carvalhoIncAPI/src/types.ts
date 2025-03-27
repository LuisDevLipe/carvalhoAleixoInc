interface iURL {
  baseURL: string;
  url: string;
  params: {
    keyword: string;
  };
}
interface iSCRAPE {
  status: number;
  message: string;
  data?: iPRODUCT[];
}
interface iPRODUCT {
  title: string;
  rating: string;
  reviews: number;
  image: string;
}
export { iURL, iSCRAPE, iPRODUCT };
