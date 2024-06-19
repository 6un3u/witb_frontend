import React, { useReducer, useContext, createContext, Dispatch } from "react";
import { SearchReqQuery, StockReqQuery } from "../api/BookApi";
import { BookList, StockByRegion, StockList, StockWithStoreList, StoreLocationList } from "./BooksType";

type State = {
  searchQuery: SearchReqQuery;
  stockQuery: StockReqQuery;
  bookList: BookList;
  stockList: StockList;
  storeList: StockWithStoreList;
};

type Action =
  | { type: "SET_SEARCH_QUERY"; searchQuery: SearchReqQuery }
  | { type: "SET_STOCK_QUERY"; stockQuery: StockReqQuery }
  | { type: "SET_BOOK_LIST"; bookList: BookList }
  | { type: "SET_STOCK_LIST"; stockList: StockList }
  | { type: "SET_STORE_LIST"; storeList: StockWithStoreList };

type BookDispatch = Dispatch<Action>;

const BookStateContext = createContext<State | null>(null);
const BookDispatchContext = createContext<BookDispatch | null>(null);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.searchQuery,
      };
    case "SET_STOCK_QUERY":
      return {
        ...state,
        stockQuery: action.stockQuery,
      };
    case "SET_BOOK_LIST":
      return {
        ...state,
        bookList: action.bookList,
      };
    case "SET_STOCK_LIST":
      return {
        ...state,
        stockList: action.stockList,
      };
    case "SET_STORE_LIST":
      return {
        ...state,
        storeList: action.storeList,
      };
    default:
      throw new Error("Unhandled action");
    // return { ...state };
  }
};

// BookProvider 에서 useReducer를 사용하고
// SampleStateContext.Provider 와 SampleDispatchContext.Provider 로 children 을 감싸서 반환합니다.
export function BookProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    searchQuery: { s: "" },
    stockQuery: { id: "" },
    bookList: [],
    stockList: [],
    storeList: [],
  });

  return (
    <BookStateContext.Provider value={state}>
      <BookDispatchContext.Provider value={dispatch}>{children}</BookDispatchContext.Provider>
    </BookStateContext.Provider>
  );
}

// state 와 dispatch 를 쉽게 사용하기 위한 커스텀 Hooks
export function useBookState(): State {
  const state = useContext(BookStateContext);
  if (!state) throw new Error("Cannot find BookProvider"); // 유효하지 않을땐 에러를 발생
  return state;
}

export function useBookDispatch(): BookDispatch {
  const dispatch = useContext(BookDispatchContext);
  if (!dispatch) throw new Error("Cannot find BookProvider"); // 유효하지 않을땐 에러를 발생
  return dispatch;
}
