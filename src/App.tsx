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
  Check,
  Square,
  Play,
  Trash2,
  RefreshCw,
  Lock,
  X,
  Sparkles,
  XCircle
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
  <div className="bg-teal-600 text-white p-2 rounded-md font-bold text-xl leading-none flex items-center justify-center shadow-md">
    ॐ
  </div>
);

// --- Components ---

const HabitTracker = () => {
  const [days, setDays] = useState([
    { id: 'mon', label: 'Mon', checked: false },
    { id: 'tue', label: 'Tue', checked: false },
    { id: 'wed', label: 'Wed', checked: false },
    { id: 'thu', label: 'Thu', checked: false },
    { id: 'fri', label: 'Fri', checked: false },
    { id: 'sat', label: 'Sat', checked: false },
  ]);

  const toggleDay = (id: string) => {
    setDays(prev => prev.map(d => 
      d.id === id ? { ...d, checked: !d.checked } : d
    ));
  };

  const totalChecked = days.filter(d => d.checked).length;
  const progress = (totalChecked / 6) * 100;

  const handleSubmit = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#FF9933', '#D4AF37']
    });
  };

  return (
    <div className="gita-card border-teal-100 bg-teal-50/20">
      <div className="gita-title border-teal-100 flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
           <Clock className="w-5 h-5 text-teal-600" /> Microhabit
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-7">discipline shapes character</p>
      </div>
      
      <div className="mt-4 mb-4">
        <h3 className="text-sm font-bold text-accent mb-1 border-l-4 border-teal-600 pl-3">Make your bed every day morning</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {days.map(day => (
          <div 
            key={day.id} 
            onClick={() => toggleDay(day.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all cursor-pointer",
              day.checked ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-teal-100 text-gray-400 hover:border-teal-300"
            )}
          >
            <span className="text-[10px] font-bold uppercase">{day.label}</span>
            {day.checked ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-current" />}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-accent">Weekly Goal: {totalChecked}/6 Days</span>
          <span className="text-teal-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-teal-600"
          />
        </div>
      </div>
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
              person.highlight ? "bg-teal-50 border border-teal-100" : "hover:bg-teal-50/50"
            )}
          >
            <span className="w-6 font-bold text-teal-600">{person.rank}</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">{person.name}</div>
            </div>
            <span className="font-bold text-gold">{person.points.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const VoiceRecorder = ({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioUrl(null);
      setAudioBlob(null);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMessage("Microphone access denied. Please allow camera/mic permissions in your browser settings and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const submitRecording = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recitation.webm');
    formData.append('studentId', '2024-042'); // Placeholder
    formData.append('shloka', 'Chapter 2, Shloka 47');

    try {
      const response = await fetch('/api/homework', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
        if (data.success) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.8 },
            colors: ['#0d9488', '#FF9933', '#D4AF37']
          });
          onUploadSuccess(data.audioUrl || '');
          deleteRecording();
        }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-area group min-h-[160px] flex flex-col items-center justify-center relative bg-teal-50/10">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs font-medium">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!isRecording && !audioUrl && (
        <button 
          onClick={startRecording}
          className="flex flex-col items-center gap-3 group"
        >
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <div className="text-sm font-bold text-accent">Tap to Record Recitation</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Record your Gita shloka recitation</div>
        </button>
      )}

      {isRecording && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-3">
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ repeat: Infinity, duration: 1 }}
               className="w-3 h-3 bg-red-500 rounded-full"
             />
             <span className="text-2xl font-mono font-bold text-accent">{formatTime(recordingTime)}</span>
          </div>
          
          <div className="flex gap-4 w-full justify-center">
            {/* Simple wave animation bars */}
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <motion.div
                key={i}
                animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                className="w-1 bg-teal-600 rounded-full"
              />
            ))}
          </div>

          <button 
            onClick={stopRecording}
            className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-full font-bold text-sm shadow-md"
          >
            <Square className="w-4 h-4 fill-white" /> Stop Recording
          </button>
        </div>
      )}

      {audioUrl && !isUploading && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="text-sm font-bold text-accent flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" /> Recording Ready
          </div>
          
          <audio src={audioUrl} controls className="w-full max-w-[240px] h-10" />
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={deleteRecording}
              className="flex-1 flex items-center justify-center gap-2 border border-teal-100 bg-white p-3 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button 
              onClick={submitRecording}
              className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white p-3 rounded-lg text-xs font-bold shadow-md hover:bg-teal-700"
            >
              <Upload className="w-4 h-4" /> Submit Homework
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex flex-col items-center gap-3">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full"
          />
          <span className="text-sm font-bold text-teal-600">Sending to Teacher...</span>
        </div>
      )}
    </div>
  );
};

