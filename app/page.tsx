'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  Lock, Unlock, Download, Instagram, CheckCircle2, 
  AlertCircle, FileText, Table, BookOpen, ExternalLink 
} from 'lucide-react';

/**
 * ПРИМІТКА: Замініть посилання нижче на ваші реальні файли (Google Drive тощо)
 */
const FILE_LINKS = {
  guide: "https://example.com/your-guide-link",
  cheatsheet: "https://example.com/your-cheatsheet-link",
  verbs: "https://example.com/your-verbs-link"
};

// Твої реальні ключі Firebase, які ти надіслав
const firebaseConfig = {
  apiKey: "AIzaSyDQomB6y2PXQcQwZ5AvqSk6tbqXk-kiNMA",
  authDomain: "englishgrammar-b6136.firebaseapp.com",
  projectId: "englishgrammar-b6136",
  storageBucket: "englishgrammar-b6136.firebasestorage.app",
  messagingSenderId: "640618938672",
  appId: "1:640618938672:web:88684de255ca5f0e3f88f5",
  measurementId: "G-PP10HGFXEV"
};

// Ініціалізація (запобігає помилкам при перезавантаженні сторінки в Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// ID для документів у базі (краще залишити зрозумілу назву)
const APP_DATA_ID = 'english-grammar-pro'; 

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [keyInput, setKeyInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Помилка авторизації", err);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const savedAccess = localStorage.getItem('grammar_unlocked_2026');
    if (savedAccess === 'true') setIsUnlocked(true);

    return () => unsubscribe();
  }, []);

  const handleUnlock = async () => {
    if (!user) {
      setError('З\'єднання з сервером...');
      return;
    }
    if (!keyInput.trim()) {
      setError('Введіть ключ доступу');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Шлях у Firestore: artifacts -> english-grammar-pro -> public -> data -> access_keys -> [ВВЕДЕНИЙ_КЛЮЧ]
      const keyRef = doc(db, 'artifacts', APP_DATA_ID, 'public', 'data', 'access_keys', keyInput.trim().toUpperCase());
      const keySnap = await getDoc(keyRef);

      if (keySnap.exists() && keySnap.data().active === true) {
        setIsUnlocked(true);
        setSuccess(true);
        localStorage.setItem('grammar_unlocked_2026', 'true');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Невірний або неактивний ключ.');
      }
    } catch (err) {
      setError('Помилка перевірки. Спробуйте ще раз.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const devCreateKey = async () => {
    const testKey = "ENGLISH-PRO";
    try {
      const keyRef = doc(db, 'artifacts', APP_DATA_ID, 'public', 'data', 'access_keys', testKey);
      await setDoc(keyRef, { active: true });
      alert(`Ключ ${testKey} додано в базу!`);
    } catch (e) { 
      alert("Помилка при створенні ключа. Перевірте правила доступу Firestore."); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-[#002D62] text-white py-16 px-6 text-center border-b-[10px] border-[#FFD700] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-tight">
            English Grammar <br className="hidden md:block" />
            <span className="text-[#FFD700]">for Real Life</span>
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 font-medium italic opacity-90">
            12 тем для реального життя — зрозуміти логіку, а не зазубрювати правила
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <section className="bg-white rounded-[2rem] p-8 md:p-14 shadow-2xl shadow-blue-900/5 mb-16 border border-slate-100 transition-all">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002D62] mb-4">Активація матеріалів</h2>
            <p className="text-slate-500 mb-10 text-lg leading-relaxed">
              Введіть ваш персональний ключ, щоб розблокувати PDF-гайд.
            </p>

            {!isUnlocked ? (
              <div className="space-y-6">
                <div className="relative group">
                  <input 
                    type="text" 
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                    placeholder="ВВЕДІТЬ ВАШ КЛЮЧ..."
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-[#002D62] focus:bg-white outline-none transition-all text-xl font-mono tracking-[0.2em] text-center shadow-inner"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002D62] transition-colors">
                    <Lock size={24} />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center justify-center gap-2 text-red-500 font-bold animate-pulse">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  onClick={handleUnlock}
                  disabled={loading || !user}
                  className="w-full bg-[#002D62] text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-900 transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? "ПЕРЕВІРКА..." : "РОЗБЛОКУВАТИ ДОСТУП"}
                  {!loading && <Unlock size={22} />}
                </button>

                <div className="pt-10 mt-10 border-t border-slate-50">
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-6">Немає ключа?</p>
                  <a 
                    href="https://ig.me/m/julianism_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-[#FFD700] text-[#002D62] px-12 py-5 rounded-2xl font-black text-3xl hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/30 group"
                  >
                    999 грн
                    <Instagram size={32} className="group-hover:rotate-12 transition-transform" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-100 p-8 rounded-3xl animate-in zoom-in">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Доступ активовано!</h3>
                <p className="text-green-600 font-medium">Тепер усі матеріали доступні для завантаження.</p>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FileCard 
            title="Гайд з граматики" 
            desc="Основний PDF: 12 тем, логіка, приклади та вправи." 
            unlocked={isUnlocked}
            icon={<BookOpen size={32} />}
            link={FILE_LINKS.guide}
            format="PDF / DOCX"
          />
          <FileCard 
            title="Шпаргалка часів" 
            desc="Всі часи в одній системній таблиці." 
            unlocked={isUnlocked}
            icon={<Table size={32} />}
            link={FILE_LINKS.cheatsheet}
            format="PDF"
          />
          <FileCard 
            title="Неправильні дієслова" 
            desc="Повна таблиця дієслів з перекладом." 
            unlocked={isUnlocked}
            icon={<FileText size={32} />}
            link={FILE_LINKS.verbs}
            format="DOCX"
          />
        </div>

        <div className="mt-20 opacity-5 hover:opacity-100 transition-opacity text-center">
          <button onClick={devCreateKey} className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold hover:text-blue-500">
            Developer: Create Test Key (ENGLISH-PRO)
          </button>
        </div>
      </main>

      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 text-sm font-medium">
          <p>© 2026 English Grammar for Real Life.</p>
          <div className="flex gap-10">
            <a href="https://ig.me/m/julianism_" className="hover:text-[#002D62] transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FileCard({ title, desc, unlocked, icon, link, format }: any) {
  return (
    <div className={`group bg-white rounded-[2rem] p-8 border-2 transition-all duration-700 flex flex-col justify-between h-full ${
      unlocked 
      ? 'border-green-50 shadow-lg hover:shadow-2xl hover:-translate-y-2' 
      : 'border-slate-50 opacity-60 grayscale'
    }`}>
      <div>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-sm ${
          unlocked ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
        }`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold mb-3 transition-colors ${unlocked ? 'text-[#002D62]' : 'text-slate-400'}`}>
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
          {desc}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest px-1">
          <span className={unlocked ? 'text-green-600' : 'text-slate-300'}>Формат: {format}</span>
          <span className={unlocked ? 'text-green-600' : 'text-slate-300'}>{unlocked ? 'Доступно' : 'Закрито'}</span>
        </div>
        
        <button 
          onClick={() => unlocked && window.open(link, '_blank')}
          disabled={!unlocked}
          className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-md ${
            unlocked 
            ? 'bg-[#002D62] text-white hover:bg-blue-900 active:scale-95 hover:shadow-xl' 
            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          {unlocked ? 'ЗАВАНТАЖИТИ' : 'ЗАБЛОКОВАНО'}
          {unlocked ? <Download size={20} /> : <Lock size={20} />}
        </button>
      </div>
    </div>
  );
}