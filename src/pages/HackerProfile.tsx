
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Hacker {
  id: number;
  name: string;
  url: string;
  interests: string[];
  lastUpdated: string;
}

const HackerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [hacker, setHacker] = useState<Hacker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the same mock data from Index.tsx
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

    const findHacker = hackers.find(h => h.id === Number(id));
    setHacker(findHacker || null);
    setLoading(false);
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
              <p className="mb-4">{hacker.lastUpdated}</p>
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
