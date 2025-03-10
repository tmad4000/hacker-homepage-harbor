
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddProjectModal from "@/components/AddProjectModal";

interface Hacker {
  id: string;
  name: string;
  url: string;
  interests: string[];
  bio: string | null;
  last_updated: string;
}

interface Project {
  id: string;
  title: string;
  creator: string;
  description: string;
  date_created: string;
  url: string;
  hacker_id: string | null;
}

interface Creator {
  name: string;
  hacker_id: string | null;
}

const HackerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [hacker, setHacker] = useState<Hacker | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  useEffect(() => {
    const fetchHackerData = async () => {
      try {
        setLoading(true);
        
        // Fetch hacker data
        const { data: hackerData, error: hackerError } = await supabase
          .from('hackers')
          .select('*')
          .eq('id', id)
          .single();
          
        if (hackerError) throw hackerError;
        
        if (hackerData) {
          const formattedHacker = {
            ...hackerData,
            last_updated: new Date(hackerData.last_updated).toISOString().split('T')[0]
          };
          
          setHacker(formattedHacker);
          
          // Fetch projects for this hacker
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .eq('hacker_id', id);
            
          if (projectsError) throw projectsError;
          
          if (projectsData) {
            const formattedProjects = projectsData.map(project => ({
              ...project,
              date_created: new Date(project.date_created).toISOString().split('T')[0]
            }));
            
            setProjects(formattedProjects);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hacker data:', error);
        toast.error('Failed to load hacker profile');
        setLoading(false);
      }
    };
    
    if (id) {
      fetchHackerData();
    }
  }, [id]);

  const handleAddProject = async (newProject: { 
    title: string; 
    creators: Creator[]; 
    description: string; 
    url: string; 
    hacker_ids: (string | null)[] 
  }) => {
    try {
      // For each creator that is associated with a hacker, create a project entry
      const projectPromises = newProject.hacker_ids
        .filter(Boolean) // Filter out null values
        .map(async (hacker_id) => {
          // Find the corresponding creator
          const creator = newProject.creators.find(c => c.hacker_id === hacker_id);
          
          if (!creator) return null;
          
          const { data, error } = await supabase
            .from('projects')
            .insert({
              title: newProject.title,
              creator: creator.name,
              description: newProject.description,
              url: newProject.url,
              hacker_id: hacker_id
            })
            .select();
            
          if (error) throw error;
          return data && data.length > 0 ? data[0] : null;
        });
      
      // Handle non-hacker creators (custom names)
      const customCreators = newProject.creators.filter(c => c.hacker_id === null);
      for (const creator of customCreators) {
        const { error } = await supabase
          .from('projects')
          .insert({
            title: newProject.title,
            creator: creator.name,
            description: newProject.description,
            url: newProject.url,
            hacker_id: null
          });
          
        if (error) throw error;
      }
      
      // Wait for all inserts to complete
      const results = await Promise.all(projectPromises);
      
      // Filter out null results and format dates
      const newProjects = results
        .filter(Boolean)
        .map(project => ({
          ...project!,
          date_created: new Date(project!.date_created).toISOString().split('T')[0]
        }));
      
      // Update local state if the current hacker is one of the creators
      const currentHackerProject = newProjects.find(p => p.hacker_id === id);
      if (currentHackerProject) {
        setProjects([...projects, currentHackerProject]);
      }
      
      toast.success(`${newProject.title} has been added to projects`);
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 py-8">
        <div className="retro-container max-w-3xl mx-auto">
          <p className="text-center">Loading<span className="blink">...</span></p>
        </div>
      </div>
    );
  }

  if (!hacker) {
    return (
      <div className="min-h-screen bg-white text-gray-900 py-8">
        <div className="retro-container max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-pixel mb-4">Hacker Not Found</h1>
            <p className="mb-4">The hacker profile you're looking for doesn't exist.</p>
            <Link to="/" className="inline-block bg-blue-700 text-white px-4 py-2 hover:bg-blue-800">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 py-8 animate-fade-in">
      <div className="retro-container max-w-3xl mx-auto">
        <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Directory</span>
        </Link>

        <div className="p-4 border border-gray-300 bg-white shadow-sm">
          <h1 className="text-xl md:text-2xl font-pixel text-gray-800 mb-4">
            &lt;{hacker.name}&gt;
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
            <div>
              <div className="bg-gray-100 p-4 mb-4 flex items-center justify-center">
                <div className="text-6xl font-pixel text-blue-700">
                  {hacker.name.charAt(0)}
                </div>
              </div>

              <h2 className="text-lg font-medium mb-2">Contact</h2>
              <p className="mb-4">
                <a 
                  href={hacker.url} 
                  className="text-blue-700 hover:text-blue-800 underline block break-words"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hacker.url}
                </a>
              </p>

              <h2 className="text-lg font-medium mb-2">Last Updated</h2>
              <p className="mb-4">{hacker.last_updated}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Interests</h2>
              <div className="mb-6 flex flex-wrap gap-2">
                {hacker.interests.map((interest, idx) => (
                  <span 
                    key={idx} 
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              {/* Projects Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Projects</h2>
                  <button 
                    onClick={() => setShowAddProjectModal(true)}
                    className="flex items-center px-2 py-1 bg-green-600 text-white hover:bg-green-700 text-xs rounded"
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add Project
                  </button>
                </div>
                
                {projects.length > 0 ? (
                  <ul className="space-y-4">
                    {projects.map((project) => (
                      <li key={project.id} className="p-3 border border-gray-200 bg-gray-50">
                        <a 
                          href={project.url} 
                          className="font-medium text-blue-700 hover:underline block"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {project.title}
                        </a>
                        <div className="text-sm text-gray-500 mt-1">{project.date_created}</div>
                        <p className="text-sm mt-1">{project.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 italic">No projects found.</p>
                )}
              </div>

              <div className="p-4 border border-gray-300 bg-gray-50">
                <h2 className="text-lg font-medium mb-2">About</h2>
                {hacker.bio ? (
                  <p className="text-gray-700">{hacker.bio}</p>
                ) : (
                  <p className="text-gray-600 italic">
                    This hacker hasn't added a bio yet. Check back later!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onAddProject={handleAddProject}
        initialHackerId={hacker.id}
        initialHackerName={hacker.name}
      />
    </div>
  );
};

export default HackerProfile;
