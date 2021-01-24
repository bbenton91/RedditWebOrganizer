import React, { SyntheticEvent } from 'react';
import {ListingData} from './Listings'

export function Search() {

  var delayedFilter: NodeJS.Timeout;
  

  const [data, setData] = React.useState(new Array<ListingData>());
  const [filteredData, setFilteredData] = React.useState(new Array<ListingData>());

  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    const text = e.currentTarget.value;

    if (text === "") {
      setFilteredData(data);
      return;
    }

    clearTimeout(delayedFilter); // Clear the last timeout (if any)
    delayedFilter = setTimeout(() => { // Then search on a delay
      setFilteredData(data.filter(item => item.title.includes(text)));
      console.log("filtered")
    }, 1000)

  }

  return <input onChange={filter} className="mb-2 text-black pl-1 pr-1" type="text" name="searchbar" id=""/>
}