import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showSuccessToast, showErrorToast } from "@/components/toasts";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin } from "@/redux/slices/admin";
import { startLoading, setLoading, stopLoading } from "@/redux/slices/loading";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (values: { email: string; password: string }) => {
    dispatch(startLoading());
    try {
      const response = await axios.post(
        "http://localhost:5001/taskMate/admin/signin",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.status === 200) {
        const { _id, name, email } = response.data.admin;
        dispatch(
          setAdmin({
            admin: { id: _id, name, email },
            token: response.data.token,
            isLoggedIn: true,
          })
        );
        localStorage.setItem("adminToken", response.data.token);
        dispatch(stopLoading());
        showSuccessToast("Login successful");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      dispatch(stopLoading());
      showErrorToast("Login failed");
    }
  };

  return (
    <div
      className={` dark:bg-zinc-800 bg-white text-zinc-800 dark:text-zinc-100 w-full h-screen flex justify-center items-center`}
    >
      <div
        className={` flex flex-col w-[50%] h-full  dark:bg-zinc-800 bg-[#EEEEEE] text-zinc-800 dark:text-zinc-100rounded-md p-10 gap-4 items-center justify-center`}
      >
        <div className="border-zinc-400 rounded-2xl p-10 flex flex-col gap-4 items-start w-full max-w-md  dark:bg-zinc-800 bg-white text-zinc-800 dark:text-zinc-100">
          <h2 className={`font-semibold text-4xl `}>Login</h2>
          <p className={`text-md `}>Welcome back! Please enter your details</p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col gap-3 w-full">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`outline-none border-2 rounded-md p-2 w-full ${errors.email && touched.email
                    ? "border-red-500"
                    : "border-zinc-400"
                    }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <label htmlFor="password">Password</label>
                <div className="relative w-full">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className={`outline-none border-2 rounded-md p-2 w-full ${errors.password && touched.password
                      ? "border-red-500"
                      : "border-zinc-400"
                      }`}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-zinc-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <div className="flex justify-end w-full">
                  <button
                    onClick={() => {
                      window.location.href = "/forgot-password";
                    }}
                    className={`  dark:bg-zinc-800 bg-white text-zinc-800 dark:text-zinc-100 cursor-pointer flex items-end  font-semibold text-sm hover`}
                  >
                    Forget Password
                  </button>
                </div>

                <button
                  type="submit"
                  className={`  dark:bg-white bg-zinc-800 hover:bg-zinc-600 text-white dark:hover:bg-zinc-200 dark:text-zinc-800 font-semibold w-full rounded-md p-3 `}
                >
                  Sign In
                </button>
                <div className="flex mt-1 justify-center items-center gap-2 w-full">
                  <p className={`text-sm`}>Don't have an account?</p>
                  <button
                    onClick={() => {
                      window.location.href = "/signup";
                    }}
                    className={`  dark:bg-zinc-800 bg-white text-zinc-800 dark:text-zinc-100 cursor-pointer flex items-end  font-semibold text-sm hover`}
                  >
                    Sign Up
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className={`w-[50%] h-screen flex justify-center items-center flex-col gap-4`}>
        <div className=" rounded-md flex items-center justify-center">
          <img
            src="src/assets/taskMate_3.jpeg"
            alt="taskMate"
            title="taskMate"
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default SignIn;
