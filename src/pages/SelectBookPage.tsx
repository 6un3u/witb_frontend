import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import BookApi from "../api/BookApi";
import { BookList } from "../types/BooksType";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";

function SelectBook() {
  const [loading, setLoading] = useState(true);
  const [stockOut, setStockOut] = useState(false);
  const [bookList, setBookList] = useState<BookList>([]);
  const location = useLocation();

  const getBookList = async () => {
    const searchResult: BookList = await BookApi.searchRequest(location.state.data);
    if (searchResult) {
      setBookList(searchResult);
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
      ) : bookList.length === 0 && stockOut ? (
        "검색 결과 없음"
      ) : (
        <div>
          {bookList.map((book) => (
            <BookCard key={book.id} id={book.id} title={book.title} author={book.author} publisher={book.publisher} cover={book.cover} price={book.price}></BookCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectBook;
