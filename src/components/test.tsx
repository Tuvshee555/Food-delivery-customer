// import axios from "axios";
// import { ChevronLeft } from "lucide-react";
// import { useState } from "react";

// export default function LogIn() {
//   const [emailValue, setEmailValue] = useState("");
//   const [passwordValue, setPasswordValue] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const LogIn = async () => {
//     try {
//       const response = await axios.post("http://localhost:4000/login", {
//         email: emailValue,
//         password: passwordValue,
//       });

//       console.log("Login successful:", response.data);
//     } catch (error) {
//       console.error("Login failed:", error);
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <>
//       <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
//         <div className="flex flex-col gap-6 w-[416px]">
//           <ChevronLeft className="bg-black rounded-[6px] hover:cursor-pointer" />
//           <h1 className="text-[24px] font-inter font-800 text-black m-[0]">
//             Log in
//           </h1>
//           <p className="text-[16px] font-inter font-400 text-[#71717a]">
//             Log in to enjoy your favorite dishes.
//           </p>
          
//           {/* Email Input */}
//           <input
//             className="gap-[8px] text-[#71717b] font-400 border border-2 rounded-[8px] p-[6px]"
//             placeholder="Enter your email address"
//             type="email"
//             value={emailValue}
//             onChange={(e) => setEmailValue(e.target.value)}
//           />

//           {/* Password Input */}
//           <input
//             className="gap-[8px] text-[#71717b] font-400 border border-2 rounded-[8px] p-[6px]"
//             placeholder="Password"
//             type="password"
//             value={passwordValue}
//             onChange={(e) => setPasswordValue(e.target.value)}
//           />

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <p className="text-[14px] font-400 underline text-[black] hover:text-[red] cursor-pointer">
//             Forgot your password?
//           </p>

//           {/* Login Button */}
//           <button
//             className="h-[36px] w-[416px] rounded-[8px] text-white bg-[#d1d1d1] hover:bg-black"
//             onClick={LogIn}
//           >
//             Log In
//           </button>

//           <div className="flex gap-3 justify-center">
//             <h1 className="text-[16px] text-400 font-inter text-[#71717a]">
//               Don't have an account?
//             </h1>
//             <h1 className="text-[16px] text-400 font-inter text-[#2762ea] hover:cursor-pointer">
//               Sign up
//             </h1>
//           </div>
//         </div>
//         <img src="./deliverM.png" className="w-[860px] h-[900px]" />
//       </div>
//     </>
//   );
// }
