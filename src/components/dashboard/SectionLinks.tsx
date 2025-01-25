import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Eye, EyeOff, Save, Trash2, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Link = Database["public"]["Tables"]["links"]["Row"];

interface SectionLinksProps {
  link: Link;
  editingLink: string | null;
  tempLinkData: { name: string; url: string };
  onUpdateLink: (linkId: string, updates: any) => Promise<void>;
  onToggleLinkVisibility: (linkId: string, currentVisibility: boolean) => Promise<void>;
  onDeleteLink: (linkId: string) => Promise<void>;
  onEditLink: (linkId: string, name: string, url: string) => void;
  onCancelEdit: () => void;
  onTempLinkDataChange: (data: { name: string; url: string }) => void;
}

export const SectionLinks = ({
  link,
  editingLink,
  tempLinkData,
  onUpdateLink,
  onToggleLinkVisibility,
  onDeleteLink,
  onEditLink,
  onCancelEdit,
  onTempLinkDataChange,
}: SectionLinksProps) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await onUpdateLink(link.id, tempLinkData);
      onCancelEdit(); // Close edit mode after successful save
      toast({
        title: "Success",
        description: "Link updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
      {editingLink === link.id ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
          <Input
            value={tempLinkData.name}
            onChange={(e) =>
              onTempLinkDataChange({ ...tempLinkData, name: e.target.value })
            }
            placeholder="Link Name"
            className="w-full bg-white text-black"
          />
          <Input
            value={tempLinkData.url}
            onChange={(e) =>
              onTempLinkDataChange({ ...tempLinkData, url: e.target.value })
            }
            placeholder="URL"
            className="w-full bg-white text-black"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex-1 sm:flex-none bg-white text-black border-black"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelEdit}
              className="flex-1 sm:flex-none bg-white text-black border-black"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 text-black">
            <h3 className="font-medium">{link.name}</h3>
            <p className="text-sm text-gray-600">{link.url}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleLinkVisibility(link.id, link.is_visible || false)}
              className="flex-1 sm:flex-none bg-white text-black border-black"
            >
              {link.is_visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onEditLink(link.id, link.name, link.url);
              }}
              className="flex-1 sm:flex-none bg-white text-black border-black"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteLink(link.id)}
              className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};