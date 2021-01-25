import React from 'react';
import { Cookies } from './Cookies';
import { Listings, ListProps } from './Listings';
import {Search, SearchProps} from './Search'


export type ListingData = {
  title: string,
  url: string,
  permalink: string,
  id: string,
  is_self: boolean,
  author: string,
  subreddit: string
}

export function App() {

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

  const setAllData: (newData:Array<ListingData>) => void = newData => {
    setData(newData);
    setFilteredData(newData);
  }

  const authorize = () => {
    // Replace our state code. This should be uniquee every request and checked when we return
    var newUrl: string = url.replace("#rs", "something")
    window.location.href = newUrl;
  }

  const params = new URLSearchParams(window.location.search)

  
  if (params.get("code") != null) {
    Cookies.addCookie("token", params.get("code")!);
    // window.location.replace("http://localhost:3000")
    window.history.replaceState(null, "React App", "/")
  }

  const listingProps:ListProps = {url:"", filteredData: filteredData, setDataCallback: setAllData, authorizeCallback: authorize}
  const searchProps: SearchProps = {originalData: data, setFilteredDataCallback: setFilteredData}

  return <div className="flex flex-col h-full items-center justify-center text-white bg-gradient-to-br from-gray-600 via-teal-700 to-gray-800">
    Here is the Latest React version: <strong>{React.version}</strong>
    <Search  {...searchProps}/>
    <Listings {...listingProps} />
    </div>
}


export default App;
