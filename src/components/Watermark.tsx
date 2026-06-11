"use client";

import React from "react";

export const Watermark: React.FC = () => {
  return (
    <div className="absolute bottom-12 right-12 opacity-5 pointer-events-none z-0">
      <img
        src="/Santrix_logo.jpeg"
        className="w-48 h-48 filter grayscale"
        alt="Sanktrix Corporate Watermark"
      />
    </div>
  );
};
export default Watermark;
