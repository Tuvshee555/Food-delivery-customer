"use client";


import { PostUser } from "@/components/PostUser";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setloading] = useState(true);

  const GetData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/user");
      console.log(response);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  if (loading)
    return (
      <div className="flex jusitfy-center items-center text-[30px] text-[white]">
        loading...
      </div>
    );

  return (
    <>
      <PostUser />
    </>
  );
}
