import React from "react";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <section className="">
      <Header />
      <div className="content min-h-screen  bg-[#262627] text-white">
        <Outlet />
      </div>
    </section>
  );
}

export default AppLayout;
