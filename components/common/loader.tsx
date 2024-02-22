import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-5">
        <div className="relative h-24 w-24">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            fill="none"
            color="#004e96"
            className="relative animate-spin"
          >
            <defs>
              <linearGradient id="spinner-secondHalf">
                <stop
                  offset="0%"
                  stopOpacity="0"
                  stopColor="currentColor"
                ></stop>
                <stop
                  offset="100%"
                  stopOpacity="0.5"
                  stopColor="currentColor"
                ></stop>
              </linearGradient>
              <linearGradient id="spinner-firstHalf">
                <stop
                  offset="0%"
                  stopOpacity="1"
                  stopColor="currentColor"
                ></stop>
                <stop
                  offset="100%"
                  stopOpacity="0.5"
                  stopColor="currentColor"
                ></stop>
              </linearGradient>
            </defs>
            <g strokeWidth="8" className="rp-app-circular__stroke">
              <path
                stroke="url(#spinner-secondHalf)"
                d="M 4 100 A 96 96 0 0 1 196 100"
              ></path>
              <path
                stroke="url(#spinner-firstHalf)"
                strokeLinecap="round"
                d="M 196 100 A 96 96 0 0 1 4 100"
              ></path>
            </g>
          </svg>
          <Image
            width={0}
            height={0}
            src="https://app.richpanel.com/img/RichpanelLogoTransaparent.c65006ef.svg"
            alt="Richpanel Logo"
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform"
          />
        </div>
        <p className="text-center text-lg font-medium text-content">
          Loading....
        </p>
      </div>
    </div>
  )
}

export default Loader
