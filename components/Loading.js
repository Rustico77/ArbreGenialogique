"use client"

import { useState } from "react";

export default function Loading({ title }){
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-medium text-lg animate-pulse">
            {title}...
          </p>
        </div>
      </div>
    );
}