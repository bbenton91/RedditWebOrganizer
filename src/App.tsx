import React from 'react';
import { Cookies } from './Cookies';
import { Listings, ListingType, ListProps } from './Listings';
import { ListingTypeChooser } from './ListingTypeChooser';
import {Search, SearchProps} from './Search'

/** 
 * The type for our individual listings 
 */
export type ListingData = {
  title: string,
  url: string,
  permalink: string,
  id: string,
  is_self: boolean,
  author: string,
  subreddit: string,
  body: string
}

/** 
 * The type that holds all of our saved data 
 */
export type SavedData = {
  links: Array<ListingData>
  comments: Array<ListingData>
}

export function App() {

  const appId = "C6iDiQaoPTwgVw"
  const redirect = "http://localhost:3000"
  const scope = "identity,save,history"

  const RedditAuthUrl = `https://www.reddit.com/api/v1/authorize?client_id=${appId}&response_type=code&
state=#rs&redirect_uri=${redirect}&duration=permanent&scope=${scope}`;

  type ResponseData = {
    data: Array<ListingData>,
    sessionId:string
  }

  const [data, setData] = React.useState<SavedData>({links: new Array<ListingData>(), comments: new Array<ListingData>()}); // All the original data
  const [filteredData, setFilteredData] = React.useState<Array<ListingData>>([]); // The filtered data that our search modifies
  const [currListingType, setcurrListingType] = React.useState<ListingType>(ListingType.Link); // The current listing type we're displaying


  const setNewCurrListingType: (listingType: ListingType) => void = (listingType) => {
    if (listingType !== currListingType)
      setFilteredData(listingType === ListingType.Link ? data.links : data.comments);
    
    setcurrListingType(listingType);
  }

  const setAllData: (newData:SavedData) => void = newData => {
    setData(newData);
    setFilteredData(newData.links);
  }

  /** 
   * Callback to authorize with reddit's web api 
   */
  const authorize = () => {
    // Replace our state code. This should be uniquee every request and checked when we return
    var newUrl: string = RedditAuthUrl.replace("#rs", "something")
    window.location.href = newUrl;
  }
  
  /** 
   * Clears the authorize cookies. 
   */
  const clearAuthorize = () => {
    Cookies.clearCookie("sessionId");
    setAllData({links: new Array<ListingData>(), comments: new Array<ListingData>()});
  }

  const params = new URLSearchParams(window.location.search)
  
  // We check here to see if we have a 'code' param in the url. If so, we save to a cookie and clear the url
  if (params.get("code") != null) {
    Cookies.addCookie("token", params.get("code")!);
    window.history.replaceState(null, "React App", "/") // Sneakily replaces the url so the get values don't clutter the url
  }

  // Our props to send to the Listings component
  const listingProps: ListProps = { url: "", filteredData: filteredData, savedData: data, setDataCallback: setAllData, authorizeCallback: authorize }
  
  // Props to send to the search component
  const searchProps: SearchProps = {originalData: currListingType === ListingType.Link ? data.links : data.comments, setFilteredDataCallback: setFilteredData}

  return <div className="flex flex-col h-full items-center justify-center text-white bg-gradient-to-br from-gray-600 via-teal-700 to-gray-800">
    <h1 className="text-5xl mb-5">Reddit Organizer</h1>
    <button onClick={clearAuthorize}>Logout</button>
    <Search  {...searchProps} />
    <ListingTypeChooser setListingType={setNewCurrListingType}/>
    <Listings {...listingProps} />
    </div>
}


export default App;
