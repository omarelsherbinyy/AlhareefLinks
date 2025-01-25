import { Instagram, Facebook } from "lucide-react";
import TikTokIcon from "./icons/TikTokIcon";

interface SocialLinksProps {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
}

export const SocialLinks = ({ instagramUrl, facebookUrl, tiktokUrl }: SocialLinksProps) => {
  if (!instagramUrl && !facebookUrl && !tiktokUrl) return null;

  return (
    <div className="flex gap-4 justify-center mb-8">
      {instagramUrl && (
        <a
          href={instagramUrl}
          className="text-white/80 hover:text-primary transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <Instagram className="w-6 h-6" />
        </a>
      )}
      {facebookUrl && (
        <a
          href={facebookUrl}
          className="text-white/80 hover:text-primary transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <Facebook className="w-6 h-6" />
        </a>
      )}
      {tiktokUrl && (
        <a
          href={tiktokUrl}
          className="text-white/80 hover:text-primary transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
        >
          <TikTokIcon className="w-6 h-6" />
        </a>
      )}
    </div>
  );
};