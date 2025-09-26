import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Users,
  Plus,
  Search,
  Shield,
  Camera,
  X,
  Check,
} from 'lucide-react';

type Member = {
  id: string;
  name: string;
  username: string;
  avatar: string;
};

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

export default function CreateGroupPage() {
  const [, setLocation] = useLocation();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [step, setStep] = useState(1); // 1: Group info, 2: Invite members, 3: Permissions

  const filteredMembers = mockPotentialMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMemberSelection = (id: string) => {
    setSelectedMembers(sel =>
      sel.includes(id) ? sel.filter(memberId => memberId !== id) : [...sel, id]
    );
  };

  // Step 1: Group Info
  const renderGroupInfo = () => (
    <div className="flex flex-col">
      <div className="relative w-full mt-4 mb-6">
        <button type="button" onClick={() => setLocation('/group-list')} aria-label="Cancel and go back" className="absolute left-0 top-0 p-2 rounded-md hover:bg-gray-100">
          Cancel
        </button>

        <div className="text-2xl font-bold text-gray-900 text-center">Create New Group</div>
        <div className="text-gray-600 text-center mt-2">Set up your group chat details</div>
      </div>

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
            <Shield color={isPrivate ? '#3B82F6' : '#6B7280'} size={20} />
            <span className="font-medium text-gray-900 ml-3">Private Group</span>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center ${isPrivate ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'} p-1`}>
            <div className="w-5 h-5 rounded-full bg-white" />
          </div>
        </button>
      </div>

      <button
        type="button"
        className={`py-4 rounded-2xl w-full font-bold items-center ${groupName.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
        disabled={!groupName.trim()}
        onClick={() => setStep(2)}
      >
        Continue
      </button>
    </div>
  );

  // Step 2: Invite Members
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
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check color="white" size={14} />
                    </div>
                  )}
                </div>
                <div className="flex-1 ml-3">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-gray-500 text-sm">{item.username}</div>
                </div>
                {!isSelected ? (
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center"
                    onClick={() => toggleMemberSelection(item.id)}
                  >
                    <Plus color="#6B7280" size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    onClick={() => toggleMemberSelection(item.id)}
                  >
                    <X color="#6B7280" size={16} />
                  </button>
                )}
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
          Continue{selectedMembers.length > 0 ? ` (${selectedMembers.length})` : ''}
        </button>
      </div>
    </div>
  );

  // Step 3: Permissions
  const renderPermissions = () => (
    <div className="flex flex-col">
      <div className="text-2xl font-bold text-gray-900 mb-2">Group Permissions</div>
      <div className="text-gray-600 mb-6">Set what members can do in this group</div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Users color="#3B82F6" size={24} />
          </div>
          <div>
            <div className="font-bold text-gray-900">{groupName || 'New Group'}</div>
            <div className="text-gray-500">{selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="font-bold text-gray-900 mb-4">Who can:</div>

          {/* Send Messages */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-gray-900">Send Messages</div>
              <div className="flex">
                <button className="bg-blue-500 rounded-full px-4 py-2 mr-2 text-white text-sm">All</button>
                <button className="bg-gray-200 rounded-full px-4 py-2 text-gray-700 text-sm">Admins</button>
              </div>
            </div>
            <div className="text-gray-500 text-sm">Control who can send messages in this group</div>
          </div>

          {/* Add Members */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-gray-900">Add Members</div>
              <div className="flex">
                <button className="bg-blue-500 rounded-full px-4 py-2 mr-2 text-white text-sm">All</button>
                <button className="bg-gray-200 rounded-full px-4 py-2 text-gray-700 text-sm">Admins</button>
              </div>
            </div>
            <div className="text-gray-500 text-sm">Control who can invite new members to the group</div>
          </div>

          {/* Edit Group Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-gray-900">Edit Group Info</div>
              <div className="flex">
                <button className="bg-gray-200 rounded-full px-4 py-2 mr-2 text-gray-700 text-sm">All</button>
                <button className="bg-blue-500 rounded-full px-4 py-2 text-white text-sm">Admins</button>
              </div>
            </div>
            <div className="text-gray-500 text-sm">Control who can change group name and description</div>
          </div>
        </div>

        <button type="button" className="flex items-center justify-between p-4 bg-blue-50 rounded-xl w-full">
          <div className="flex items-center">
            <Shield color="#3B82F6" size={20} />
            <span className="font-medium text-blue-600 ml-3">Advanced Permissions</span>
          </div>
          <Plus color="#3B82F6" size={20} />
        </button>
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
          onClick={() => {}}
        >
          Create Group
        </button>
      </div>
    </div>
  );

  return (
  <div className="min-h-screen bg-gray-50 p-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <button type="button" onClick={() => setLocation('/group-list')} className="text-blue-500">
          Cancel
        </button>
        <div className="flex items-center">
          {[1, 2, 3].map(num => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= num ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}>{num}</div>
              {num < 3 && (
                <div className={`h-1 w-8 ${step > num ? 'bg-blue-500' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
        <span className="text-gray-400 w-10 text-right">{step}/3</span>
      </div>
      {step === 1 && renderGroupInfo()}
      {step === 2 && renderInviteMembers()}
      {step === 3 && renderPermissions()}
    </div>
  );
}