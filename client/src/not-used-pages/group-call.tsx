import { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
  Users,
  Paperclip,
  Send,
  Volume2,
} from 'lucide-react';

const participantAvatars = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
];

export default function GroupCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, _setParticipants] = useState([
    { id: 1, name: 'Alex Morgan', isMuted: false, isVideoOn: true, isSpeaking: true },
    { id: 2, name: 'Taylor Swift', isMuted: true, isVideoOn: false, isSpeaking: false },
    { id: 3, name: 'Jamie Foxx', isMuted: false, isVideoOn: true, isSpeaking: false },
    { id: 4, name: 'Jordan Lee', isMuted: false, isVideoOn: false, isSpeaking: false },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    setIsRecording(r => !r);
    if (!isRecording) setRecordingTime(0);
  };
  const toggleMute = () => setIsMuted(m => !m);
  const toggleVideo = () => setIsVideoOn(v => !v);
  const toggleSpeaker = () => setIsSpeakerOn(s => !s);
  const endCall = () => alert('Call ended');

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header with call info */}
      <div className="p-4 bg-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-white text-lg font-bold">Team Meeting</div>
          <div className="text-gray-300">{formatTime(recordingTime)}</div>
        </div>
        <div className="text-gray-400 text-sm mt-1">Group call • 4 participants</div>
      </div>

      {/* Main video area */}
      <div className="flex-1 relative">
        {/* Active speaker video */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=60"
            alt="Active Speaker"
            className="w-full h-full object-cover rounded-lg"
            style={{ maxHeight: '60vh' }}
          />
          <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full">
            <span className="text-white font-medium">Alex Morgan</span>
          </div>
        </div>

        {/* Participants grid */}
        <div className="absolute top-4 right-4 flex flex-row flex-wrap w-1/3 gap-2">
          {participants.slice(0, 3).map((participant, idx) => (
            <div key={participant.id} className="relative">
              <img
                src={participantAvatars[idx % participantAvatars.length]}
                alt={participant.name}
                className="w-16 h-16 rounded-lg border-2 border-blue-500 object-cover"
              />
              {participant.isSpeaking && (
                <div className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-gray-900" />
              )}
            </div>
          ))}
          {participants.length > 3 && (
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">+{participants.length - 3}</span>
            </div>
          )}
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex flex-row items-center bg-red-500/90 px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full mr-2" />
            <span className="text-white font-medium">REC</span>
          </div>
        )}
      </div>

      {/* Audio recording section */}
      <div className="bg-gray-800 p-4">
        <div className="flex flex-row items-center justify-between mb-4">
          <span className="text-white font-bold">Audio Recording</span>
          <div className="flex flex-row items-center">
            <span className="text-gray-300 mr-2">{formatTime(recordingTime)}</span>
            {isRecording ? (
              <button 
                onClick={toggleRecording}
                className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center"
              >
                <div className="w-5 h-5 bg-white rounded-sm" />
              </button>
            ) : (
              <button 
                onClick={toggleRecording}
                className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center"
              >
                <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Recording progress bar */}
        <div className="h-2 bg-gray-700 rounded-full mb-2">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${Math.min(100, recordingTime / 10)}%` }}
          />
        </div>
        <span className="text-gray-400 text-xs">
          {isRecording ? 'Recording in progress...' : 'Tap record to start audio capture'}
        </span>
      </div>

      {/* File sharing section */}
      <div className="bg-gray-800 p-4">
        <span className="text-white font-bold mb-3 block">Share Files</span>
        <div className="flex flex-row gap-2">
          <button className="flex-1 bg-gray-700 rounded-lg p-3 flex flex-col items-center">
            <Paperclip color="white" size={20} />
            <span className="text-white text-xs mt-1">Document</span>
          </button>
          <button className="flex-1 bg-gray-700 rounded-lg p-3 flex flex-col items-center">
            <img 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=60" 
              alt="Image" 
              className="w-5 h-5 mb-1 object-contain" />
            <span className="text-white text-xs">Image</span>
          </button>
          <button className="flex-1 bg-gray-700 rounded-lg p-3 flex flex-col items-center">
            <Send color="white" size={20} />
            <span className="text-white text-xs mt-1">Send</span>
          </button>
        </div>
      </div>

      {/* Call controls */}
      <div className="bg-gray-800 p-6">
        <div className="flex flex-row justify-around items-center">
          <button 
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-500' : 'bg-gray-700'}`}
          >
            {isMuted ? (
              <MicOff color="white" size={24} />
            ) : (
              <Mic color="white" size={24} />
            )}
          </button>

          <button 
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${!isVideoOn ? 'bg-red-500' : 'bg-gray-700'}`}
          >
            {isVideoOn ? (
              <Video color="white" size={24} />
            ) : (
              <VideoOff color="white" size={24} />
            )}
          </button>

          <button 
            onClick={toggleSpeaker}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${isSpeakerOn ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <Volume2 color="white" size={24} />
          </button>

          <button className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-700">
            <Users color="white" size={24} />
          </button>

          <button 
            onClick={endCall}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-red-500"
          >
            <Phone color="white" size={24} style={{ transform: 'rotate(135deg)' }} />
          </button>
        </div>
      </div>
    </div>
  );
}