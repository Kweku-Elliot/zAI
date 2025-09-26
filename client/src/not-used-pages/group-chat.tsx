import { useEffect, useRef, useState } from 'react';
import {
  Send,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Plus,
  Smile,
  Camera,
  Wallet,
  Check,
  Clock,
  WifiOff,
  X,
} from 'lucide-react';

type Participant = {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
};

type Message = {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  isOwn?: boolean;
  isImage?: boolean;
  imageUrl?: string;
};

type Transaction = {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  initiator: string;
};

const participants: Participant[] = [
  { id: '1', name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=60', online: true },
  { id: '2', name: 'Taylor Swift', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=600&q=60', online: true },
  { id: '3', name: 'Chris Evans', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&q=60', online: false },
  { id: '4', name: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=60', online: true },
  { id: '5', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=60', online: false },
];

const mockMessages: Message[] = [
  { id: '1', userId: '1', text: 'Hey everyone! Ready for the meeting tomorrow?', timestamp: '10:30 AM' },
  { id: '2', userId: '2', text: "Yes, I've prepared the presentation slides", timestamp: '10:32 AM' },
  { id: '3', userId: 'currentUser', text: "Great! I'll bring the project report", timestamp: '10:33 AM', isOwn: true },
  { id: '4', userId: '3', text: "Don't forget about the client feedback we received yesterday", timestamp: '10:35 AM' },
  { id: '5', userId: '4', text: "I've incorporated those changes into the proposal", timestamp: '10:40 AM' },
  { id: '6', userId: 'currentUser', text: 'Perfect! Looking forward to it', timestamp: '10:42 AM', isOwn: true },
  { id: '7', userId: '5', text: 'See you all tomorrow at 10am', timestamp: '10:45 AM' },
  { id: '8', userId: 'currentUser', text: 'image', timestamp: '10:50 AM', isOwn: true, isImage: true, imageUrl: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?w=900&q=60' },
];

const groupWallet = {
  balance: 1250.75,
  currency: '₵',
  members: [
    { id: '1', name: 'Alex Morgan', contribution: 500, avatar: participants[0].avatar },
    { id: '2', name: 'Taylor Swift', contribution: 300, avatar: participants[1].avatar },
    { id: 'currentUser', name: 'You', contribution: 450.75, avatar: participants[2].avatar },
  ],
  recentTransactions: [
    { id: '1', title: 'Project Expenses', amount: -150.25, date: '2023-05-15', type: 'expense', initiator: 'Alex Morgan' },
    { id: '2', title: 'Team Contribution', amount: 500, date: '2023-05-12', type: 'income', initiator: 'Taylor Swift' },
    { id: '3', title: 'Development Tools', amount: -200.5, date: '2023-05-10', type: 'expense', initiator: 'You' },
  ] as Transaction[],
};

export default function GroupChatPage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showWallet, setShowWallet] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [offlineCommands, setOfflineCommands] = useState<string[]>([]);
  const [showOfflineCommands, setShowOfflineCommands] = useState(false);
  const [_pendingTransaction, _setPendingTransaction] = useState<any>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (Math.random() > 0.7) {
        setTypingUsers(['Taylor Swift']);
        setIsTyping(true);
      } else {
        setIsTyping(false);
        setTypingUsers([]);
      }
    }, 3000);

    return () => clearTimeout(typingTimer);
  }, [messages]);

  useEffect(() => {
    // scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      userId: 'currentUser',
      text: inputText,
      timestamp: 'Now',
      isOwn: true,
    };

    setMessages((m) => [...m, newMessage]);
    setInputText('');
  };

  const _handleOfflineCommand = (command: string) => {
    if (command.toLowerCase().includes('send')) {
      const amountMatch = command.match(/₵(\d+)/);
      const recipientMatch = command.match(/to\s+(\w+)/i);
      if (amountMatch && recipientMatch) {
        const amount = amountMatch[1];
        const recipientName = recipientMatch[1];
        _setPendingTransaction({ amount, recipient: recipientName });
        setShowSendModal(true);
      }
    }
    setOfflineCommands((c) => [command, ...c].slice(0, 10));
  };

  const renderMessage = (item: Message) => {
    const isOwn = !!item.isOwn;
    const user = participants.find((p) => p.id === item.userId) || { name: 'Unknown', avatar: '' };

    if (item.isImage && item.imageUrl) {
      return (
        <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`} key={item.id}>
          <div className={`max-w-[80%] ${isOwn ? 'bg-blue-500' : 'bg-gray-200'} rounded-2xl p-2`}> 
            <img src={item.imageUrl} alt="shared" className="w-64 h-48 rounded-xl object-cover" />
            <div className="flex items-center justify-end mt-1">
              <span className="text-xs text-gray-500">{item.timestamp}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`} key={item.id}>
        {!isOwn && (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2 self-end" />
        )}
        <div className={`max-w-[80%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-2xl p-3`}>
          {!isOwn && <div className="font-bold text-sm mb-1">{user.name}</div>}
          <div>{item.text}</div>
          <div className="flex justify-end mt-1 items-center">
            <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'} mr-1`}>{item.timestamp}</span>
            {isOwn && <Check size={14} color="#BFDBFE" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <img src={participants[0].avatar} alt="group" className="w-10 h-10 rounded-full" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="ml-3">
              <div className="font-bold text-lg">Project Team</div>
              <div className="text-gray-500 text-sm">{participants.filter((p) => p.online).length} online</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2" aria-label="wallet" onClick={() => setShowWallet(true)}>
              <Wallet size={20} color="#4A90E2" />
            </button>
            <button className="p-2">
              <Phone size={20} color="#4A90E2" />
            </button>
            <button className="p-2">
              <Video size={20} color="#4A90E2" />
            </button>
            <button className="p-2">
              <MoreVertical size={20} color="#4A90E2" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-auto">
        <div className="mb-4 flex justify-center">
          <div className="bg-white rounded-2xl p-3">
            <div className="text-gray-500 text-sm">Today, June 15</div>
          </div>
        </div>

        <div>
          {messages.map((m) => renderMessage(m))}
        </div>

        {isTyping && typingUsers.length > 0 && (
          <div className="flex mb-4 items-center">
            <img src={participants.find((p) => p.name === typingUsers[0])?.avatar} alt="typing" className="w-8 h-8 rounded-full mr-2" />
            <div className="bg-gray-200 rounded-2xl p-3">
              <div className="text-gray-800">{typingUsers[0]} is typing...</div>
            </div>
          </div>
        )}
      </div>

      {/* Offline AI Indicator */}
      <div className="bg-orange-100 px-4 py-2 flex items-center">
        <WifiOff size={16} color="#F39C12" />
        <div className="text-orange-800 text-xs ml-2 flex-1">Offline mode active. AI commands will be queued for later processing.</div>
        <button className="text-orange-800 font-bold text-xs" onClick={() => setShowOfflineCommands(true)}>View Commands</button>
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 border-t border-gray-200">
        <div className="flex items-center">
          <button className="p-2"><Plus size={24} color="#4B5563" /></button>
          <button className="p-2"><Camera size={24} color="#4B5563" /></button>
          <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2 mx-2">
            <textarea
              className="flex-1 bg-transparent resize-none outline-none" 
              placeholder="Type a message or command..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={1}
            />
            <button className="ml-2"><Smile size={24} color="#4B5563" /></button>
          </div>

          <div>
            {inputText ? (
              <button className="p-2 bg-blue-500 rounded-full ml-2 text-white" onClick={handleSend} aria-label="send">
                <Send size={20} color="white" />
              </button>
            ) : (
              <button className="p-2"><Mic size={24} color="#4B5563" /></button>
            )}
          </div>
        </div>

        <button className="flex items-center justify-between bg-blue-50 p-3 rounded-xl mt-2 w-full" onClick={() => setShowWallet(true)}>
          <div className="flex items-center">
            <Wallet size={20} color="#3B82F6" />
            <div className="ml-2 font-medium">Group Wallet</div>
          </div>
          <div className="font-bold text-blue-600">₵{groupWallet.balance.toFixed(2)}</div>
        </button>
      </div>

      {/* Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-auto max-h-[90vh]">
            <div className="bg-white p-4 flex items-center justify-between">
              <div className="text-xl font-bold">Group Wallet</div>
              <button onClick={() => setShowWallet(false)}><X size={24} /></button>
            </div>
            <div className="p-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 text-white">
                <div className="text-lg mb-2">Total Balance</div>
                <div className="text-3xl font-bold mb-4">₵{groupWallet.balance.toFixed(2)}</div>
                <button className="bg-white py-2 rounded-full px-4 text-blue-600 font-bold" onClick={() => setShowSendModal(true)}>Send Money</button>
              </div>

              <div>
                <div className="text-lg font-bold mb-3">Members</div>
                <div className="space-y-3 mb-6">
                  {groupWallet.members.map((m) => (
                    <div key={m.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <img src={m.avatar} className="w-10 h-10 rounded-full mr-3" alt={m.name} />
                      <div className="flex-1">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-gray-500 text-sm">₵{m.contribution.toFixed(2)}</div>
                      </div>
                      {m.id === 'currentUser' && (
                        <button className="bg-blue-500 px-3 py-1 rounded-full text-white" onClick={() => setShowSendModal(true)}>Send</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-lg font-bold mb-3">Recent Transactions</div>
                <div className="space-y-3">
                  {groupWallet.recentTransactions.map((t) => (
                    <div key={t.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Wallet size={20} color={t.type === 'income' ? '#10B981' : '#EF4444'} />
                      </div>
                      <div className="flex-1 ml-3">
                        <div className="font-medium">{t.title}</div>
                        <div className="text-gray-500 text-sm">{t.date} • {t.initiator}</div>
                      </div>
                      <div className={`font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : ''}₵{Math.abs(t.amount).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-black/40 absolute inset-0" onClick={() => setShowSendModal(false)} />
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold">Send Money</div>
              <button onClick={() => setShowSendModal(false)}><X size={24} /></button>
            </div>
            <div className="mb-4">
              <div className="text-gray-500 mb-2">Amount</div>
              <div className="flex items-end">
                <div className="text-3xl font-bold mr-2">₵</div>
                <input className="flex-1 text-3xl font-bold outline-none" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="0.00" />
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-500 mb-2">Recipient</div>
              <input className="w-full border-b border-gray-300 pb-2 outline-none" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Enter name" />
            </div>

            <button className="bg-blue-500 py-3 rounded-full w-full text-white font-bold" onClick={() => {
              if (sendAmount && recipient) {
                alert(`Sent ₵${sendAmount} to ${recipient}`);
                setShowSendModal(false);
                setSendAmount('');
                setRecipient('');
              }
            }}>Send</button>
          </div>
        </div>
      )}

      {/* Offline Commands Modal */}
      {showOfflineCommands && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold">Offline Commands</div>
              <button onClick={() => setShowOfflineCommands(false)}><X size={24} /></button>
            </div>
            <div>
              {offlineCommands.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <WifiOff size={48} color="#F39C12" />
                  <div className="text-gray-500 mt-4 text-center">No offline commands yet. Try saying something like "Send ₵20 to Ama"</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {offlineCommands.map((cmd, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 flex items-center">
                      <Clock size={16} color="#9CA3AF" />
                      <div className="ml-2 flex-1 text-gray-700">{cmd}</div>
                      <button><Check size={16} color="#10B981" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// end of file
