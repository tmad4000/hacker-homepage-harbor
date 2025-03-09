
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: {
    title: string;
    creator: string;
    description: string;
    url: string;
  }) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("https://github.com/");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !creator || !description || !url) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    onAddProject({
      title,
      creator,
      description,
      url,
    });

    // Reset form
    setTitle("");
    setCreator("");
    setDescription("");
    setUrl("https://github.com/");
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
            <input
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="Your Name"
            />
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
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="https://github.com/username/repo"
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
