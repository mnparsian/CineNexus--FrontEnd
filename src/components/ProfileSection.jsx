const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, updateUserProfile, uploadProfileImage } from "../features/authSlice";
import ChangePassword from "./ChangePassword";
import { Link } from "react-router-dom";

const ProfileSection = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      setFormData(user);
      setSelectedLanguage(user.preferredLanguage || "");
      setSelectedCountry(user.country || "");
      setPreview(user.profileImage || "/default-profile.jpg");
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchUserDetails());

    fetch(`${BASE_URL}/api/language`)
      .then((res) => res.json())
      .then((data) => setLanguages(data));

    fetch(`${BASE_URL}/api/country`)
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      username: user.username,
      email: user.email,
      role: user.role,
      name: formData.name,
      surname: formData.surname,
      bio: formData.bio || "",
      profileImage: formData.profileImage || "default.jpg",
      birthday: formData.birthday,
      preferredLanguage_id: languages.find((lang) => lang.name === selectedLanguage)?.id || null,
      country_id: countries.find((ctry) => ctry.name === selectedCountry)?.id || null,
      phoneNumber: formData.phoneNumber || ""
    };

    dispatch(updateUserProfile(formattedData));
  };

  const handleUpload = async () => {
    if (!image) return;
    const formDataImage = new FormData();
    formDataImage.append("file", image);

    try {
      const response = await dispatch(uploadProfileImage({ userId: user.id, file: formDataImage }));

      if (response.payload) {
        const newImageUrl = response.payload;
        setFormData((prev) => ({
          ...prev,
          profileImage: newImageUrl
        }));
        setPreview(newImageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="p-6 bg-card text-foreground rounded-lg shadow-lg max-w-3xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">👤 Profile Settings</h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6 border-b border-gray-700 pb-2">
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            activeTab === "profile" ? "bg-blue-600 text-white border-b-4 border-blue-500" : "bg-muted text-foreground"
          } rounded-t-md`}
          onClick={() => setActiveTab("profile")}
        >
          Edit Profile
        </button>
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            activeTab === "password" ? "bg-blue-600 text-white border-b-4 border-blue-500" : "bg-muted text-foreground"
          } rounded-t-md`}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {/* Content */}
      {activeTab === "profile" && (
        <>
          {/* Image Upload */}
          <div className="min-[640px]:flex items-center gap-6 mb-6">
            <Link to={`/profile/${user.id}`}>
              <img src={preview} alt="Profile" className="w-24 h-24 rounded-full border-2 border-blue-400" />
            </Link>
            <div className="flex flex-col">
              <input type="file" onChange={handleImageChange} className="bg-background border-border text-foreground text-sm mb-2" />
              <button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Upload
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Email:</label>
              <input type="email" value={formData.email || ""} disabled className="w-full p-2 rounded bg-muted text-foreground" />
            </div>
            <div>
              <label>Role:</label>
              <input type="text" value={formData.role || ""} disabled className="w-full p-2 rounded bg-muted text-foreground" />
            </div>
            <div>
              <label>First Name:</label>
              <input type="text" name="name" value={formData.name || ""} onChange={handleChange} className="w-full p-2 rounded bg-muted text-foreground" />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="surname"
                value={formData.surname || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-muted text-foreground"
              />
            </div>
            <div className="sm:col-span-2">
              <label>Bio:</label>
              <textarea name="bio" value={formData.bio || ""} onChange={handleChange} className="w-full p-2 rounded bg-muted text-foreground"></textarea>
            </div>
            <div>
              <label>Birthday:</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-muted text-foreground"
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-muted text-foreground"
              />
            </div>
            <div>
              <label>Language:</label>
              <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full p-2 rounded bg-muted text-foreground">
                <option value="">Choose</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Country:</label>
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full p-2 rounded bg-muted text-foreground">
                <option value="">Choose</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700 transition">
                Save Changes
              </button>
            </div>
          </form>
        </>
      )}

      {activeTab === "password" && <ChangePassword />}
    </div>
  );
};

export default ProfileSection;
