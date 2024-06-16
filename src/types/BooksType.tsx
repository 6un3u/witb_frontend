export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  cover: string;
  price: string;
}

export interface Stock {
  store: string;
  address: string;
  stock: number;
  phone: string;
}

export interface StoreLocation {
  id: string;
  x: number;
  y: number;
  placeName: string;
  address: string;
  stockPlaceName: string;
}

export interface StockWithStore {
  stockInfo: Stock;
  storeLocation: StoreLocation;
}

export interface BookList extends Array<Book> {}
export interface StockByRegion extends Array<Stock> {}
export interface StockList extends Array<StockByRegion> {}
export interface StoreLocationList extends Array<StoreLocation> {}
export interface StockWithStoreList extends Array<StockWithStore> {}
