import { useState } from 'react';
import {
  Users,
  MessageCircle,
  Plus,
  Search,
  Camera,
  Check,
  Lock,
  Globe,
  ChevronLeft,
} from 'lucide-react';

type Group = {
  id: string;
  name: string;
  members: number;
  unread: number;
  isPrivate: boolean;
  description: string;
  avatar: string;
};

type Member = {
  id: string;
  name: string;
  username: string;
  avatar: string;
};

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Design Team',
    members: 12,
    unread: 3,
    isPrivate: true,
    description: 'UI/UX designers working on mobile projects',
    avatar: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Marketing Team',
    members: 8,
    unread: 0,
    isPrivate: false,
    description: 'Campaign planning and brand strategy',
    avatar: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=900&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Engineering',
    members: 24,
    unread: 12,
    isPrivate: true,
    description: 'Frontend and backend development team',
    avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    name: 'Product Managers',
    members: 6,
    unread: 1,
    isPrivate: false,
    description: 'Product strategy and roadmap planning',
    avatar: 'https://images.unsplash.com/photo-1541085929998-15c0040fec78?w=900&auto=format&fit=crop&q=60',
  },
];

const mockPotentialMembers: Member[] = [
  { id: '1', name: 'Alex Johnson', username: '@alexj', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Sam Wilson', username: '@samw', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Taylor Kim', username: '@taylork', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Jordan Smith', username: '@jordans', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Casey Brown', username: '@caseyb', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Morgan Lee', username: '@morganl', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '7', name: 'Riley Davis', username: '@rileyd', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '8', name: 'Quinn Miller', username: '@quinnm', avatar: 'https://i.pravatar.cc/150?img=8' },
];

export default function GroupListPage() {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const filteredMembers = mockPotentialMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const _toggleMemberSelection = (id: string) => {
    setSelectedMembers(sel =>
      sel.includes(id) ? sel.filter(memberId => memberId !== id) : [...sel, id]
    );
  };

  // Create Group Steps
  const renderGroupInfo = () => (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <button onClick={() => window.history.back()} aria-label="Go back" className="p-2 mr-3 rounded-md hover:bg-gray-100">
            <ChevronLeft size={20} color="#374151" />
          </button>
          <div className="text-2xl font-bold text-gray-900">Create New Group</div>
        </div>
      </div>
      <div className="text-gray-600 mb-6">Set up your group chat details</div>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center relative">
            <Camera color="#6B7280" size={32} />
            <button type="button" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-2 border-white">
              <Plus color="white" size={16} />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-gray-700 font-medium mb-2">Group Name</div>
          <input
            className="border border-gray-300 rounded-xl p-4 text-gray-900 w-full"
            placeholder="Enter group name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <div className="text-gray-700 font-medium mb-2">Description (Optional)</div>
          <textarea
            className="border border-gray-300 rounded-xl p-4 text-gray-900 w-full h-24 resize-none"
            placeholder="What is this group about?"
            value={groupDescription}
            onChange={e => setGroupDescription(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full"
          onClick={() => setIsPrivate(!isPrivate)}
        >
          <div className="flex items-center">
            {isPrivate ? (
              <Lock color="#3B82F6" size={20} />
            ) : (
              <Globe color="#6B7280" size={20} />
            )}
            <span className="font-medium text-gray-900 ml-3">{isPrivate ? 'Private Group' : 'Public Group'}</span>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center ${isPrivate ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'} p-1`}>
            <div className="w-5 h-5 rounded-full bg-white" />
          </div>
        </button>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 py-4 rounded-2xl bg-gray-200 font-bold text-gray-700"
          onClick={() => setShowCreateGroup(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`flex-1 py-4 rounded-2xl font-bold items-center ${groupName.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
          disabled={!groupName.trim()}
          onClick={() => setStep(2)}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderInviteMembers = () => (
    <div className="flex flex-col">
      <div className="text-2xl font-bold text-gray-900 mb-2">Invite Members</div>
      <div className="text-gray-600 mb-6">
        {selectedMembers.length > 0
          ? `${selectedMembers.length} member${selectedMembers.length > 1 ? 's' : ''} selected`
          : 'Select members to invite'}
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center bg-gray-100 rounded-xl px-4 mb-4">
          <Search color="#6B7280" size={20} />
          <input
            className="flex-1 p-4 text-gray-900 bg-transparent outline-none"
            placeholder="Search members"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="divide-y divide-gray-100">
          {filteredMembers.map(item => {
            const isSelected = selectedMembers.includes(item.id);
            return (
              <div key={item.id} className="flex items-center py-3">
                <div className="relative">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full" />
                  {isSelected && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white">
                      <Check color="white" size={12} />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-gray-500 text-sm">{item.username}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {isSelected && <Check color="white" size={16} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 py-4 rounded-2xl bg-gray-200 font-bold text-gray-700"
          onClick={() => setStep(1)}
        >
          Back
        </button>
        <button
          type="button"
          className="flex-1 py-4 rounded-2xl bg-blue-500 font-bold text-white"
          onClick={() => setStep(3)}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderPermissions = () => (
    <div className="flex flex-col">
      <div className="text-2xl font-bold text-gray-900 mb-2">Group Permissions</div>
      <div className="text-gray-600 mb-6">Set permissions for group members</div>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="mb-6">
          <div className="font-medium text-gray-900 mb-4">Who can invite members?</div>
          <div className="flex gap-3">
            <button className="flex-1 p-4 bg-blue-50 rounded-xl items-center border border-blue-200 font-medium text-blue-600">Admins Only</button>
            <button className="flex-1 p-4 bg-gray-100 rounded-xl items-center font-medium text-gray-700">All Members</button>
          </div>
        </div>
        <div className="mb-6">
          <div className="font-medium text-gray-900 mb-4">Message permissions</div>
          <div className="flex gap-3">
            <button className="flex-1 p-4 bg-blue-50 rounded-xl items-center border border-blue-200 font-medium text-blue-600">All Members</button>
            <button className="flex-1 p-4 bg-gray-100 rounded-xl items-center font-medium text-gray-700">Admins Only</button>
          </div>
        </div>
        <div className="mb-6">
          <div className="font-medium text-gray-900 mb-4">Media sharing</div>
          <div className="flex gap-3">
            <button className="flex-1 p-4 bg-blue-50 rounded-xl items-center border border-blue-200 font-medium text-blue-600">Enabled</button>
            <button className="flex-1 p-4 bg-gray-100 rounded-xl items-center font-medium text-gray-700">Admins Only</button>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 py-4 rounded-2xl bg-gray-200 font-bold text-gray-700"
          onClick={() => setStep(2)}
        >
          Back
        </button>
        <button
          type="button"
          className="flex-1 py-4 rounded-2xl bg-blue-500 font-bold text-white"
          onClick={() => {
            setShowCreateGroup(false);
            setStep(1);
            setGroupName('');
            setGroupDescription('');
            setSelectedMembers([]);
          }}
        >
          Create Group
        </button>
      </div>
    </div>
  );

  // Groups List
  const renderGroupsList = () => (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button onClick={() => window.history.back()} aria-label="Go back" className="p-2 mr-3 rounded-md hover:bg-gray-100">
            <ChevronLeft size={20} color="#374151" />
          </button>
          <div className="text-2xl font-bold text-gray-900">Your Groups</div>
        </div>
        <button 
          className="bg-blue-500 rounded-full p-3"
          onClick={() => setShowCreateGroup(true)}
        >
          <Plus color="white" size={20} />
        </button>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center bg-gray-100 rounded-xl px-4 mb-4">
          <Search color="#6B7280" size={20} />
          <input
            className="flex-1 p-4 text-gray-900 bg-transparent outline-none"
            placeholder="Search groups"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="divide-y divide-gray-100">
          {mockGroups.map(item => (
            <div key={item.id} className="flex items-center py-4 border-b border-gray-100">
              <div className="relative">
                <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full object-cover" />
                {item.isPrivate && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                    <Lock color="white" size={12} />
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <span className="font-bold text-gray-900 text-lg">{item.name}</span>
                  {item.unread > 0 && (
                    <div className="ml-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{item.unread}</span>
                    </div>
                  )}
                </div>
                <div className="text-gray-600 text-sm mt-1">{item.description}</div>
                <div className="flex items-center mt-1">
                  <Users color="#6B7280" size={14} />
                  <span className="text-gray-500 text-sm ml-1">{item.members} members</span>
                </div>
              </div>
              <MessageCircle color="#6B7280" size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {showCreateGroup ? (
        step === 1 ? renderGroupInfo() :
        step === 2 ? renderInviteMembers() :
        renderPermissions()
      ) : (
        renderGroupsList()
      )}
    </div>
  );
}