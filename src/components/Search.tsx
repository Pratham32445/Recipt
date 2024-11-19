import { useRecoilState } from "recoil";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { isSearch, searchQuery } from "../state";
import React from "react";

const Search = () => {
  const [, setSearch] = useRecoilState(searchQuery);
  const [, setIsSearch] = useRecoilState(isSearch);
  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearch(true);
  }
  return (
    <div className="flex flex-col justify-center items-center mt-[50px]">
      <div className="p-2">
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
          GitHub Receipt
        </h2>
        <p className="leading-7 text-center">
          Generate a receipt-style summary of your GitHub profile
        </p>
      </div>
      <form className="w-10/12 sm:w-[500px] my-10 sm:flex sm:gap-2 sm-flex-col" onSubmit={handleSubmit}>
        <Input
          placeholder="Enter Github username"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="w-full my-5 sm:w-fit sm:my-0"
          type="submit"
        >
          Generate
        </Button>
      </form>
    </div>
  );
};

export default Search;
