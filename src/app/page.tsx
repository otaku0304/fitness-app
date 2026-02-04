'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Flame, Footprints, Droplets, Calendar, Bell, Search, Plus, X, User, LogOut, Settings, ArrowRight, Info, ChevronRight, Lock, Utensils, Check } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { ActivityChart } from '@/components/ActivityChart';
import { MacrosCard } from '@/components/MacrosCard';

// --- Types ---

type ModeType = 'Weight Loss' | 'Weight Gain' | 'Muscle Gain' | 'Maintenance' | null;

type SystemTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradient: string;
};

type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  type: string;
  duration: string;
  color: string;
};

type Notification = {
  id: string;
  text: string;
  time: string;
  unread: boolean;
};

type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  mode: ModeType;
  modeSince: number; // Timestamp
  modeSwitchCount: number;
};

type UserStats = {
  calories: number;
  steps: number;
  distance: number;
  water: number;
  macros: { name: string; value: number; color: string }[];
  goals: { label: string; current: number; max: number; unit?: string; color: string; shadow: string }[];
  activity: { name: string; calories: number; steps: number }[];
};

// --- Constants & Config ---

const THEMES: Record<string, SystemTheme> = {
  'Weight Loss': {
    primary: 'text-emerald-600',
    secondary: 'bg-emerald-100 text-emerald-700',
    accent: 'bg-emerald-500',
    background: 'bg-emerald-50/30',
    gradient: 'from-emerald-400 to-teal-500'
  },
  'Weight Gain': {
    primary: 'text-blue-600',
    secondary: 'bg-blue-100 text-blue-700',
    accent: 'bg-blue-500',
    background: 'bg-blue-50/30',
    gradient: 'from-blue-400 to-indigo-500'
  },
  'Muscle Gain': {
    primary: 'text-orange-600',
    secondary: 'bg-orange-100 text-orange-700',
    accent: 'bg-orange-500',
    background: 'bg-orange-50/30',
    gradient: 'from-orange-400 to-red-500'
  },
  'Maintenance': {
    primary: 'text-slate-600',
    secondary: 'bg-slate-100 text-slate-700',
    accent: 'bg-slate-500',
    background: 'bg-slate-50/30',
    gradient: 'from-slate-400 to-gray-500'
  }
};

const FOOD_SUGGESTIONS: Record<string, { title: string, items: string[] }> = {
  'Weight Loss': {
    title: 'Lean & Green',
    items: ['Leafy Greens (Spinach, Kale)', 'Lean Protein (Chicken, Tofu)', 'Berries (Low GI)', 'Whole Grains (Quinoa)']
  },
  'Weight Gain': {
    title: 'High Calorie & Protein',
    items: ['Nuts & Nut Butters', 'Avocados', 'Red Meat (Steak)', 'Complex Carbs (Oats, Rice)']
  },
  'Muscle Gain': {
    title: 'Protein Power',
    items: ['Eggs & Egg Whites', 'Chicken Breast', 'Greek Yogurt', 'Protein Shakes', 'Sweet Potatoes']
  },
  'Maintenance': {
    title: 'Balanced Diet',
    items: ['Mixed Vegetables', 'Fish (Salmon)', 'Fruits', 'Moderate Carbs']
  }
};

// Default "Null" Stats for fresh user
const INITIAL_STATS: UserStats = {
  calories: 0,
  steps: 0,
  distance: 0,
  water: 0,
  macros: [
    { name: 'Protein', value: 0, color: '#e2e8f0' },
    { name: 'Carbs', value: 0, color: '#e2e8f0' },
    { name: 'Fats', value: 0, color: '#e2e8f0' },
  ],
  goals: [],
  activity: []
};

