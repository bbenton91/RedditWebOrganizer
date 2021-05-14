import { view } from "@risingstack/react-easy-state";
import React from "react";
import { Cookies } from "./Cookies";
import ListingsContainer, { ListingType, ListProps } from "./ListingsContainer";
import { ListingTypeChooser } from "./ListingTypeChooser";
import { LoadingStatus } from "./LoadingStatus";
import { LogoutButton } from "./LogoutButton";
import { Search } from "./Search";
import { dataState, loadingState } from "./Stores";
import { isBrowser } from "react-device-detect";



import "./styles/App.css";

/**
 * The type for our individual listings
 */
export class ListingData{
  title: string = "";
  url: string = "";
  permalink: string = "";
  id: string = "";
  is_self: boolean = false;
  author: string = "";
  subreddit: string = "";
  body: string = "";
};

/**
 * The type that holds all of our saved data
 */
export type SavedData = {
  links: Array<ListingData>;
  comments: Array<ListingData>;
};

export function App() {
  const appId = "C6iDiQaoPTwgVw";
  const redirect = "http://localhost:3000";
  const scope = "identity,save,history";

  const RedditAuthUrl = `https://www.reddit.com${isBrowser? "/api/v1/authorize?" : "/api/v1/authorize.compact?"}client_id=${appId}&response_type=code&
state=#rs&redirect_uri=${redirect}&duration=permanent&scope=${scope}`;

  type ResponseData = {
    data: Array<ListingData>;
    sessionId: string;
  };

  const [currListingType, setcurrListingType] = React.useState<ListingType>(
    ListingType.Link
  ); // The current listing type we're displaying

  const setNewCurrListingType: (listingType: ListingType) => void = (
    listingType
  ) => {
    if (listingType !== currListingType)
      dataState.filteredData =
        listingType === ListingType.Link
          ? dataState.originalData.links
          : dataState.originalData.comments;
    // setFilteredData(listingType === ListingType.Link ? data.links : data.comments);

    setcurrListingType(listingType);
  };

  const setAllData: (newData: SavedData) => void = (newData) => {
    dataState.filteredData = newData.links;
    dataState.originalData = newData;
    // setData(newData);
    // setFilteredData(newData.links);
  };

  /**
   * Callback to authorize with reddit's web api
   */
  const authorize = () => {
    // Replace our state code. This should be uniquee every request and checked when we return
    var newUrl: string = RedditAuthUrl.replace("#rs", "something");
    window.location.href = newUrl;
  };

  /**
   * Clears the authorize cookies.
   */
  const clearAuthorize = () => {
    Cookies.clearCookie("sessionId");
    dataState.originalData = { links: [], comments: [] };
    dataState.filteredData = [];
    // setAllData({links: new Array<ListingData>(), comments: new Array<ListingData>()});
  };

  const params = new URLSearchParams(window.location.search);

  // We check here to see if we have a 'code' param in the url. If so, we save to a cookie and clear the url
  if (params.get("code") != null) {
    Cookies.addCookie("token", params.get("code")!);
    window.history.replaceState(null, "React App", "/"); // Sneakily replaces the url so the get values don't clutter the url
  }

  // Our props to send to the Listings component
  const listingProps: ListProps = {
    url: "",
    setDataCallback: setAllData,
    authorizeCallback: authorize,
    startFetch: false,
  };

  return (
    <div
      id="main"
      className="flex flex-col h-full items-center justify-center text-white"
    >
      <div className="flex flex-col w-full justify-end text-sm lg:text-lg">
        <h1 className="text-4xl lg:text-5xl mb-2 lg:mb-5 mt-2 title text-center">Reddit Organizer</h1>
        <div className="flex justify-end lg:w-1/5 lg:m-auto">
          <LogoutButton logoutCallback={clearAuthorize} className="mr-2 w-14"  />
        </div>
      </div>
      <LoadingStatus amount={dataState.originalData.comments.length + dataState.originalData.links.length} className={ loadingState.isLoading ? "text-yellow-700" : "opacity-0" } />
      <ListingTypeChooser setListingType={setNewCurrListingType}/>
      <Search />
      <ListingsContainer {...listingProps} />
    </div>
  );
}

export default view(App);
