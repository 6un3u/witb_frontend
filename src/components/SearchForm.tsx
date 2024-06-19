import { useForm } from "react-hook-form";
import Input from "@mui/material/Input";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { SearchReqQuery } from "../api/BookApi";
import { useNavigate } from "react-router-dom";
import { useBookDispatch, useBookState } from "../types/BookContext";

function SearchForm() {
  const { register, handleSubmit } = useForm<SearchReqQuery>();
  const navigate = useNavigate();

  const state = useBookState();
  const dispatch = useBookDispatch();

  const setSearchQuery = (data: SearchReqQuery) => {
    dispatch({ type: "SET_SEARCH_QUERY", searchQuery: data });
    navigate("/select-book");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(setSearchQuery)}>
        <Input id="query" type="text" placeholder="Enter the book title" {...register("s")} />
        <IconButton aria-label="search" type="submit">
          <SearchIcon />
        </IconButton>
      </form>
    </div>
  );
}

export default SearchForm;
