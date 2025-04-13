import * as React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Home = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const handleExploreButton = () => {
    navigate("/books");
  };

  const handleMyOrderBooks = () => {
    if (!keycloak?.authenticated) {
      toast.info("Login First!!");
    }
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f1f5f9] text-black font-sans">
      {/* Hero Section */}
      <section className=" py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Start Reading Smarter - Anytime, Anywhere
          </h1>
          <p className="text-lg md:text-xl mb-8 ">
            Find your next great read, explore new authors, and enjoy books in
            chunks
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-[#1F2937] text-white font-semibold px-6 py-3 rounded-2xl shadow-md hover:bg-gray-700 transition"
              onClick={handleExploreButton}
            >
              Explore Books
            </button>
            <button
              className="bg-[#1F2937] hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition"
              onClick={handleMyOrderBooks}
            >
              View My Orders
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-[#f1f5f9] to-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">
            Tools for Every Consumer
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-2xl border border-indigo-300 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">Simple Exploring</h3>
              <p className="text-gray-600">
                Preview new books, read in chunks, and dive into stories
                seamlessly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-indigo-300 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">Flexible Reading</h3>
              <p className="text-gray-600">
                Read books in small chunks—perfect for your busy schedule.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-indigo-300 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">
                Connect With Authors
              </h3>
              <p className="text-gray-600">
                Build your contact and interact with authors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className=" py-16 text-black text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Start Creating Your eBooks Today!
        </h2>
        <p className="mb-6">
        Join a community of book lovers and start reading today!
        </p>
        <button
          className="bg-[#1F2937] text-white font-semibold px-6 py-3 rounded-2xl shadow hover:bg-gray-700 transition"
          onClick={handleExploreButton}
        >
          Explore Now
        </button>
      </section>
    </div>
  );
};

export default Home;
