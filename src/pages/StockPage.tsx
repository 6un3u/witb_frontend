import { useEffect, useState } from "react";

import BookApi from "../api/BookApi";
import { StockList, StockWithStoreList } from "../types/BooksType";
import MapApi from "../api/MapApi";
import { Map, MapMarker, useKakaoLoader, useMap } from "react-kakao-maps-sdk";
import React from "react";
import { useBookDispatch, useBookState } from "../types/BookContext";

type stockWithStoreListProps = {
  stockWithStoreList: StockWithStoreList;
};
const MarkerContainer: React.FC<stockWithStoreListProps> = ({ stockWithStoreList }) => {
  // 다른 머키 div hide
  // 선택한 마커 div 띄우기
  const map = useMap();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [selectedMarker, setSeleteMarker] = useState();

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

type storeProps = {
  storeList: StockWithStoreList;
};

const StoreLocationOnMapAsync: React.FC<storeProps> = ({ storeList }: storeProps) => {
  return (
    <div>
      {storeList.length === 0 ? (
        <div>찾으시는 책의 재고가 없습니다.</div>
      ) : (
        <>
          <Map center={{ lng: 126.977908555263, lat: 37.5707974563789 }} style={{ width: "100%", height: "500px" }}>
            {/* {storeList.map((storeWithLocation) => (
              <MapMarker key={storeWithLocation.storeLocation.id} position={{ lng: storeWithLocation.storeLocation.x, lat: storeWithLocation.storeLocation.y }} clickable={true}>
                <div style={{ color: "#000" }}>{storeWithLocation.stockInfo.store}</div>
                <div style={{ color: "#000" }}>{storeWithLocation.stockInfo.phone}</div>
              </MapMarker>
            ))} */}
            <MarkerContainer stockWithStoreList={storeList}></MarkerContainer>
          </Map>
        </>
      )}
    </div>
  );
};

type stockProps = {
  stockList: StockList;
};

const StockByStore: React.FC<stockProps> = ({ stockList }: stockProps) => {
  return (
    <div>
      <div>재고 검색 결과</div>
      {stockList.length !== 0 &&
        stockList.map((storeByRegion, index) => (
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
    </div>
  );
};

function Stock() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapLoading, mapError] = useKakaoLoader({
    appkey: "f3d2075fccd2daa2b4324fc9e39457e6", // 발급 받은 APPKEY
  });

  const state = useBookState();
  const dispatch = useBookDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStock = async () => {
      try {
        // 재고 조회
        const stockResult = await BookApi.stockRequest(state.stockQuery);
        dispatch({ type: "SET_STOCK_LIST", stockList: stockResult });
        console.log("[+] Set Stock List", stockResult);

        // 지점 정보
        const stockLocationResult: StockWithStoreList = await MapApi.getStoresLocationInfo(stockResult);
        dispatch({ type: "SET_STORE_LIST", storeList: stockLocationResult });
        console.log("[+] Set Store List", stockLocationResult);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    getStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {console.log("[ROOT]", loading, state.stockList, state.storeList)}
      {loading ? (
        <div>Loading</div>
      ) : (
        <>
          <StockByStore stockList={state.stockList} />
          <StoreLocationOnMapAsync storeList={state.storeList} />
        </>
      )}
    </>
  );
}

export default Stock;
