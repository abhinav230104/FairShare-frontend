import React, { useState, useEffect } from 'react';
import { addMember, removeMember, updateMemberRole } from '../../api/rooms';
import { useAuth } from '../../contexts/AuthContext';

const FriendsTab = ({ roomId, members = [], onRefresh }) => {
  const { user } = useAuth();
  
  // --- State ---
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');
  const [loadingId, setLoadingId] = useState(null); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- Auto-Dismiss Feedback ---
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // --- Admin Check ---
  const currentUserMember = members.find(m => {
    const memberId = m.user?.userId || m.user?._id; 
    // Flexible check for ID string matching
    return memberId?.toString() === user?.userId?.toString() || m.user?._id?.toString() === user?._id?.toString();
  });
  const isAdmin = currentUserMember?.role === 'admin';

  // --- Handlers ---
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberId.trim()) return;

    try {
      setLoadingId('add');
      setError('');
      setSuccess('');
      
      await addMember(roomId, newMemberId);
      
      setSuccess('Member added successfully!');
      setNewMemberId('');
      setIsAdding(false);
      onRefresh(); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemoveMember = async (memberDbId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName}?`)) return;

    try {
      setLoadingId(memberDbId);
      // Calls API: DELETE /rooms/:roomId/removeMember/:memberDbId
      await removeMember(roomId, memberDbId);
      setSuccess(`${memberName} removed.`);
      onRefresh();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to remove member.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRoleUpdate = async (memberDbId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    try {
      setLoadingId(memberDbId);
      await updateMemberRole(roomId, memberDbId, newRole);
      onRefresh();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* --- Header & Add Button --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Room Members</h2>
          <p className="text-sm text-gray-500">Manage who has access to this room</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-bold text-sm"
          >
            {isAdding ? 'Cancel' : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add Member
              </>
            )}
          </button>
        )}
      </div>

      {/* --- Feedback Messages --- */}
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-medium animate-fade-in">{error}</div>}
      {success && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm border border-emerald-100 font-medium animate-fade-in">{success}</div>}

      {/* --- Add Member Form --- */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm mb-6 animate-fade-in-down">
          <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">FairShare ID</label>
              <input 
                type="text" 
                placeholder="e.g. nomad-EOQR"
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                autoFocus
              />
            </div>
            <button 
              type="submit" 
              disabled={loadingId === 'add'}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-bold shadow-sm h-[42px] min-w-[100px]"
            >
              {loadingId === 'add' ? '...' : 'Add'}
            </button>
          </form>
        </div>
      )}

      {/* --- Members List --- */}
      <div className="grid gap-4">
        {members.map((member) => {
            const u = member.user || {};
            const uId = u._id || 'unknown';
            const uName = u.name || 'Unknown User';
            const fairShareId = u.userId || 'No ID'; 
            const role= member.role || 'Missing';
            const isCurrentUser = fairShareId?.toString() === user?.userId?.toString();
            const isProcessing = loadingId === member._id;

            return (
                <div key={member._id || uId} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-emerald-100 transition-all">
                    
                    {/* User Info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-200 shadow-sm">
                            {uName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                {uName}
                                {isCurrentUser && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">YOU</span>}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <span className="text-gray-400">ID:</span> 
                                <span className="font-mono bg-gray-50 px-1 rounded text-gray-600">{fairShareId}</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                        {/* Role Badge/Button */}
                        {isAdmin && !isCurrentUser ? (
                            <button 
                                onClick={() => handleRoleUpdate(uId, role)}
                                disabled={isProcessing}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all cursor-pointer shadow-sm ${
                                    member.role === 'admin' 
                                        ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' 
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                                title="Toggle Role"
                            >
                                 {isProcessing ? (
                                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                 ) : (role)}
                            </button>
                        ) : (
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border opacity-80 ${
                                role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}>
                                {role}
                            </span>
                        )}

                        {/* Remove Button */}
                        {isAdmin && !isCurrentUser && (
                            <button 
                                onClick={() => handleRemoveMember(uId, uName)}
                                disabled={isProcessing}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg transition-all text-xs font-bold shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default FriendsTab;