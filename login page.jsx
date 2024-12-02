import React from "react";

function RegisterButton() {
  return (
    <button className="flex flex-col justify-center items-center px-20 py-5 mt-7 text-center rounded-md bg-[linear-gradient(270deg,#3498DB_0.09%,#31B2A6_59.04%,#2ECC71_99.73%)] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col max-w-full w-[153px]">
        <span className="self-start text-black">Register Account</span>
        <span className="z-10 self-end mt-0 text-white">Register Account</span>
      </div>
    </button>
  );
}

export default RegisterButton;