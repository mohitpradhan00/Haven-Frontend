import React, { useState } from "react";
import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        className="rounded-full p-5 bg-white/80 text-black placeholder-gray-500 pr-12"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={togglePassword}
        className="absolute top-1/2 right-4 transform -translate-y-1/2"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      
    </div>
  );
};

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (!password || password !== confirmPassword) {
      toast.error("Password and Confirm Password must match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#4c1d95] to-[#d946ef] ">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-lg bg-white/10 border border-white/30 shadow-2xl rounded-3xl w-[90vw] md:w-[70vw] xl:w-[60vw] grid xl:grid-cols-2 overflow-hidden hover:scale-[1.02] transition-transform duration-500 ease-in-out"
      >
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#4c1d95] to-[#0f172a] text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold drop-shadow-xl">
              Welcome
            </h1>
            <img src={Victory} alt="victory" className="h-[80px]" />
            <p className="font-medium text-center mt-4 text-gray-300">
              Ready to chat ? <br /> Let’s get started!
            </p>
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center w-full p-6">
          <Tabs className="w-full" defaultValue="login">
            <TabsList className="bg-transparent rounded-lg w-full flex">
              <TabsTrigger
                className="w-full text-white border-b-2 rounded-3xl data-[state=active]:border-b-pink-400 data-[state=active]:font-bold p-3"
                value="login"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-white border-b-2 rounded-3xl data-[state=active]:border-b-pink-400 data-[state=active]:font-bold p-3"
                value="signup"
              >
                Signup
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent className="flex flex-col gap-5 mt-8" value="login">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-5 bg-white/80 text-black placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="rounded-full p-5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white transition-all duration-300"
                onClick={handleLogin}
              >
                Login
              </Button>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent className="flex flex-col gap-5 mt-8" value="signup">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-5 bg-white/80 text-black placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                className="rounded-full p-5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white transition-all duration-300"
                onClick={handleSignup}
              >
                Signup
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
