import { Link } from "@/i18n/navigation";

type LogoProps = {
  locale: string;
};

export function Logo({ locale }: LogoProps) {
  return (
    <Link
      href="/"
      locale={locale}
      className="flex items-center gap-2 font-display font-bold uppercase text-xl tracking-tight"
    >
      <span className="text-brand">Nitro</span>
      <span>Plus</span>
    </Link>
  );
}