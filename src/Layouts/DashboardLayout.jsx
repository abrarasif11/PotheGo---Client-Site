import React from "react";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  //   const { role, roleLoading } = useUserRole();
  //   if (roleLoading) return <Loader />;
  //   console.log("Current user role:", role);
  //   console.log(role);
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Navbar */}
        <div className="navbar lg:hidden bg-base-300 w-full">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block text-[#FA2A3B] h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 lg:hidden text-[#FA2A3B] flex-1 px-2">Dashboard</div>
        </div>
        {/* Page content here */}
        <Outlet />
        {/* Page content here */}
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Logo */}
          <Link
            to="/"
            className=" font-josefin font-semibold normal-case text-2xl"
          >
            <p className="text-3xl text-[#FA2A3B] font-semibold">potheGo</p>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
