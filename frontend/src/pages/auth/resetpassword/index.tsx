function ResetPassword() {
  return (
    <div
      className={` dark:bg-zinc-800 bg-white text-zinc-800 dark:text-zinc-100 w-full flex flex-col items-center justify-center h-screen`}
    >
      <h1 className="text-2xl font-bold text-center">Reset Password</h1>
      <p className="text-center mt-4">Enter your new password.</p>
      <form className="flex flex-col gap-3 w-full max-w-sm mx-auto mt-5">
        <label htmlFor="password" className="rounded-2xl">
          New Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          className={`outline-none border-2 rounded-md p-2 w-full border-zinc-400 `}
        />
        <label htmlFor="confirmPassword" className="rounded-2xl">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="********"
          className={`outline-none border-2 rounded-md p-2 w-full border-zinc-400 `}
        />
        <button
          type="submit"
          className={
            " rounded-md p-2 mt-3 transition duration-200 text-md  dark:bg-zinc-100 bg-zinc-800 text-zinc-100 dark:text-zinc-800"
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
