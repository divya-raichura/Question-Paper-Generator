import { FC, useEffect, useState } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../firebase/contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Generate", href: "/generate", current: false },
  { name: "Questions", href: "/questions", current: false },
  { name: "Subjects", href: "/subjects", current: false },
];
const unauthNavigation = [{ name: "Log In", href: "/login", current: false }];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(navigation[0].name);

  const nav = window.location.href;

  useEffect(() => {
    if (nav.includes("questions")) {
      setActiveTab("Questions");
    }
    if (nav.includes("generate")) {
      setActiveTab("Generate");
    }
  }, [nav]);

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error: any) {
      console.log("log out error: ", error);
      notifications.show({
        title: "Error",
        message: "Failed to log out",
        color: "red",
      });
    }
  }

  if (!currentUser) {
    return (
      <Disclosure as="nav" className="">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-20 items-center justify-between">
                <div className="cursor-pointer" onClick={() => navigate("/")}>
                  <span className="text-cyan-600 hover:underline text-3xl font-bold tracking-wider">
                    QPG
                  </span>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {unauthNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? " text-cyan-500 bg-gray-700"
                            : "text-slate-300 hover:text-white hover:bg-gray-700",
                          "rounded-3xl px-4 py-2 text-sm font-medium tracking-wide"
                        )
                      }
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {unauthNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-bold"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  }

  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-[10vh] items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="cursor-pointer" onClick={() => navigate("/")}>
                  <span className="text-cyan-600 hover:underline text-3xl font-bold tracking-wider">
                    QPG
                  </span>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => {
                          setActiveTab(item.name);
                          // if (item.name === "Generate") {
                          //   navigate("/generate");
                          //   window.location.reload();
                          // }
                        }}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? " text-cyan-500"
                              : "text-slate-300 hover:text-white hover:bg-gray-700",
                            "rounded-full px-4 py-2 text-sm font-medium tracking-wide relative"
                          )
                        }
                        aria-current={item.current ? "page" : undefined}
                      >
                        {activeTab === item.name && (
                          <motion.div
                            layoutId="active-pill"
                            className=" bg-gray-700 absolute inset-0 rounded-full"
                            style={{
                              borderRadius: "9999px",
                            }}
                          />
                        )}
                        <span className="relative z-10">{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                  {/* <div className="mt-5 flex justify-start">
                    <motion.div
                      layoutId="red-dot"
                      className="w-5 h-5 bg-red-500 rounded-full"
                    ></motion.div>
                  </div> */}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                          clipRule="evenodd"
                          className="text-gray-400"
                        />
                      </svg>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                            onClick={() => {
                              handleLogout();
                            }}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
