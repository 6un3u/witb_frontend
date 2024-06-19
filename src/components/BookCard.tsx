import { StockReqQuery } from "../api/BookApi";
import { useBookDispatch, useBookState } from "../types/BookContext";

import { Book } from "../types/BooksType";
import { useNavigate } from "react-router-dom";

function BookCard(book: Book) {
  const navigate = useNavigate();
  const dispatch = useBookDispatch();

  const callStockPage = (book: Book) => {
    const stockQuery: StockReqQuery = { id: book.id };
    dispatch({ type: "SET_STOCK_QUERY", stockQuery: stockQuery });

    navigate("/stock", { state: { stockQuery: stockQuery, title: book.title } });
  };

  return (
    <div onClick={() => callStockPage(book)}>
      <ul>
        <li>title={book.title}</li>
        <li>author={book.author}</li>
        <li>cover={book.cover}</li>
      </ul>
    </div>
  );
}

export default BookCard;
