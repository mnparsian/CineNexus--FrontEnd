import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const movies = useSelector((state) => state.movies.list);

  const texts = [
    "Discover new movies and TV shows.",
    "Join a community of cinephiles.",
    "Rate and review your favorite films.",
    "Personalized recommendations just for you."
  ];

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(imageInterval);
  }, [movies]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900">
      {/* Left Side: Login/Register Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-start items-start px-20 py-16 text-white">
        <h1 className="text-6xl font-extrabold mb-6">{isLogin ? "Welcome Back" : "Create an Account"}</h1>
        <p className="text-gray-300 mb-6 text-lg">{isLogin ? "Login to your account to continue." : "Sign up to join our community."}</p>

        <div className="flex justify-start mb-6 space-x-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-8 py-3 text-lg rounded-full transition-all duration-300 ${
              isLogin ? "bg-blue-500 text-white shadow-lg" : "bg-gray-700 text-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-8 py-3 text-lg rounded-full transition-all duration-300 ${
              !isLogin ? "bg-green-500 text-white shadow-lg" : "bg-gray-700 text-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="relative w-full max-w-lg">
          <Transition
            show={isLogin}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500 absolute top-0 left-0 w-full"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <form className="flex flex-col space-y-6">
              <input type="email" placeholder="Email" className="w-full p-4 text-lg border rounded-lg bg-gray-800 text-white" />
              <input type="password" placeholder="Password" className="w-full p-4 text-lg border rounded-lg bg-gray-800 text-white" />
              <button className="w-full bg-blue-500 text-white py-4 rounded-lg shadow-lg text-lg hover:bg-blue-600 transition-all">Login</button>
            </form>
          </Transition>

          <Transition
            show={!isLogin}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500 absolute top-0 left-0 w-full"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <form className="flex flex-col space-y-6">
              <div className="flex space-x-6">
                <input type="text" placeholder="First Name" className="w-1/2 p-4 text-lg border rounded-lg bg-gray-800 text-white" />
                <input type="text" placeholder="Last Name" className="w-1/2 p-4 text-lg border rounded-lg bg-gray-800 text-white" />
              </div>
              <input type="email" placeholder="Email" className="w-full p-4 text-lg border rounded-lg bg-gray-800 text-white" />
              <input type="password" placeholder="Password" className="w-full p-4 text-lg border rounded-lg bg-gray-800 text-white" />
              <button className="w-full bg-green-500 text-white py-4 rounded-lg shadow-lg text-lg hover:bg-green-600 transition-all">Sign Up</button>
            </form>
          </Transition>
        </div>

        {/* Animated Text Section */}
        <div className="mt-8 text-center text-lg font-semibold text-gray-300 h-8 overflow-hidden">
          <Transition
            show={true}
            enter="transition-opacity duration-700"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-700"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <p key={currentText} className="absolute">
              {texts[currentText]}
            </p>
          </Transition>
        </div>
      </div>

      {/* Right Side: Double Movie Slider */}
      <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden flex-col space-y-4">
        <Carousel className="w-full h-1/2">
          <CarouselContent className="absolute inset-0 flex items-center justify-center ">
            {movies.length > 0 && (
              <img
                src={`https://image.tmdb.org/t/p/w780${movies[currentImage].posterUrl}`}
                alt={movies[currentImage].title}
                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              />
            )}
          </CarouselContent>
        </Carousel>
        <Carousel className="w-full h-1/2">
          <CarouselContent className="absolute inset-0 flex items-center justify-center">
            {movies.length > 0 && (
              <img
                src={`https://image.tmdb.org/t/p/w780${movies[(currentImage + 1) % movies.length].posterUrl}`}
                alt={movies[(currentImage + 1) % movies.length].title}
                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              />
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
