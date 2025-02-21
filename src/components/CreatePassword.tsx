import { ChevronLeft } from "lucide-react";

type CreatePassword = {
  nextStep: () => void
  stepBack: () => void

}

export const CreatePassword = ({nextStep, stepBack}: CreatePassword) => {
  return (
    <>
      <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
        <div className="flex flex-col gap-6 w-[416px]">
          <ChevronLeft
            className="bg-black rounded-[6px]"
            onClick={() => stepBack()}
          />
          <h1 className="text-[24px] font-inter font-600 text-black m-[0]">
            Create a strong password
          </h1>
          <p className="text-[16px] font-inter font-400 text-[#71717a]">
            Create a strong password with letters, numbers.
          </p>
          <input
            className="gap-[8px] text-[#71717b] font-400 border border-2 rounded-[8px] p-[6px]"
            placeholder="Password"
            type="password"
          ></input>
          <input
            className="gap-[8px] text-[#71717b] font-400 border border-2 rounded-[8px] p-[6px]"
            placeholder="Confirm"
            type="password"
          ></input>
          <button className="h-[36px] w-[416px] rounded-[8px] text-[white] bg-[#d1d1d1] hover:bg-black">
            Let's go
          </button>
          <div className="flex gap-3 justify-center">
            <h1 className="text-[16px] text-400 font-inter text-[#71717a]">
              Already have an account?
            </h1>
            <h1 className="text-[16px] text-400 font-inter text-[#2762ea]">
              Log in
            </h1>
          </div>
        </div>
        <img src="./deliverM.png" className="w-[860px] h-[900px]" />
      </div>
    </>
  );
};
