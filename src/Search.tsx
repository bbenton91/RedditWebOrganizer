import React, { SyntheticEvent } from "react";
import { reduceEachLeadingCommentRange } from "typescript";
import { ListingData } from "./App";
import { ContentType, contentType, dataState } from "./Stores";
import "./styles/search.css";
import comment from './images/comments.png'
import user from './images/user.png'
import reddit from './images/reddit-logo.png'

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
      const searchComment = document.querySelector("#searchContent") as HTMLInputElement;
      const searchUser = document.querySelector("#searchUser") as HTMLInputElement;
      const searchSubreddit = document.querySelector("#searchSubreddit") as HTMLInputElement;

      // Then search on a delay
      var regex = new RegExp(text, "gmi");
      contentType.listingType = ContentType.ListingData;
      dataState.filteredData = dataState.originalData.links.filter(
            (item) =>
            (searchComment?.checked ? item.title?.match(regex) : false) ||
            (searchComment?.checked ? item.body?.match(regex) : false) ||
            (searchUser?.checked ? item.author.match(regex) : false) ||
            (searchSubreddit?.checked ? item.subreddit.match(regex) : false)
      );
      
    }, 1000);
  };

  return (
    <div className="flex items-center mb-4">
      <input
        onChange={filter}
        className="mb-2 text-black pl-1 pr-1 w-60 mr-2"
        type="text"
        name="searchbar"
        id=""
      />
      
      <div className="mr-2 flex flex-col items-center"><input id="searchContent" type="checkbox" defaultChecked={true} name="" className="mb-1"/><img src={comment} alt="" className="icon"/></div>
      <div className="mr-2 flex flex-col items-center"><input id="searchUser" type="checkbox" defaultChecked={true} name="" className="mb-1"/><img src={user} alt="" className="icon"/></div>
      <div className="mr-2 flex flex-col items-center"><input id="searchSubreddit" type="checkbox" defaultChecked={true} name="" className="mb-1" /><img src={reddit} alt="" className="icon"/></div>
      
    </div>
  );
}
