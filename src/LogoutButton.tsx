import React from 'react';

export type ListingTypeChooserProps = {
  logoutCallback: () => void;
  className?: string;
}

export function LogoutButton({ logoutCallback, className }: ListingTypeChooserProps) {

  return <button className={`text-color ${className}`} onClick={logoutCallback}>
      Logout
    </button >
}