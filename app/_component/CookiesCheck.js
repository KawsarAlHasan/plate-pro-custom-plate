import Cookies from "js-cookie";

export default function CookiesCheck(checkerName) {
  const cookiesMap = {
    shape: Cookies.get("shape"),
    point: Cookies.get("point"),
    holes: Cookies.get("holes"),
    material: Cookies.get("material"),
    thickness: Cookies.get("thickness"),
    review: Cookies.get("review"),
    canvas: Cookies.get("canvas"),
  };

  return !!cookiesMap[checkerName];
}