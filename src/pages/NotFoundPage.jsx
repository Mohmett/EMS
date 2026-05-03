import React from 'react'

const NotFoundPage = () => {
return (
  <div className="flex items-center justify-center min-h-screen bg-white p-4">
    <div className="text-center">
      {/* Visual Icon/Graphic */}
      <div className="mb-6">
        <h1 className="text-9xl font-extrabold text-green-600 tracking-widest">404</h1>
        <div className="bg-white px-2 text-sm rounded rotate-12 absolute -mt-16 ml-24 border border-green-600 text-green-600 font-semibold shadow-sm">
          Sorry saaxiib,
        </div>
      </div>

      {/* Message */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Lost in space?
      </h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved to another URL.
      </p>

      {/* Navigation Button */}
      <a
        href="/"
        className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg transform hover:-translate-y-1"
      >
        Go Back Home
      </a>

      {/* Decorative background element */}
      <div className="mt-12">
        <svg className="w-24 h-24 mx-auto text-gray-200" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);
}

export default NotFoundPage