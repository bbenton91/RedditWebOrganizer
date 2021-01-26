import React from 'react';
import loadingSpinner from './images/spinner-of-dots.png';

type LoadingButtonProps = {
  callback: () => void
  text: string
  loading: boolean
  className: string
}

export function LoadingButton({callback, text, loading, className=""}:LoadingButtonProps){


  return !loading ?
      <button onClick={callback} className={className}>{text}</button>
    : <button className={"flex justify-center items-center " + className}> <img className="rotating w-6 h-6 flex-shrink mr-3" src={loadingSpinner} alt="loading spinner"></img> <span className="">{text}</span></button>
}