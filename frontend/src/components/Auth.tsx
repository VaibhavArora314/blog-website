import { SignupInput } from "@vaibhav314/blog-common";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [formInputs, setFormInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error,setError] = useState("");

  const handleSubmit = async () => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, formInputs);
        const jwt = response.data?.token;
        localStorage.setItem("token", jwt);
        navigate("/blogs");
    } catch (error) {
      const axiosError = error as AxiosError<{error: string}>
      console.log(axiosError.response?.data?.error);
        setError(axiosError.response?.data?.error || "");
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col max-w-lg mx-auto px-4">
      <div className="px-10">
          <div className="text-3xl font-extrabold text-center">
            {type === "signup" ? "Create an account" : "Login to your account"}
          </div>
          <div className="text-slate-400 mb-4 text-center">
            {type === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              to={type == "signin" ? "/signup" : "/signin"}
              className="underline"
            >
              {type == "signin" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
      </div>
      <div className="pt-8">
        {type === "signup" && <LabelledInput
          label="Name"
          placeholder="John Doe"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormInputs((val) => ({
              ...val,
              name: e.target.value,
            }));
          }}
        />}
        <LabelledInput
          type="email"
          label="Email"
          placeholder="john@email.com"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormInputs((val) => ({
              ...val,
              email: e.target.value,
            }));
          }}
        />
        <LabelledInput
          type="password"
          label="Password"
          placeholder="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormInputs((val) => ({
              ...val,
              password: e.target.value,
            }));
          }}
        />
        <p className="text-md font-semibold text-red-500 text-center">{error}</p>
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          {type == "signin" ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LabelledInput = ({
  label,
  placeholder,
  onChange,
  type = "text",
}: LabelledInputType) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={label}
        className="block mb-2 text-md font-medium text-gray-900 text-semibold"
      >
        {label}
      </label>
      <input
        type={type}
        id={label}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default Auth;
