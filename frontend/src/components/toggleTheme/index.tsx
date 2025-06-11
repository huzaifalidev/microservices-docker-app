// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";

// interface ThemeContextType {
//   theme: "light" | "dark";
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// interface ThemeProviderProps {
//   children: ReactNode;
// }

// export const ThemeProvider = ({ children }: ThemeProviderProps) => {
//   const [theme, setTheme] = useState<"light" | "dark">(() => {
//     return (localStorage.getItem("theme") as "light" | "dark") || "light";
//   });

//   useEffect(() => {
//     document.documentElement.classList.remove("light", "dark");
//     document.documentElement.classList.add(theme);
//     localStorage.setItem("theme", theme);
//     localStorage.setItem(
//       "textColor",
//       theme === "light" ? "text-zinc-800" : "text-white"
//     );
//     localStorage.setItem(
//       "bgColor",
//       theme === "light" ? "bg-zinc" : "bg-zinc-800"
//     );
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = (): ThemeContextType => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// };

// export const themeStyles = (theme: "light" | "dark") => {
//   if (theme === "light") {
//     return {
//       textColor: "text-zinc-800",
//       bgColor: "bg-white",
//     };
//   } else {
//     return {
//       textColor: "text-white",
//       bgColor: "bg-zinc-800",
//     };
//   }
// };
