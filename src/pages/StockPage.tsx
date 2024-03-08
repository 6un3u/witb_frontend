import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import BookApi, { StockReqQuery } from "../api/BookApi";
import { StoreList, StoreLocationList } from "../types/BooksType";
import MapApi from "../api/MapApi";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import React from "react";

type storeLocationProps = {
  stores: StoreList;
  storeLocationList: StoreLocationList;
  setStoreLocationList: React.Dispatch<React.SetStateAction<StoreLocationList>>;
};
const StoreLocationOnMapAsync: React.FC<storeLocationProps> = ({ stores, storeLocationList, setStoreLocationList }: storeLocationProps) => {
  const [storeLocationInsideList, setStoreLocationInsideList] = useState<StoreLocationList>([]);
  const [loading, setLoading] = useState(true);

  const getStoreLocation = async () => {
    const stockLocationResult: StoreLocationList = await MapApi.getStoresLocationInfo(stores);
    setStoreLocationList(stockLocationResult);
    setStoreLocationInsideList(stockLocationResult);
    setLoading(false);

    console.log("[StockPage][StoreLocation]: Result storeLocation", stockLocationResult);
  };

  useLayoutEffect(() => {
    console.log("[StockPage][StoreLocation] Watching...");
    if (stores.length !== 0) getStoreLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {storeLocationInsideList.length === 0 ? (
            <div>찾으시는 책의 재고가 없습니다.</div>
          ) : (
            <>
              <Map center={{ lng: 126.977908555263, lat: 37.5707974563789 }} style={{ width: "100%", height: "500px" }}>
                {storeLocationInsideList.map((store) => (
                  <MapMarker key={store.id} position={{ lng: store.x, lat: store.y }}>
                    <div style={{ color: "#000" }}>{store.placeName}</div>
                  </MapMarker>
                ))}
              </Map>
            </>
          )}
        </>
      )}
    </div>
  );
};

type stockSearchQuery = {
  query: StockReqQuery;
  stores: StoreList;
  setStoreList: React.Dispatch<React.SetStateAction<StoreList>>;
};

const StoreListComponent: React.FC<stockSearchQuery> = ({ query, stores, setStoreList }: stockSearchQuery) => {
  console.log("[StockPage][StoreList]: Start");
  const [loading, setLoading] = useState(true);
  const [storeInsideList, setStoreInsideList] = useState<StoreList>([]);

  const getStock = async () => {
    const stockResult = await BookApi.stockRequest(query);
    setStoreList(stockResult);
    setStoreInsideList(stockResult);
    setLoading(false);
    console.log("[StockPage][StoreList]: Set Store List");
  };

  useLayoutEffect(() => {
    console.log("[StockPage][StoreList] Watching...");
    if (stores.length === 0) getStock();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores]);

  return (
    <div>
      {loading ? (
        <div>Loading</div>
      ) : (
        <>
          <div>재고 검색 결과</div>
          {storeInsideList.length !== 0 &&
            storeInsideList.map((storeByRegion, index) => (
              <div key={index}>
                {storeByRegion.map((store, subIndex) => (
                  <div key={subIndex}>
                    {store.stock !== 0 && (
                      <ul key={store.store}>
                        <li>store={store.store}</li>
                        <li>address={store.address}</li>
                        <li>stock={store.stock}</li>
                        <li>phone={store.phone}</li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </>
      )}
    </div>
  );
};

function Stock() {
  const location = useLocation();
  const stockQuery: StockReqQuery = location.state.stockQuery;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapLoading, mapError] = useKakaoLoader({
    appkey: "f3d2075fccd2daa2b4324fc9e39457e6", // 발급 받은 APPKEY
  });
  const [storeList, setStoreList] = useState<StoreList>([]);
  const [storeLocationList, setStoreLocationList] = useState<StoreLocationList>([]);

  return (
    <>
      {console.log("TOPPAGE!!", storeList, storeLocationList)}
      {console.log("TOPPAGE!!", storeList.length, storeLocationList.length)}
      <StoreListComponent query={stockQuery} stores={storeList} setStoreList={setStoreList} />
      <StoreLocationOnMapAsync stores={storeList} storeLocationList={storeLocationList} setStoreLocationList={setStoreLocationList}></StoreLocationOnMapAsync>
    </>
  );
}

export default Stock;
