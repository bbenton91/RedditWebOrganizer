import React from 'react';

type AuthProps = {
  loggedIn: boolean,
  fetchData: () => void
}

export const StateButton = ({ loggedIn, fetchData }: AuthProps) => {
  
  return <button onClick={fetchData} className="ml-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded">Fetch Data</button>
}

