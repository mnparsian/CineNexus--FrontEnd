const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, sendOtp, verifyOtp, resetAuthStatus } from "@/features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchUserDetails } from "@/features/authSlice";

export default function AuthSidebar({ open, setOpen, defaultToLogin = true }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token, otpSent, otpVerified } = useSelector((state) => state.auth);
  const [loginToastShown, setLoginToastShown] = useState(false);

  const [isLogin, setIsLogin] = useState(defaultToLogin);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [countryId, setCountryId] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/country`)
      .then((res) => res.json())
      .then((data) => setCountries(data));

    fetch(`${BASE_URL}/api/language`)
      .then((res) => res.json())
      .then((data) => setLanguages(data));
  }, []);

  useEffect(() => {
    if (status === "succeeded" && token) {
      toast.success("You have successfully logged in.");
      /* navigate("/"); */
      dispatch(resetAuthStatus());
    }
  }, [status, token, loginToastShown, dispatch, navigate]);

  // send OTP
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
    dispatch(sendOtp(email))
      .unwrap()
      .then(() => {
        toast("OTP code sent", {
          description: "Please check your email."
        });
      })
      .catch((err) => {
        toast.error("Error sending OTP", {
          description: err?.message || "There was a problem sending the code."
        });
      });
  };

  // confirm OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("You have not entered the OTP code.");
      return;
    }
    dispatch(verifyOtp({ email, otp }))
      .unwrap()
      .then(() => {
        toast.success("The OTP code was successfully verified.");
      })
      .catch((err) => {
        toast.error("Error verifying code", {
          description: err?.message || "The OTP is invalid."
        });
      });
  };

  // login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();
      await dispatch(fetchUserDetails());
      toast.success("Login successful!");
      console.log("Login result:", result);
    } catch (err) {
      toast.error("Login error", {
        description: err || "The username or password is incorrect!"
      });
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (!otpVerified) {
      toast.error("First you need to verify the OTP code.");
      return;
    }
    dispatch(
      registerUser({
        username,
        email,
        password,
        role: "USER",
        name,
        surname,
        country_id: countryId,
        preferredLanguage_id: languageId
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Successful registration", {
          description: "You can now log in to your account."
        });
      })
      .catch((err) => {
        toast.error("Registration error", {
          description: err || "There was a problem with registration."
        });
      });
  };

  useEffect(() => {
    setIsLogin(defaultToLogin);
  }, [defaultToLogin]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* <SheetTrigger className="fixed top-6 left-6 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all dark:bg-gray-700 dark:text-gray-200">
        Login / Sign Up
      </SheetTrigger> */}
      <SheetContent side="left" className="w-96 bg-background text-foreground p-6 ">
        <h1 className="text-foreground text-4xl font-bold mb-6">{isLogin ? "Welcome Back" : "Create an Account"}</h1>
        <p className="text-foreground mb-6 text-lg">{isLogin ? "Login to your account to continue." : "Sign up to join our community."}</p>

        <div className="flex justify-start mb-6 space-x-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-8 py-3 text-lg rounded-full transition-all duration-300 ${
              isLogin ? "bg-blue-500 text-white shadow-lg dark:bg-blue-700" : "bg-gray-700 text-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-8 py-3 text-lg rounded-full transition-all duration-300 ${
              !isLogin ? "bg-green-500 text-white shadow-lg dark:bg-green-700" : "bg-gray-700 text-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 text-lg border rounded-lg bg-muted text-foreground"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-lg border rounded-lg bg-muted text-foreground"
            />
            {status === "failed" && <p className="text-red-500">{error}</p>}
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-lg text-lg hover:bg-blue-600 transition-all dark:bg-blue-700">Login</button>
          </form>
        ) : (
          <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 text-lg bg-muted text-foreground border rounded-lg"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="p-3 text-lg bg-muted text-foreground border rounded-lg"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 text-lg bg-muted text-foreground border rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 text-lg bg-muted text-foreground border rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 text-lg bg-muted text-foreground border rounded-lg"
            />
            <select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
              {countries.map((c) => (
                <option className="bg-muted p-3" key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select value={languageId} onChange={(e) => setLanguageId(e.target.value)}>
              {languages.map((l) => (
                <option className="bg-muted p-3" key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg shadow-lg text-lg hover:bg-yellow-600 transition-all dark:bg-yellow-700"
              >
                Send OTP
              </button>
            ) : !otpVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 text-lg border rounded-lg bg-background text-foreground"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full bg-green-500 text-white py-3 rounded-lg shadow-lg text-lg hover:bg-green-600 transition-all dark:bg-green-700"
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <button className="w-full bg-green-500 text-white py-3 rounded-lg shadow-lg text-lg hover:bg-green-600 transition-all dark:bg-green-700">
                Sign Up
              </button>
            )}
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
