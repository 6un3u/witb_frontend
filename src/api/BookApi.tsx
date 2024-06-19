import { error } from "console";
import { BookList, StockList } from "../types/BooksType";

export interface SearchReqQuery {
  s: string;
}
export interface StockReqQuery {
  id: string;
}

enum ApiType {
  search = "search",
  stock = "stock",
}

class BookApi {
  private static apiUrl = process.env.REACT_APP_API_URL;

  static searchRequest = (data: SearchReqQuery) => {
    console.log("[*] Call Search Api");
    if (data.s === "") {
      throw new Error("Invalid Search Query");
    }
    return this.apiRequest(ApiType.search, data) as Promise<BookList>;
  };

  static stockRequest = (data: StockReqQuery) => {
    console.log("[*] Call Stock Api");
    if (data.id === "") {
      throw new Error("Invalid BookId");
    }
    return this.apiRequest(ApiType.stock, data) as Promise<StockList>;
  };

  private static apiRequest = async (type: ApiType, data: SearchReqQuery | StockReqQuery) => {
    const reqUrl = `${this.apiUrl}/${type}`;
    const res = await fetch(reqUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    return result;
  };
}

export default BookApi;
