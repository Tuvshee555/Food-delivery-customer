"use client";

export const ProfileHeader = ({ userEmail }: { userEmail: string | null }) => {
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-800">
      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold text-[#facc15]">
        {firstLetter}
      </div>
      <h2 className="mt-3 font-medium text-gray-300 text-sm">{userEmail}</h2>
    </div>
  );
};
