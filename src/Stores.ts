import { store } from '@risingstack/react-easy-state';
import { ListingData, SavedData } from './App';
import { CategorizedListings } from './CategorizedListing';

// this is a global state store
export const loadingState = store({ isLoading: false });

export enum ContentType { ListingData, CategorizedListings };

export const contentType = store({listingType: ContentType.ListingData});

export type AllData = {
  originalData: SavedData
  filteredData: Array<ContentType>
}

export const dataState = store({ originalData: { links: new Array<ListingData>(), comments: new Array<ListingData>() }, filteredData: new Array<ListingData|CategorizedListings>() })
