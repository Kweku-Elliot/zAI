import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Layers, Code, Palette, ChevronRight } from 'lucide-react';
import TopBar from '@/components/TopBar';

export default function ProjectSetupScreen() {
  const [, setLocation] = useLocation();
  const [projectName, setProjectName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedColorScheme, setSelectedColorScheme] = useState('');

  const languages = [
    { id: 'react', name: 'React Native' },
    { id: 'flutter', name: 'Flutter' },
    { id: 'swift', name: 'Swift' },
    { id: 'kotlin', name: 'Kotlin' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Ocean Blue', colors: ['#3B82F6', '#60A5FA', '#93C5FD'] },
    { id: 'green', name: 'Forest Green', colors: ['#10B981', '#34D399', '#6EE7B7'] },
    { id: 'purple', name: 'Royal Purple', colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'] },
    { id: 'pink', name: 'Coral Pink', colors: ['#EC4899', '#F472B6', '#F9A8D4'] },
    { id: 'indigo', name: 'Midnight Indigo', colors: ['#6366F1', '#818CF8', '#A5B4FC'] },
    { id: 'amber', name: 'Sunset Amber', colors: ['#F59E0B', '#FBBF24', '#FCD34D'] },
  ];

  const handleProcess = () => {
    // Save project setup data if needed
    setLocation('/generation-ui');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar title="New Project" />
      <div className="max-w-xl mx-auto p-6 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New Project</h1>
          <p className="text-gray-600">Set up your project preferences to get started</p>
        </div>

        {/* Project Name */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <Layers size={20} color="#3B82F6" className="mr-2" />
            <span className="text-lg font-semibold text-gray-800">Project Name</span>
          </div>
          <input
            className="bg-white border border-gray-300 rounded-xl p-4 text-base w-full"
            placeholder="Enter your project name"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <Code size={20} color="#3B82F6" className="mr-2" />
            <span className="text-lg font-semibold text-gray-800">Language</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {languages.map((language) => (
              <button
                key={language.id}
                className={`px-4 py-3 rounded-xl border transition-colors ${
                  selectedLanguage === language.id
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-white border-gray-300'
                }`}
                onClick={() => setSelectedLanguage(language.id)}
              >
                <span
                  className={`font-medium ${
                    selectedLanguage === language.id ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {language.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme Selection */}
        <div className="mb-10">
          <div className="flex items-center mb-3">
            <Palette size={20} color="#3B82F6" className="mr-2" />
            <span className="text-lg font-semibold text-gray-800">Color Scheme</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                className={`w-28 h-28 rounded-xl border-2 transition-colors ${
                  selectedColorScheme === scheme.id
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedColorScheme(scheme.id)}
              >
                <div className="flex rounded-t-xl overflow-hidden">
                  <div style={{ backgroundColor: scheme.colors[0] }} className="flex-1 h-8" />
                  <div style={{ backgroundColor: scheme.colors[1] }} className="flex-1 h-8" />
                </div>
                <div style={{ backgroundColor: scheme.colors[2] }} className="h-6 rounded-b-xl" />
                <div className="absolute bottom-2 left-0 right-0">
                  <span className="text-center text-xs font-medium text-gray-800 bg-white/80 mx-2 py-1 rounded">
                    {scheme.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Process Button */}
        <button
          className={`py-4 rounded-xl flex items-center justify-center w-full transition-colors ${
            projectName && selectedLanguage && selectedColorScheme
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-400'
          }`}
          disabled={!projectName || !selectedLanguage || !selectedColorScheme}
          onClick={handleProcess}
        >
          <span className="text-lg font-semibold mr-2">Process</span>
          <ChevronRight size={20} color="white" />
        </button>
      </div>
    </div>
  );
}
