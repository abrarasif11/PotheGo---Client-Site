import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaRoute,
  FaUserCheck,
  FaUserClock,
  FaUserPlus,
  FaUsersCog,
} from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";
import Loader from "../Shared/Loader/Loader";
const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  if (roleLoading) return <Loader />;
  console.log("Current user role:", role);
  console.log(role);
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
          <div className="mx-2 lg:hidden text-[#FA2A3B] flex-1 px-2">
            Dashboard
          </div>
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
          <li>
            <NavLink
              to="/dashboard/myParcels"
              className={({ isActive }) =>
                `flex items-center text-[#FA2A3B] hover:text-[#E02032] mt-10 gap-2 ${
                  isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                }`
              }
            >
              <FaBoxOpen className="w-5 h-5" />
              My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className={({ isActive }) =>
                `flex items-center text-[#FA2A3B] hover:text-[#E02032] mt-5 gap-2 ${
                  isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                }`
              }
            >
              <FaCreditCard className="w-5 h-5" />
              My Payment History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/track"
              className={({ isActive }) =>
                `flex items-center text-[#FA2A3B] hover:text-[#E02032] mt-5 gap-2 ${
                  isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                }`
              }
            >
              <FaRoute className="w-5 h-5" />
              Track Parcel
            </NavLink>
          </li>
          {!roleLoading && role === "rider" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/pendingDeliveries"
                  className={({ isActive }) =>
                    `flex items-center gap-2 mt-5 text-[#FA2A3B] hover:text-[#E02032] ${
                      isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                    }`
                  }
                >
                  <FaClock className="w-5 h-5" />
                  Pending Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/completedDeliveries"
                  className={({ isActive }) =>
                    `flex items-center gap-2 mt-5 text-[#FA2A3B] hover:text-[#E02032] ${
                      isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                    }`
                  }
                >
                  <FaCheckCircle className="w-5 h-5" />
                  Completed Deliveries
                </NavLink>
              </li>
            </>
          )}
          {!roleLoading && role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/activeRiders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 mt-5 text-[#FA2A3B] hover:text-[#E02032] ${
                      isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                    }`
                  }
                >
                  <FaUserCheck className="w-5 h-5" />
                  Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/assignRider"
                  className={({ isActive }) =>
                    `flex items-center gap-2 mt-5 text-[#FA2A3B] hover:text-[#E02032] ${
                      isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                    }`
                  }
                >
                  <FaUserPlus className="w-5 h-5" />
                  Assign Rider
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pendingRiders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 mt-5 text-[#FA2A3B] hover:text-[#E02032] ${
                      isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                    }`
                  }
                >
                  <FaUserClock className="w-5 h-5" />
                  Pending Riders
                </NavLink>
              </li>
              <li>
                {/* Admin Routes */}
                <NavLink
                  to="/dashboard/makeAdmin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 mt-5 text-[#FA2A3B] hover:text-[#E02032] ${
                      isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                    }`
                  }
                >
                  <FaUsersCog className="w-5 h-5" />
                  Manage Admins
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
