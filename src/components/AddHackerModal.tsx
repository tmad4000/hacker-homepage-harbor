
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface AddHackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHacker: (hacker: {
    name: string;
    url: string | null;
    interests: string[];
  }) => void;
}

const AddHackerModal: React.FC<AddHackerModalProps> = ({
  isOpen,
  onClose,
  onAddHacker,
}) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Missing information",
        description: "Please provide a name",
        variant: "destructive",
      });
      return;
    }

    // Convert comma-separated interests to array
    const interests = interestsInput
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest !== "");

    if (interests.length === 0) {
      toast({
        title: "Missing interests",
        description: "Please provide at least one interest",
        variant: "destructive",
      });
      return;
    }

    onAddHacker({
      name,
      url: url || null,
      interests,
    });

    // Reset form
    setName("");
    setUrl("");
    setInterestsInput("");
    onClose();

    toast({
      title: "Success!",
      description: `${name} has been added to the directory`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 border border-gray-400 shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-lg font-pixel text-gray-800 mb-4">
          &lt;Add New Hacker&gt;
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="Full Name"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Homepage URL (optional):</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="https://yourdomain.com"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Interests (comma-separated):</label>
            <input
              type="text"
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="AI, Blockchain, Cybersecurity"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-800"
            >
              Add Hacker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHackerModal;
