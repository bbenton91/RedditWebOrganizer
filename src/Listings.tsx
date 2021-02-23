import React from "react";
import { Cookies } from "./Cookies";
import { Listing } from "./Listing";
import { SavedData, ListingData } from "./App";
import { LoadingButton } from "./LoadingButton";
import "./styles/Listings.css";
import ClipLoader from "react-spinners/ClipLoader"

export enum ListingType{Link, Comment}

export type ListProps = {
  filteredData: Array<ListingData>;
  savedData: SavedData;
  setDataCallback: (data: SavedData) => void;
  url: string;
  authorizeCallback: () => void;
};

export function Listings(props: ListProps) {
  type ResponseData = {
    savedComments: Array<ListingData>;
    savedLinks: Array<ListingData>;
    sessionId: string;
  };

  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const hasData = props.filteredData.length > 0;
  const loggedIn = () => Cookies.getCookie("token") !== "";

  const params = new URLSearchParams(window.location.search);

  const fetchData = () => {
    setLoadingData(true);
    fetch("http://127.0.0.1:7070/get-saved", {
      method: "POST",
      headers: new Headers({
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        token: Cookies.getCookie("token"),
        sessionId: Cookies.getCookie("sessionId"),
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        var obj: ResponseData = JSON.parse(data); // Parse the json
        props.setDataCallback({comments: obj.savedComments, links: obj.savedLinks}); // Set our state data
        // console.log(obj);
        Cookies.addCookie("sessionId", obj.sessionId ?? ""); // Add the auth cookie //TODO Need to set time expiration
        if (obj.sessionId === "") props.authorizeCallback();

        setLoadingData(false);
      }).catch(reason => { setLoadingData(false); setError("Something went wrong. Please try again later")});
  };

  if (params.get("code") != null) {
    Cookies.addCookie("token", params.get("code")!);
    window.history.replaceState(null, "React App", "/");
  }

  const removeListing: (id: string, listingType: ListingType) => void = (id, listingType) => {
    var newData: Array<ListingData>;
    
    if(listingType === ListingType.Link)
      newData = props.savedData.links.filter((listing) => listing.id !== id);
    else
      newData = props.savedData.comments.filter((listing) => listing.id !== id);
    
    props.setDataCallback({comments: newData, links: props.savedData.links});
  };

  // Generates the buttons for Login/fetch
  const button: () => JSX.Element | string = () => {
    const className =
      "ml-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded w-60 h-20";

    var button: JSX.Element | string;
    var status = error !== "" ? "Something went wrong. Please try again later" : "";

    if (!loggedIn())
      button = (
        <LoadingButton
          callback={fetchData}
          text="Login"
          loading={false}
          className={className}
          iconPath=""
        />
      );
    else if (!hasData && !loadingData)
      button = (
          <LoadingButton
            callback={fetchData}
            text="Fetch Data"
            loading={false}
            className={className}
            iconPath=""
          
          />
      );
    else if (!hasData && loadingData) {
      status = "Please be patient. This could take up to a minute to retrieve all saved posts."
      button = button = (
        <LoadingButton
          callback={fetchData}
          text="Fetching Data"
          loading={true}
          className={className}
          iconPath=""
        />
      );
    }else button = "";

    if (button !== "")
      return (
        <div className="flex flex-col h-full items-center justify-center">
          {button}
          <span id="statusText" className="text-yellow-700 hidden">{status}</span>
        </div>
      );
    return "";
  };

  // Generates the listings
  const listings = () => {
    if (props.filteredData.length > 0) {
      return (
        <ul className="m-2 w-full">
          {props.filteredData.map((value) => (
            <li>
              <Listing
                removeSelf={removeListing}
                data={value}
                authorizeCallback={props.authorizeCallback}
              />
            </li>
          ))}
        </ul>
      );
    }
  };

  setTimeout(() => {
    document.querySelector("#statusText")?.classList.remove("hidden");
  }, 3000);

  // The final render
  return (
    <div
      id="innerListings"
      className="w-full lg:w-4/6 h-5/6 bg-white overflow-y-auto"
    >
      {button()}
      {listings()}
    </div>
  );
}
