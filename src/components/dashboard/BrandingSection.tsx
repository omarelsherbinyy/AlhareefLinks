import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Branding = Database["public"]["Tables"]["branding"]["Row"];

interface BrandingSectionProps {
  branding: Branding | null;
  onUpdate: (updates: Partial<Branding>) => Promise<void>;
}

export const BrandingSection = ({ branding, onUpdate }: BrandingSectionProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Partial<Branding>>({});

  const startEditing = (field: string, value: string) => {
    setEditingField(field);
    setTempValues({ ...tempValues, [field]: value });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleUpdate = async (field: string) => {
    await onUpdate({ [field]: tempValues[field] });
    setEditingField(null);
    setTempValues({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Branding</h2>
      <div className="space-y-4">
        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {editingField === 'description' ? (
              <>
                <Textarea
                  value={tempValues.description || ''}
                  onChange={(e) =>
                    setTempValues({
                      ...tempValues,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter brand description"
                  className="w-full"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate('description')}
                    className="flex-1 sm:flex-none"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="flex-1 sm:flex-none"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Textarea
                  value={branding?.description || ''}
                  readOnly
                  placeholder="Enter brand description"
                  className="w-full bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    startEditing('description', branding?.description || '')
                  }
                  className="w-full sm:w-auto"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Social Media URLs */}
        {['instagram_url', 'facebook_url', 'tiktok_url'].map((field) => (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.split('_')[0].charAt(0).toUpperCase() + field.split('_')[0].slice(1)} URL
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {editingField === field ? (
                <>
                  <Input
                    type="url"
                    value={tempValues[field] || ''}
                    onChange={(e) =>
                      setTempValues({
                        ...tempValues,
                        [field]: e.target.value,
                      })
                    }
                    placeholder={`Enter ${field.split('_')[0]} URL`}
                    className="w-full"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdate(field)}
                      className="flex-1 sm:flex-none"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEditing}
                      className="flex-1 sm:flex-none"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    type="url"
                    value={branding?.[field] || ''}
                    readOnly
                    placeholder={`Enter ${field.split('_')[0]} URL`}
                    className="w-full bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      startEditing(field, branding?.[field] || '')
                    }
                    className="w-full sm:w-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};