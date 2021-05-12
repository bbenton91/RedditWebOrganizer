import React from 'react';
import { CategorizedListings } from './CategorizedListing';
import { ListingType } from './ListingsContainer';
import { dataState, contentType, ContentType } from './Stores';

export type ListingTypeChooserProps = {
  setListingType:(listingType:ListingType)=>void
}

export function ListingTypeChooser({ setListingType }: ListingTypeChooserProps) {

  function loadCategorizedListings() {
    let listings = dataState.originalData.links;
    let map = new Map<string, CategorizedListings>();

    listings.forEach(listing => {
      let value = map.get(listing.subreddit);
      if (value === undefined) {
        value = { subredditName: listing.subreddit, amount: 1 };
        map.set(listing.subreddit, value);
      }else
        value.amount += 1;
    })

    let values: CategorizedListings[] = Array.from(map.values());
    values.sort((x, y) => y.amount - x.amount);

    dataState.filteredData = values;

    contentType.listingType = ContentType.CategorizedListings;

  }

  return <div className="mb-5 text-black ">
    <button onClick={() => { contentType.listingType = ContentType.ListingData; dataState.filteredData = dataState.originalData.links;} } className="w-40 h-8 bg-white rounded font-medium">Recent</button>
    <button onClick={loadCategorizedListings}className="w-40 h-8 bg-white rounded ml-4 font-medium">By Subreddit</button>
  </div>
}