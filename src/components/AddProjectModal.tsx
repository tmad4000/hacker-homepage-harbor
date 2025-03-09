
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Hacker {
  id: string;
  name: string;
}

interface Creator {
  name: string;
  hacker_id: string | null;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: {
    title: string;
    creators: Creator[];
    description: string;
    url: string;
    hacker_ids: (string | null)[];
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
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [hackers, setHackers] = useState<Hacker[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
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
          
          // Initialize creators array
          if (initialHackerId && initialHackerName) {
            setCreators([{
              name: initialHackerName,
              hacker_id: initialHackerId
            }]);
          } else if (data.length > 0) {
            // Start with one empty creator
            setCreators([{ name: "", hacker_id: null }]);
          }
        }
      };
      
      fetchHackers();
    }
  }, [isOpen, initialHackerId, initialHackerName, toast]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setUrl("");
      
      if (initialHackerId && initialHackerName) {
        setCreators([{
          name: initialHackerName,
          hacker_id: initialHackerId
        }]);
      } else {
        setCreators([{ name: "", hacker_id: null }]);
      }
    }
  }, [isOpen, initialHackerId, initialHackerName]);

  if (!isOpen) return null;

  const handleCreatorChange = (index: number, field: "name" | "hacker_id", value: string) => {
    const updatedCreators = [...creators];
    
    if (field === "hacker_id") {
      // If selecting an existing hacker
      if (value) {
        const selectedHacker = hackers.find(h => h.id === value);
        updatedCreators[index] = {
          name: selectedHacker ? selectedHacker.name : "",
          hacker_id: value
        };
      } else {
        // If choosing to enter a custom name
        updatedCreators[index] = {
          name: "",
          hacker_id: null
        };
      }
    } else {
      // Just update the name for custom creators
      updatedCreators[index].name = value;
    }
    
    setCreators(updatedCreators);
  };

  const addCreator = () => {
    setCreators([...creators, { name: "", hacker_id: null }]);
  };

  const removeCreator = (index: number) => {
    if (creators.length <= 1) {
      toast({
        title: "Error",
        description: "A project must have at least one creator",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCreators = [...creators];
    updatedCreators.splice(index, 1);
    setCreators(updatedCreators);
  };

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

    // Validate creators
    const validCreators = creators.every(creator => 
      creator.name.trim() !== "" || creator.hacker_id !== null
    );

    if (!validCreators) {
      toast({
        title: "Missing information",
        description: "Please specify all creators",
        variant: "destructive",
      });
      return;
    }

    // Format URL if needed (add https:// if no protocol specified)
    let formattedUrl = url.trim();
    if (formattedUrl && !formattedUrl.match(/^[a-zA-Z]+:\/\//)) {
      formattedUrl = "https://" + formattedUrl;
    }

    // Prepare creators and hacker_ids
    const formattedCreators = creators.map(creator => {
      if (creator.hacker_id) {
        // For existing hackers, use the name from the hackers list
        const selectedHacker = hackers.find(h => h.id === creator.hacker_id);
        return {
          name: selectedHacker ? selectedHacker.name : creator.name,
          hacker_id: creator.hacker_id
        };
      } else {
        // For custom creators
        return {
          name: creator.name,
          hacker_id: null
        };
      }
    });

    // Extract just the hacker_ids for the database
    const hacker_ids = formattedCreators.map(creator => creator.hacker_id);

    onAddProject({
      title,
      creators: formattedCreators,
      description,
      url: formattedUrl,
      hacker_ids,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setUrl("");
    setCreators([{ name: "", hacker_id: null }]);
    onClose();
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm">Creators:</label>
              <button 
                type="button" 
                onClick={addCreator}
                className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
              >
                <Plus size={14} className="mr-1" /> Add Creator
              </button>
            </div>
            
            {creators.map((creator, index) => (
              <div key={index} className="mb-2 border-b border-gray-100 pb-2">
                <div className="flex items-center mb-2">
                  <span className="text-xs text-gray-500 mr-2">Creator {index + 1}</span>
                  {index > 0 || !initialHackerId ? (
                    <button 
                      type="button" 
                      onClick={() => removeCreator(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
                
                <div className="mb-2">
                  <div className="flex space-x-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name={`creatorMode-${index}`}
                        checked={creator.hacker_id !== null}
                        onChange={() => handleCreatorChange(index, "hacker_id", hackers.length > 0 ? hackers[0].id : "")}
                        disabled={initialHackerId && index === 0}
                      />
                      <span className="ml-2 text-sm">Select existing hacker</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name={`creatorMode-${index}`}
                        checked={creator.hacker_id === null}
                        onChange={() => handleCreatorChange(index, "hacker_id", "")}
                        disabled={initialHackerId && index === 0}
                      />
                      <span className="ml-2 text-sm">Enter new creator</span>
                    </label>
                  </div>
                </div>

                {creator.hacker_id !== null ? (
                  <select
                    value={creator.hacker_id || ""}
                    onChange={(e) => handleCreatorChange(index, "hacker_id", e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
                    disabled={initialHackerId && index === 0}
                  >
                    <option value="" disabled>Select a hacker</option>
                    {hackers.map((hacker) => (
                      <option key={hacker.id} value={hacker.id}>
                        {hacker.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={creator.name}
                    onChange={(e) => handleCreatorChange(index, "name", e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
                    placeholder="Creator Name"
                  />
                )}

                {initialHackerName && index === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    This project will be added to {initialHackerName}'s profile
                  </p>
                )}
              </div>
            ))}
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
