import React from 'react';
import { Cookies } from './Cookies';
import { ListingData } from './App';
import loadingSpinner from './images/spinner-of-dots.png';
import { LoadingButton } from './LoadingButton';


type BodyProps = {
  removeSelf:(id:string) => void
  data: ListingData,
  authorizeCallback: () => void
}

export function Listing({removeSelf, data, authorizeCallback}:BodyProps) {

  type ResponseData = {
    success: boolean,
    sessionId: string
  }

  const [unsaving, setUnsaving] = React.useState<boolean>(false);

  const redditBaseUrl = "https://reddit.com/"

  const unsaveButton = !unsaving ?
    <LoadingButton callback={() => { }} text="Unsave" loading={false} className="h-full w-full block rounded"/>
    : <LoadingButton callback={() => { }} text="Unsaving" loading={true} className="h-full w-full block rounded"/>

  const unsavePost = () => {
    setUnsaving(true);
    const fullname = "t3_" + data.id; // The fullname of our saved link. t1_ is a comment, t3_ is a link

    fetch("http://127.0.0.1:7070/unsave", {
      method: 'POST',
      headers: new Headers({ "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }),
      body: JSON.stringify({ "fullname": fullname, "sessionId": Cookies.getCookie("sessionId") })
    }).then(response => response.text())
      .then(responseData => {
        var obj: ResponseData = JSON.parse(responseData); // Parse the json
        if(obj.success) // If success, remove our listing by calling the passed in callback
          removeSelf(data.id);
        
        setUnsaving(false)

        // Add our cookie. If the sessionId is empty, we need to reauthenticate
        Cookies.addCookie("sessionId", obj.sessionId);
        if (obj.sessionId === "")
          authorizeCallback();
        console.log(obj.sessionId);
    })
  }

  const title = (title: string) => {
    var length = 800
    return title.length > length ? title.substr(0, length-3) + "..." : title
  }
  
  return <div className="listing w-full bg-gray-400 mb-2 h-14 flex text-black">
    <div className="flex-grow flex-1 text-lg pl-1 pr-1 font-medium">{title(data.title)}</div>
    <div className="w-1/6 mr-2 flex justify-center place-items-center flex-col border-l-2 border-r-2">
      <span>{"r/"+data.subreddit}</span>
      <span>{"u/"+data.author}</span>
    </div>
    <div className="w-20 mr-1 rounded border-r-2"><a className="" href={data.url}><button className="h-full w-full block rounded">Link</button></a></div>
    <div className="w-20 mr-1 rounded border-r-2"><a href={redditBaseUrl+data.permalink}><button className="h-full w-full block rounded">Permalink</button></a></div>
    <div className="w-20 rounded"><a onClick={unsavePost}>{ unsaveButton }</a></div>
  </div>
}