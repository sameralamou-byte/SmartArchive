import { Outlet, useLocation } from "react-router-dom";

import { HsaWebsiteFooter } from "./HsaWebsiteFooter";
import { HsaWebsiteHeader } from "./HsaWebsiteHeader";
import { HSA_WEBSITE_BASE } from "./hsaWebsiteAssets";
import "./hsaWebsitePreview.css";

function isHsaOverlayPage(pathname: string) {
  return (
    pathname === HSA_WEBSITE_BASE ||
    pathname === `${HSA_WEBSITE_BASE}/` ||
    /\/hsa-website\/(how-it-works|features)\/?$/.test(pathname)
  );
}

function overlaySceneClass(pathname: string) {
  if (/\/hsa-website\/how-it-works\/?$/.test(pathname)) return "hsa-website-preview hsa-website-preview--how";
  if (/\/hsa-website\/features\/?$/.test(pathname)) return "hsa-website-preview hsa-website-preview--features";
  return "hsa-website-preview";
}

export default function HsaWebsiteLayout() {
  const location = useLocation();
  const overlay = isHsaOverlayPage(location.pathname);

  return (
    <div className={overlaySceneClass(location.pathname)}>
      <div className="hsa-website-preview__stage">
        <HsaWebsiteHeader overlay={overlay} />
        <Outlet />
      </div>
      <HsaWebsiteFooter />
    </div>
  );
}
