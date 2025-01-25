import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddSectionFormProps {
  newSectionName: string;
  onNewSectionNameChange: (value: string) => void;
  onAddSection: () => void;
}

export const AddSectionForm = ({
  newSectionName,
  onNewSectionNameChange,
  onAddSection,
}: AddSectionFormProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Input
          placeholder="New Section Name"
          value={newSectionName}
          onChange={(e) => onNewSectionNameChange(e.target.value)}
          className="w-full bg-white text-black"
        />
        <Button 
          onClick={onAddSection}
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>
    </div>
  );
};