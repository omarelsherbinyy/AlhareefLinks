import { useEffect, useState } from "react";
import { LinkSection } from "@/components/LinkSection";
import { SocialLinks } from "@/components/SocialLinks";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Brand configuration
const DEFAULT_BRAND_NAME = "Alhareef";
const BRAND_LOGO_URL = "/logo.png";

type Branding = Database["public"]["Tables"]["branding"]["Row"];
type Section = Database["public"]["Tables"]["sections"]["Row"] & {
  links: Database["public"]["Tables"]["links"]["Row"][];
};

const Index = () => {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const unsubscribe = setupRealtimeSubscription();
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: brandingData, error: brandingError } = await supabase
        .from("branding")
        .select("*")
        .single();

      if (brandingError) throw brandingError;

      const { data: sectionsData, error: sectionsError } = await supabase
        .from("sections")
        .select("*, links(*)")
        .order("order_index");

      if (sectionsError) throw sectionsError;

      if (brandingData) setBranding(brandingData);
      if (sectionsData) setSections(sectionsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load content. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Change received!', payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#1D1B1C] flex items-center justify-center">
        <div className="text-white text-center p-4">
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => fetchData()} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D1B1C] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D1B1C] p-6">
      <div className="max-w-2xl mx-auto pt-12 pb-20">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <img
            src={BRAND_LOGO_URL}
            alt="Logo"
            className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100"
          />
          <h1 className="text-2xl font-bold text-white mb-2">
            {DEFAULT_BRAND_NAME}
          </h1>
          {branding?.description && (
            <p className="text-white/80 mb-6">{branding.description}</p>
          )}
        </div>

        {/* Social Links */}
        {branding && (
          <SocialLinks
            instagramUrl={branding.instagram_url}
            facebookUrl={branding.facebook_url}
            tiktokUrl={branding.tiktok_url}
          />
        )}

        {/* Link Sections */}
        {sections.map((section) => (
          <LinkSection
            key={section.id}
            title={section.name}
            links={section.links
              .filter(link => link.is_visible)
              .map(link => ({
                id: link.id,
                title: link.name,
                url: link.url,
                type: link.button_template === "none" ? "default" : "store",
              }))}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;