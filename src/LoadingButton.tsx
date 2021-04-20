import React from "react";
import loadingSpinner from "./images/spinner-of-dots.png";

type LoadingButtonProps = {
  callback: () => void;
  text: string;
  loading: boolean;
  className: string;
  iconPath: string;
  disabled: boolean;
};

export function LoadingButton({
  callback,
  text,
  loading,
  className = "",
  iconPath = "",
  disabled = false,
}: LoadingButtonProps) {

  const button = (): JSX.Element => {
    
    // If it's loading, we return a special button
    if (loading) {
      const buttonText = iconPath === "" ? text : "";

      return <button className={"flex justify-center items-center disabled:opacity-50 " + className}  disabled={disabled}>
        <img
          className="rotating w-6 h-6 flex-shrink mr-3"
          src={loadingSpinner}
          alt="loading spinner"
        ></img>{" "}
        <span className=""> {buttonText}</span>
      </button>

    // Otherwise, we return a normal button
    } else {
      const buttonText = iconPath === "" || iconPath === undefined ? text : " ";

      return <button onClick={callback} className={className} disabled={disabled}>
        {buttonText}
        {iconPath !== "" ? <img src={iconPath} alt="" className="w-full h-full" /> : ""}
      </button>

    }
  }

  return button();
}
