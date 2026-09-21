import { Outlet, useLocation } from "react-router-dom";

import { HsaWebsiteFooter } from "./HsaWebsiteFooter";
import { HsaWebsiteHeader } from "./HsaWebsiteHeader";
import { HSA_WEBSITE_BASE } from "./hsaWebsiteAssets";
import "./hsaWebsitePreview.css";

function isHsaHome(pathname: string) {
  return pathname === HSA_WEBSITE_BASE || pathname === `${HSA_WEBSITE_BASE}/`;
}

export default function HsaWebsiteLayout() {
  const location = useLocation();
  const overlay = isHsaHome(location.pathname);

  return (
    <div className="hsa-website-preview">
      <div className="hsa-website-preview__stage">
        <HsaWebsiteHeader overlay={overlay} />
        <Outlet />
      </div>
      <HsaWebsiteFooter />
    </div>
  );
}
