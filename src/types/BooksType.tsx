export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  cover: string;
  price: string;
}

export interface Store {
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

export interface BookList extends Array<Book> {}
export interface StoreByRegion extends Array<Store> {}
export interface StoreList extends Array<StoreByRegion> {}
export interface StoreLocationList extends Array<StoreLocation> {}
