"use client";

import React from "react";

export const ShareButton: React.FC<{ title: string }> = ({ title }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="hover:text-white transition text-gray-400 text-sm"
    >
      Share ↗
    </button>
  );
};
