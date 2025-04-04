import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Email = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);
    console.log("email", email);
  }, []);

  const handleClick = () => {
    localStorage.removeItem("token");
    router.push(`/log-in`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border rounded-full h-full items-center w-[44px] flex justify-center bg-[white]">
          <User />
        </div>
      </DialogTrigger>

      <DialogContent className="w-[250px] p-4 h-[150px]">
        <DialogHeader>
          <DialogTitle>{userEmail}</DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={handleClick} type="submit">
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
