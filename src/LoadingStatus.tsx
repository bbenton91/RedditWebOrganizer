import React from 'react';
import { loadingState } from "./Stores";

type LoadingStatusProps = {
  amount: number;
  className: string;
}

export function LoadingStatus({amount, className}:LoadingStatusProps) {
  
  return <div className={className}>Data is loading. Please wait. Loaded {amount} so far.</div>
}