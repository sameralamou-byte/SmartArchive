import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "../layouts/AppShell";
import AccountPage from "../pages/app/AccountPage";
import ChangePasswordPage from "../pages/app/ChangePasswordPage";
import DocumentDetailPage from "../pages/app/DocumentDetailPage";
import DocumentsPage from "../pages/app/DocumentsPage";
import HomePage from "../pages/app/HomePage";
import RemindersPage from "../pages/app/RemindersPage";
import SettingsPage from "../pages/app/SettingsPage";
import UnderstandPage from "../pages/app/UnderstandPage";
import ComponentShowcase from "../pages/ComponentShowcase";
import FounderPageReview from "../pages/dev/FounderPageReview";
import HsaWebsiteLayout from "../pages/dev/hsa-website/HsaWebsiteLayout";
import HsaWebsiteHome from "../pages/dev/hsa-website/HsaWebsiteHome";
import {
  HsaWebsiteAbout,
  HsaWebsiteForBusiness,
  HsaWebsiteForHome,
  HsaWebsiteHowItWorks,
  HsaWebsiteSecurity,
} from "../pages/dev/hsa-website/HsaWebsitePages";
import EsaWebsiteLayout from "../pages/dev/esa-website/EsaWebsiteLayout";
import EsaWebsiteHome from "../pages/dev/esa-website/EsaWebsiteHome";
import EsaWebsiteHowItWorks from "../pages/dev/esa-website/EsaWebsiteHowItWorks";
import {
  EsaWebsiteAbout,
  EsaWebsiteIndustries,
  EsaWebsiteResources,
  EsaWebsiteSecurity,
} from "../pages/dev/esa-website/EsaWebsitePages";
import DocumentUnderstanding from "../pages/DocumentUnderstanding";
import EnterpriseCommandCenter from "../pages/EnterpriseCommandCenter";
import HomeDashboard from "../pages/HomeDashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import CheckEmail from "../pages/CheckEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ForgotPasswordCheckEmail from "../pages/ForgotPasswordCheckEmail";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import HomeRedirect from "./HomeRedirect";
import PublicOnly from "./PublicOnly";
import RequireAuth from "./RequireAuth";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/register/check-email" element={<CheckEmail />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password/check-email" element={<ForgotPasswordCheckEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/app" replace />} />

      <Route path="/dev/components" element={<ComponentShowcase />} />
      <Route path="/dev/home-dashboard" element={<HomeDashboard />} />
      <Route path="/dev/enterprise-command-center" element={<EnterpriseCommandCenter />} />
      <Route path="/dev/hsa-understanding" element={<DocumentUnderstanding />} />
      <Route path="/dev/founder-page-review/website" element={<HsaWebsiteLayout />}>
        <Route index element={<HsaWebsiteHome />} />
        <Route path="how-it-works" element={<HsaWebsiteHowItWorks />} />
        <Route path="security" element={<HsaWebsiteSecurity />} />
        <Route path="for-home" element={<HsaWebsiteForHome />} />
        <Route path="for-business" element={<HsaWebsiteForBusiness />} />
        <Route path="about" element={<HsaWebsiteAbout />} />
      </Route>
      <Route path="/dev/founder-page-review/esa-website" element={<EsaWebsiteLayout />}>
        <Route index element={<EsaWebsiteHome />} />
        <Route path="industries" element={<EsaWebsiteIndustries />} />
        <Route path="how-it-works" element={<EsaWebsiteHowItWorks />} />
        <Route path="security" element={<EsaWebsiteSecurity />} />
        <Route path="resources" element={<EsaWebsiteResources />} />
        <Route path="about" element={<EsaWebsiteAbout />} />
      </Route>
      <Route path="/dev/founder-page-review" element={<FounderPageReview />} />

      <Route path="/app" element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />
          <Route path="understand" element={<UnderstandPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="account/security" element={<ChangePasswordPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
