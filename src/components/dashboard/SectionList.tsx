import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, Save, X, GripVertical } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { SectionLinks } from "./SectionLinks";

type Section = Database["public"]["Tables"]["sections"]["Row"] & {
  links: Database["public"]["Tables"]["links"]["Row"][];
};

interface SectionListProps {
  sections: Section[];
  onSectionOrderChange: (sections: Section[]) => Promise<void>;
  onSectionUpdate: (sectionId: string, name: string) => Promise<void>;
  onSectionDelete: (sectionId: string) => Promise<void>;
  onAddLink: (sectionId: string) => Promise<void>;
  onUpdateLink: (linkId: string, updates: any) => Promise<void>;
  onToggleLinkVisibility: (linkId: string, currentVisibility: boolean) => Promise<void>;
  onDeleteLink: (linkId: string) => Promise<void>;
}

const SortableSection = ({ section, children }: { section: Section; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <button
            className="cursor-grab hover:text-gray-400 touch-none text-black"
            {...listeners}
          >
            <GripVertical className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export const SectionList = ({
  sections,
  onSectionOrderChange,
  onSectionUpdate,
  onSectionDelete,
  onAddLink,
  onUpdateLink,
  onToggleLinkVisibility,
  onDeleteLink,
}: SectionListProps) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [tempSectionName, setTempSectionName] = useState<string>("");
  const [tempLinkData, setTempLinkData] = useState<{ name: string; url: string }>({ name: "", url: "" });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex);
      onSectionOrderChange(newSections);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map(section => section.id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((section) => (
          <SortableSection key={section.id} section={section}>
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                {editingSection === section.id ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                    <Input
                      value={tempSectionName}
                      onChange={(e) => setTempSectionName(e.target.value)}
                      className="w-full bg-white text-black"
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onSectionUpdate(section.id, tempSectionName);
                          setEditingSection(null);
                        }}
                        className="flex-1 sm:flex-none bg-white text-black border-black"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSection(null)}
                        className="flex-1 sm:flex-none bg-white text-black border-black"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <h2 className="text-xl font-semibold text-black">{section.name}</h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSection(section.id);
                          setTempSectionName(section.name);
                        }}
                        className="flex-1 sm:flex-none bg-white text-black border-black"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onSectionDelete(section.id)}
                        className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddLink(section.id)}
                  className="w-full sm:w-auto mt-4 bg-primary hover:bg-primary-hover text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
              <div className="space-y-4 mt-4">
                {section.links.map((link) => (
                  <SectionLinks
                    key={link.id}
                    link={link}
                    editingLink={editingLink}
                    tempLinkData={tempLinkData}
                    onUpdateLink={onUpdateLink}
                    onToggleLinkVisibility={onToggleLinkVisibility}
                    onDeleteLink={onDeleteLink}
                    onEditLink={(linkId, name, url) => {
                      setEditingLink(linkId);
                      setTempLinkData({ name, url });
                    }}
                    onCancelEdit={() => setEditingLink(null)}
                    onTempLinkDataChange={setTempLinkData}
                  />
                ))}
              </div>
            </div>
          </SortableSection>
        ))}
      </SortableContext>
    </DndContext>
  );
};