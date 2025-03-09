
import React, { useState, useEffect } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AddHackerModal from "@/components/AddHackerModal";
import AddProjectModal from "@/components/AddProjectModal";
import { Toaster } from "@/components/ui/toaster";

interface Hacker {
  id: number;
  name: string;
  url: string;
  interests: string[];
  lastUpdated: string;
}

interface Project {
  id: number;
  title: string;
  creator: string;
  description: string;
  dateCreated: string;
  url: string;
}

const hackers: Hacker[] = [
  {
    id: 1,
    name: "Alex Chen",
    url: "https://alexchen.berkeley.edu",
    interests: ["Quantum Computing", "Blockchain", "AI"],
    lastUpdated: "2023-05-15"
  },
  {
    id: 2, 
    name: "Jordan Taylor",
    url: "https://jtaylor.berkeley.edu",
    interests: ["Cybersecurity", "Open Source", "Linux"],
    lastUpdated: "2023-08-22"
  },
  {
    id: 3,
    name: "Sam Rodriguez",
    url: "https://samrodriguez.berkeley.edu",
    interests: ["Robotics", "Machine Learning", "IoT"],
    lastUpdated: "2023-11-03"
  },
  {
    id: 4,
    name: "Morgan Lee",
    url: "https://morganlee.berkeley.edu",
    interests: ["Web3", "Distributed Systems", "Privacy"],
    lastUpdated: "2023-09-18"
  },
  {
    id: 5,
    name: "Taylor Johnson",
    url: "https://tjohnson.berkeley.edu",
    interests: ["Game Development", "AR/VR", "Computer Graphics"],
    lastUpdated: "2023-10-27"
  },
  {
    id: 6,
    name: "Casey Williams",
    url: "https://caseyw.berkeley.edu",
    interests: ["Mobile Development", "UX Design", "Accessibility"],
    lastUpdated: "2023-07-14"
  },
  {
    id: 7,
    name: "Riley Patel",
    url: "https://rpatel.berkeley.edu",
    interests: ["Systems Programming", "Compilers", "Low-level Optimization"],
    lastUpdated: "2023-12-05"
  },
  {
    id: 8,
    name: "Jamie Garcia",
    url: "https://jamieg.berkeley.edu",
    interests: ["Network Security", "Ethical Hacking", "Bug Bounty"],
    lastUpdated: "2023-11-20"
  }
];

const recentProjects: Project[] = [
  {
    id: 1,
    title: "Distributed Neural Network Framework",
    creator: "Alex Chen",
    description: "Open-source framework for distributed neural network training",
    dateCreated: "2023-12-10",
    url: "https://github.com/alexchen/dist-neural-net"
  },
  {
    id: 2,
    title: "Privacy-Preserving ML",
    creator: "Morgan Lee",
    description: "Machine learning algorithms that protect user privacy",
    dateCreated: "2023-11-25", 
    url: "https://github.com/morganlee/private-ml"
  },
  {
    id: 3,
    title: "Decentralized Git Platform",
    creator: "Jamie Garcia",
    description: "Git-compatible version control system using blockchain tech",
    dateCreated: "2023-12-02",
    url: "https://github.com/jamieg/decentragit"
  },
  {
    id: 4,
    title: "Autonomous Drone Navigation",
    creator: "Sam Rodriguez",
    description: "Computer vision algorithms for drone obstacle avoidance",
    dateCreated: "2023-10-30",
    url: "https://github.com/samrodriguez/drone-nav"
  }
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hackersData, setHackersData] = useState<Hacker[]>(hackers);
  const [projectsData, setProjectsData] = useState<Project[]>(recentProjects);
  const [showAddHackerModal, setShowAddHackerModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  
  const filteredHackers = hackersData.filter(hacker => 
    hacker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hacker.interests.some(interest => 
      interest.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Simulate loading and getting visitor count from "server"
    setTimeout(() => {
      // Generate a random number between 10000 and 25000
      const randomVisitorCount = Math.floor(Math.random() * 15000) + 10000;
      setVisitorCount(randomVisitorCount);
      setLoading(false);
    }, 1200);
    
    return () => clearInterval(timer);
  }, []);

  const handleAddHacker = (newHacker: { name: string; url: string; interests: string[] }) => {
    const formattedHacker: Hacker = {
      id: hackersData.length > 0 ? Math.max(...hackersData.map(h => h.id)) + 1 : 1,
      name: newHacker.name,
      url: newHacker.url,
      interests: newHacker.interests,
      lastUpdated: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    };
    
    setHackersData([...hackersData, formattedHacker]);
  };

  const handleAddProject = (newProject: { title: string; creator: string; description: string; url: string }) => {
    const formattedProject: Project = {
      id: projectsData.length > 0 ? Math.max(...projectsData.map(p => p.id)) + 1 : 1,
      title: newProject.title,
      creator: newProject.creator,
      description: newProject.description,
      dateCreated: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      url: newProject.url
    };
    
    setProjectsData([...projectsData, formattedProject]);
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
              filteredHackers.map((hacker) => (
                <li key={hacker.id} className="animate-fade-in" style={{ animationDelay: `${hacker.id * 100}ms` }}>
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
                      <span className="mr-2">Last updated: {hacker.lastUpdated}</span>
                      <a 
                        href={hacker.url} 
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Site →
                      </a>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        
        {/* Recent Projects Section */}
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
            {projectsData.map((project) => (
              <li key={project.id} className="animate-fade-in" style={{ animationDelay: `${project.id * 100}ms` }}>
                <a 
                  href={project.url} 
                  className="retro-link block group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <div>
                    <span className="text-base md:text-lg font-medium">{project.title}</span>
                    <div className="text-xs text-gray-500 mt-1">
                      By {project.creator} • {project.dateCreated}
                    </div>
                    <p className="text-sm mt-1">{project.description}</p>
                  </div>
                </a>
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
      
      {/* Add Hacker Modal */}
      <AddHackerModal 
        isOpen={showAddHackerModal}
        onClose={() => setShowAddHackerModal(false)}
        onAddHacker={handleAddHacker}
      />
      
      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
};

export default Index;
