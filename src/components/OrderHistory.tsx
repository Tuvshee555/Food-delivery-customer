import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { toast } from "sonner";

type UserType = {
  userId: string;
};

export const OrderHistory = () => {
  const [order, setOrder] = useState("");
  const token = localStorage.getItem("token");
  const { decodedToken, isExpired } = useJwt<UserType>(token as string);
  console.log(decodedToken);

  const getOrder = async () => {
    try {
      console.log(decodedToken?.userId);
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }
      if (isExpired) {
        toast.error("Session expired. Please log in again.");
        return;
      }
      const response = await axios.get(
        `http://localhost:4000/order/${decodedToken?.userId}`
      );
      setOrder(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOrder();
  }, []);
  return (
    <>
      <div></div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
};
