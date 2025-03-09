import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Hacker {
  id: string;
  name: string;
  url: string;
  interests: string[];
  last_updated: string;
}

interface Project {
  id: string;
  title: string;
  creator: string;
  description: string;
  date_created: string;
  url: string;
  hacker_id: string;
}

const HackerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [hacker, setHacker] = useState<Hacker | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
              {projects.length > 0 ? (
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">Projects</h2>
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
                </div>
              ) : (
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">Projects</h2>
                  <p className="text-gray-600 italic">No projects found.</p>
                </div>
              )}

              <div className="p-4 border border-gray-300 bg-gray-50">
                <h2 className="text-lg font-medium mb-2">About</h2>
                <p className="text-gray-600 italic">
                  This hacker hasn't added a bio yet. Check back later!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackerProfile;
