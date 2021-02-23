import React from "react";
import { Cookies } from "./Cookies";
import { ListingData } from "./App";
import { LoadingButton } from "./LoadingButton";
import { ListingType } from "./Listings";
import { BrowserView, isBrowser } from "react-device-detect";
import close from "./images/close-outline.svg";


import "./styles/Listing.css";


type BodyProps = {
  removeSelf: (id: string, listingType: ListingType) => void;
  data: ListingData;
  authorizeCallback: () => void;
};

export function Listing({ removeSelf, data, authorizeCallback }: BodyProps) {
  type ResponseData = {
    success: boolean;
    sessionId: string;
  };

  const [unsaving, setUnsaving] = React.useState<boolean>(false);

  const redditBaseUrl = "https://reddit.com/";

  const unsaveButton = !unsaving ? (
    isBrowser ?
      // For browser
      <LoadingButton
        callback={() => { }}
        text="Unsave"
        loading={false}
        className="h-full w-full block rounded"
        iconPath=""
      />
      :
      // For mobile
      <LoadingButton
        callback={() => { }}
        text = ""
        loading={false}
        className="h-full w-full block rounded"
        iconPath={close}
      />
  ) : (
    isBrowser ?
      // For unsaving browser
      <LoadingButton
        callback={() => {}}
        text="Unsaving"
        loading={true}
        className="h-full w-full block rounded"
        iconPath=""
      />
        :
      // For unsaving mobile
      <LoadingButton
        callback={() => {}}
        text=""
        loading={true}
        className="h-full w-full block rounded"
        iconPath=""
      />
        
  );

  // Function for unsaving a post
  const unsavePost = () => {
    setUnsaving(true);
    const fullname = "t3_" + data.id; // The fullname of our saved link. t1_ is a comment, t3_ is a link

    // Make a post to the unsave api
    fetch("http://127.0.0.1:7070/unsave", {
      method: "POST",
      headers: new Headers({
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        fullname: fullname,
        sessionId: Cookies.getCookie("sessionId"),
      }),
    })
      // Get the response back to make sure we didn't have an error
      .then((response) => response.text())
      .then((responseData) => {
        var obj: ResponseData = JSON.parse(responseData); // Parse the json
        if (obj.success)
          // If success, remove our listing by calling the passed in callback
          removeSelf(
            data.id,
            data.body === "" ? ListingType.Link : ListingType.Comment
          );

        setUnsaving(false);

        // Add our cookie. If the sessionId is empty, we need to reauthenticate
        Cookies.addCookie("sessionId", obj.sessionId);
        if (obj.sessionId === "") authorizeCallback();
        console.log(obj.sessionId);
      });
  };

  const openInNewTab = (url:string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  }

  // Formats the title for our listing
  const title = (listing: ListingData): string => {
    var length = 800;
    var text = listing.title ?? listing.body ?? "";
    return text.length > length ? text.substr(0, length - 3) + "..." : text;
  };

  const link = (link: string, fallbackLink: string): string => link === "" || link === undefined || !link.includes("reddit") ? fallbackLink : link;

  return (
    <div className="w-full mb-2 h-14 flex text-color listing-background rounded text-xs lg:text-lg">
      <a className="listing-title pl-4 pr-4 font-medium cursor-pointer listing"  onClick={(()=>openInNewTab(redditBaseUrl + data.permalink))}>
        {title(data)}
      </a>

      {/* The title/content */}
      <div className="listing-info lg:w-1/6 flex justify-center place-items-center flex-col border-l-2 border-r-2 listing">
        <span>{"r/" + data.subreddit}</span>
        <span>{"u/" + data.author}</span>
      </div>

      {/* The unsave post button */}
      <div className="listing-unsave lg:w-20 rounded border-r-2">
        <a onClick={unsavePost}>{unsaveButton}</a>
      </div>

      <div className="w-3">

      </div>
    </div>
  );
}
