import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User as UserIcon, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Award, 
  Wallet, 
  CheckCircle2, 
  Edit3, 
  Plus, 
  X,
  Truck,
  Wrench
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, t, language, toggleHelperMode } = useApp();

  const [bio, setBio] = useState(currentUser.bio);
  const [skills, setSkills] = useState<string[]>(currentUser.skills);
  const [newSkill, setNewSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.profile} & Helper Credentials
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your skills, verification status, and neighborhood visibility
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#0BB8A8] hover:bg-[#09998b] text-white font-extrabold text-xs shadow-md transition"
        >
          {isSaved ? '✓ Profile Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Profile Card Banner */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-3xl object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 ${
              currentUser.isHelperModeOn ? 'bg-[#22C55E]' : 'bg-slate-400'
            }`} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </h3>
              {currentUser.isVerified && (
                <ShieldCheck className="w-5 h-5 text-blue-500" title="Aadhaar Verified" />
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B2B]" />
              <span>{currentUser.location.address}</span>
            </p>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="text-amber-500 font-bold">⭐ {currentUser.rating} ({currentUser.reviewCount} reviews)</span>
              <span>·</span>
              <span className="text-[#0BB8A8] font-bold">Trust Score {currentUser.trustScore}/100</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.helperMode}</p>
            <p className="text-[10px] text-slate-500">{currentUser.isHelperModeOn ? 'Broadcasting on Live Map' : 'Hidden from Map'}</p>
          </div>
          <button
            onClick={() => toggleHelperMode()}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              currentUser.isHelperModeOn ? 'bg-[#22C55E]' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                currentUser.isHelperModeOn ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Skills & Bio Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bio & Contact */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Personal Bio & Contact Info
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              About Me / Experience
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                disabled
                value={currentUser.phone}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="text"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Right: Skills & Equipment */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Helper Skills & Capabilities
          </h3>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add skill (e.g. Scooter Repair, WiFi Setup, Carpentry)..."
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-[#FF6B2B] text-white rounded-xl font-bold text-xs"
            >
              Add
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Registered Equipment:</span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">🛵 Two-Wheeler (Hero Splendor)</span>
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 font-bold">🧰 Basic Toolkit (Pliers, Screwdrivers)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