const HomeworkSubmission = () => {
  const [completedDate, setCompletedDate] = useState<string | null>(null);

  const handleSuccess = (url: string) => {
    console.log("Uploaded URL:", url);
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'short' });
    setCompletedDate(`${day}-${month}`);
  };

  return (
    <div className="gita-card flex-1">
      <div className="gita-title">
        <Mic className="w-5 h-5 text-teal-600" /> Voice Recitation Homework
      </div>
      <p className="text-xs text-gray-500 mb-4 bg-teal-50/30 p-2 rounded-md border-l-2 border-teal-600 italic">
        "Chapter 2, Shloka 47: Karmanye vādhikārāste mā phaleṣu kadācana..."
      </p>
      
      <VoiceRecorder onUploadSuccess={handleSuccess} />

      {completedDate && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg justify-center border border-green-100"
        >
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-bold">Successfully Submitted! Recorded on {completedDate}</span>
        </motion.div>
      )}
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
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="gita-card h-[250px] md:h-[300px]">
              <div className="gita-title text-sm md:text-lg">Class Attendance Trends (%)</div>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="gita-card h-[250px] md:h-[300px]">
              <div className="gita-title text-sm md:text-lg">Homework Completion (%)</div>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="homework" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="gita-card overflow-x-auto">
            <div className="gita-title text-sm md:text-lg">Student Registry</div>
            <table className="w-full text-xs md:text-sm min-w-[500px]">
              <thead className="text-left border-b-2 border-teal-100">
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
                  <tr key={s.id} className="border-b border-teal-50 last:border-0 hover:bg-teal-50/50">
                    <td className="py-3 font-mono text-[11px]">{s.id}</td>
                    <td className="py-3 font-bold">{s.name}</td>
                    <td className="py-3">Grade {s.grade}</td>
                    <td className="py-3 font-bold text-teal-600">{s.points}</td>
                    <td className="py-3">
                       <button className="text-xs text-accent font-bold underline hover:text-teal-600">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
           <Leaderboard />
           <div className="gita-card bg-teal-600 text-white border-none">
              <div className="gita-title border-teal-500 text-white">Admin Tip</div>
              <p className="text-xs italic">Review pending homework uploads daily to keep students motivated with timely feedback.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ studentName }: { studentName: string }) => {
  const [view, setView] = useState<'student' | 'admin'>('student');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  const handleAdminClick = () => {
    if (isAdminAuth) {
      setView('admin');
    } else {
      setShowAdminModal(true);
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Default password changed to 'admin'
    if (adminPass === 'admin') {
      setIsAdminAuth(true);
      setView('admin');
      setShowAdminModal(false);
      setError('');
    } else {
      setError('Incorrect Password');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen text-accent bg-teal-50/20 md:overflow-hidden md:h-screen transition-colors duration-500">
      {/* Admin Password Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-teal-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-teal-600" /> Admin Authentication
                </h3>
                <button onClick={() => setShowAdminModal(false)} className="text-gray-400 hover:text-accent">
                   <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAdminAuth} className="space-y-4">
                <input 
                  type="password"
                  placeholder="Enter Admin Password"
                  autoFocus
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full bg-teal-50/50 border border-teal-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                />
                {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                <button type="submit" className="btn-primary w-full py-3">Access Admin View</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b-2 border-teal-600 px-4 md:px-8 py-3 md:py-4 flex flex-col md:flex-row justify-between items-center shadow-sm z-10 gap-3 md:gap-0 relative overflow-hidden">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <OM_ICON />
            <h1 className="font-serif text-lg md:text-2xl font-bold tracking-tight">Gita Class Portal</h1>
          </div>
        </div>
        
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center py-2 md:py-0">
           <span className="text-xl md:text-3xl font-serif font-black text-teal-700 tracking-wide uppercase block md:inline">
             {view === 'student' ? studentName || 'Arjun Sharma' : 'Class Admin'}
           </span>
        </div>

        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="flex bg-teal-50 p-1 rounded-lg border border-teal-100 flex-1 md:flex-none">
             <button 
               onClick={() => setView('student')}
               className={cn("flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all", view === 'student' ? "bg-white text-teal-600 shadow-sm" : "text-gray-400")}
             >
               Student View
             </button>
             <button 
               onClick={handleAdminClick}
               className={cn("flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all", view === 'admin' ? "bg-white text-teal-600 shadow-sm" : "text-gray-400")}
             >
               Admin View
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        {view === 'admin' ? (
          <AdminDashboard />
        ) : (
          <main className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[300px_1fr] gap-6 relative">
            <section className="flex flex-col gap-6 md:overflow-y-auto md:pr-2 custom-scrollbar z-10 order-1 md:order-2">
              <div className="gita-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-teal-100 bg-teal-50/10 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-lg shrink-0">
                     <Calendar className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Sunday Class Attendance</div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    confetti({ particleCount: 150, origin: { y: 0.7 }, colors: ['#0d9488', '#FF9933'] });
                  }}
                  className="w-full sm:w-auto bg-teal-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-teal-700 transition-all shadow-md shadow-teal-100"
                >
                   Confirm Attendance
                </button>
              </div>

              <HomeworkSubmission />
            </section>

            <aside className="space-y-6 md:overflow-y-auto md:pr-2 custom-scrollbar z-10 order-2 md:order-1">
              <HabitTracker />
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
      <div className="h-screen bg-teal-50/10 flex items-center justify-center p-4 relative overflow-hidden">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-8 rounded-2xl shadow-2xl border border-teal-100 max-w-sm w-full text-center relative overflow-hidden z-10"
         >
           <div className="absolute top-0 left-0 w-full h-2 bg-teal-600" />
           <div className="flex justify-center mb-6 relative">
             <OM_ICON />
           </div>
           <h2 className="font-serif text-2xl font-bold mb-2 text-teal-700">Gita Class Portal</h2>
           <p className="text-gray-500 text-sm mb-6">Enter the student's first name to enter the portal</p>
           
           <div className="flex flex-col gap-4 text-left">
             <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Student's First Name</label>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="e.g. Arjun"
                 value={pin}
                 onChange={(e) => setPin(e.target.value)}
                 className="w-full bg-teal-50/30 border border-teal-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600/50 text-center text-xl font-bold"
               />
             </div>
             <button 
               onClick={() => setIsLogged(true)}
               className="btn-primary w-full py-4 text-lg shadow-lg shadow-teal-100"
             >
               Go to Dashboard
             </button>
           </div>
           
           <div className="mt-8 pt-6 border-t border-teal-50 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase">
             <Star className="w-4 h-4 text-gold fill-gold" /> Krishna's Path to Learning
           </div>
         </motion.div>
      </div>
    )
  }

  return <Dashboard studentName={pin} />;
}
