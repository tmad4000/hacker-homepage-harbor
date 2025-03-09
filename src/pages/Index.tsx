import React, { useState, useEffect } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AddHackerModal from "@/components/AddHackerModal";
import AddProjectModal from "@/components/AddProjectModal";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Hacker {
  id: string;
  name: string;
  url: string | null;
  interests: string[];
  last_updated: string;
  bio: string | null;
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

const sampleHackers = [
  {
    name: "Ada Lovelace",
    url: "https://ada-lovelace.dev",
    interests: ["Algorithms", "Mathematical Engines", "Analytical Computation"]
  },
  {
    name: "Grace Hopper",
    url: "https://gracehopper.tech",
    interests: ["Compilers", "Programming Languages", "COBOL"]
  },
  {
    name: "Alan Turing",
    url: "https://turingmachine.io",
    interests: ["Cryptography", "Machine Learning", "Computational Theory"]
  },
  {
    name: "Linus Torvalds",
    url: "https://linux-kernel.org",
    interests: ["Operating Systems", "Git", "Open Source"]
  },
  {
    name: "Margaret Hamilton",
    url: "https://moonlanding.space",
    interests: ["Software Engineering", "Space Systems", "Error Prevention"]
  }
];

const sampleProjects = [
  {
    title: "Analytical Engine Simulator",
    creator: "Ada Lovelace",
    description: "A modern implementation of Babbage's Analytical Engine with web interface",
    url: "https://github.com/adalovelace/analytical-engine"
  },
  {
    title: "FLOW-MATIC Revived",
    creator: "Grace Hopper",
    description: "Reimagining the first English-like data processing language",
    url: "https://github.com/gracehopper/flow-matic"
  },
  {
    title: "Turing Complete",
    creator: "Alan Turing",
    description: "A puzzle game teaching the fundamentals of computer architecture",
    url: "https://github.com/alanturing/turing-complete"
  },
  {
    title: "Git Internals Explorer",
    creator: "Linus Torvalds",
    description: "Visualize and understand how Git works under the hood",
    url: "https://github.com/linustorvalds/git-explorer"
  },
  {
    title: "Zero-Error Framework",
    creator: "Margaret Hamilton",
    description: "A modern framework inspired by NASA's mission-critical software principles",
    url: "https://github.com/mhamilton/zero-error"
  }
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hackersData, setHackersData] = useState<Hacker[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [showAddHackerModal, setShowAddHackerModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  
  const findHackerIdByName = (name: string) => {
    const hacker = hackersData.find(h => h.name === name);
    return hacker ? hacker.id : null;
  };

  const filteredHackers = hackersData.filter(hacker => 
    hacker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hacker.interests.some(interest => 
      interest.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const populateSampleData = async () => {
    setIsPopulating(true);
    try {
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('hackers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      for (const hacker of sampleHackers) {
        const { error } = await supabase
          .from('hackers')
          .insert({
            name: hacker.name,
            url: hacker.url,
            interests: hacker.interests,
          });
          
        if (error) {
          console.error("Error adding hacker:", error);
          throw error;
        }
      }
      
      const { data: hackers, error: hackersError } = await supabase
        .from('hackers')
        .select('*');
        
      if (hackersError) throw hackersError;
      
      for (const project of sampleProjects) {
        const hacker = hackers.find(h => h.name === project.creator);
        if (hacker) {
          const { error } = await supabase
            .from('projects')
            .insert({
              title: project.title,
              creator: project.creator,
              description: project.description,
              url: project.url,
              hacker_id: hacker.id
            });
            
          if (error) throw error;
        }
      }
      
      fetchData();
      toast.success('Sample data added successfully!');
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast.error('Failed to add sample data');
    } finally {
      setIsPopulating(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    setTimeout(() => {
      const randomVisitorCount = Math.floor(Math.random() * 15000) + 10000;
      setVisitorCount(randomVisitorCount);
    }, 1200);
    
    fetchData();
    
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: hackers, error: hackersError } = await supabase
        .from('hackers')
        .select('*');
        
      if (hackersError) throw hackersError;
      
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');
        
      if (projectsError) throw projectsError;
      
      setHackersData(hackers.map(hacker => ({
        ...hacker,
        last_updated: new Date(hacker.last_updated).toISOString().split('T')[0]
      })));
      
      setProjectsData(projects.map(project => ({
        ...project,
        date_created: new Date(project.date_created).toISOString().split('T')[0]
      })));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleAddHacker = async (newHacker: { name: string; url: string | null; interests: string[]; bio: string | null }) => {
    try {
      const { data, error } = await supabase
        .from('hackers')
        .insert({
          name: newHacker.name,
          url: newHacker.url || '',
          interests: newHacker.interests,
          bio: newHacker.bio,
        })
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedHacker = {
          ...data[0],
          last_updated: new Date(data[0].last_updated).toISOString().split('T')[0]
        };
        
        setHackersData([...hackersData, formattedHacker]);
        toast.success(`${newHacker.name} has been added to the directory`);
      }
    } catch (error) {
      console.error('Error adding hacker:', error);
      toast.error('Failed to add hacker');
    }
  };

  const handleAddProject = async (newProject: { title: string; creator: string; description: string; url: string; hacker_id: string | null }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          creator: newProject.creator,
          description: newProject.description,
          url: newProject.url,
          hacker_id: newProject.hacker_id
        })
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedProject = {
          ...data[0],
          date_created: new Date(data[0].date_created).toISOString().split('T')[0]
        };
        
        setProjectsData([...projectsData, formattedProject]);
        toast.success(`${newProject.title} has been added to projects`);
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
    }
  };
  
  return (
    <div className="min-h-screen bg-white text-gray-900 py-8 animate-fade-in">
      <div className="retro-container">
        <header className="text-center mb-10">
          <div className="inline-block bg-blue-700 text-white px-4 py-2 mb-4">
            <h1 className="font-pixel text-2xl md:text-4xl">
              Hackers at Berkeley
            </h1>
          </div>
          <div className="text-xs md:text-sm opacity-75 mb-2 font-mono">
            <span className="inline-block bg-gray-200 px-2 py-1">
              {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
              <span className="blink ml-1">_</span>
            </span>
          </div>
          <p className="text-sm md:text-base italic">
            A directory of personal homepages for Berkeley's hacker community
          </p>
          
          {hackersData.length === 0 && !loading && (
            <button 
              onClick={populateSampleData} 
              disabled={isPopulating}
              className="mt-4 px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-sm rounded"
            >
              {isPopulating ? 'Adding Sample Data...' : 'Add Sample Data'}
            </button>
          )}
        </header>
        
        <div className="mb-6 p-4 border border-gray-300 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg md:text-xl font-pixel text-gray-800">
              &lt;Directory&gt;
            </h2>
            <div className="text-xs text-gray-500">
              {loading ? (
                <span>Loading stats<span className="blink">...</span></span>
              ) : (
                <span>Visitors: {visitorCount?.toLocaleString()}</span>
              )}
            </div>
          </div>
          <p className="mb-4 text-sm">
            Welcome to our old-school directory of Hackers at Berkeley personal homepages. 
            Click on a name to view their profile or visit their site.
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-grow mr-2">
              <input
                type="text"
                placeholder="Search by name or interest..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-3 pl-9 border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <button 
              onClick={() => setShowAddHackerModal(true)}
              className="flex items-center px-3 py-2 bg-green-600 text-white hover:bg-green-700 text-sm"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Hacker
            </button>
          </div>
          
          <ul className="list-disc pl-6 space-y-4">
            {filteredHackers.length === 0 ? (
              <li className="text-gray-500 italic">No results found. Try a different search term.</li>
            ) : (
              filteredHackers.map((hacker, index) => (
                <li key={hacker.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <Link 
                        to={`/hacker/${hacker.id}`}
                        className="text-base md:text-lg font-medium hover:text-blue-700 hover:underline"
                      >
                        {hacker.name}
                      </Link>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {hacker.interests.map((interest, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 md:mt-0 flex items-center">
                      <span className="mr-2">Last updated: {hacker.last_updated}</span>
                      {hacker.url && (
                        <a 
                          href={hacker.url} 
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Site →
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        
        <div className="mb-6 p-4 border border-gray-300 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg md:text-xl font-pixel text-gray-800">
              &lt;Recent Projects&gt;
            </h2>
            <button 
              onClick={() => setShowAddProjectModal(true)}
              className="flex items-center px-3 py-2 bg-green-600 text-white hover:bg-green-700 text-sm"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Project
            </button>
          </div>
          <p className="mb-4 text-sm">
            Check out these recent projects from our hacker community.
          </p>
          
          <ul className="list-disc pl-6 space-y-4">
            {projectsData.map((project, index) => (
              <li key={project.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div>
                  <a 
                    href={project.url} 
                    className="retro-link block group text-base md:text-lg font-medium"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {project.title}
                  </a>
                  <div className="text-xs text-gray-500 mt-1">
                    By{" "}
                    {findHackerIdByName(project.creator) ? (
                      <Link
                        to={`/hacker/${findHackerIdByName(project.creator)}`}
                        className="hover:underline text-blue-600"
                      >
                        {project.creator}
                      </Link>
                    ) : (
                      <span>{project.creator}</span>
                    )}
                    {" • "}{project.date_created}
                  </div>
                  <p className="text-sm mt-1">{project.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-10">
          <hr className="retro-hr" />
          <p>
            Made with <span className="text-red-500">♥</span> at Berkeley, CA 
            <br />
            Best viewed with Netscape Navigator or Internet Explorer 4.0
          </p>
          <div className="mt-2 inline-block">
            <img 
              src="data:image/gif;base64,R0lGODlhVgAcALMAAAAAAP///3V1dWZmZlVVVf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAWAB0AAAT/EMhJq7046827/2AojmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter/gsHhMLpvP6LR6zW673/C4fE6v2+/4vH7P7/v/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AXQQYMGPBFQQYHESZ0qFDDwoZF" 
              width="86" 
              height="28" 
              alt="Best viewed with Netscape"
              className="mr-2"
            />
            <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5QQXEg0gNICLKwAAA8RJREFUOMull11oW2UYx3/POZG2adKsXWPptmwa1K7dBnFeKIpQp9CPi+JNvRHBC724WAQRBbeLIl54J4IXgjeC1wiCMEFxbMwp68f8GLS1tF2aNM2aNecceV+Pc3LS5GQ0+F8953z3fZ//83+e5/mfV9i2bXMbkm1OJpNhZHSU0VOn5i/aFpk/PyPIZrOMvfU209PTADjjcWLtbUzF/2L0hRfuDNyyLCYnJ7nw01m+PPEF1WoVx7Uh+dW3XxCqqmRyOS5dusT582MMbhl4TxgkYMzPE3/yKVZkJeSGKB17CQBtWaRe38Gm5jD+qiTz7l5OPjdEU1OT+4nDsmzWi+LJ57FGT5P9+DDhnZ0YHx7jwqYtxOoCRHyC+miU7Je/snrbXjraY2tD1zSU3kGCtTWkl1cQ6dxF4peDXPn+OPcte4HWaJS8UUEV4Pjkc8L1Hlo3RFdHeaqq0jc4RLC/n8TZk/QeeIW88FOdl7CrIFSPUKV8Sj54hImB3bRG69zXoYiivP7sMO07dzHx3UeYZ05jXL2MYVrEojF8TivFzA2SqQxCqeHAgX2EwyGnRu7itW2b4eFhKpUK3T3dFG7O89HBvXycqyMSDPDwlgdIvPk209PTtKxfT60/gGHoLi6I4pgxDJ3h4WHGx8fdnKDvHrr7HkOVAjM1Prrbhh5RAAAC70lEQVR18gGqRiOjEgkkKcWqaupWVYtFW7S1rTW7a8uuZbsV26q+L6J2q+hTjZjZkGZJCJmQADH9/HHvhJlJJmFeuu3nd+7lnu/cc7jnfPccFqVSiaWlJba3t6lUKnQ6HSRpz4NWq0W9Xn9kbnZ2FsuyeO655xgZGeHs2bMEg0HC4TDxeJxMJsPIyAgXLlwgGo0ONGztwePxsKff26OP07R/TKvf0EMwDBCgIikpuVRSekpKQdq7PnXy5J6HJVZ50u1lm3VucbmtsWKxgCzLewU9fPQYbreb5eVlpqenKRaLVCqVPZnY7ZimiWEYvPnmG7zyyss8/clTJD47wfT0RYpO1Ww+6HA46PV6XLp0Cd9jPtrLy1xeOsNFP6T9TtYGnzO+dJKLL/iJ+Lz0e31MBoXDWK2t+xJ/bnUhzpEtVZiauMhbXzWJ+L00VpdZWlmlWK3TbLWZW1hkdGiIhGrS6GmgmSA1qC5v73z/d6Xb7fLgwQPFVIv+7J/p9rYhXnntda5cu05ba9PVH9JQO/T1Lm+8+RZ/+OJ/8Pv2Pt7Uf/a5IrJrm83m/zY0TXOQYwBUVRVO9X1JkkgkEgSDQXw+H21F5r/XrhH0+9jY2GB9fYN6rU7A5yMSDDDkcxEJevC6VCTJgWyY9DstDNMCDkRCIe5NTdFQtjnzqVPY7XYkSVLkTdOk3W5TrVZRVXXXKIWR0RihUIhms0mlUuHixYsPPbLFvXv38Pl8xGIxDMNAkiT0nqHkDBVL66JrOs1Wa48RksSdO3eUGJnNZrHZbLRaLaSHMDQa9apALs5ZKpUKtVptUN/3l9zcXMb7+DHi8QQ+/xBWv41qKzSaDWqKs1htVh4/PspLY8/T7ffYWCsyk5ljfaMkqlLsIzd1tQT/AHcdWG6LxV/DAAAAAElFTkSuQmCC" 
              width="22" 
              height="22" 
              alt="Valid HTML 4.01"
              className="mr-2"
            />
          </div>
        </div>
      </div>
      
      <AddHackerModal 
        isOpen={showAddHackerModal}
        onClose={() => setShowAddHackerModal(false)}
        onAddHacker={handleAddHacker}
      />
      
      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
};

export default Index;
