import React from "react";
import { BlinkBlur } from "react-loading-indicators";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#243c5a",
      }}
    >
      <BlinkBlur color="#2f24c5" size="large" text="" textColor="#162042" />
    </div>
  );
};

export default Loading;
