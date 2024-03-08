import { StoreList, StoreLocation, StoreLocationList } from "../types/BooksType";

class MapApi {
  private static restApiUrl = process.env.REACT_APP_KAKAOMAP_REST_API_KEYWORD_URL;
  private static restApiKey = process.env.REACT_APP_KAKAOMAP_REST_API_KEY;
  private static jsKey = process.env.REACT_APP_KAKAOMAP_JS_KEY;

  static getStoreMapInfo = (store: string) => {
    return this.storeInfo(store) as Promise<StoreLocation>;
  };
  static getStoresLocationInfo = (stores: StoreList) => {
    return this.getInfoFromStoreList(stores) as Promise<StoreLocationList>;
  };

  static getInfoFromStoreList1 = async (stores: StoreList) => {
    console.log("[MapApi]: getInfoFromStoreList Func called!");
    console.log("[MapApi]: arg", stores);

    const storeLocationList = await Promise.all(stores.flatMap((region) => region.map(async (store) => await this.storeInfo(store.store))));

    return storeLocationList;
  };

  static getInfoFromStoreList = async (stores: StoreList): Promise<StoreLocationList> => {
    const results: StoreLocationList = [];

    await Promise.all(
      stores.flatMap((regionStores) =>
        regionStores.map(async (store) => {
          if (store.stock !== 0) {
            const res = await this.storeInfo(store.store);
            if (res) {
              results.push(res);
            }
          }
        })
      )
    );
    console.log(results);

    return results;
  };

  private static storeInfo = async (query: string) => {
    const apiUrl = encodeURI(`${this.restApiUrl}?query=교보문고 ${query}`.replace("팝업", ""));

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${this.restApiKey}`,
      },
    });
    const json = await res.json();
    const data = json["documents"][0];

    let storeMapInfo: StoreLocation;

    if (!data) {
      return null;
    }
    storeMapInfo = {
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
