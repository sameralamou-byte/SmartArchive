export function HsaWebsiteStub({ title }: { title: string }) {
  return (
    <main className="hsa-stub">
      <h1 className="hsa-stub__title">{title}</h1>
      <p className="hsa-stub__note">This page is not specified yet.</p>
    </main>
  );
}

export function HsaWebsitePrivacyAndControl() {
  return <HsaWebsiteStub title="Privacy & Control" />;
}

export function HsaWebsitePricing() {
  return <HsaWebsiteStub title="Pricing" />;
}

export function HsaWebsiteAbout() {
  return <HsaWebsiteStub title="About" />;
}
