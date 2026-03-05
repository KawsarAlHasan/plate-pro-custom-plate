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

const languages = [
  {
    code: "en",
    label: "English",
    flag: (
      <svg
        width="24"
        height="16"
        viewBox="0 0 60 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5" />
        <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
        <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
      </svg>
    ),
  },
  {
    code: "nl",
    label: "Dutch",
    flag: (
      <svg
        width="24"
        height="16"
        viewBox="0 0 9 6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="9" height="2" fill="#AE1C28" />
        <rect y="2" width="9" height="2" fill="#fff" />
        <rect y="4" width="9" height="2" fill="#21468B" />
      </svg>
    ),
  },
];

export default function Header({ dict, lang }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(lang);

  const navigation = dict?.navigation;

  useEffect(() => {
    const currentToken = Cookies.get("token");
    setToken(currentToken);

    const savedLang = Cookies.get("lang") || "en";
    setSelectedLang(savedLang);

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

  const handleLangChange = (code) => {
    setSelectedLang(code);
    Cookies.set("lang", code);
    router.refresh();
  };

  const currentLang = languages.find((l) => l.code === selectedLang);

  const langMenuItems = languages.map((lang) => ({
    key: lang.code,
    label: (
      <div
        className="flex items-center gap-2 px-1 py-0.5"
        onClick={() => handleLangChange(lang.code)}
      >
        {lang.flag}
        <span className="text-sm font-medium text-gray-700">{lang.label}</span>
      </div>
    ),
  }));

  const LanguageSwitcher = () => (
    <Dropdown
      menu={{ items: langMenuItems }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 rounded-md px-2.5 py-1.5 bg-white shadow-sm">
        {currentLang?.flag}
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {currentLang?.code.toUpperCase()}
        </span>
        <DownOutlined className="text-[9px] text-gray-400" />
      </div>
    </Dropdown>
  );

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <MyProfile
          profileData={profileData}
          mutate={mutate}
          isMobile={false}
          navigation={navigation}
        />
      ),
    },
    {
      key: "orders",
      label: (
        <Link href="/orders" className="flex items-center gap-2">
          <ShoppingCartOutlined />
          {navigation.myOrders}
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center gap-2 text-red-600">
          <LogoutOutlined /> {navigation.logout}
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  const navLinks = [
    { href: "/", label: navigation.home },
    { href: "/about-us", label: navigation.about },
    { href: "/how-it-works", label: navigation.howItWorks },
    { href: "/contact", label: navigation.contact },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
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

          {/* Right Side - Auth, Lang & Cart */}
          <div className="flex items-center gap-3">
            {/* Language Switcher - always visible */}
            <div className="hidden lg:flex">
              <LanguageSwitcher />
            </div>

            {token ? (
              <>
                {/* Logged In State - Desktop */}
                <div className="hidden lg:flex items-center gap-5">
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
                      {navigation.login}
                    </button>
                  </Link>
                  <div className="w-px h-5 bg-gray-300 mx-1"></div>
                  <Link href="/auth/signup">
                    <button className="cursor-pointer font-medium text-gray-900 hover:text-gray-600 px-4 py-2 transition-colors">
                      {navigation.signup}
                    </button>
                  </Link>
                </div>

                {/* Logged Out State - Mobile */}
                <div className="lg:hidden flex items-center gap-3">
                  <Link href="/auth/signin">
                    <button className="font-medium text-gray-900">
                      {navigation.login}
                    </button>
                  </Link>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                type="text"
                icon={<MenuOutlined className="text-xl" />}
                className="flex items-center justify-center"
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

          {/* Language Switcher in Mobile Drawer */}
          <div className="border-t border-gray-200 my-4"></div>
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-semibold">
              {navigation.language}
            </p>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
                    selectedLang === lang.code
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {lang.flag}
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {token && (
            <>
              <div className="border-t border-gray-200 my-4"></div>

              <MyProfile
                profileData={profileData}
                mutate={mutate}
                isMobile={true}
                navigation={navigation}
              />

              <Link
                href="/orders"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCartOutlined /> {navigation.myOrders}
              </Link>

              <div className="border-t border-gray-200 my-4"></div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-red-600 hover:bg-red-50 font-medium px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 w-full text-left"
              >
                <LogoutOutlined /> {navigation.logout}
              </button>
            </>
          )}
        </nav>
      </Drawer>
    </header>
  );
}
