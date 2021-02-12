import React, { SyntheticEvent } from "react";
import { ListingData } from "./App";

export type SearchProps = {
  originalData: Array<ListingData>;
  setFilteredDataCallback: (data: Array<ListingData>) => void;
};

export function Search(props: SearchProps) {
  var delayedFilter: NodeJS.Timeout;

  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    const text = e.currentTarget.value;

    if (text === "") {
      props.setFilteredDataCallback(props.originalData);
      return;
    }

    clearTimeout(delayedFilter); // Clear the last timeout (if any)
    delayedFilter = setTimeout(() => {
      // Then search on a delay
      var regex = new RegExp(text, "gmi");
      props.setFilteredDataCallback(
        props.originalData.filter(
          (item) =>
            item.title.match(regex) ||
            item.author.match(regex) ||
            item.subreddit.match(regex)
        )
      );
      console.log("filtered");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <input
        onChange={filter}
        className="mb-2 text-black pl-1 pr-1 w-60"
        type="text"
        name="searchbar"
        id=""
      />

      <div className="flex space-x-10">
        <div className="flex flex-col items-center">
          <label htmlFor="searchTitle">Search Title</label>
          <input
            className="w-4 h-4"
            type="checkbox"
            id="searchTitle"
            name="searchTitle"
            value="Title"
            defaultChecked={true}
          ></input>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="searchTitle">Search Subreddit</label>
          <input
            className="w-4 h-4"
            type="checkbox"
            id="searchSubreddit"
            name="searchSubreddit"
            value="Subreddit"
            defaultChecked={true}
          ></input>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="searchTitle">Search Author</label>
          <input
            className="w-4 h-4"
            type="checkbox"
            id="searchAuthor"
            name="searchAuthor"
            value="Author"
            defaultChecked={true}
          ></input>
        </div>
      </div>
    </div>
  );
}
