import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { BrandingSection } from "@/components/dashboard/BrandingSection";
import { SectionList } from "@/components/dashboard/SectionList";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AddSectionForm } from "@/components/dashboard/AddSectionForm";

type Branding = Database["public"]["Tables"]["branding"]["Row"];
type Section = Database["public"]["Tables"]["sections"]["Row"] & {
  links: Database["public"]["Tables"]["links"]["Row"][];
};

const Dashboard = () => {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSectionName, setNewSectionName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    setupRealtimeSubscription();
  }, []);

  const fetchData = async () => {
    try {
      const { data: brandingData } = await supabase
        .from("branding")
        .select("*")
        .single();

      const { data: sectionsData } = await supabase
        .from("sections")
        .select("*, links(*)")
        .order("order_index");

      if (brandingData) setBranding(brandingData);
      if (sectionsData) setSections(sectionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
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

  const handleBrandingUpdate = async (updates: Partial<Branding>) => {
    try {
      const { error } = await supabase
        .from("branding")
        .update(updates)
        .eq("id", branding?.id || "");

      if (error) throw error;

      toast({
        title: "Success",
        description: "Branding updated successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error("Error updating branding:", error);
      toast({
        title: "Error",
        description: "Failed to update branding",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;

    try {
      const { error } = await supabase.from("sections").insert({
        name: newSectionName,
        type: "links",
        order_index: sections.length,
      });

      if (error) throw error;

      setNewSectionName("");
      toast({
        title: "Success",
        description: "Section added successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error("Error adding section:", error);
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive",
      });
    }
  };

  const handleSectionOrderChange = async (newSections: Section[]) => {
    try {
      const updates = newSections.map((section, index) => ({
        id: section.id,
        name: section.name,
        order_index: index,
        type: section.type
      }));

      const { error } = await supabase
        .from("sections")
        .upsert(updates);

      if (error) throw error;

      setSections(newSections);
    } catch (error) {
      console.error("Error updating section order:", error);
      toast({
        title: "Error",
        description: "Failed to update section order",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSection = async (sectionId: string, name: string) => {
    try {
      const { error } = await supabase
        .from("sections")
        .update({ name })
        .eq("id", sectionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Section updated successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from("sections")
        .delete()
        .eq("id", sectionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error("Error deleting section:", error);
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      });
    }
  };

  const handleAddLink = async (sectionId: string) => {
    try {
      const { error } = await supabase.from("links").insert({
        name: "New Link",
        url: "https://example.com",
        section_id: sectionId,
        is_visible: true,
        order: 0,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Link added successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error("Error adding link:", error);
      toast({
        title: "Error",
        description: "Failed to add link",
        variant: "destructive",
      });
    }
  };

  const handleUpdateLink = async (linkId: string, updates: Partial<Database["public"]["Tables"]["links"]["Row"]>) => {
    try {
      const { error } = await supabase
        .from("links")
        .update(updates)
        .eq("id", linkId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Link updated successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error("Error updating link:", error);
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive",
      });
    }
  };

  const handleToggleLinkVisibility = async (linkId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from("links")
        .update({ is_visible: !currentVisibility })
        .eq("id", linkId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Link ${!currentVisibility ? 'shown' : 'hidden'} successfully`,
      });
      
      fetchData();
    } catch (error) {
      console.error("Error toggling link visibility:", error);
      toast({
        title: "Error",
        description: "Failed to toggle link visibility",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", linkId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Link deleted successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error("Error deleting link:", error);
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D1B1C] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D1B1C] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader onLogout={handleLogout} />

        <BrandingSection
          branding={branding}
          onUpdate={handleBrandingUpdate}
        />

        <AddSectionForm
          newSectionName={newSectionName}
          onNewSectionNameChange={setNewSectionName}
          onAddSection={handleAddSection}
        />

        <SectionList
          sections={sections}
          onSectionOrderChange={handleSectionOrderChange}
          onSectionUpdate={handleUpdateSection}
          onSectionDelete={handleDeleteSection}
          onAddLink={handleAddLink}
          onUpdateLink={handleUpdateLink}
          onToggleLinkVisibility={handleToggleLinkVisibility}
          onDeleteLink={handleDeleteLink}
        />
      </div>
    </div>
  );
};

export default Dashboard;