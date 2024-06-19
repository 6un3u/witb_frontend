import { useEffect, useState } from "react";

import BookApi from "../api/BookApi";
import { BookList } from "../types/BooksType";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";
import { useBookDispatch, useBookState } from "../types/BookContext";

function SelectBook() {
  const [loading, setLoading] = useState(true);
  const [stockOut, setStockOut] = useState(false);

  const state = useBookState();
  const dispatch = useBookDispatch();

  const getBookList = async () => {
    const searchResult: BookList = await BookApi.searchRequest(state.searchQuery);
    if (searchResult) {
      dispatch({ type: "SET_BOOK_LIST", bookList: searchResult });
    } else {
      setStockOut(true);
    }
  };

  useEffect(() => {
    getBookList();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : state.bookList.length === 0 && stockOut ? (
        "검색 결과 없음"
      ) : (
        <div>
          {state.bookList.map((book) => (
            <BookCard key={book.id} id={book.id} title={book.title} author={book.author} publisher={book.publisher} cover={book.cover} price={book.price}></BookCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectBook;
