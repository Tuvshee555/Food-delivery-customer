"use client";

// import { PostUser } from "@/components/PostUser";
import axios from "axios";
import { useEffect, useState } from "react";
import QPayPage from "./qpay/page";

export default function Home() {
  const [loading, setloading] = useState(true);

  const GetData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`
      );
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
      {/* <PostUser /> */}
      <QPayPage
      // qr_text={
      //   "0002010102121531279404962794049600251110256214527540014A00000084300010108AGMOMNUB0220WmBlzu94JSlfXdZcYOA0520447895303496540420005802MN5920GANTURTUVSHINSAIKHAN6011ULAANBAATAR62240720WmBlzu94JSlfXdZcYOA07106QPP_QR78150142216047724147902228002016304A6E4"
      // }
      />
    </>
  );
}

// qr_text={
//   "0002010102121531279404962794049600251110221497927540014A00000084300010108AGMOMNUB0220Suj4Dt8wZg8my1h0Viz0520447895303496540420005802MN5920GANTURTUVSHINSAIKHAN6011ULAANBAATAR62240720Suj4Dt8wZg8my1h0Viz07106QPP_QR78155003831318291657902228002016304C4B4"
// }
