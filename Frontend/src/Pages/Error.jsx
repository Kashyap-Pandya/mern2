import React from "react";

function Error() {
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="tracking-wider text-xl font-semibold text-white">
        Something Went Wrong
      </h1>
      <button
        className="tracking-wider m-4 px-4 py-2 text-base font-semibold bg-[#31363F]"
        onClick={handleRefresh}
      >
        Refresh Page
      </button>
    </div>
  );
}

export default Error;
