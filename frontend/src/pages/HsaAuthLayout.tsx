import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import { LocaleSwitcher } from "../components";
import { HsaThreeDotMark } from "../components/HsaThreeDotMark";
import "./hsaAuth.css";

export function HsaAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="hsa-auth">
      <div className="hsa-auth__bar">
        <Link to="/login" className="hsa-auth__brand" aria-label="SmartArchive Home">
          <HsaThreeDotMark className="hsa-auth__mark" />
          <span className="hsa-auth__name">
            <span className="hsa-auth__name-smart">Smart</span>
            <span className="hsa-auth__name-archive">Archive</span>
          </span>
        </Link>
        <LocaleSwitcher />
      </div>
      <div className="hsa-auth__stage">
        <div className="hsa-auth__card">{children}</div>
      </div>
    </div>
  );
}
