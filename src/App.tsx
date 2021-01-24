import React from 'react';
import { Listings } from './Listings';
import {Search} from './Search'


export function App() {

  type Data = {
    title:string
  }

  const [data, setData] = React.useState<Array<Data>>([]);

  const hasData = data.length > 0;

  return <div className="flex flex-col h-full items-center justify-center text-white bg-gradient-to-br from-gray-600 via-teal-700 to-gray-800">
    Here is the Latest React version: <strong>{React.version}</strong>
    <Search />
    <Listings />
    </div>
}


export default App;
