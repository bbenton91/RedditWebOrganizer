import React from 'react';
import { Cookies } from './Cookies';
import { Listing } from './Listing';
import { ListingData } from './App';
import { LoadingButton } from './LoadingButton';
import './styles/Listings.css'


export type ListProps = {
  filteredData: Array<ListingData>
  setDataCallback: (data: Array<ListingData>) => void
  url: string,
  authorizeCallback: () => void
}

export function Listings(props: ListProps) {
  
  type ResponseData = {
    data: Array<ListingData>,
    sessionId:string
  }

  const [loadingData, setLoadingData] = React.useState<boolean>(false);

  const hasData = props.filteredData.length > 0;
  const loggedIn = () => Cookies.getCookie("token") !== "";

  const params = new URLSearchParams(window.location.search)

  const fetchData = () => {
    setLoadingData(true)
    fetch("http://127.0.0.1:7070/get-saved", {
      method: 'POST',
      headers: new Headers({ "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }),
      body: JSON.stringify({"token": Cookies.getCookie("token"), "sessionId": Cookies.getCookie("sessionId")})
    }).then(response => response.text())
      .then(data => {
        var obj:ResponseData = JSON.parse(data); // Parse the json
        props.setDataCallback(obj.data); // Set our state data
        console.log(obj)
        Cookies.addCookie("sessionId", obj.sessionId ?? "") // Add the auth cookie //TODO Need to set time expiration
        if (obj.sessionId === "")
          props.authorizeCallback();
        
        setLoadingData(false)
    })
  }

  if (params.get("code") != null) {
    Cookies.addCookie("token", params.get("code")!);
    // window.location.replace("http://localhost:3000")
    window.history.replaceState(null, "React App", "/")
  }

  const removeListing: (id:string) => void = (id) => {
    var newData = props.filteredData.filter(listing => listing.id !== id)
    props.setDataCallback(newData);
  }

  // Generates the buttons for Login/fetch
  const button: () => JSX.Element | string = () => {
    const className = "ml-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded w-60 h-20"

    var button:JSX.Element|string
    if (!loggedIn())
      button = <LoadingButton callback={fetchData} text="Login" loading={false} className={className}/>
    else if (!hasData && !loadingData)
      button = <LoadingButton callback={fetchData} text="Fetch Data" loading={false} className={className}/>
    else if (!hasData && loadingData)
      button = <LoadingButton callback={fetchData} text="Fetching Data" loading={true} className={className} />
    else
      button = "";
    
    if (button !== "")
      return <div className="flex w-full h-full justify-center place-items-center">{button}</div>
    return "";
  }

  // Generates the listings
  const listings = () => {
    if (props.filteredData.length > 0) {
      return <ul className="m-2 w-full">
      {
        props.filteredData.map(value =>
          <li>< Listing removeSelf={removeListing} data={value} authorizeCallback={props.authorizeCallback} /></li>
        )
      }
      </ul>
    }
  }
  
  // The final render
  return <div id="innerListings" className="w-5/6 h-5/6 bg-white flex overflow-y-auto">
    {button()}
    {listings()}
  </div>
}