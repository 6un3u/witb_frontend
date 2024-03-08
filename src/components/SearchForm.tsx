import { useForm } from "react-hook-form";
import Input from "@mui/material/Input";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { SearchReqQuery } from "../api/BookApi";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const { register, handleSubmit } = useForm<SearchReqQuery>();
  const navigate = useNavigate();

  const onSubmit = (data: SearchReqQuery) => {
    console.log(data);
    navigate("/select-book", { state: { data } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input id="query" type="text" placeholder="Enter the book title" {...register("s")} />
      <IconButton aria-label="search" type="submit">
        <SearchIcon />
      </IconButton>
    </form>
  );
}

export default SearchForm;
