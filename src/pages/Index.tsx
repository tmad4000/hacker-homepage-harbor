
import React, { useState, useEffect } from "react";

interface Hacker {
  id: number;
  name: string;
  url: string;
  interests: string[];
  lastUpdated: string;
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

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
  
  return (
    <div className="min-h-screen bg-amber-50 text-gray-900 py-8 animate-fade-in">
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
            Click on a name to visit their site.
          </p>
          
          <ul className="list-disc pl-6 space-y-4">
            {hackers.map((hacker) => (
              <li key={hacker.id} className="animate-fade-in" style={{ animationDelay: `${hacker.id * 100}ms` }}>
                <a 
                  href={hacker.url} 
                  className="retro-link block group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <span className="text-base md:text-lg font-medium">{hacker.name}</span>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {hacker.interests.map((interest, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 md:mt-0">
                      Last updated: {hacker.lastUpdated}
                    </div>
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
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5QQXEg0gNICLKwAAA8RJREFUOMull11oW2UYx3/POZG2adKsXWPptmwa1K7dBnFeKIpQp9CPi+JNvRHBC724WAQRBbeLIl54J4IXgheC1wiCMEFxbMwp68f8GLS1tF2aNM2aNucceV+Pc3LS5GQ0+F8955z3fZ//83+e5/mfV9i2bXMbkm1OJpNhZHSU0VOn5i/aFpk/PyPIZrOMvfU209PTADjjcWLtbUzF/2L0hRfuDNyyLCYnJ7nw01m+PPEF1WoVx7Uh+dW3XxCqqmRyOS5dusT582MMbhl4TxgkYMzPE3/yKVZkJeSGKB17CQBtWaRe38Gm5jD+qiTz7l5OPjdEU1OT+4nDsmzWi+LJ57FGT5P9+DDhnZ0YHx7jwqYtxOoCRHyC+miU7Je/snrbXjraY2tD1zSU3kGCtTWkl1cQ6dxF4peDXPn+OPcte4HWaJS8UUEV4Pjkc8L1Hlo3RFdHeaqq0jc4RLC/n8TZk/QeeIW88FOdl7CrIFSPUKV8Sj54hImB3bRG69zXoYiivP7sMO07dzHx3UeYZ05jXL2MYVrEojF8TivFzA2SqQxCqeHAgX2EwyGnRu7itW2b4eFhKpUK3T3dFG7O89HBvXycqyMSDPDwlgdIvPk209PTtKxfT60/gGHoLi6I4pgxDJ3h4WHGx8fdnKDvHrr7HkOVAjM1Prrb2qhUKnx94hiamWR5aYlbt25xtq+T5lCQSt5iduYGZj5HsaDicxTLZDJs377dJVBTVbp6ehmfnqOYy3Luh8+JRqNEo1Gu/PIpp0ZOouk6QggUr4dAIEDPwf30bd2GLwDFQsHtEGdRBIMh1q5bR+qffzF0zd1cXVMp5NOoqkoul3OvAxAOR0gmk7z7ziEGBgbo7e3ln+vXWVxYoFAoOLVbL/H6AGohjzc8QENDAxOJBJOJhLtQCHGbJyNHCQQC5HJ5RkZGANA0jdXU7DLYwfGTpwhvfpiDhz9G8SqUS0VUTeP07ycJNjbS09NDoVDg5s0MlmWxbVsHiUQCwzCwLItcNksmk3ErpaqKm2hpacHv97O0tEQqlVoVxxMnTvDc0xcRK7FMJuOGLRQKkU6n3RIopZTrYw3x+Xy0tbXh8/kolUpomubC0+k0+XweRVGIRCLu4VjOm81mY5kAABf1SAUQQiCEwO/3Y5qmm1CzLJSHhoYYGBhgcHCQ1tbWNfDVh2M5z+97R0dHl2csgC2/oc97pOMdz44bHl+9FKCpqQlN09wJnkPm5GUymVwl7X28X/dxu1Z/TxRFoa6urj7yNTrx2M3/AwQo0lwMCBZ8AAAAAElFTkSuQmCC" 
              width="22" 
              height="22" 
              alt="Valid HTML 4.01"
              className="mr-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
