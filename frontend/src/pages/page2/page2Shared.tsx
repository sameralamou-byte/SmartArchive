import type { ReactNode } from "react";

export type TranslateFn = (key: string) => string;

/** Authority letter body — used by approved Hero only. */
export function AuthorityLetterBody({ hero = false }: { hero?: boolean }) {
  return (
    <div className="space-y-3 leading-relaxed text-body-m">
      <p className={hero ? "font-display text-body-l text-[color:var(--esa-surface)]" : "text-text-primary"}>
        Sehr geehrte Damen und Herren,
      </p>
      <p className="text-text-secondary">wir bitten Sie, die angeforderten Unterlagen bis spätestens</p>
      <p className="text-text-secondary">
        <mark className="rounded-sm bg-accent-2-tint px-1.5 py-0.5 font-display font-bold text-accent-2 no-underline">
          31 October
        </mark>{" "}
        einzureichen.
      </p>
      <p className="text-text-secondary">Bitte verwenden Sie das beigefügte Formular.</p>
    </div>
  );
}

/** Scene container — approved Hero only. */
export function HeroSceneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[400px] overflow-hidden rounded-lg border-2 border-[color:var(--esa-surface)]/25 shadow-3 sm:min-h-[460px] lg:min-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-recessed via-surface-page to-accent-2-tint/20" aria-hidden />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function MagnifiedDeadline({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block font-display text-body-l font-bold text-accent-2 underline decoration-accent-2 decoration-2 underline-offset-4 ${className}`}
    >
      31 October
    </span>
  );
}
