import React from "react";
import { Cookies } from "./Cookies";
import { ListingData } from "./App";
import { LoadingButton } from "./LoadingButton";
import { ListingType } from "./ListingsContainer";
import { BrowserView, isBrowser } from "react-device-detect";
import close from "./images/close-outline.svg";
import { ContentType, contentType, dataState } from './Stores';


import "./styles/Listing.css";

export class CategorizedListings{
  subredditName: string = "";
  amount: number = 0;
}

type BodyProps = {
  data: CategorizedListings,
};

export function CategorizedListing({ data }: BodyProps) {

  // Formats the title for our listing
  const title = (listing: CategorizedListings): string => {
    return listing.subredditName;
  };

  const filterBySubreddit = (subredditName: string) => {
    contentType.listingType = ContentType.ListingData;
    let data = dataState.originalData.links;
    let filtered = data.filter(d => d.subreddit === subredditName)
    dataState.filteredData = filtered;
  }

  return (
    <div className="w-full mb-2 h-14 flex text-color listing-background rounded text-xs lg:text-lg">
      <a className="flex w-full pl-4 pr-4 font-medium cursor-pointer listing place-items-center"  onClick={(()=>filterBySubreddit(data.subredditName))}>
        /r/{title(data)}
      </a>

      {/* The amount of listings under the subreddit */}
      <div className="lg:w-24 flex justify-center place-items-center flex-col border-l-2 border-r-2 listing">
        {data.amount}
      </div>

    </div>
  );
}
