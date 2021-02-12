import React from 'react';
import { ListingType } from './Listings';

export type ListingTypeChooserProps = {
  setListingType:(listingType:ListingType)=>void
}

export function ListingTypeChooser({setListingType}:ListingTypeChooserProps){
  return <div className="mb-5 text-black ">
    <button onClick={() => setListingType(ListingType.Link) } className="w-40 h-12 bg-white rounded mr-4 font-medium">Links</button>
    <button onClick={() => setListingType(ListingType.Comment) }className="w-40 h-12 bg-white rounded font-medium">Comments</button>
  </div>
}