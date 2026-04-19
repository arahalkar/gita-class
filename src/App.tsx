import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Mic, 
  CheckCircle, 
  Trophy, 
  Calendar, 
  Flame, 
  Star, 
  Clock, 
  Upload, 
  User, 
  LogIn,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Icons ---
const OM_ICON = () => (
  <div className="bg-saffron text-white p-2 rounded-md font-bold text-xl leading-none flex items-center justify-center">
    ॐ
  </div>
);

// --- Components ---

const HabitTracker = ({ onHabitComplete }: { onHabitComplete: () => void }) => {
  const [habits, setHabits] = useState([
    { id: 1, label: 'Deep Breathing (5 mins)', checked: true },
    { id: 2, label: 'Morning Prayer', checked: true },
    { id: 3, label: 'Shloka Reading', checked: true },
    { id: 4, label: "Parents' Blessings", checked: false },
    { id: 5, label: 'Vegetarian Meal', checked: true },
    { id: 6, label: 'Daily Reflection', checked: false },
    { id: 7, label: 'Early to Bed', checked: false },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(prev => prev.map(h => 
      h.id === id ? { ...h, checked: !h.checked } : h
    ));
  };

  const handleSubmit = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF9933', '#D4AF37', '#5D2E1F']
    });
    onHabitComplete();
  };

  return (
    <div className="gita-card">
      <div className="gita-title">
        <Clock className="w-5 h-5" /> Micro-Habit Tracker
      </div>
      <div className="space-y-1">
        {habits.map(habit => (
          <div key={habit.id} className="flex items-center justify-between py-2 border-b border-peach last:border-0">
            <span className="text-sm font-medium">{habit.label}</span>
            <div 
              onClick={() => toggleHabit(habit.id)}
              className={cn("habit-checkbox", habit.checked && "checked")}
            >
              {habit.checked && <Check className="w-3 h-3" />}
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={handleSubmit}
        className="btn-primary mt-6"
      >
        Submit Daily Tracker
      </button>
    </div>
  );
};

const Leaderboard = () => {
  const leaders = [
    { rank: 1, name: 'Meera Patel', points: 2450 },
    { rank: 2, name: 'Rohan Iyer', points: 2310 },
    { rank: 3, name: 'Sneha Rao', points: 2280 },
    { rank: 4, name: 'Arjun Sharma', points: 2250, highlight: true },
    { rank: 5, name: 'Aditi Gupta', points: 2190 },
  ];

  return (
    <div className="gita-card h-full">
      <div className="gita-title">
        <Trophy className="w-5 h-5" /> Leaderboard
      </div>
      <div className="space-y-4">
        {leaders.map(person => (
          <div 
            key={person.name} 
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-all",
              person.highlight ? "bg-saffron/10 border border-saffron/20" : "hover:bg-peach"
            )}
          >
            <span className="w-6 font-bold text-saffron">{person.rank}</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">{person.name}</div>
            </div>
            <span className="font-bold text-gold">{person.points.toLocaleString()}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-3 bg-peach rounded-lg text-center border border-gold/10">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Internal Access</div>
        <button className="bg-accent text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-accent/90 transition-all w-full flex items-center justify-center gap-2">
           <LogIn className="w-3 h-3" /> Admin Dashboard
        </button>
      </div>
    </div>
  );
};

const HomeworkSubmission = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(75);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.8 },
        colors: ['#FF9933', '#D4AF37']
      });
    }, 2000);
  };

  return (
    <div className="gita-card flex-1">
      <div className="gita-title">
        <Mic className="w-5 h-5" /> Homework Submission
      </div>
      <p className="text-xs text-gray-500 mb-4 bg-peach p-2 rounded-md border-l-2 border-saffron italic">
        "Chapter 2, Shloka 47: Karmanye vādhikārāste mā phaleṣu kadācana..."
      </p>
      
      <div 
        onClick={handleUpload}
        className="upload-area group"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full"
            />
            <span className="text-sm font-bold text-gold">Uploading Recitation...</span>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-sm">Upload Audio Recitation</div>
            <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">MP3 or WAV files up to 10MB</div>
          </>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-accent">Weekly Goal Completion</span>
          <span className="text-saffron">{progress}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-saffron to-gold"
          />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const data = [
    { week: 'W1', attendance: 85, homework: 60 },
    { week: 'W2', attendance: 88, homework: 70 },
    { week: 'W3', attendance: 92, homework: 75 },
    { week: 'W4', attendance: 90, homework: 85 },
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
      <div className="grid grid-cols-2 gap-6">
        <div className="gita-card h-[300px]">
          <div className="gita-title">Class Attendance Trends (%)</div>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#888" fontSize={10} />
              <YAxis stroke="#888" fontSize={10} />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#FF9933" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="gita-card h-[300px]">
          <div className="gita-title">Homework Completion (%)</div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#888" fontSize={10} />
              <YAxis stroke="#888" fontSize={10} />
              <Tooltip />
              <Bar dataKey="homework" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="gita-card">
        <div className="gita-title">Student Registry</div>
        <table className="w-full text-sm">
          <thead className="text-left border-b-2 border-peach">
            <tr>
              <th className="py-2 text-gray-400 uppercase text-[10px]">ID</th>
              <th className="py-2 text-gray-400 uppercase text-[10px]">Name</th>
              <th className="py-2 text-gray-400 uppercase text-[10px]">Grade</th>
              <th className="py-2 text-gray-400 uppercase text-[10px]">Total Points</th>
              <th className="py-2 text-gray-400 uppercase text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: '2024-001', name: 'Meera Patel', grade: '6', points: 2450 },
              { id: '2024-015', name: 'Rohan Iyer', grade: '4', points: 2310 },
              { id: '2024-042', name: 'Arjun Sharma', grade: '5', points: 1250 },
            ].map(s => (
              <tr key={s.id} className="border-b border-peach last:border-0 hover:bg-peach/50">
                <td className="py-3 font-mono text-[11px]">{s.id}</td>
                <td className="py-3 font-bold">{s.name}</td>
                <td className="py-3">Grade {s.grade}</td>
                <td className="py-3 font-bold text-saffron">{s.points}</td>
                <td className="py-3">
                   <button className="text-xs text-accent font-bold underline hover:text-saffron">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [view, setView] = useState<'student' | 'admin'>('student');
  
  return (
    <div className="flex flex-col h-screen text-accent overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b-2 border-saffron px-8 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <OM_ICON />
          <h1 className="font-serif text-2xl font-bold tracking-tight">Gita Class Management</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-peach p-1 rounded-lg border border-gold/20">
             <button 
               onClick={() => setView('student')}
               className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", view === 'student' ? "bg-white text-saffron shadow-sm" : "text-gray-400")}
             >
               Student View
             </button>
             <button 
               onClick={() => setView('admin')}
               className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", view === 'admin' ? "bg-white text-saffron shadow-sm" : "text-gray-400")}
             >
               Admin Stats
             </button>
          </div>

          <div className="flex items-center gap-4 border-l border-peach pl-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-saffron">{view === 'student' ? 'Arjun Sharma' : 'Class Admin'}</span>
              <div className="bg-peach px-2 py-0.5 rounded-full text-[10px] font-bold border border-gold/20">
                {view === 'student' ? 'ID: 2024-042' : 'Full Access'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-peach border-2 border-saffron flex items-center justify-center overflow-hidden">
              {view === 'student' ? <User className="w-6 h-6 text-saffron" /> : <div className="font-bold text-saffron">AD</div>}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {view === 'admin' ? (
          <AdminDashboard />
        ) : (
          <main className="flex-1 p-6 grid grid-cols-[300px_1fr_300px] gap-6 overflow-hidden">
             {/* Left Sidebar */}
            <aside className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <HabitTracker onHabitComplete={() => {}} />
              <div className="gita-card bg-accent text-white border-none shadow-lg">
                 <div className="flex items-center gap-2 mb-2 font-serif text-lg">
                   <Star className="w-5 h-5 text-gold fill-gold" /> Student Tip
                 </div>
                 <p className="text-xs leading-relaxed opacity-90 italic">
                   "Focus on the practice, not just the points. Consistency in micro-habits builds character."
                 </p>
              </div>
            </aside>

            {/* Center Section */}
            <section className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
              {/* Stats Boxes */}
              <div className="grid grid-cols-3 gap-4">
                <div className="stat-box">
                  <div className="text-3xl font-black text-accent">92%</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Attendance</div>
                </div>
                <div className="stat-box">
                  <div className="text-3xl font-black text-accent flex items-center justify-center gap-1">
                    14 <Flame className="w-6 h-6 text-saffron fill-saffron" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Day Streak</div>
                </div>
                <div className="stat-box">
                  <div className="text-3xl font-black text-accent">1,250</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Total Points</div>
                </div>
              </div>

              <HomeworkSubmission />

              <div className="gita-card p-3 flex flex-row items-center justify-between border-green-100 bg-green-50/10">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                     <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Sunday Class Attendance</div>
                    <div className="text-[10px] text-green-600 font-bold uppercase">Open for check-in</div>
                  </div>
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-all shadow-md shadow-green-100">
                   Confirm Attendance
                </button>
              </div>
            </section>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              <Leaderboard />
            </aside>
          </main>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [pin, setPin] = useState('');

  if (!isLogged) {
    return (
      <div className="h-screen bg-peach flex items-center justify-center p-4">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-8 rounded-2xl shadow-2xl border border-gold/30 max-w-sm w-full text-center relative overflow-hidden"
         >
           <div className="absolute top-0 left-0 w-full h-2 bg-saffron" />
           <div className="flex justify-center mb-6">
             <OM_ICON />
           </div>
           <h2 className="font-serif text-2xl font-bold mb-2">Gita Class Portal</h2>
           <p className="text-gray-500 text-sm mb-6">Enter your Student ID or PIN to enter the portal</p>
           
           <div className="flex flex-col gap-4 text-left">
             <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Access Key</label>
             <div className="relative">
               <input 
                 type="password" 
                 placeholder="0000"
                 value={pin}
                 onChange={(e) => setPin(e.target.value)}
                 className="w-full bg-peach border border-gold/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-saffron/50 text-center text-2xl tracking-[1em] font-mono"
               />
             </div>
             <button 
               onClick={() => setIsLogged(true)}
               className="btn-primary w-full py-4 text-lg"
             >
               Go to Dashboard
             </button>
           </div>
           
           <div className="mt-8 pt-6 border-t border-peach flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase">
             <Trophy className="w-4 h-4" /> Leading the way in digital learning
           </div>
         </motion.div>
      </div>
    )
  }

  return <Dashboard />;
}
