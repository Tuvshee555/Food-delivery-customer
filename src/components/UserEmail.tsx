import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

export const UserEmail = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);
    console.log("email",email);
    
  }, []);

  const handleClick = () => {
    localStorage.removeItem("token");  
    // localStorage.removeItem("email");  
    window.location.reload(); 
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
          {/* <DialogDescription>
            {userEmail ? (
              <p>Your email: {userEmail}</p>
            ) : (
              <p>No email found</p> 
            )}
          </DialogDescription> */}
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
