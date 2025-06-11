import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showSuccessToast, showErrorToast } from "@/components/toasts";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(25, "Name must be at most 25 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /^(?=.*[!@#$%^&*()\-_=+{};:,<.>/?\\[\]|`~])/,
      "Password must contain at least one special character"
    ),
});

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      console.log(values);
      const response = await axios.post(
        "http://localhost:5001/taskMate/admin/signup",
        {
          email: values.email,
          password: values.password,
          name: values.name,
        }
      );
      if (response.status === 200) {
        showSuccessToast("Sucess");
        setTimeout(() => {
          window.location.href = "/signin";
        }, 4000);
      }
    } catch (error: any) {
      if (error.response.data.status === 409) {
        showErrorToast("Email already exists");
      } else {
        showErrorToast("Failed");
      }
    }
  };

  return (
    <div
      className={` dark:bg-zinc-800  text-zinc-800 dark:text-zinc-100 w-full h-screen flex justify-center items-center`}
    >
      <div className={`w-[50%] h-screen flex justify-center items-center  `}>
        <div className="w-full rounded-md flex items-center justify-center">
          <img
            src="src/assets/taskMate_1.jpeg"
            alt="taskMate"
            title="taskMate"
          />
        </div>
      </div>
      <div
        className={` flex flex-col w-[50%] h-full  dark:bg-zinc-800  bg-[#EEE6D9] text-zinc-800 dark:text-zinc-100 rounded-md p-10 gap-4 items-center justify-center`}
      >
        <div className="border-zinc-400 rounded-2xl p-10 flex flex-col gap-4 items-start w-full max-w-md  dark:bg-zinc-800 bg-white text-zinc-800 dark:text-zinc-100">
          <h2 className={`font-semibold text-4xl `}>Sign Up</h2>
          <p className={`text-md `}>Create your account.</p>

          <Formik
            initialValues={{ email: "", password: "", name: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col gap-3 w-full">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Name"
                  className={`outline-none border-2 rounded-md p-2 w-full ${errors.name && touched.name
                    ? "border-red-500"
                    : "border-zinc-400"
                    }`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
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
                      window.location.href = "/signin";
                    }}
                    className={`  dark:bg-zinc-800 bg-white text-zinc-800 dark:text-zinc-100 cursor-pointer flex items-end  font-semibold text-sm hover`}
                  >
                    Already have an account? Sign In
                  </button>
                </div>

                <button
                  type="submit"
                  className={`  dark:bg-white dark:hover:bg-zinc-200 bg-zinc-800 text-white hover:bg-zinc-600 dark:text-zinc-800 font-semibold w-full rounded-md p-3 `}
                >
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default SignUp;
