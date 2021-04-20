import React from 'react';

export type ListingTypeChooserProps = {
  logoutCallback: () => void;
}

export function LogoutButton({ logoutCallback }: ListingTypeChooserProps) {

  return <button className="text-color" onClick={logoutCallback}>
      Logout
    </button>
}