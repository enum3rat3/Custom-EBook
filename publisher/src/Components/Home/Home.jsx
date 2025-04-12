import * as React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

const Home = () => {
    const { keycloak } = useKeycloak()
    const navigate=useNavigate();
    const handlePublishButton=()=>{

        if(!keycloak?.authenticated){
          toast.info("Login First!!")
        }

        navigate("/publish")

        
    }

    const handleViewBooks=()=>{
      if(!keycloak?.authenticated){
        toast.info("Login First!!")
      }
      navigate("/my-books")
    }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-[#f1f5f9] text-black font-sans'>
      {/* Hero Section */}
      <section className=' py-20 px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg'>
            Publish Your eBooks With Ease
          </h1>
          <p className='text-lg md:text-xl mb-8 '>
            Reach thousands of readers, manage your content, and grow your
            author brand.
          </p>
          <div className='flex justify-center gap-4'>
            <button className='bg-[#1F2937] text-white font-semibold px-6 py-3 rounded-2xl shadow-md hover:bg-gray-700 transition' onClick={handlePublishButton}>
              Publish Book
            </button>
            <button className='bg-[#1F2937] hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition' onClick={handleViewBooks}>
               View My Books
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-gradient-to-b from-[#f1f5f9] to-white py-20 px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-12 text-gray-900'>
            Tools for Every Publisher
          </h2>
          <div className='grid md:grid-cols-3 gap-10'>
            <div className='bg-white p-6 rounded-2xl border border-indigo-300 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105'>
              <h3 className='text-xl font-semibold mb-4'>Simple Publishing</h3>
              <p className='text-gray-600'>
                Easily upload, format, and publish your books with our
                user-friendly tools.
              </p>
            </div>
            <div className='bg-white p-6 rounded-2xl border border-indigo-300 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105'>
              <h3 className='text-xl font-semibold mb-4'>Create Chunks</h3>
              <p className='text-gray-600'>
                Divide Book into multiple Chunks, set dynamic price for each
                chunk
              </p>
            </div>
            <div className='bg-white p-6 rounded-2xl border border-indigo-300 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105'>
              <h3 className='text-xl font-semibold mb-4'>
                Connect With Readers
              </h3>
              <p className='text-gray-600'>
                Build your audience and interact with readers who love your
                work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className=' py-16 text-black text-center px-6'>
        <h2 className='text-3xl font-bold mb-4'>
          Start Publishing Your eBooks Today!
        </h2>
        <p className='mb-6'>
          Join a growing community of passionate authors and publishers.
        </p>
        <button className='bg-[#1F2937] text-white font-semibold px-6 py-3 rounded-2xl shadow hover:bg-gray-700 transition' onClick={handlePublishButton}>
          Publish Now
        </button>
      </section>
    </div>
  )
}

export default Home
