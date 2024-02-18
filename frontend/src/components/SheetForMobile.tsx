import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "./SideBar";
import { MdGroups } from "react-icons/md";

const SheetForMobile = () => {
  return (
    <Sheet>
      <SheetTrigger className="p-0 m-0">
        <div className="p-2 border rounded-md hover:bg-secondary mr-2">
          <MdGroups />
        </div>
      </SheetTrigger>
      <SheetContent className="p-1" side={"left"}>
        {/* <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader> */}
        <SideBar />
      </SheetContent>
    </Sheet>
  );
};

export default SheetForMobile;
