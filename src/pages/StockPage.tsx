import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import BookApi, { StockReqQuery } from "../api/BookApi";
import { StockList, StockWithStoreList, StoreLocationList } from "../types/BooksType";
import MapApi from "../api/MapApi";
import { Map, MapMarker, useKakaoLoader, useMap } from "react-kakao-maps-sdk";
import React from "react";

type stockWithStoreListProps = {
  stockWithStoreList: StockWithStoreList;
};
const MarkerContainer: React.FC<stockWithStoreListProps> = ({ stockWithStoreList }) => {
  // 다른 머키 div hide
  // 선택한 마커 div 띄우기
  const map = useMap();
  const [isContentVisible, setIsContentVisible] = useState(false);

  // const clickEvent = () {

  // }

  return (
    <>
      {stockWithStoreList.map((storeWithLocation) => (
        <MapMarker
          key={storeWithLocation.storeLocation.id}
          position={{ lng: storeWithLocation.storeLocation.x, lat: storeWithLocation.storeLocation.y }}
          onClick={(marker) => {
            setIsContentVisible(false);
            map.panTo(marker.getPosition());
            setIsContentVisible(true);
          }}
          // onMouseOver={() => setIsContentVisible(true)}
          // onMouseOut={() => setIsContentVisible(false)}
          clickable={true}
        >
          {isContentVisible && (
            <>
              <div style={{ color: "#000" }}>{storeWithLocation.stockInfo.store}</div>
              <div style={{ color: "#000" }}>{storeWithLocation.stockInfo.phone}</div>
            </>
          )}
        </MapMarker>
      ))}
    </>
  );
};

type storeLocationProps = {
  stockByStore: StockList;
  storeLocationList: StockWithStoreList;
  setStoreLocationList: React.Dispatch<React.SetStateAction<StockWithStoreList>>;
};
const StoreLocationOnMapAsync: React.FC<storeLocationProps> = ({ stockByStore, storeLocationList, setStoreLocationList }: storeLocationProps) => {
  const [storeLocationInsideList, setStoreLocationInsideList] = useState<StockWithStoreList>([]);
  const [loading, setLoading] = useState(true);

  const getStoreLocation = async () => {
    const stockLocationResult: StockWithStoreList = await MapApi.getStoresLocationInfo(stockByStore);
    setStoreLocationList(stockLocationResult);
    setStoreLocationInsideList(stockLocationResult);
    setLoading(false);

    console.log("[StockPage][StoreLocation]: Result storeLocation", stockLocationResult);
  };

  useLayoutEffect(() => {
    console.log("[StockPage][StoreLocation] Watching...");
    if (stockByStore.length !== 0) getStoreLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockByStore]);

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
                {/* {storeLocationInsideList.map((storeWithLocation) => (
                  <MapMarker key={storeWithLocation.storeLocation.id} position={{ lng: storeWithLocation.storeLocation.x, lat: storeWithLocation.storeLocation.y }} clickable={true}>
                    <div style={{ color: "#000" }}>{storeWithLocation.stockInfo.store}</div>
                    <div style={{ color: "#000" }}>{storeWithLocation.stockInfo.phone}</div>
                  </MapMarker>
                ))} */}
                <MarkerContainer stockWithStoreList={storeLocationInsideList}></MarkerContainer>
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
  stockByStore: StockList;
  setStockByStore: React.Dispatch<React.SetStateAction<StockList>>;
};

const StockByStore: React.FC<stockSearchQuery> = ({ query, stockByStore, setStockByStore: setStoreList }: stockSearchQuery) => {
  console.log("[StockPage][StockList]: Start");
  const [loading, setLoading] = useState(true);
  const [storeInsideList, setStoreInsideList] = useState<StockList>([]);

  const getStock = async () => {
    const stockResult = await BookApi.stockRequest(query);
    setStoreList(stockResult);
    setStoreInsideList(stockResult);
    setLoading(false);
    console.log("[StockPage][StockList]: Set Store List");
  };

  useLayoutEffect(() => {
    console.log("[StockPage][StockList] Watching...");
    if (stockByStore.length === 0) getStock();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockByStore]);

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
  const [stockByStore, setStockByStore] = useState<StockList>([]);
  const [storeLocationList, setStoreLocationList] = useState<StockWithStoreList>([]);

  return (
    <>
      {console.log("TOPPAGE!!", stockByStore, storeLocationList)}
      {console.log("TOPPAGE!!", stockByStore.length, storeLocationList.length)}
      <StockByStore query={stockQuery} stockByStore={stockByStore} setStockByStore={setStockByStore} />
      <StoreLocationOnMapAsync stockByStore={stockByStore} storeLocationList={storeLocationList} setStoreLocationList={setStoreLocationList}></StoreLocationOnMapAsync>
    </>
  );
}

export default Stock;
