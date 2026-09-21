import { Outlet, useLocation } from "react-router-dom";

import { HsaWebsiteFooter } from "./HsaWebsiteFooter";
import { HsaWebsiteHeader } from "./HsaWebsiteHeader";
import { HSA_WEBSITE_BASE } from "./hsaWebsiteAssets";
import "./hsaWebsitePreview.css";

function isHsaOverlayPage(pathname: string) {
  return (
    pathname === HSA_WEBSITE_BASE ||
    pathname === `${HSA_WEBSITE_BASE}/` ||
    /\/hsa-website\/how-it-works\/?$/.test(pathname)
  );
}

export default function HsaWebsiteLayout() {
  const location = useLocation();
  const overlay = isHsaOverlayPage(location.pathname);
  const howItWorks = /\/hsa-website\/how-it-works\/?$/.test(location.pathname);

  return (
    <div className={howItWorks ? "hsa-website-preview hsa-website-preview--how" : "hsa-website-preview"}>
      <div className="hsa-website-preview__stage">
        <HsaWebsiteHeader overlay={overlay} />
        <Outlet />
      </div>
      <HsaWebsiteFooter />
    </div>
  );
}
