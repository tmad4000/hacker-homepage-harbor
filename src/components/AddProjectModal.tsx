
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Hacker {
  id: string;
  name: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: {
    title: string;
    creator: string;
    description: string;
    url: string;
    hacker_id: string | null;
  }) => void;
  initialHackerId?: string;
  initialHackerName?: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
  initialHackerId,
  initialHackerName,
}) => {
  const [title, setTitle] = useState("");
  const [selectedHackerId, setSelectedHackerId] = useState(initialHackerId || "");
  const [creatorName, setCreatorName] = useState(initialHackerName || "");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [hackers, setHackers] = useState<Hacker[]>([]);
  const [creatorMode, setCreatorMode] = useState<"existing" | "new">(
    initialHackerId ? "existing" : "existing"
  );
  const { toast } = useToast();

  // Fetch hackers for dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchHackers = async () => {
        const { data, error } = await supabase
          .from('hackers')
          .select('id, name')
          .order('name');
          
        if (error) {
          console.error('Error fetching hackers:', error);
          toast({
            title: "Error",
            description: "Failed to load hackers list",
            variant: "destructive",
          });
        } else if (data) {
          setHackers(data);
          
          // Set initial hacker if provided
          if (initialHackerId) {
            setSelectedHackerId(initialHackerId);
            setCreatorMode("existing");
          } else if (data.length > 0 && !selectedHackerId) {
            setSelectedHackerId(data[0].id);
          }
        }
      };
      
      fetchHackers();
    }
  }, [isOpen, initialHackerId, toast]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setUrl("");
      setCreatorName(initialHackerName || "");
      
      if (initialHackerId) {
        setSelectedHackerId(initialHackerId);
        setCreatorMode("existing");
      } else {
        setCreatorMode("existing");
      }
    }
  }, [isOpen, initialHackerId, initialHackerName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !url) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    if (creatorMode === "existing" && !selectedHackerId) {
      toast({
        title: "Missing information",
        description: "Please select a hacker",
        variant: "destructive",
      });
      return;
    }

    if (creatorMode === "new" && !creatorName) {
      toast({
        title: "Missing information",
        description: "Please enter creator name",
        variant: "destructive",
      });
      return;
    }

    // Format URL if needed (add https:// if no protocol specified)
    let formattedUrl = url.trim();
    if (formattedUrl && !formattedUrl.match(/^[a-zA-Z]+:\/\//)) {
      formattedUrl = "https://" + formattedUrl;
    }

    let creator = "";
    let hacker_id: string | null = null;

    if (creatorMode === "existing") {
      // Find selected hacker name
      const selectedHacker = hackers.find(h => h.id === selectedHackerId);
      if (!selectedHacker) {
        toast({
          title: "Error",
          description: "Selected hacker not found",
          variant: "destructive",
        });
        return;
      }
      creator = selectedHacker.name;
      hacker_id = selectedHacker.id;
    } else {
      creator = creatorName;
      hacker_id = null;
    }

    onAddProject({
      title,
      creator,
      description,
      url: formattedUrl,
      hacker_id,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setUrl("");
    setCreatorName("");
    onClose();

    toast({
      title: "Success!",
      description: `${title} has been added to projects`,
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
          &lt;Add New Project&gt;
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Project Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="Project Name"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Creator:</label>
            {!initialHackerId && (
              <div className="mb-2">
                <div className="flex space-x-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="creatorMode"
                      checked={creatorMode === "existing"}
                      onChange={() => setCreatorMode("existing")}
                    />
                    <span className="ml-2">Select existing hacker</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="creatorMode"
                      checked={creatorMode === "new"}
                      onChange={() => setCreatorMode("new")}
                    />
                    <span className="ml-2">Enter new creator</span>
                  </label>
                </div>
              </div>
            )}

            {creatorMode === "existing" && (
              <select
                value={selectedHackerId}
                onChange={(e) => setSelectedHackerId(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
                disabled={!!initialHackerName}
              >
                <option value="" disabled>Select a hacker</option>
                {hackers.map((hacker) => (
                  <option key={hacker.id} value={hacker.id}>
                    {hacker.name}
                  </option>
                ))}
              </select>
            )}

            {creatorMode === "new" && (
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
                placeholder="Creator Name"
              />
            )}

            {initialHackerName && (
              <p className="text-xs text-gray-500 mt-1">
                This project will be added to {initialHackerName}'s profile
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm mb-1">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="Brief description of the project"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Project URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="github.com/username/repo"
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
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
