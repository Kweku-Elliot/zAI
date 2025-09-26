import { useState } from 'react';
import TopBar from '@/components/TopBar';
import {
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
  Search,
  Download,
  Heart,
  Share2,
  Settings,
  Wand2,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';

type GeneratedContent = {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  likes: number;
  downloads: number;
  image: string;
  isLiked: boolean;
};

const mockGeneratedContent: GeneratedContent[] = [
  {
    id: '1',
    type: 'image',
    title: 'Abstract Art',
    description: 'Generated with prompt: "Abstract art with vibrant colors"',
    likes: 24,
    downloads: 12,
    image: 'https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?w=900&auto=format&fit=crop&q=60',
    isLiked: false,
  },
  {
    id: '2',
    type: 'video',
    title: 'Cyberpunk Scene',
    description: 'Generated with prompt: "Futuristic cyberpunk city"',
    likes: 42,
    downloads: 31,
    image: 'https://plus.unsplash.com/premium_photo-1700769221371-e6fbd55753ee?w=900&auto=format&fit=crop&q=60',
    isLiked: true,
  },
  {
    id: '3',
    type: 'image',
    title: 'Minimalist Design',
    description: 'Generated with prompt: "Clean, minimalist graphic design"',
    likes: 18,
    downloads: 9,
    image: 'https://images.unsplash.com/photo-1544654423372-91c3d0dade3b?w=900&auto=format&fit=crop&q=60',
    isLiked: false,
  },
  {
    id: '4',
    type: 'image',
    title: 'Digital Art',
    description: 'Generated with prompt: "Digital art with geometric shapes"',
    likes: 35,
    downloads: 22,
    image: 'https://images.unsplash.com/photo-1729179666011-38d13280b92f?w=900&auto=format&fit=crop&q=60',
    isLiked: false,
  },
];

const mockPrompts = [
  'Abstract art with vibrant colors',
  'Futuristic cyberpunk city',
  'Minimalist graphic design',
  'Digital art with geometric shapes',
  '3D rendering of a mountain landscape',
];

export default function ImageVideoGenPage() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [searchQuery, setSearchQuery] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(mockGeneratedContent);
  const [recentPrompts] = useState(mockPrompts);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{id: string, uri: string, type: 'image' | 'video'} | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleLike = (id: string) => {
    setGeneratedContent(prev => prev.map(item =>
      item.id === id ? { ...item, isLiked: !item.isLiked } : item
    ));
  };

  const generateContent = () => {
    if (!prompt.trim()) return;
    const newContent: GeneratedContent = {
      id: `${generatedContent.length + 1}`,
      type: activeTab === 'images' ? 'image' : 'video',
      title: prompt.substring(0, 20) + (prompt.length > 20 ? '...' : ''),
      description: `Generated with prompt: "${prompt}"`,
      likes: 0,
      downloads: 0,
      image: 'https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?w=900&auto=format&fit=crop&q=60',
      isLiked: false,
    };
    setGeneratedContent([newContent, ...generatedContent]);
    setPrompt('');
    setShowPromptInput(false);
  };

  const filteredContent = generatedContent.filter(item =>
    (activeTab === 'images' ? item.type === 'image' : item.type === 'video') &&
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openMediaViewer = (id: string, uri: string, type: 'image' | 'video') => {
    setSelectedMedia({ id, uri, type });
  };
  const closeMediaViewer = () => setSelectedMedia(null);
  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMedia) return;
    const currentIndex = filteredContent.findIndex(item => item.id === selectedMedia.id);
    if (currentIndex === -1) return;
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredContent.length - 1;
    } else {
      newIndex = currentIndex < filteredContent.length - 1 ? currentIndex + 1 : 0;
    }
    const newItem = filteredContent[newIndex];
    setSelectedMedia({
      id: newItem.id,
      uri: newItem.image,
      type: newItem.type,
    });
  };

  return (
  <div className="min-h-screen bg-background flex flex-col pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] text-foreground mobile-safe-container">
      {/* Top Bar */}
      <TopBar title="AI Generation" />
      <div className="px-4">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
          <Search color="#6B7280" size={20} />
          <input
            className="flex-1 p-4 text-gray-900 dark:text-gray-100 bg-transparent outline-none"
            placeholder="Search generated content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Tab Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            className={`flex-1 py-3 rounded-md flex items-center justify-center ${activeTab === 'images' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            <ImageIcon color={activeTab === 'images' ? '#3B82F6' : '#6B7280'} size={18} />
            <span className={`font-medium ml-2 ${activeTab === 'images' ? 'text-blue-500 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>Images</span>
          </button>
          <button
            className={`flex-1 py-3 rounded-md flex items-center justify-center ${activeTab === 'videos' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <VideoIcon color={activeTab === 'videos' ? '#3B82F6' : '#6B7280'} size={18} />
            <span className={`font-medium ml-2 ${activeTab === 'videos' ? 'text-blue-500 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>Videos</span>
          </button>
        </div>
        {/* Generate Button */}
        <button
          className="bg-blue-500 flex items-center justify-center py-4 rounded-xl mb-4 w-full"
          onClick={() => setShowPromptInput(!showPromptInput)}
        >
          <Wand2 color="white" size={20} />
          <span className="text-white font-bold text-lg ml-2">{showPromptInput ? 'Cancel' : 'Generate New Content'}</span>
        </button>
        {/* Prompt Input */}
        {showPromptInput && (
          <div className="mb-4">
            <div className="flex bg-white rounded-xl p-4 mb-3">
              <textarea
                className="flex-1 text-gray-900 bg-transparent outline-none resize-none"
                placeholder="Enter your creative prompt..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={2}
              />
            </div>
            {/* Recent Prompts */}
            <div className="text-gray-500 font-medium mb-2">Recent Prompts:</div>
            <div className="flex gap-2 mb-3 overflow-x-auto">
              {recentPrompts.map((recentPrompt, index) => (
                <button
                  key={index}
                  className="bg-gray-100 px-3 py-2 rounded-lg text-gray-700 text-sm"
                  onClick={() => setPrompt(recentPrompt)}
                >
                  {recentPrompt}
                </button>
              ))}
            </div>
            <button
              className="bg-blue-600 py-3 rounded-xl w-full text-white font-bold"
              onClick={generateContent}
            >
              Generate
            </button>
          </div>
        )}
      </div>
      {/* Content Grid */}
      <div className="flex-1 p-4">
        <div className="flex flex-wrap gap-4">
          {filteredContent.map(item => (
            <button
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm flex-1 min-w-[45%] text-left"
              onClick={() => openMediaViewer(item.id, item.image, item.type)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <div className="font-bold text-gray-900 mb-1 truncate">{item.title}</div>
                <div className="text-gray-500 text-sm mb-3 truncate">{item.description}</div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      className="flex items-center mr-3"
                      onClick={e => {
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                    >
                      <Heart
                        color={item.isLiked ? '#EF4444' : '#6B7280'}
                        size={16}
                        fill={item.isLiked ? '#EF4444' : 'none'}
                      />
                      <span className="text-gray-500 text-sm ml-1">{item.likes}</span>
                    </button>
                    <span className="flex items-center">
                      <Download color="#6B7280" size={16} />
                      <span className="text-gray-500 text-sm ml-1">{item.downloads}</span>
                    </span>
                  </div>
                  <button className="ml-2">
                    <Share2 color="#6B7280" size={16} />
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-black">
            <button onClick={closeMediaViewer}>
              <X color="white" size={28} />
            </button>
            <span className="text-white font-bold text-lg">
              {selectedMedia.type === 'image' ? 'Image Viewer' : 'Video Player'}
            </span>
            <div className="w-7" />
          </div>
          {/* Media Content */}
          <div className="flex-1 flex items-center justify-center">
            {selectedMedia.type === 'image' ? (
              <img
                src={selectedMedia.uri}
                alt="Selected"
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : (
              <div className="w-full h-[70vh] bg-gray-800 flex items-center justify-center relative">
                <img
                  src={selectedMedia.uri}
                  alt="Video"
                  className="max-w-full max-h-[70vh] object-contain"
                />
                <button
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  onClick={() => setIsPlaying(p => !p)}
                >
                  {isPlaying ? <Pause color="white" size={48} /> : <Play color="white" size={48} />}
                </button>
              </div>
            )}
          </div>
          {/* Media Controls */}
          <div className="flex justify-between items-center p-4 bg-black">
            <button onClick={() => navigateMedia('prev')}>
              <ChevronLeft color="white" size={28} />
            </button>
            <div className="flex items-center">
              {selectedMedia.type === 'video' && (
                <button className="mr-4" onClick={() => setIsMuted(m => !m)}>
                  {isMuted ? <VolumeX color="white" size={24} /> : <Volume2 color="white" size={24} />}
                </button>
              )}
              <button>
                <Download color="white" size={24} />
              </button>
            </div>
            <button onClick={() => navigateMedia('next')}>
              <ChevronRight color="white" size={28} />
            </button>
          </div>
        </div>
      )}
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-gray-900">Settings</span>
              <button onClick={() => setShowSettings(false)}>
                <X color="#6B7280" size={28} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <div className="text-lg font-semibold text-gray-900 mb-4">AI Model</div>
                <div className="bg-gray-100 rounded-xl p-4">
                  <span className="text-gray-700">Stable Diffusion v4.2</span>
                </div>
              </div>
              <div className="mb-6">
                <div className="text-lg font-semibold text-gray-900 mb-4">Quality</div>
                <div className="flex justify-between">
                  {[256, 512, 768, 1024].map(size => (
                    <button
                      key={size}
                      className="bg-gray-100 rounded-lg p-3 flex-1 items-center mx-1"
                    >
                      <span className="text-gray-700">{size}p</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-lg font-semibold text-gray-900 mb-4">Style</div>
                <div className="flex flex-wrap">
                  {['Realistic', 'Anime', 'Cartoon', 'Abstract', 'Cyberpunk', 'Minimalist'].map(style => (
                    <button
                      key={style}
                      className="bg-gray-100 rounded-lg px-4 py-2 m-1"
                    >
                      <span className="text-gray-700">{style}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-lg font-semibold text-gray-900 mb-4">Export Options</div>
                <div className="flex justify-between items-center bg-gray-100 rounded-xl p-4 mb-3">
                  <span className="text-gray-700">Watermark</span>
                  <div className="w-12 h-6 bg-blue-500 rounded-full" />
                </div>
                <div className="flex justify-between items-center bg-gray-100 rounded-xl p-4">
                  <span className="text-gray-700">Auto-enhance</span>
                  <div className="w-12 h-6 bg-gray-300 rounded-full" />
                </div>
              </div>
              <button
                className="bg-blue-500 py-4 rounded-xl w-full text-white font-bold mb-4"
                onClick={() => setShowSettings(false)}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}