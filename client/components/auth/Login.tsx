import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, AppState } from "../store/store";
import { setCreated, userAsync } from "../store/user";
import { userStateType } from "@/types/types";
import ButtonLoading from "../spinners/buttonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const { created, error, isLoading } = useSelector<AppState>(
    (state) => state.user
  ) as userStateType;

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function submitHandler(e: FormEvent) {
    e.preventDefault();

    try {
      if (email && password) {
        await dispatch(userAsync({ email, password }));
      }
      else throw new Error("All fields are required!");
    }
    catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (error !== '') toast.error(error)
    else if (created) {
      dispatch(setCreated())
      router.push("/dashboard");
      toast.success("Login Successfull!", { id: 'login' });
    }
  }, [error, created]);

  return (
    <>
      <form action="" onSubmit={submitHandler} method="POST">
        <div className="flex flex-col">
          <label htmlFor="email" className="my-3">
            Email<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter your email"
            required
            className="p-4 bg-slate-100 text-slate-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col relative">
          <label htmlFor="pass" className="my-3">
            Password<span className="text-red-500"> *</span>
          </label>
          <div className="flex justify-between bg-slate-100 pe-4">
            <input
              type={showPassword ? 'text' : 'password'}
              name="pass"
              id="pass"
              placeholder="Enter your Password"
              className="p-4 bg-slate-100 text-slate-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required />
            <button
              type="button"
              className=""
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="text-gray-500 cursor-pointer"
              />
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className={`bg-[#5a51be] text-stone-100 rounded-sm w-full text-lg font-semibold my-4 py-2 cursor-${isLoading ? "not-allowed" : "pointer"
              }`}
          >
            {isLoading ? <ButtonLoading /> : "Login"}
          </button>
        </div>
      </form>
      <p className="text-stone-500 underline cursor-pointer">
        Forgot Password?
      </p>
    </>
  );
};

export default Login;
