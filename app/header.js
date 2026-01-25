"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Dropdown, Avatar, Button, Drawer } from "antd";
import {
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  DownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMyProfile } from "./api/userApi";
import MyProfile from "./_component/MyProfile";

export default function Header() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentToken = Cookies.get("token");
    setToken(currentToken);

    const checkToken = () => {
      const newToken = Cookies.get("token");
      if (newToken !== token) {
        setToken(newToken);
      }
    };

    const interval = setInterval(checkToken, 100);
    return () => clearInterval(interval);
  }, [token]);

  const { profileData, isLoading, isError, mutate } = useMyProfile(token);

  const handleLogout = () => {
    Cookies.remove("token");
    setToken(null);
    router.push("/auth/signin");
  };

  // Dropdown menu items for authenticated user
  const userMenuItems = [
    {
      key: "profile",
      label: (
        <MyProfile profileData={profileData} mutate={mutate} isMobile={false} />
      ),
    },
    {
      key: "orders",
      label: (
        <Link href="/orders" className="flex items-center gap-2">
          <ShoppingCartOutlined /> My Orders
        </Link>
      ),
    },
    // {
    //   key: "settings",
    //   label: (
    //     <Link href="/settings" className="flex items-center gap-2">
    //       <SettingOutlined /> Settings
    //     </Link>
    //   ),
    // },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center gap-2 text-red-600">
          <LogoutOutlined /> Logout
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About us" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      {/* sticky top-0 z-50 */}
      <div className="px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/headerLogo.png"
              alt="vloerplaat"
              width={220}
              height={35}
              className="h-8 lg:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-900 hover:text-gray-600 font-medium text-base transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth & Cart */}
          <div className="flex items-center gap-6">
            {token ? (
              <>
                {/* Logged In State - Desktop */}
                <div className="hidden lg:flex items-center gap-5">
                  {/* User Dropdown */}
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
                      <Avatar
                        size={36}
                        src={profileData?.profile_image}
                        icon={<UserOutlined />}
                        className="border border-gray-200"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-900">
                          {profileData?.full_name}
                        </span>
                        <DownOutlined className="text-[10px] text-gray-500" />
                      </div>
                    </div>
                  </Dropdown>
                </div>
              </>
            ) : (
              <>
                {/* Logged Out State - Desktop */}
                <div className="hidden lg:flex items-center gap-0">
                  <Link href="/auth/signin">
                    <button className="cursor-pointer font-medium text-gray-900 hover:text-gray-600 px-4 py-2 transition-colors">
                      Login
                    </button>
                  </Link>
                  <div className="w-px h-5 bg-gray-300 mx-1"></div>
                  <Link href="/auth/signup">
                    <button className="cursor-pointer font-medium text-gray-900 hover:text-gray-600 px-4 py-2 transition-colors">
                      Sign up
                    </button>
                  </Link>
                </div>

                {/* Logged Out State - Mobile */}
                <div className="lg:hidden flex items-center gap-3">
                  <Link href="/auth/signin">
                    <button className="font-medium text-gray-900">Login</button>
                  </Link>
                </div>
              </>
            )}

            {/* Mobile Menu Button - Only show on mobile */}
            <div className="lg:hidden">
              <Button
                type="text"
                icon={<MenuOutlined className="text-xl" />}
                className="lg:hidden flex items-center justify-center"
                onClick={() => setMobileMenuOpen(true)}
                size="large"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <Image
            src="/headerLogo.png"
            alt="vloerplaat"
            width={180}
            height={30}
            className="h-8 w-auto"
          />
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        size={280}
      >
        <nav className="flex flex-col space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium px-4 py-3 rounded-lg transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {token && (
            <>
              <div className="border-t border-gray-200 my-4"></div>

              <MyProfile
                profileData={profileData}
                mutate={mutate}
                isMobile={true}
              />

              <Link
                href="/orders"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCartOutlined /> My Orders
              </Link>

              <div className="border-t border-gray-200 my-4"></div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-red-600 hover:bg-red-50 font-medium px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 w-full text-left"
              >
                <LogoutOutlined /> Logout
              </button>
            </>
          )}
        </nav>
      </Drawer>
    </header>
  );
}