// "Simulation" Data to populate when Mode is selected
const GENERATE_STATS = (mode: ModeType): UserStats => {
  // Start with just "Today" as an empty entry
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const initialActivity = [
    { name: dateStr, calories: 0, steps: 0 }
  ];

  if (mode === 'Weight Loss') return {
    calories: 0,
    steps: 0,
    distance: 0,
    water: 0,
    macros: [
      { name: 'Protein', value: 0, color: '#10b981' },
      { name: 'Carbs', value: 0, color: '#34d399' },
      { name: 'Fats', value: 0, color: '#6ee7b7' }
    ],
    goals: [
      { label: 'Cardio Goal', current: 0, max: 60, unit: 'min', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' },
      { label: 'Calorie Limit', current: 0, max: 1800, unit: 'kcal', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' }
    ],
    activity: initialActivity
  };

  if (mode === 'Weight Gain') return {
    calories: 0,
    steps: 0,
    distance: 0,
    water: 0,
    macros: [
      { name: 'Protein', value: 0, color: '#3b82f6' },
      { name: 'Carbs', value: 0, color: '#60a5fa' },
      { name: 'Fats', value: 0, color: '#93c5fd' }
    ],
    goals: [
      { label: 'Calorie Goal', current: 0, max: 3200, unit: 'kcal', color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
      { label: 'Protein Target', current: 0, max: 200, unit: 'g', color: 'bg-blue-400', shadow: 'shadow-blue-400/50' }
    ],
    activity: initialActivity
  };

  // Muscle Gain / Maintenance (Default)
  return {
    calories: 0,
    steps: 0,
    distance: 0,
    water: 0,
    macros: [
      { name: 'Protein', value: 0, color: '#f97316' },
      { name: 'Carbs', value: 0, color: '#fb923c' },
      { name: 'Fats', value: 0, color: '#fdba74' }
    ],
    goals: [
      { label: 'Protein Goal', current: 0, max: 220, unit: 'g', color: 'bg-orange-500', shadow: 'shadow-orange-500/50' },
      { label: 'Workout Time', current: 0, max: 90, unit: 'min', color: 'bg-orange-500', shadow: 'shadow-orange-500/50' }
    ],
    activity: initialActivity
  };
};

export default function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // State
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [isModeSelectOpen, setIsModeSelectOpen] = useState(false);

  // Data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Guest',
    email: 'guest@fitness.app',
    avatar: '',
    mode: null,
    modeSince: 0,
    modeSwitchCount: 0
  });
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // New Item State
  const [newItem, setNewItem] = useState({ title: '', time: '', duration: '', type: 'Fitness' });

  // --- Persistence ---
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('fitness_data_v2');
    if (stored) {
      const data = JSON.parse(stored);
      // Auto-fix for previous default name
      if (data.profile.name === 'mr_ask_chay') {
        data.profile.name = 'Guest';
      }
      setUserProfile(data.profile);
      setUserStats(data.stats);
      setSchedule(data.schedule);
      setNotifications(data.notifications);
    } else {
      // First time? Open mode selection
      setIsModeSelectOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('fitness_data_v2', JSON.stringify({
        profile: userProfile,
        stats: userStats,
        schedule,
        notifications
      }));
    }
  }, [userProfile, userStats, schedule, notifications, isMounted]);

  // --- Helpers ---
  const currentTheme = userProfile.mode && THEMES[userProfile.mode] ? THEMES[userProfile.mode] : THEMES['Maintenance'];

  const canSwitchMode = () => {
    if (!userProfile.mode) return true;
    const timeElapsed = Date.now() - userProfile.modeSince;
    const isWithinTimeLimit = timeElapsed < 10 * 60 * 1000; // 10 mins
    const hasSwitchesLeft = userProfile.modeSwitchCount < 1;
    return isWithinTimeLimit && hasSwitchesLeft;
  };

  const handleModeSelect = (mode: ModeType) => {
    if (!mode) return;

    // Strict locking logic
    if (userProfile.mode) {
      if (!canSwitchMode()) {
        alert("Mode locked! You can only switch modes once within the first 10 minutes for health consistency.");
        return;
      }
      setUserProfile(prev => ({
        ...prev,
        mode,
        modeSince: prev.modeSince || Date.now(),
        modeSwitchCount: prev.modeSwitchCount + 1
      }));
    } else {
      // First selection
      setUserProfile(prev => ({
        name: 'Guest',
        email: 'guest@fitness.app',
        avatar: '',
        mode,
        modeSince: Date.now(),
        modeSwitchCount: 0
      }));
    }

    // Populate data based on mode
    setUserStats(GENERATE_STATS(mode));
    setNotifications([{ id: Date.now().toString(), text: `Switched to ${mode} mode!`, time: 'Just now', unread: true }]);
    setIsModeSelectOpen(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Calculate stats based on inputs
    const durationMinutes = parseInt(newItem.duration) || 30; // Default to 30 if parsing fails
    let caloriesBurned = 0;
    let stepsTaken = 0;

    switch (newItem.type) {
      case 'Fitness':
        caloriesBurned = durationMinutes * 10; // High intensity: ~10 cal/min
        stepsTaken = durationMinutes * 130;    // Running: ~130 steps/min
        break;
      case 'Wellness': // Yoga, etc
        caloriesBurned = durationMinutes * 3.5; // Low intensity
        stepsTaken = durationMinutes * 10;      // Minimal steps
        break;
      case 'Nutrition':
        caloriesBurned = 0; // Eating doesn't burn active calories usually
        stepsTaken = 0;
        break;
      default: // Other/Walking
        caloriesBurned = durationMinutes * 5;
        stepsTaken = durationMinutes * 100;
        break;
    }

    // 2. Add to Schedule
    const colors = {
      'Fitness': currentTheme.secondary,
      'Wellness': 'bg-purple-100 text-purple-700',
      'Nutrition': 'bg-green-100 text-green-700',
      'Other': 'bg-slate-100 text-slate-700'
    };
    const item: ScheduleItem = {
      id: Date.now().toString(),
      title: newItem.title,
      time: newItem.time,
      duration: newItem.duration || '30 min',
      type: newItem.type,
      color: colors[newItem.type as keyof typeof colors] || colors['Other']
    };
    setSchedule([...schedule, item]);
    setIsAddModalOpen(false);

    // 3. Update User Stats (Totals + History)
    setUserStats(prev => {
      const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Handle History Logic (Max 10 Days)
      let newActivity = [...prev.activity];
      const existingDayIndex = newActivity.findIndex(a => a.name === todayDate);

      if (existingDayIndex >= 0) {
        // Update today
        newActivity[existingDayIndex] = {
          ...newActivity[existingDayIndex],
          calories: newActivity[existingDayIndex].calories + caloriesBurned,
          steps: newActivity[existingDayIndex].steps + stepsTaken
        };
      } else {
        // Add new day
        newActivity.push({
          name: todayDate,
          calories: caloriesBurned,
          steps: stepsTaken
        });
      }

      // Keep only last 10 days
      if (newActivity.length > 10) {
        newActivity = newActivity.slice(newActivity.length - 10);
      }

      return {
        ...prev,
        calories: prev.calories + caloriesBurned,
        steps: prev.steps + stepsTaken,
        distance: prev.distance + (stepsTaken * 0.0008), // approx 0.8m per step -> km
        activity: newActivity
      };
    });

    // Notify user of gain
    if (caloriesBurned > 0) {
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        text: `Activity added! Burned ${caloriesBurned} kcal.`,
        time: 'Just now',
        unread: true
      }]);
    }
  };

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen p-8 pb-20 sm:p-12 font-[family-name:var(--font-geist-sans)] transition-colors duration-1000 ${userProfile.mode ? currentTheme.background : 'bg-slate-50'}`}
      onClick={() => { setIsProfileOpen(false); setIsNotifOpen(false); }}>

      {/* --- Onboarding / Mode Selection Modal --- */}
      {(isModeSelectOpen || (userProfile.mode === null)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Welcome to Fitness Tracker!</h2>
              <p className="text-lg text-slate-500">Let's personalize your journey. Select your primary goal.</p>
              <p className="text-xs text-red-400 mt-2 font-semibold uppercase tracking-wider">
                Warning: You can switch this only ONCE within 10 minutes. Choose wisely.
              </p>
              <p className="text-[10px] text-slate-300 mt-4 tracking-widest uppercase">Built by mr_ask_chay</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'Weight Loss', icon: Flame, desc: 'Burn fat, stay lean', color: 'emerald' },
                { id: 'Muscle Gain', icon: Activity, desc: 'Build strength & mass', color: 'orange' },
                { id: 'Weight Gain', icon: Plus, desc: 'Increase size healthily', color: 'blue' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModeSelect(m.id as ModeType)}
                  className={`group relative p-8 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                        ${userProfile.mode === m.id ? `border-${m.color}-500 bg-${m.color}-50` : 'border-slate-100 bg-white hover:border-slate-300'}
                     `}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 text-white text-2xl shadow-lg bg-${m.color}-500 group-hover:bg-${m.color}-600 transition-colors`}>
                    <m.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{m.id}</h3>
                  <p className="text-slate-500 font-medium">{m.desc}</p>

                  {userProfile.mode === m.id && (
                    <div className="absolute top-4 right-4 text-emerald-500">
                      <Check size={24} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Footer Credit --- */}
      <div className="fixed bottom-4 right-6 pointer-events-none z-50 mix-blend-multiply opacity-50">
        <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Developed by <span className="text-slate-800">mr_ask_chay</span></p>
      </div>

      {/* --- Header --- */}
      <header className="flex justify-between items-center mb-10 animate-fade-in relative z-20">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            Fitness Tracker
            {userProfile.mode && (
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest ${currentTheme.secondary}`}>
                {userProfile.mode}
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-1 font-medium">{currentDate}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Detailed Metrics Toggle */}
          <button
            onClick={() => setIsMetricsOpen(true)}
            className="p-3 bg-white/60 backdrop-blur-md rounded-full text-slate-600 hover:text-blue-600 transition-colors shadow-sm"
            title="View Calculations"
          >
            <Info size={20} />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
              className={`h-12 px-4 rounded-full bg-gradient-to-r ${currentTheme.gradient} text-white font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2`}
            >
              <User size={18} />
              <span className="hidden sm:inline">{userProfile.name}</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-14 w-72 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-4 animate-fade-in z-50">
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="font-bold text-slate-800 text-lg">{userProfile.name}</p>
                  <p className="text-slate-500 text-sm">{userProfile.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                    <span>Mode Switches:</span>
                    <span className="font-bold">{userProfile.modeSwitchCount}/1</span>
                  </div>

                  <button
                    onClick={() => {
                      if (canSwitchMode()) setIsModeSelectOpen(true);
                      else alert("Mode switching is currently locked.");
                    }}
                    className={`w-full p-3 rounded-lg text-left text-sm font-medium flex justify-between items-center transition-colors ${canSwitchMode() ? 'hover:bg-slate-100 text-slate-700' : 'opacity-50 cursor-not-allowed text-slate-400'}`}
                  >
                    Change Mode
                    {canSwitchMode() ? <ChevronRight size={16} /> : <Lock size={14} />}
                  </button>

                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full p-3 rounded-lg text-left text-sm font-medium text-red-500 hover:bg-red-50">
                    Reset App (Dev Only)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- Main Grid --- */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Calories" value={userStats.calories} unit="kcal" icon={Flame} color={currentTheme.primary} trend={{ value: 5, isPositive: true }} />
            <StatCard title="Steps" value={userStats.steps.toLocaleString()} icon={Footprints} color={currentTheme.primary} />
            <StatCard title="Distance" value={userStats.distance} unit="km" icon={Activity} color={currentTheme.primary} />
            <StatCard title="Water" value={userStats.water} unit="L" icon={Droplets} color="text-cyan-500" />
          </div>

          <ActivityChart data={userStats.activity} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MacrosCard data={userStats.macros} totalCalories={userStats.calories} />

            {/* Food Suggestions Box */}
            <div className="glass-card flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Utensils size={20} className="text-slate-600" />
                <h3 className="text-lg font-bold text-slate-700">Recommended Diet</h3>
              </div>
              {userProfile.mode ? (
                <div className="flex-1">
                  <p className={`text-sm font-bold mb-3 ${currentTheme.primary}`}>{FOOD_SUGGESTIONS[userProfile.mode].title}</p>
                  <ul className="space-y-2">
                    {FOOD_SUGGESTIONS[userProfile.mode].items.map((food, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 p-2 rounded-lg">
                        <span className={`w-2 h-2 rounded-full ${currentTheme.accent}`}></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Select a mode to see suggestions.</p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-8">
          <div className="glass-card flex flex-col h-full max-h-[600px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-700">Today's Schedule</h3>
              <Calendar size={20} className="text-slate-400" />
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-20">
              {schedule.length === 0 ? (
                <div className="text-center py-10 text-slate-400">No activities scheduled</div>
              ) : (
                schedule.map((item) => (
                  <div key={item.id} className={`p-4 rounded-xl border ${item.color} flex flex-col gap-1 transition-transform hover:translate-x-1 cursor-pointer group`}>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm opacity-80">{item.time}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wide opacity-70 border border-current px-2 py-0.5 rounded-full">{item.type}</span>
                    </div>
                    <h4 className="font-bold text-lg flex items-center justify-between">
                      {item.title}
                      <button onClick={(e) => { e.stopPropagation(); setSchedule(schedule.filter(s => s.id !== item.id)); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded-full">
                        <X size={14} />
                      </button>
                    </h4>
                    <div className="flex items-center gap-1 text-xs opacity-80 font-medium"><Activity size={12} /> {item.duration}</div>
                  </div>
                ))
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white/90 to-transparent">
              <button onClick={() => setIsAddModalOpen(true)} className={`w-full py-3 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r ${currentTheme.gradient}`}>
                <Plus size={20} /> Add New Activity
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- Metrics Modal --- */}
      {isMetricsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Metrics Calculations</h3>
              <button onClick={() => setIsMetricsOpen(false)}><X size={20} className="text-slate-500 hover:text-slate-800" /></button>
            </div>
            <div className="space-y-6 text-sm text-slate-600">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-800 mb-2">Basal Metabolic Rate (BMR)</h4>
                <p className="mb-2 italic">Mifflin-St Jeor Equation:</p>
                <code className="block bg-slate-200 p-2 rounded text-xs select-all">
                  P = (10 × weight) + (6.25 × height) - (5 × age) + 5
                </code>
                <p className="mt-2 text-xs">This calculates the calories your body burns at rest.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-800 mb-2">Total Daily Energy Expenditure (TDEE)</h4>
                <p className="mb-2 italic">Based on Activity Level:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Sedentary: BMR x 1.2</li>
                  <li>Light: BMR x 1.375</li>
                  <li>Moderate: BMR x 1.55</li>
                  <li>Active: BMR x 1.725</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-xl">
                <h4 className="font-bold text-red-800 mb-2">Health Rules & Restrictions</h4>
                <p className="mb-1"><strong>Mode Locking:</strong> To prevent metabolic confusion, we restrict goal switching.</p>
                <ul className="list-disc pl-5 space-y-1 text-xs mt-2">
                  <li>You can switch modes <strong>only once</strong> per session.</li>
                  <li>Switching is only allowed within the <strong>first 10 minutes</strong>.</li>
                  <li>This ensures you stick to a consistent plan for results.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Add Activity Modal --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add New Activity</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  placeholder="e.g., Evening Run"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                  <select
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                    value={newItem.duration}
                    onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                  >
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="1 hr">1 hr</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <div className="flex gap-2">
                  {['Fitness', 'Wellness', 'Nutrition'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewItem({ ...newItem, type })}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${newItem.type === type ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full mt-4 py-3 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 bg-gradient-to-r ${currentTheme.gradient}`}
              >
                Create Activity
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
