import React, { useState } from 'react';
import { Trophy, Flame, Coins, Clock, CheckCircle2, Star, TrendingUp, Calendar } from 'lucide-react';
import TopBar from '@/components/TopBar';

const CodeChallengesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'history' | 'leaderboard'>('challenges');

  // Mock data for challenges
  const challenges = [
    {
      id: '1',
      title: 'JavaScript Functions',
      difficulty: 'Beginner',
      points: 50,
      completed: true,
      timeEstimate: '15 min',
      description: 'Practice basic JavaScript function concepts',
      category: 'JavaScript',
    },
    {
      id: '2',
      title: 'React Components',
      difficulty: 'Intermediate',
      points: 100,
      completed: false,
      timeEstimate: '30 min',
      description: 'Build reusable React components',
      category: 'React',
    },
    {
      id: '3',
      title: 'API Integration',
      difficulty: 'Advanced',
      points: 200,
      completed: false,
      timeEstimate: '45 min',
      description: 'Connect to external APIs using fetch',
      category: 'API',
    },
    {
      id: '4',
      title: 'Data Structures',
      difficulty: 'Intermediate',
      points: 150,
      completed: true,
      timeEstimate: '35 min',
      description: 'Implement common data structures',
      category: 'Algorithms',
    },
  ];

  // Mock data for history
  const history = [
    {
      id: '1',
      title: 'CSS Grid Layout',
      points: 75,
      date: '2023-05-15',
      credits: 10,
    },
    {
      id: '2',
      title: 'JavaScript Loops',
      points: 50,
      date: '2023-05-14',
      credits: 5,
    },
    {
      id: '3',
      title: 'HTML Semantics',
      points: 25,
      date: '2023-05-12',
      credits: 3,
    },
  ];

  // Mock data for leaderboard
  const leaderboard = [
    { id: '1', name: 'You', points: 1250, position: 1, isUser: true },
    { id: '2', name: 'Alex Johnson', points: 1120, position: 2, isUser: false },
    { id: '3', name: 'Sam Wilson', points: 980, position: 3, isUser: false },
    { id: '4', name: 'Taylor Reed', points: 875, position: 4, isUser: false },
    { id: '5', name: 'Jordan Kim', points: 760, position: 5, isUser: false },
  ];

  // Stats data
  const stats = {
    streak: 7,
    totalPoints: 1250,
    credits: 42,
    challengesCompleted: 24,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col pb-[env(safe-area-inset-bottom)]">
      <TopBar title="Crack the Code" />
      {/* Stats Summary */}
  <div className="flex flex-row justify-between items-center px-4 py-6 pt-24">
        <div className="flex items-center gap-2">
          <Flame color="orange" size={20} />
          <span className="font-bold text-lg">{stats.streak}</span>
          <span className="text-gray-500 text-xs">Day Streak</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins color="gold" size={20} />
          <span className="font-bold text-lg">{stats.credits}</span>
          <span className="text-gray-500 text-xs">AI Credits</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp color="#6366f1" size={20} />
          <span className="font-bold text-lg">{stats.totalPoints}</span>
          <span className="text-gray-500 text-xs">Total Points</span>
        </div>
      </div>

      {/* Tabs */}
  <div className="flex flex-row bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {['challenges', 'history', 'leaderboard'].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-4 text-center ${activeTab === tab ? 'border-b-2 border-indigo-600' : ''}`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            <span className={`${activeTab === tab ? 'text-indigo-600 font-bold' : 'text-gray-500'} capitalize`}>
              {tab}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {activeTab === 'challenges' && (
          <div>
            <span className="text-lg font-bold mb-4 block">Available Challenges</span>
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">{challenge.title}</span>
                      {challenge.completed ? (
                        <CheckCircle2 color="green" size={20} />
                      ) : null}
                    </div>
                    <span className="text-gray-500 text-sm mt-1 block">{challenge.description}</span>
                    <div className="flex flex-row mt-3 gap-2">
                      <span className="bg-indigo-100 px-2 py-1 rounded-full text-indigo-700 text-xs font-medium">{challenge.category}</span>
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-200 text-xs font-medium">{challenge.difficulty}</span>
                      <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full text-green-700 dark:text-green-300 text-xs font-medium">{challenge.points} pts</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <Clock color="gray" size={16} />
                    <span className="text-gray-500 text-sm ml-1">{challenge.timeEstimate}</span>
                  </div>
                  <button className="bg-indigo-600 px-4 py-2 rounded-lg text-white text-sm font-medium">
                    {challenge.completed ? 'Review' : 'Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <span className="text-lg font-bold mb-4 block">Challenge History</span>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-900 font-bold">Recent Activity</span>
                <span className="flex items-center gap-1">
                  <Calendar color="gray" size={16} />
                  <span className="text-gray-500 text-sm">Last 30 days</span>
                </span>
              </div>
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center py-3 ${index !== history.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div>
                    <span className="font-medium text-gray-900 block">{item.title}</span>
                    <span className="text-gray-500 text-sm block">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins color="gold" size={16} />
                    <span className="text-gray-900 font-bold">+{item.credits}</span>
                    <Star color="orange" size={16} />
                    <span className="text-gray-900 font-bold">+{item.points}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <span className="text-gray-900 font-bold mb-3 block">Achievements</span>
              <div className="flex flex-row flex-wrap gap-2">
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3 flex-1 min-w-[40%] text-center">
                  <Trophy color="gold" size={24} />
                  <span className="text-yellow-800 font-bold mt-1 block">5 Days Streak</span>
                  <span className="text-yellow-600 text-xs block mt-1">Completed challenges for 5 consecutive days</span>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 flex-1 min-w-[40%] text-center">
                  <CheckCircle2 color="blue" size={24} />
                  <span className="text-blue-800 font-bold mt-1 block">10 Solved</span>
                  <span className="text-blue-600 text-xs block mt-1">Solved 10 coding challenges</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div>
            <span className="text-lg font-bold mb-4 block">Leaderboard</span>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              {leaderboard.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center p-4 ${user.isUser ? 'bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-500' : 'border-b border-gray-100 dark:border-gray-700'}`}
                >
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 font-bold text-gray-700">{user.position}</span>
                  <span className={`flex-1 font-medium ${user.isUser ? 'text-indigo-700' : 'text-gray-900'}`}>{user.name}</span>
                  <span className="flex items-center gap-1">
                    <Star color="orange" size={16} />
                    <span className="font-bold text-gray-900">{user.points}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4">
              <span className="text-gray-900 font-bold mb-3 block">Weekly Challenge</span>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4">
                <span className="text-white font-bold text-lg block">Algorithm Master</span>
                <span className="text-indigo-100 text-sm mt-1 block">Solve 5 algorithm challenges this week</span>
                <div className="flex items-center mt-3">
                  <div className="flex-1 bg-indigo-400 h-2 rounded-full overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-white text-sm ml-2">3/5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeChallengesScreen;
