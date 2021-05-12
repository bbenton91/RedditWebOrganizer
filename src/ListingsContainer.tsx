import React, { useDebugValue } from "react";
import { Cookies } from "./Cookies";
import { Listing } from "./Listing";
import { SavedData, ListingData } from "./App";
import { LoadingButton } from "./LoadingButton";
import "./styles/Listings.css";
import "./styles/ListingContainer.css";
import { ContentType, contentType, dataState, loadingState } from "./Stores";
import {view} from '@risingstack/react-easy-state';
import { CategorizedListing, CategorizedListings } from "./CategorizedListing";

export enum ListingType{Link, Comment}

export type ListProps = {
  setDataCallback: (data: SavedData) => void;
  url: string;
  authorizeCallback: () => void;
  startFetch:boolean;
};

type Action = {
  type: string;
  data: ListingData[];
}

function ListingsContainer(props: ListProps) {
  type ResponseData = {
    savedComments: Array<ListingData>;
    savedLinks: Array<ListingData>;
    sessionId: string;
    finished: boolean;
  };

  
  const [error, setError] = React.useState<string>("");
  const [isBusy, setBusy] = React.useState(false);

  const hasData = dataState.filteredData.length > 0;
  const loggedIn = () => Cookies.getCookie("token") !== "";

  const params = new URLSearchParams(window.location.search);

  // We set the setLocalData function of the context so we can update the data in this component locally.
  // useContext doesn't seem to want to redraw
  // contextData.setLocalData = (data: ListingData[]) => {
  //   setData(data);
  // }

  /** 
   * Fetches the data when the 'Fetch Data' button is clicked.
   * This will gather all saved content from the user after a authorized log in.
   * 
   * @param {boolean} isNew - If it is a new fetch request. This will signal the server to 
   * start over since the server does chunked requests. Should be false on all followup requests.
   * @param {Listingtype} contentType - The type of ListingType to fetch from the server (defaults to Link)
   *  
   */
  const fetchData = (isNew:boolean = true, contentType:ListingType = ListingType.Link) => {
    // setLoadingData(true); // For our loading button
    loadingState.isLoading = true;

    const isNewRequest = isNew ? true : false;

    fetch("http://127.0.0.1:7070/get-saved", {
      method: "POST",
      headers: new Headers({
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        token: Cookies.getCookie("token"),
        sessionId: Cookies.getCookie("sessionId"),
        isNew: isNewRequest,
        listingType: contentType === ListingType.Link ? "link" : "comment" 
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        var obj: ResponseData = JSON.parse(data); // Parse the json

        // Since this is a 'chunked' partial upload, we concat both of the new data
        var comments = dataState.originalData.comments.concat(obj.savedComments ?? []);
        var links = dataState.originalData.links.concat(obj.savedLinks ?? []);

        // Then we set the context data
        dataState.originalData = { comments: comments, links: links };
        dataState.filteredData = links;
        // setData(dataState.filteredData);

        // Then we store our session ID
        Cookies.addCookie("sessionId", obj.sessionId ?? "");

        /** 
         * This area will recursively call fetch data to get all chunked data until we finish.
         * It essentially ping-pongs the server until we get a response that contains "finished: true".
         * But we need to get both Link and Comment types, so we start with Link. Then change to Comment 
         */

        // If the session ID is empty, we need to autorize with reddit
        if (obj.sessionId === "")
          props.authorizeCallback();
        // Otherwise, if we're finished but still on "link" type content, start a new fetch for the comments
        else if (!obj.finished)
          fetchData(false, contentType);
        else {
          // setLoadingData(false);
          console.log("Why am I called here");
          loadingState.isLoading = false;
        }

      }).catch(reason => { loadingState.isLoading = false; setError("Something went wrong. Please try again later")});
  };

  if (params.get("code") != null) {
    Cookies.addCookie("token", params.get("code")!);
    window.history.replaceState(null, "React App", "/");
  }

  /** 
   * Function to remove a listing by ID and ListingType
   * Removes the listing and sets the new data to trigger a rerender.
   * This should only be called after the server returns a success for removal
   */
  const removeListing: (id: string, listingType: ListingType) => void = (id, listingType) => {
    var newList: Array<ListingData>;
    var newData: SavedData;
    
    if (listingType === ListingType.Link) {
      newList = dataState.originalData.links.filter((listing: ListingData) => listing.id !== id);
      newData = { links: newList, comments: dataState.originalData.comments };
    } else {
      newList = dataState.originalData.comments.filter((listing: ListingData) => listing.id !== id);
      newData = {  links: dataState.originalData.links, comments: newList  };
    }

    dataState.originalData = newData;
    dataState.filteredData = newList;
    // setData(newList);
    // dispatch({ type: "update", data: newList });

    // Remove the element with javascript here because context doesn't trigger a rerender for some reason
    // var elem = document.querySelector(`li[data-id='${id}'`);
    // elem?.remove();
  };

  // Generates the buttons for Login/fetch
  const button: () => JSX.Element | string = () => {
    const className =
      "ml-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded w-60 h-20";

    var button: JSX.Element | string;
    var status = error !== "" ? "Something went wrong. Please try again later" : "";
    var text = "";
    var loading = false;
    var disabled = false;

    if (!loggedIn()) {
      text = "Login";
      loading = false;
      disabled = false;
    } else if (!hasData && !loadingState.isLoading) {
      text = "Get Saved";
      loading = false;
      disabled = false;
    }
    else if (!hasData && loadingState.isLoading) {
      text = "Fetching Saved";
      loading = true;
      disabled = true;
      // status = "Please be patient. This could take up to a minute to retrieve all saved posts."
    }

    button = 
      <LoadingButton
        callback={fetchData}
        text={text}
        loading={loading}
        className={className}
        iconPath=""
        disabled={disabled}
      />

    if (text !== "")
      return (
        <div className="flex flex-col h-full items-center justify-center">
          {button}
          <span id="statusText" className="text-yellow-700 hidden">{status}</span>
        </div>
      );
    return "";
  };

  const regularListing = (value: ListingData, index:number) => {
    return <li key={value.id} data-id={value.id} data-num={index}>
          <Listing
            removeSelf={removeListing}
            data={value}
            authorizeCallback={props.authorizeCallback}
            isLoading={loadingState.isLoading || isBusy}
            setBusy={setBusy}
          />
        </li>
  }

  const categorizedListing = (value: CategorizedListings) => {
    return <li key={value.subredditName} data-id={value.subredditName}>
          <CategorizedListing
            data={value}
          />
        </li>
  }

  // Generates the listings
  const listings = () => {
    if (dataState.filteredData.length > 0) {
      return (
        <ul className="m-2 w-full">
          {dataState.filteredData.map((value, index) => (
            contentType.listingType === ContentType.ListingData?
              regularListing(value as ListingData, index)
              :
              categorizedListing(value as CategorizedListings)
          ))}
        </ul>
      );
    }
  };

  setTimeout(() => {
    document.querySelector("#statusText")?.classList.remove("hidden");
  }, 3000);

  // The final render
  return <div
        id="innerListings"
        className="w-full lg:w-4/6 h-5/6 bg-white overflow-y-auto container"
      >
        {button()}
        {listings()}
      </div>
  
}


export default view(ListingsContainer)