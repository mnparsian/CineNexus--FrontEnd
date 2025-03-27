import { useState } from "react";
import { Transition } from "@headlessui/react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-center mb-4">
        <button onClick={() => setIsLogin(true)} className={`px-4 py-2 ${isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          Login
        </button>
        <button onClick={() => setIsLogin(false)} className={`px-4 py-2 ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          Signup
        </button>
      </div>

      <Transition
        show={isLogin}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-lg font-bold mb-2">Login</h2>
          <input type="email" placeholder="email" className="w-full p-2 mb-2 border rounded" />
          <input type="password" placeholder="password" className="w-full p-2 mb-2 border rounded" />
          <button className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
        </div>
      </Transition>

      <Transition
        show={!isLogin}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-lg font-bold mb-2">Signup</h2>
          <input type="text" placeholder="نام" className="w-full p-2 mb-2 border rounded" />
          <input type="email" placeholder="ایمیل" className="w-full p-2 mb-2 border rounded" />
          <input type="password" placeholder="رمز عبور" className="w-full p-2 mb-2 border rounded" />
          <button className="w-full bg-green-500 text-white py-2 rounded">signup</button>
        </div>
      </Transition>
    </div>
  );
}
