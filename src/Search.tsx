import React, { SyntheticEvent } from "react";
import { ListingData } from "./App";
import { ContentType, contentType, dataState } from "./Stores";

export function Search() {
  var delayedFilter: NodeJS.Timeout;

  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    const text = e.currentTarget.value;

    if (text === "") {
      dataState.filteredData = dataState.originalData.links;
      // props.setFilteredDataCallback(contextData.originalData);
      return;
    }

    clearTimeout(delayedFilter); // Clear the last timeout (if any)
    delayedFilter = setTimeout(() => {
      // Then search on a delay
      var regex = new RegExp(text, "gmi");
      contentType.listingType = ContentType.ListingData;
      dataState.filteredData = dataState.originalData.links.filter(
            (item) =>
            item.title?.match(regex) ||
            item.body?.match(regex) ||
            item.author.match(regex) ||
            item.subreddit.match(regex)
      );
      
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

      
    </div>
  );
}
