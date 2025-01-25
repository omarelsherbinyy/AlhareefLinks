import { LinkButton } from "./LinkButton";

interface Link {
  id: string;
  title: string;
  url: string;
  type: "default" | "store";
}

interface LinkSectionProps {
  title: string;
  links: Link[];
}

export const LinkSection = ({ title, links }: LinkSectionProps) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8 animate-fade-in">
      <h2 className="text-white/80 text-sm font-medium mb-3">{title}</h2>
      <div className="space-y-3">
        {links.map((link) => (
          <LinkButton key={link.id} href={link.url} variant={link.type}>
            {link.title}
          </LinkButton>
        ))}
      </div>
    </div>
  );
};