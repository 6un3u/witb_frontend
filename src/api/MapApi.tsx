import { StockList, StockWithStore, StockWithStoreList, StoreLocation, StoreLocationList } from "../types/BooksType";

class MapApi {
  private static restApiUrl = process.env.REACT_APP_KAKAOMAP_REST_API_KEYWORD_URL;
  private static restApiKey = process.env.REACT_APP_KAKAOMAP_REST_API_KEY;
  private static jsKey = process.env.REACT_APP_KAKAOMAP_JS_KEY;

  static getStoreMapInfo = (store: string): Promise<StoreLocation> => {
    return this.storeInfo(store) as Promise<StoreLocation>;
  };
  static getStoresLocationInfo = (stores: StockList): Promise<StockWithStoreList> => {
    return this.getInfoFromStoreList(stores) as Promise<StockWithStoreList>;
  };

  static getInfoFromStoreList = async (stores: StockList): Promise<StockWithStoreList> => {
    console.info("[*] Call Map Api", stores);
    const results: StockWithStoreList = [];

    await Promise.all(
      stores.flatMap((regionStores) =>
        regionStores.map(async (store) => {
          if (store.stock !== 0) {
            const res = await this.storeInfo(store.store);
            if (res) {
              const stockWithStore: StockWithStore = { stockInfo: store, storeLocation: res };
              results.push(stockWithStore);
            }
          }
        })
      )
    );

    return results;
  };

  private static storeInfo = async (query: string): Promise<StoreLocation | null> => {
    const apiUrl = encodeURI(`${this.restApiUrl}?query=교보문고 ${query}`.replace("팝업", ""));

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${this.restApiKey}`,
      },
    });

    const json = await res.json();
    const data = json["documents"][0];

    if (!data) {
      return null;
    }

    let storeMapInfo: StoreLocation = {
      id: data["id"],
      x: data["x"],
      y: data["y"],
      placeName: data["place_name"],
      address: data["road_address_name"],
      stockPlaceName: query,
    };

    return storeMapInfo;
  };
}

export default MapApi;
