import React from 'react'

const Home = () => {
  return (
    <div className='min-h-screen bg-white text-gray-800 font-sans'>
      <section className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white py-20 px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>
            Discover, Read, and Publish eBooks Effortlessly
          </h1>
          <p className='text-lg md:text-xl mb-8'>
            A modern platform for authors and readers to connect, share, and
            explore.
          </p>
          <div className='flex justify-center gap-4'>
            <button className='bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl shadow hover:bg-gray-100 transition'>
              Explore Books
            </button>
            <button className='bg-indigo-700 font-semibold px-6 py-3 rounded-2xl shadow hover:bg-indigo-800 transition'>
              Publish Now
            </button>
          </div>
        </div>
      </section>

      <section className='py-20 px-6 bg-gray-50'>
        <div className='max-w-6xl mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-12'>Why Choose Us?</h2>
          <div className='grid md:grid-cols-3 gap-10'>
            <div className='bg-white p-6 rounded-2xl shadow hover:shadow-lg transition'>
              <h3 className='text-xl font-semibold mb-4'>Huge Library</h3>
              <p>
                Access thousands of free and premium eBooks across all genres.
              </p>
            </div>
            <div className='bg-white p-6 rounded-2xl shadow hover:shadow-lg transition'>
              <h3 className='text-xl font-semibold mb-4'>Author Friendly</h3>
              <p>
                Easy-to-use tools for writers to publish and track their works.
              </p>
            </div>
            <div className='bg-white p-6 rounded-2xl shadow hover:shadow-lg transition'>
              <h3 className='text-xl font-semibold mb-4'>Secure & Fast</h3>
              <p>Safe and fast reading experience on all your devices.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 bg-indigo-600 text-white text-center px-6'>
        <h2 className='text-3xl font-bold mb-4'>
          Start Your eBook Journey Today!
        </h2>
        <p className='mb-6'>
          Join a thriving community of readers and authors.
        </p>
        <button className='bg-white text-indigo-600 font-semibold px-6 py-3 rounded-2xl shadow hover:bg-gray-100 transition'>
          Get Started
        </button>
      </section>
    </div>
  )
}

export default Home
