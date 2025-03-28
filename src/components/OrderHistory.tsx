import {
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

export const OrderHistory = () => {
    return (
        <>
        <div></div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
        </>
    )
}