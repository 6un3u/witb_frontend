import { StockReqQuery } from "../api/BookApi";

import { Book } from "../types/BooksType";
import { useNavigate } from "react-router-dom";

function BookCard(book: Book) {
  const navigate = useNavigate();

  const callStockPage = (book: Book) => {
    const stockQuery: StockReqQuery = { id: book.id };
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
