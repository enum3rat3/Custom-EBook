import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl font-semibold">E-Book </h2>
        <p className="text-sm mt-2">Your one-stop destination for digital books.</p>

        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="text-gray-400 hover:text-white text-2xl">
            <FaFacebook />
          </a>
          <a href="#" className="text-gray-400 hover:text-white text-2xl">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-400 hover:text-white text-2xl">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-400 hover:text-white text-2xl">
            <FaLinkedin />
          </a>
        </div>

        {/* <nav className="mt-4">
          <ul className="flex justify-center gap-6 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Categories</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </nav> */}

        <p className="text-xs mt-4">&copy; {new Date().getFullYear()} E-Book. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
