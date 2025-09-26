import React, { useState } from 'react';
import { CheckCircle, Trophy, Users, Clock } from 'lucide-react';

const challenges = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Master fundamental JS concepts",
    participants: 2450,
    duration: "7 days",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1634715972006-c16b5518f501?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    title: "React Components",
    description: "Build reusable UI components",
    participants: 1890,
    duration: "14 days",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1634715972006-c16b5518f501?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  },
  {
    id: 3,
    title: "API Integration",
    description: "Connect to RESTful services",
    participants: 1420,
    duration: "10 days",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  },
  {
    id: 4,
    title: "State Management",
    description: "Redux and Context patterns",
    participants: 960,
    duration: "14 days",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  },
  {
    id: 5,
    title: "Testing Strategies",
    description: "Jest and React Testing Library",
    participants: 720,
    duration: "7 days",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1634715972006-c16b5518f501?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  },
  {
    id: 6,
    title: "Performance Optimization",
    description: "Improve app speed and UX",
    participants: 590,
    duration: "10 days",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop"
  }
];

const ChallengesScreen: React.FC = () => {
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);

  const toggleChallenge = (id: number) => {
    setSelectedChallenges(selectedChallenges.includes(id)
      ? selectedChallenges.filter(challengeId => challengeId !== id)
      : [...selectedChallenges, id]
    );
  };

  return (
  <div className="min-h-screen bg-background flex flex-col pb-[env(safe-area-inset-bottom)] mobile-safe-container text-foreground">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <h1 className="text-3xl font-bold text-card-foreground">Code Challenges</h1>
        <p className="text-muted-foreground mt-2">Select coding challenges to enhance your skills</p>
      </div>

      {/* Challenge List */}
      <div className="flex-1 p-4">
        <div className="flex flex-wrap gap-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`flex-1 min-w-[300px] max-w-[350px] bg-white rounded-xl border-2 ${selectedChallenges.includes(challenge.id) ? 'border-blue-500' : 'border-gray-100'} shadow-sm overflow-hidden cursor-pointer`}
              onClick={() => toggleChallenge(challenge.id)}
            >
              <div className="relative">
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full h-32 object-cover"
                />
                {selectedChallenges.includes(challenge.id) && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <CheckCircle size={20} color="white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-900">{challenge.title}</h2>
                <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>
                <div className="flex items-center mt-3">
                  <Users size={16} color="#6B7280" />
                  <span className="text-gray-500 text-sm ml-1">{challenge.participants} developers</span>
                </div>
                <div className="flex items-center mt-1">
                  <Clock size={16} color="#6B7280" />
                  <span className="text-gray-500 text-sm ml-1">{challenge.duration}</span>
                </div>
                <div className="mt-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : challenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Challenges Summary */}
        {selectedChallenges.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy size={20} color="#3B82F6" />
                <span className="font-bold text-blue-800 ml-2">Selected Challenges</span>
              </div>
              <span className="font-bold text-blue-800">{selectedChallenges.length} selected</span>
            </div>
            <div className="mt-3">
              {selectedChallenges.map(id => {
                const challenge = challenges.find(c => c.id === id);
                return (
                  <div key={id} className="flex items-center mt-1">
                    <span className="text-blue-700 text-sm">• {challenge?.title}</span>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 bg-blue-500 rounded-lg py-3 w-full text-center font-bold text-white">Start Challenges</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesScreen;
