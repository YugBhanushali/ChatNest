import React from "react";
import { ModeToggle } from "./ModeToggle";
import { IoIosChatbubbles } from "react-icons/io";

const Navbar = () => {
  return (
    <div className="flex w-[98%] justify-between p-2 items-center m-2 mx-3 border rounded-lg ">
      <div className="flex justify-center items-center gap-x-2 text-[23px] font-bold ml-2">
        <span>
          <IoIosChatbubbles size={23} />
        </span>
        ChatNest
      </div>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
