import React from 'react';
import { Cookies } from './Cookies';
import { Listing } from './Listing';
import loadingSpinner from './images/spinner-of-dots.png';
import './styles/Listings.css'


export type ListingData = {
  title: string,
  url: string,
  permalink: string,
  id: string,
  is_self: boolean
}

export function Listings() {

  const appId = "C6iDiQaoPTwgVw"
  const redirect = "http://localhost:3000"
  const scope = "identity,save,history"

  const url = `https://www.reddit.com/api/v1/authorize?client_id=${appId}&response_type=code&
state=#rs&redirect_uri=${redirect}&duration=permanent&scope=${scope}`;

  type ResponseData = {
    data: Array<ListingData>,
    sessionId:string
  }

  const [data, setData] = React.useState<Array<ListingData>>([]);
  const [filteredData, setFilteredData] = React.useState<Array<ListingData>>([]);

  const [loadingData, setLoadingData] = React.useState<boolean>(false);

  const hasData = data.length > 0;
  const loggedIn = () => Cookies.getCookie("token") !== "";

  const authorize = () => {
    var newUrl: string = url.replace("#rs", "something")
    window.location.href = newUrl;
  }

  const params = new URLSearchParams(window.location.search)

  const fetchData = () => {
    setLoadingData(true)
    fetch("http://127.0.0.1:7070/get-saved", {
      method: 'POST',
      headers: new Headers({ "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }),
      body: JSON.stringify({"token": Cookies.getCookie("token"), "sessionId": Cookies.getCookie("sessionId")})
    }).then(response => response.text())
      .then(data => {
        // console.log(data)
        var obj:ResponseData = JSON.parse(data); // Parse the json
        setData(obj.data); // Set our state data
        setFilteredData(obj.data);
        console.log(obj)
        Cookies.addCookie("sessionId", obj.sessionId ?? "") // Add the auth cookie //TODO Need to set time expiration
        if (obj.sessionId === "")
          authorize();
        
        // setLoadingData(false)
    })
  }

  if (params.get("code") != null) {
    Cookies.addCookie("token", params.get("code")!);
    // window.location.replace("http://localhost:3000")
    window.history.replaceState(null, "React App", "/")
  }

  const removeListing: (id:string) => void = (id) => {
    var newData = data.filter(listing => listing.id !== id)
    setData(newData);
  }

  // Generates the buttons for Login/fetch
  const button:()=>JSX.Element|string = () => {
    if (!loggedIn())
      return <button onClick={authorize} className="ml-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded w-20 h-14">Log In</button>
    else if (!hasData && !loadingData)
      return <button onClick={fetchData} className="rotate ml-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded w-20 h-14">Fetch Data</button>
    else if (!hasData && loadingData)
      return <button onClick={fetchData} className="rotate ml-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded w-20 h-14"><img className="rotating" src={loadingSpinner} alt="loading spinner"></img>Fetching Data</button>
    return "";
  }

  // Generates the listings
  const listings = () => {
    if (filteredData.length > 0) {
      return <ul className="m-2 w-full">
      {
        filteredData.map(value =>
          <li>< Listing removeSelf={removeListing} data={value} /></li>
        )
      }
      </ul>
    }
  }
  
  // The final render
  return <div id="innerListings" className="w-5/6 min-h-1/4 bg-white flex">
    {button()}
    {listings()}
  </div>
}