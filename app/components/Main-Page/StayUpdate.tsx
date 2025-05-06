import React from 'react'

export default function StayUpdate() {
  return (
    <div>
<section className="bg-gray-900 w-[100%] text-white py-16">
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
      <p className="text-gray-300 mb-8">
        Subscribe to our newsletter for the latest reviews, news, and
        updates
      </p>
      <div className="flex max-w-md mx-auto">
        <input type="email" placeholder="Enter your email" className="flex-1 !rounded-button rounded-r-none px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-custom" />
        <button className="!rounded-button rounded-l-none bg-custom px-6 py-3 font-medium hover:bg-blue-700">
          Subscribe
        </button>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}
