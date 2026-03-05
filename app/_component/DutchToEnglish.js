"use client";
import Cookies from "js-cookie";

export default function DutchToEnglish({ engText, dutText }) {
  const languages = Cookies.get("lang") || "en";

  return <>{languages === "en" ? engText : dutText}</>;
}
