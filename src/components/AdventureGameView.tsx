import React, { useState, useEffect, useCallback, useRef } from 'react';
import { soundEffects } from '../utils/soundEffects';
import { Home, ShoppingCart, ChevronRight, Package, Heart, Shield, Award, Crown, TrendingUp, AlertTriangle, Trophy, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, Clock, MapPin, ListChecks, Volume2, VolumeX, MessageSquare, Send, Sparkles, BookOpen, FileText, FileSpreadsheet, HelpCircle } from 'lucide-react';
import { calculateAdventureScore, downloadScoreReportTXT, downloadScoreReportExcel, getPredikatScore } from '../utils/scoreExporter';
import { PRICES, BUILDING_IMAGES, ALL_MAPS, QUESTS, WANDERING_NPCS, FARM_ANIMALS, ANIMAL_IMAGES, NAMED_BUILDINGS } from '../data/adventureMaps';

const LEVELS = {
  'JUNIOR': { label: 'Junior', months: 4, icon: Shield, cityCount: 2, assistance: 'FULL', color: 'emerald', desc: 'Krisis: Bulan 3.', crisisMonths: [3] },
  'SENIOR': { label: 'Senior', months: 8, icon: Award, cityCount: 3, assistance: 'HALF', color: 'blue', desc: 'Krisis: Bulan 3, 6.', crisisMonths: [3, 6] },
  'MASTER': { label: 'Master', months: 12, icon: Crown, cityCount: 4, assistance: 'NONE', color: 'amber', desc: 'Krisis: Bulan 3, 6, 9.', crisisMonths: [3, 6, 9] }
};

const CRISIS_DESC = [
  "Usahanya bangkrut karena inflasi.",
  "Terserang hama paceklik musim kemarau.",
  "Rumahnya terbakar habis tanpa sisa.",
  "Kapal dagangnya tenggelam diterjang badai.",
  "Tabungannya ludes karena tertipu investasi bodong."
];

interface PlayerPos { x: number; y: number }
interface AdventureStats { trust: number; population_saved: number; cash: number; rice: number; gold: number }

export function AdventureGameView({ 
  playerName, playerAvatar, isMultiplayer = false, socket = null, roomId = null, playerId = null, otherPlayers = [], adventureState = null, chatMessages = [], onSendChat = null, serverTime = null, isHost = false, onGoHome
}: any) {
  const MAP_COLS = 40; const MAP_ROWS = 30; const CELL_SIZE = 64;
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'ENDING'>('START');
  const [dragItem, setDragItem] = useState<any>(null);
  const [level, setLevel] = useState<keyof typeof LEVELS>('JUNIOR');
  const [month, setMonth] = useState(0);
  const [maxMonths, setMaxMonths] = useState(4);
  const [currentMap, setCurrentMap] = useState<string>('');
  const [playerPos, setPlayerPos] = useState<PlayerPos>({ x: 2, y: 2 });
  const [stats, setStats] = useState<AdventureStats>({ trust: 60, population_saved: 0, cash: 0, rice: 0, gold: 0 });
  const [activeMaps, setActiveMaps] = useState<any[]>([]);
  const [completedThisMonth, setCompletedThisMonth] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>(["Selamat datang, Petugas Amil."]);

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'NPC' | 'CRISIS' | 'WANDERING_CHAT' | 'ADMIN_EDIT' | 'QUEST_STATUS' | 'HELP_HOW_TO_PLAY', data: any, reason?: string}>({isOpen: false, type: 'NPC', data: null});
  const [questInput, setQuestInput] = useState('');
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [enableWandering, setEnableWandering] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(true);

  // Chat & Story Modal States
  const [chatInputText, setChatInputText] = useState('');
  const [localChatMessages, setLocalChatMessages] = useState<any[]>([]);
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);
  const [hasSeenStory, setHasSeenStory] = useState<boolean>(false);
  const [storySlide, setStorySlide] = useState(0);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Trigger Story Modal at Game Start
  useEffect(() => {
    if (gameState === 'PLAYING' && !hasSeenStory) {
      setShowStoryModal(true);
    }
  }, [gameState, hasSeenStory]);

  // Combined Chat Messages
  const displayChats = isMultiplayer ? chatMessages : localChatMessages;

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [displayChats]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim()) return;
    soundEffects.playClick();
    const text = chatInputText.trim();
    setChatInputText('');

    if (isMultiplayer && onSendChat) {
      onSendChat(text);
    } else {
      setLocalChatMessages(prev => [
        ...prev,
        {
          id: `local_msg_${Date.now()}_${Math.random()}`,
          sender: playerName || 'Amil Muda',
          avatar: playerAvatar || '🧔',
          text,
          timestamp: Date.now(),
          type: 'chat'
        }
      ]);
    }
  };

  // Background Village Music Handler
  useEffect(() => {
    if (gameState === 'PLAYING' && isMusicOn) {
      soundEffects.startVillageBGM();
    } else {
      soundEffects.stopVillageBGM();
    }
    return () => {
      soundEffects.stopVillageBGM();
    };
  }, [gameState, isMusicOn]);

  const toggleVillageMusic = () => {
    const newState = !isMusicOn;
    setIsMusicOn(newState);
    soundEffects.musicEnabled = newState;
    if (newState) {
      soundEffects.startVillageBGM();
    } else {
      soundEffects.stopVillageBGM();
    }
  };

  // Helper to check if NPC quest is completed
  const isNpcCompleted = (npcId: string) => {
    if (isMultiplayer) {
      return completedThisMonth.includes(npcId);
    } else {
      return completedThisMonth.includes(`${npcId}_${month}`) || completedThisMonth.includes(npcId);
    }
  };

  // Wandering NPCs periodic movement (Mundar-Mandir)
  useEffect(() => {
    if (gameState !== 'PLAYING' || !enableWandering) return;
    const interval = setInterval(() => {
      setActiveMaps(prevMaps => {
        return prevMaps.map(m => {
          const updatedNpcs = m.npcs.map((npc: any) => {
            if (!npc.isWandering) return npc;
            const dx = Math.floor(Math.random() * 3) - 1;
            const dy = dx === 0 ? (Math.floor(Math.random() * 3) - 1) : 0;
            const nx = Math.max(0, Math.min(MAP_COLS - 1, npc.x + dx));
            const ny = Math.max(0, Math.min(MAP_ROWS - 1, npc.y + dy));

            // Avoid overlapping buildings
            const hitBuilding = m.buildings?.some((b: any) => b.x === nx && b.y === ny);
            if (hitBuilding) return npc;

            return { ...npc, x: nx, y: ny };
          });
          return { ...m, npcs: updatedNpcs };
        });
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [gameState, enableWandering, MAP_COLS, MAP_ROWS]);

  // Auto spread buildings across regions so they never cluster
  const autoSpreadBuildings = () => {
    soundEffects.playCorrect();
    const regions = [
      { x: 4, y: 4 },    // Barat Laut
      { x: 34, y: 4 },   // Timur Laut
      { x: 19, y: 4 },   // Tengah Utara
      { x: 4, y: 24 },   // Barat Daya
      { x: 34, y: 24 },  // Timur Daya
      { x: 19, y: 24 },  // Tengah Selatan
      { x: 10, y: 14 },  // Barat Tengah
      { x: 28, y: 14 },  // Timur Tengah
      { x: 4, y: 14 },   // Barat Samping
      { x: 34, y: 14 },  // Timur Samping
      { x: 19, y: 14 },  // Pusat Kota
      { x: 28, y: 24 }   // Tenggara
    ];

    setActiveMaps(prevMaps => {
      const updated = prevMaps.map(m => {
        const buildings = m.buildings.map((b: any, idx: number) => {
          const reg = regions[idx % regions.length];
          return { ...b, x: reg.x, y: reg.y };
        });

        // Place quest NPCs beside buildings
        let qIndex = 0;
        const npcs = m.npcs.map((n: any) => {
          if (n.isWandering) return n;
          const linkedBuilding = buildings[qIndex % buildings.length];
          qIndex++;
          return {
            ...n,
            x: Math.max(0, Math.min(MAP_COLS - 1, linkedBuilding.x + 1)),
            y: linkedBuilding.y
          };
        });

        return { ...m, buildings, npcs };
      });

      if (isMultiplayer && socket) {
        updated.forEach(m => {
          m.buildings.forEach((b: any) => {
            socket.send(JSON.stringify({
              type: 'ADVENTURE_MOVE_ITEM',
              payload: { mapName: m.name, type: 'building', id: b.id, x: b.x, y: b.y }
            }));
          });
          m.npcs.forEach((n: any) => {
            socket.send(JSON.stringify({
              type: 'ADVENTURE_MOVE_ITEM',
              payload: { mapName: m.name, type: 'npc', id: n.id, x: n.x, y: n.y }
            }));
          });
        });
      }

      return updated;
    });
  };

  // Helper to ensure wandering NPCs are present in map
  const attachWanderingNpcs = (mapsToProcess: any[]) => {
    return mapsToProcess.map((m: any) => {
      const existingIds = new Set(m.npcs.map((n: any) => n.id));
      const questNpcs = m.npcs.filter((n: any) => !n.isWandering);
      const wanderers: any[] = [];

      WANDERING_NPCS.forEach((wn: any, idx: number) => {
        const wId = `wn_${wn.id}_${idx}`;
        if (!existingIds.has(wId) && !existingIds.has(wn.id)) {
          wanderers.push({
            ...wn,
            id: wId,
            x: (wn.x + idx) % (MAP_COLS - 2) + 1,
            y: (wn.y + idx) % (MAP_ROWS - 2) + 1
          });
        }
      });

      const existingWanderers = m.npcs.filter((n: any) => n.isWandering);
      return {
        ...m,
        npcs: [...questNpcs, ...existingWanderers, ...wanderers]
      };
    });
  };

  // Multiplayer sync
  useEffect(() => {
    if (isMultiplayer && socket && gameState === 'PLAYING') {
      socket.send(JSON.stringify({
        type: 'ADVENTURE_SYNC',
        payload: {
          mapName: currentMap,
          pos: playerPos,
          stats: {
             score: (stats.population_saved * 100) + stats.trust,
             trust: stats.trust,
             population: stats.population_saved
          }
        }
      }));
    }
  }, [playerPos, currentMap, stats, isMultiplayer, socket, gameState]);

  // Handle Server adventureState
  useEffect(() => {
     if (isMultiplayer && adventureState && gameState === 'PLAYING') {
        setActiveMaps(adventureState.activeMaps);
        setMonth(adventureState.cycle - 1);
        setCompletedThisMonth(adventureState.completedNpcs || []);
        
        if (adventureState.playerStats && adventureState.playerStats[playerId]) {
           const s = adventureState.playerStats[playerId];
           setStats(prev => ({ ...prev, trust: s.trust, population_saved: s.population_saved, cash: s.cash, rice: s.rice, gold: s.gold }));
        }
     }
  }, [isMultiplayer, adventureState, gameState, playerId]);

  // Sync End game
  useEffect(() => {
     if (isMultiplayer && adventureState && adventureState.cycle > 3) {
        setGameState('ENDING');
     }
  }, [isMultiplayer, adventureState]);

  // Auto-start for Multiplayer
  useEffect(() => {
     if (isMultiplayer && gameState === 'START' && adventureState) {
        startGame('MASTER');
     }
  }, [isMultiplayer, gameState, adventureState]);

  // Multiplayer Timer
  useEffect(() => {
      let interval: any;
      const cycleEndTime = adventureState?.cycleEndTime;
      if (isMultiplayer && cycleEndTime && gameState === 'PLAYING') {
         // calculate clock skew if serverTime is available
         const skew = serverTime ? (serverTime - Date.now()) : 0;
         const getRemain = () => Math.max(0, cycleEndTime - (Date.now() + skew));
         
         setTimeLeftMs(getRemain());
         interval = setInterval(() => {
            setTimeLeftMs(getRemain());
         }, 1000);
      }
      return () => clearInterval(interval);
  }, [isMultiplayer, adventureState?.cycleEndTime, gameState, serverTime]);
  
  const formatTime = (ms: number) => {
      const s = Math.floor(ms / 1000);
      return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const startGame = (lvl: keyof typeof LEVELS) => {
    soundEffects.playVictoryFanfare();
    const config = LEVELS[lvl];
    setGameState('PLAYING');
    setLevel(lvl);
    setMaxMonths(config.months);
    setMonth(0);
    setStats({ trust: 60, population_saved: 0, cash: 0, rice: 0, gold: 0 });
    setLog([`Tugas dimulai sebagai ${config.label}.`]);
    setCompletedThisMonth([]);
    
    if (isMultiplayer) {
       setCurrentMap(ALL_MAPS[0].name);
    } else {
       const maps = JSON.parse(JSON.stringify(ALL_MAPS.slice(0, config.cityCount)));
       setActiveMaps(maps);
       setCurrentMap(maps[0].name);
    }
    setPlayerPos({ x: 2, y: 2 });
  };

  const move = useCallback((dx: number, dy: number) => {
    if (gameState !== 'PLAYING' || modalState.isOpen) return;
    setPlayerPos(prev => {
      const nx = Math.max(0, Math.min(MAP_COLS - 1, prev.x + dx));
      const ny = Math.max(0, Math.min(MAP_ROWS - 1, prev.y + dy));
      if (nx !== prev.x || ny !== prev.y) {
        soundEffects.playClick();
        checkInteraction(nx, ny, currentMap, activeMaps, completedThisMonth);
        return { x: nx, y: ny };
      }
      return prev;
    });
  }, [gameState, modalState.isOpen, currentMap, activeMaps, completedThisMonth]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'PLAYING' || modalState.isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const tileX = Math.floor((clickX / rect.width) * MAP_COLS);
    const tileY = Math.floor((clickY / rect.height) * MAP_ROWS);

    const clampedX = Math.max(0, Math.min(MAP_COLS - 1, tileX));
    const clampedY = Math.max(0, Math.min(MAP_ROWS - 1, tileY));

    soundEffects.playClick();
    setPlayerPos({ x: clampedX, y: clampedY });
    checkInteraction(clampedX, clampedY, currentMap, activeMaps, completedThisMonth);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move(0, -1);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  
  const handleDragStart = (e: any, item: any, type: string) => {
    if (!isHost) return;
    setDragItem({ ...item, itemType: type });
  };
  const handleDrop = (e: any) => {
    if (!isHost || !dragItem) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dropX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const dropY = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    
    if (socket) {
       socket.send(JSON.stringify({
          type: 'ADVENTURE_MOVE_ITEM',
          payload: {
             mapName: currentMap,
             type: dragItem.itemType,
             id: dragItem.id,
             x: Math.max(0, Math.min(MAP_COLS - 1, dropX)),
             y: Math.max(0, Math.min(MAP_ROWS - 1, dropY))
          }
       }));
    }
    setDragItem(null);
  };

  const checkInteraction = (x: number, y: number, mapName: string, maps: any[], completed: string[]) => {
    const mapData = maps.find((m: any) => m.name === mapName);
    if (!mapData) return;
    const npc = mapData.npcs.find((n: any) => n.x === x && n.y === y);
    if (npc) {
       if (npc.isWandering) {
          soundEffects.playClick();
          setModalState({ isOpen: true, type: 'WANDERING_CHAT', data: npc });
          return;
       }
       const isCompleted = isMultiplayer ? completed.includes(npc.id) : completed.includes(`${npc.id}_${month}`);
       if (!isCompleted) {
          soundEffects.playClick();
          setModalState({ isOpen: true, type: 'NPC', data: npc });
          setQuestInput('');
       }
    }
  };

  const liquidate = (type: 'rice' | 'gold') => {
    soundEffects.playClick();
    if (stats[type] <= 0) return;
    const amount = stats[type];
    const gain = amount * PRICES[type];
    setStats(prev => ({ ...prev, [type]: 0, cash: prev.cash + gain }));
    setLog(prev => [`PASAR: Menjual ${amount} ${type === 'rice' ? 'kg Beras' : 'gr Emas'} seharga Rp ${gain.toLocaleString()}.`, ...prev]);
    if (isMultiplayer && socket) {
       socket.send(JSON.stringify({ type: 'ADVENTURE_LIQUIDATE', payload: { type, amount, gain } }));
    }
  };

  const triggerCrisis = (maps: any[]) => {
    const muzakkis: any[] = [];
    maps.forEach(map => {
      map.npcs.forEach((npc: any) => {
        if (npc.type === 'MUZAKKI') muzakkis.push({mapName: map.name, npc});
      });
    });

    if (muzakkis.length > 0) {
      const target = muzakkis[Math.floor(Math.random() * muzakkis.length)];
      const reason = CRISIS_DESC[Math.floor(Math.random() * CRISIS_DESC.length)];
      target.npc.type = 'MUSTAHIK';
      target.npc.isHelped = false;
      target.npc.cost = 4000000 + (Math.floor(Math.random() * 6) * 1000000);
      target.npc.name = target.npc.name.replace(" (Mandiri)", "");
      setModalState({ isOpen: true, type: 'CRISIS', data: target.npc, reason });
      setLog(prev => [`DARURAT: ${target.npc.name} jatuh miskin!`, ...prev]);
      soundEffects.playWrong();
    }
  };

  const nextMonth = () => {
    soundEffects.playCorrect();
    if (month >= maxMonths - 1) {
      setGameState('ENDING');
      if (isMultiplayer && socket) {
         socket.send(JSON.stringify({ type: 'ADVENTURE_END', payload: { score: (stats.population_saved * 100) + stats.trust }}));
      }
    } else {
      setMonth(prev => prev + 1);
      const newMaps = [...activeMaps];
      newMaps.forEach(map => {
        map.npcs.forEach((npc: any) => {
          if (npc.type === 'MUSTAHIK' && npc.isHelped) {
            npc.type = 'MUZAKKI';
            npc.name += " (Mandiri)";
            npc.quest = 'TERNAK';
            setLog(prev => [`BERKAH: ${npc.name} kini mandiri!`, ...prev]);
          }
        });
      });
      setActiveMaps(newMaps);
      
      const config = LEVELS[level];
      if (config.crisisMonths.includes(month + 2)) { // +2 because month is 0-indexed and we are advancing
        triggerCrisis(newMaps);
      }
      setCompletedThisMonth([]);
      setLog(prev => [`--- Memasuki Bulan ${month + 2} ---`, ...prev]);
    }
  };

  const handleNPCAction = () => {
    const npc = modalState.data;
    const isMuzakki = npc.type === 'MUZAKKI';
    
    // Validate first
    let isSuccess = false;
    let statsDiff: any = {};
    const quest = isMuzakki ? QUESTS[npc.quest as keyof typeof QUESTS] : null;

    if (isMuzakki && quest) {
      const input = parseFloat(questInput);
      if (input === quest.target) {
         isSuccess = true;
         statsDiff = { [quest.unit]: quest.target, trust: 5 };
         setLog(prev => [`BERHASIL: Menerima ${quest.target} ${quest.label} dari ${npc.name}.`, ...prev]);
      } else {
         soundEffects.playWrong();
         setLog(prev => [`SALAH: Perhitungan zakat ${npc.name} keliru.`, ...prev]);
         if (!isMultiplayer) setStats(prev => ({ ...prev, trust: Math.max(0, prev.trust - 5) }));
      }
    } else {
      if (stats.cash >= npc.cost) {
         isSuccess = true;
         statsDiff = { cash: -npc.cost, population_saved: 1, trust: 5 };
         npc.isHelped = true;
         setLog(prev => [`MULIA: Bantuan disalurkan. ${npc.name} akan mulai mandiri bulan depan!`, ...prev]);
      } else {
         soundEffects.playWrong();
         setLog(prev => [`GAGAL: Uang tunai tidak cukup. Tukarkan aset di Gudang!`, ...prev]);
      }
    }

    if (isSuccess) {
       soundEffects.playCorrect();

       // Add local chat notification
       const actionText = isMuzakki 
         ? `berhasil menghitung & mengumpulkan zakat dari ${npc.name}` 
         : `berhasil menyalurkan bantuan modal zakat kepada ${npc.name}`;
       setLocalChatMessages(prev => [
         ...prev,
         {
           id: `local_notif_${Date.now()}_${Math.random()}`,
           sender: 'Sistem Zakat',
           avatar: '🕌',
           text: `🎉 [${playerName || 'Amil Muda'}] ${actionText}!`,
           timestamp: Date.now(),
           type: 'system'
         }
       ]);

       if (isMultiplayer && socket) {
          socket.send(JSON.stringify({
             type: 'ADVENTURE_INTERACT',
             payload: {
                npcId: isMultiplayer ? npc.id : `${npc.id}_${month}`,
                statsDiff,
                mapName: currentMap,
                npcName: npc.name,
                isMuzakki
             }
          }));
       } else {
          setStats(prev => {
             const ns = { ...prev };
             for (const k in statsDiff) {
                // @ts-ignore
                ns[k] = (ns[k] || 0) + statsDiff[k];
             }
             ns.trust = Math.min(100, ns.trust);
             return ns;
          });
          setCompletedThisMonth(prev => [...prev, `${npc.id}_${month}`]);
       }
    }
    setModalState({ isOpen: false, type: 'NPC', data: null });
  };

  const getSpriteClass = (type: string) => {
    if (type === 'PLAYER') return 'bg-emerald-500';
    if (type === 'MUZAKKI') return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 relative z-10 text-[#3D405B] font-sans">
      
      {/* Header */}
      {gameState !== 'START' && (
        <div className="bg-[#FDFCF0] p-4 rounded-3xl flex flex-col md:flex-row gap-4 shadow-[4px_4px_0px_#3D405B] border-2 border-[#3D405B]">
          <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-[#3D405B]/20 pb-3 md:pb-0 md:pr-4">
            <button onClick={onGoHome} className="w-10 h-10 bg-[#E07A5F] text-white rounded-xl border-2 border-[#3D405B] flex items-center justify-center hover:scale-105 transition-transform"><Home size={18} /></button>
            <div>
              <h2 className="font-black text-sm leading-tight uppercase">{LEVELS[level].label}</h2>
              <p className="text-[10px] text-[#3D405B]/70 font-bold uppercase tracking-wider">
                {isMultiplayer ? `Siklus ${month + 1}/3` : `Bulan ${month + 1}/${maxMonths}`}
                {isMultiplayer && <span className="ml-2 text-rose-500">{formatTime(timeLeftMs)}</span>}
              </p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="bg-emerald-50 border-2 border-emerald-200 p-2 rounded-2xl flex flex-col items-center justify-center"><span className="text-[9px] font-black text-emerald-600 uppercase">Rupiah</span><span className="font-bold text-[11px]">Rp {stats.cash.toLocaleString()}</span></div>
            <div className="bg-amber-50 border-2 border-amber-200 p-2 rounded-2xl flex flex-col items-center justify-center"><span className="text-[9px] font-black text-amber-600 uppercase">Beras</span><span className="font-bold text-[11px]">{stats.rice.toLocaleString()} kg</span></div>
            <div className="bg-yellow-50 border-2 border-yellow-200 p-2 rounded-2xl flex flex-col items-center justify-center"><span className="text-[9px] font-black text-yellow-600 uppercase">Emas</span><span className="font-bold text-[11px]">{stats.gold.toLocaleString()} gr</span></div>
          </div>
        </div>
      )}

      {/* Main View */}
      {gameState === 'START' && (
         <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 py-10">
            <div className="text-center animate-bounce">
                <div className="inline-flex p-5 bg-emerald-100 text-emerald-600 rounded-3xl border-2 border-emerald-300 mb-6 shadow-xl">
                    <TrendingUp size={48} />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-[#3D405B] tracking-tighter mb-4 uppercase">Zakat Adventure</h1>
                <p className="text-[#3D405B]/80 text-lg md:text-xl font-bold max-w-lg mx-auto leading-relaxed">Pimpin misi kemandirian umat dan hadapi tantangan krisis ekonomi.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {(Object.keys(LEVELS) as Array<keyof typeof LEVELS>)
                  .filter(lvl => isMultiplayer ? lvl === 'MASTER' : true)
                  .map((lvl) => {
                  const LvlIcon = LEVELS[lvl].icon;
                  return (
                    <button key={lvl} onClick={() => startGame(lvl)} className="group relative bg-[#FDFCF0] p-8 rounded-3xl border-4 border-[#3D405B] hover:border-emerald-500 hover:shadow-[6px_6px_0px_#10b981] transition-all flex flex-col items-center text-center gap-4 overflow-hidden shadow-[4px_4px_0px_#3D405B]">
                        <div className="relative z-10 w-16 h-16 bg-emerald-100 text-emerald-600 border-2 border-emerald-300 rounded-2xl flex items-center justify-center mb-2"><LvlIcon size={32} /></div>
                        <div className="relative z-10">
                          <h3 className="text-2xl font-black text-[#3D405B] mb-1">Amil {LEVELS[lvl].label}</h3>
                          <div className="flex flex-col items-center justify-center gap-1 mb-3">
                            <span className="px-3 py-1 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">{LEVELS[lvl].cityCount} Kota • {LEVELS[lvl].months} Bulan</span>
                            <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">{LEVELS[lvl].desc}</span>
                          </div>
                        </div>
                    </button>
                  );
                })}
            </div>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col items-center w-full">
              <div className="w-full bg-[#3D405B] text-white p-3 rounded-2xl mb-3 flex flex-wrap items-center justify-between gap-2 shadow-[2px_2px_0px_#000000]">
                <div className="flex items-center gap-2">
                  <span className={`font-black text-[10px] px-2 py-1 rounded uppercase tracking-wider ${isHost ? 'bg-amber-400 text-[#3D405B]' : 'bg-emerald-400 text-[#3D405B]'}`}>
                    {isHost ? 'Layar Admin' : 'Peta Petualangan'}
                  </span>
                  <span className="text-xs font-bold hidden sm:inline">Peta Zakat Adventure</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={() => {
                      setShowStoryModal(true);
                      setStorySlide(0);
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] px-3 py-1.5 rounded-xl font-black border border-white/20 shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105"
                    title="Baca ulang cerita & alur tugas Amil Muda"
                  >
                    <BookOpen size={14} /> Kisah Amil
                  </button>

                  <button 
                    onClick={() => setModalState({ isOpen: true, type: 'HELP_HOW_TO_PLAY', data: null })}
                    className="bg-sky-400 hover:bg-sky-500 text-[#3D405B] text-[11px] px-3 py-1.5 rounded-xl font-black border border-white/20 shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105"
                    title="Cara Bermain"
                  >
                    <HelpCircle size={14} /> Bantuan
                  </button>

                  <button 
                    onClick={() => setModalState({ isOpen: true, type: 'QUEST_STATUS', data: null })}
                    className="bg-amber-400 hover:bg-amber-500 text-[#3D405B] text-[11px] px-3 py-1.5 rounded-xl font-black border border-white/20 shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105"
                    title="Lihat status misi zakat per kota"
                  >
                    <ListChecks size={14} /> Status Misi Per Kota
                  </button>

                  <button 
                    onClick={toggleVillageMusic}
                    className={`${isMusicOn ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-600 hover:bg-slate-700'} text-white text-[11px] px-3 py-1.5 rounded-xl font-black border border-white/20 shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105`}
                    title={isMusicOn ? 'Matikan Musik Desa' : 'Nyalakan Musik Desa'}
                  >
                    {isMusicOn ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />} 
                    {isMusicOn ? 'Musik Desa [ON]' : 'Musik Desa [OFF]'}
                  </button>

                  {isHost && (
                    <>
                      <button 
                        onClick={autoSpreadBuildings}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] px-2.5 py-1.5 rounded-xl font-black border border-white/20 shadow-sm transition-transform hover:scale-105"
                        title="Sebarkan gedung & NPC agar terpisah jauh sesuai kawasan"
                      >
                        📍 Ratakan Kawasan
                      </button>
                      <button 
                        onClick={() => setEnableWandering(prev => !prev)}
                        className={`${enableWandering ? 'bg-indigo-500' : 'bg-slate-500'} text-white text-[11px] px-2.5 py-1.5 rounded-xl font-bold border border-white/20`}
                      >
                        {enableWandering ? '🚶 NPC Mundar-Mandir [ON]' : '⏸️ NPC [PAUSE]'}
                      </button>
                      <button 
                        onClick={() => setModalState({ isOpen: true, type: 'ADMIN_EDIT', data: null })}
                        className="bg-amber-500 hover:bg-amber-600 text-[#3D405B] text-[11px] px-2.5 py-1.5 rounded-xl font-black"
                      >
                        ✏️ Edit Koordinat
                      </button>
                      <button 
                        onClick={() => { if (socket) socket.send(JSON.stringify({ type: 'ADVENTURE_FAST_FORWARD' })); }}
                        className="bg-purple-500 hover:bg-purple-600 text-white text-[11px] px-2.5 py-1.5 rounded-xl font-black flex items-center gap-1 border border-white/20"
                        title="Percepat & Langsung ke Siklus Berikutnya"
                      >
                        <Clock size={12} /> Percepat Siklus
                      </button>
                      {adventureState?.cycleEndTime === 0 && (
                        <button 
                          onClick={() => { if (socket) socket.send(JSON.stringify({ type: 'START_GAME' })); }}
                          className="bg-emerald-400 text-[#3D405B] text-[11px] px-3 py-1.5 rounded-xl font-black border-2 border-[#3D405B]"
                        >
                          🚀 MULAI PERMAINAN
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="relative w-full max-w-3xl xl:max-w-4xl h-[60vh] bg-[#81B29A] border-4 border-[#3D405B] rounded-3xl shadow-[6px_6px_0px_#3D405B] overflow-hidden" 
                   onDragOver={e => e.preventDefault()} 
                   onDrop={handleDrop}>
                  
                  {/* Floating Camera Status Badge */}
                  <div className="absolute top-3 left-3 z-40 bg-[#3D405B]/90 backdrop-blur-md border-2 border-[#3D405B] text-white px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-[3px_3px_0px_#000000] pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[10px] font-black uppercase text-amber-300">
                      🎥 Kamera Terkunci: {isHost ? '👑 Admin' : '🧭 ' + (playerName || 'Kamu')}
                    </span>
                  </div>

                  {/* Floating Zoom Controls */}
                  <div className="absolute top-3 right-3 z-40 bg-[#3D405B]/90 backdrop-blur-md border-2 border-[#3D405B] text-white p-1.5 rounded-2xl flex items-center gap-1 shadow-[3px_3px_0px_#000000]">
                    <button 
                      onClick={() => setZoomLevel(prev => Math.min(1.8, +(prev + 0.15).toFixed(2)))}
                      className="p-1.5 hover:bg-white/20 active:scale-95 rounded-xl transition-all font-bold text-xs flex items-center gap-1 text-white"
                      title="Zoom In (Perbesar Peta)"
                    >
                      <ZoomIn size={16} />
                    </button>
                    <span className="text-[10px] font-black px-1.5 text-amber-300 min-w-[38px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.max(0.5, +(prev - 0.15).toFixed(2)))}
                      className="p-1.5 hover:bg-white/20 active:scale-95 rounded-xl transition-all font-bold text-xs flex items-center gap-1 text-white"
                      title="Zoom Out (Perkecil Peta)"
                    >
                      <ZoomOut size={16} />
                    </button>
                    <div className="w-[1px] h-4 bg-white/30 mx-0.5"></div>
                    <button 
                      onClick={() => setZoomLevel(1.0)}
                      className="p-1.5 hover:bg-white/20 active:scale-95 rounded-xl transition-all font-bold text-[10px] text-white"
                      title="Reset Zoom (100%)"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                  
                  {/* Map Canvas - Camera stays strictly centered on playerPos */}
                  <div className="absolute transition-transform duration-300 ease-out cursor-crosshair" 
                       onClick={handleMapClick}
                       style={{ 
                          left: '50%',
                          top: '50%',
                          width: MAP_COLS * CELL_SIZE, 
                          height: MAP_ROWS * CELL_SIZE,
                          transformOrigin: '0 0',
                          transform: `scale(${zoomLevel}) translate(-${(playerPos.x + 0.5) * CELL_SIZE}px, -${(playerPos.y + 0.5) * CELL_SIZE}px)`, 
                       }}>
                       
                      {/* Decorative Forest/Land pattern */}
                      <div className="absolute inset-0 bg-[#81B29A]" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #3D405B 2px, transparent 2px), radial-gradient(circle at 70% 60%, #3D405B 2px, transparent 2px), radial-gradient(circle at 40% 80%, #3D405B 2px, transparent 2px), radial-gradient(circle at 80% 20%, #3D405B 2px, transparent 2px)', backgroundSize: '100px 100px', opacity: 0.1 }}></div>
                      
                      {/* Danau & Kolam (Lakes with water ripples & lotus) */}
                      <div className="absolute bg-sky-500/60 rounded-[40px] border-4 border-sky-300/80 shadow-lg overflow-hidden flex items-center justify-center" style={{ left: 12 * CELL_SIZE, top: 2 * CELL_SIZE, width: 8 * CELL_SIZE, height: 5 * CELL_SIZE }}>
                         <span className="text-2xl animate-bounce">🪷 🦆 🪷</span>
                      </div>
                      <div className="absolute bg-sky-500/60 rounded-[50px] border-4 border-sky-300/80 shadow-lg overflow-hidden flex items-center justify-center" style={{ left: 22 * CELL_SIZE, top: 15 * CELL_SIZE, width: 7 * CELL_SIZE, height: 5 * CELL_SIZE }}>
                         <span className="text-2xl animate-pulse">🦆 🪷 🦆</span>
                      </div>
                      <div className="absolute bg-sky-500/50 rounded-full border-2 border-sky-300/70 overflow-hidden flex items-center justify-center" style={{ left: 2 * CELL_SIZE, top: 14 * CELL_SIZE, width: 5 * CELL_SIZE, height: 4 * CELL_SIZE }}>
                         <span className="text-xl">🪷</span>
                      </div>

                      {/* Sungai (Rivers flowing across map) */}
                      <div className="absolute bg-sky-400/70 border-x-4 border-sky-200/80" style={{ left: 10 * CELL_SIZE, top: 0, width: CELL_SIZE * 1.1, height: MAP_ROWS * CELL_SIZE, zIndex: 1 }}></div>
                      <div className="absolute bg-sky-400/70 border-y-4 border-sky-200/80" style={{ left: 0, top: 14 * CELL_SIZE, width: MAP_COLS * CELL_SIZE, height: CELL_SIZE * 1.1, zIndex: 1 }}></div>

                      {/* Jembatan Kayu (Wooden Bridges over rivers) */}
                      <div className="absolute bg-amber-800 border-2 border-amber-950 rounded-md shadow-md flex items-center justify-center text-amber-100 font-black text-[10px]" style={{ left: 10 * CELL_SIZE - 4, top: 7 * CELL_SIZE, width: CELL_SIZE * 1.2, height: 32, zIndex: 2 }}>
                         🪵 JEMBATAN 🪵
                      </div>
                      <div className="absolute bg-amber-800 border-2 border-amber-950 rounded-md shadow-md flex items-center justify-center text-amber-100 font-black text-[10px]" style={{ left: 10 * CELL_SIZE - 4, top: 18 * CELL_SIZE, width: CELL_SIZE * 1.2, height: 32, zIndex: 2 }}>
                         🪵 JEMBATAN 🪵
                      </div>
                      <div className="absolute bg-amber-800 border-2 border-amber-950 rounded-md shadow-md flex items-center justify-center text-amber-100 font-black text-[10px]" style={{ left: 6 * CELL_SIZE, top: 14 * CELL_SIZE - 4, width: 32, height: CELL_SIZE * 1.2, zIndex: 2 }}>
                         🪵
                      </div>
                      <div className="absolute bg-amber-800 border-2 border-amber-950 rounded-md shadow-md flex items-center justify-center text-amber-100 font-black text-[10px]" style={{ left: 24 * CELL_SIZE, top: 14 * CELL_SIZE - 4, width: 32, height: CELL_SIZE * 1.2, zIndex: 2 }}>
                         🪵
                      </div>

                      {/* Auto Paths for Buildings */}
                      {activeMaps.find(m => m.name === currentMap)?.buildings?.map((b: any) => (
                        <div key={'path-' + b.id} className="absolute bg-[#F4F1DE]/50 border-x-2 border-[#3D405B]/10" 
                             style={{ left: b.x * CELL_SIZE + CELL_SIZE/2 - 10, top: b.y * CELL_SIZE + CELL_SIZE/2, width: 20, height: 1000, zIndex: 0 }}></div>
                      ))}

                      {/* Roads (Main horizontal & vertical) */}
                      <div className="absolute left-0 right-0 h-[64px] bg-[#F4F1DE]/60 border-y-2 border-[#3D405B]/20 rounded-lg" style={{ top: 7 * CELL_SIZE }}></div>
                      <div className="absolute left-0 right-0 h-[64px] bg-[#F4F1DE]/60 border-y-2 border-[#3D405B]/20 rounded-lg" style={{ top: 18 * CELL_SIZE }}></div>
                      <div className="absolute top-0 bottom-0 w-[64px] bg-[#F4F1DE]/60 border-x-2 border-[#3D405B]/20 rounded-lg" style={{ left: 18 * CELL_SIZE }}></div>

                      {/* Abundant Trees, Flowers & Nature elements */}
                      {Array.from({ length: 90 }).map((_, i) => {
                        const floraIcons = ['🌳', '🌲', '🌴', '🌸', '🌹', '🌻', '🌺', '🌿', '🌾', '🌼'];
                        const icon = floraIcons[i % floraIcons.length];
                        const posX = ((i * 37) % 94 + 3);
                        const posY = ((i * 23) % 94 + 3);
                        return (
                          <div key={`flora-${i}`} className="absolute text-xl md:text-2xl opacity-90 hover:scale-125 transition-transform cursor-default" style={{ left: `${posX}%`, top: `${posY}%`, pointerEvents: 'none', zIndex: 5 }}>
                            {icon}
                          </div>
                        );
                      })}

                      {/* Livestock & Farm Animals (Kambing Dewasa, Kambing Muda, Sapi Dewasa) */}
                      {FARM_ANIMALS.map((animal: any) => (
                        <div 
                          key={animal.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEffects.playClick();
                            setLog(prev => [`${animal.sound} [${animal.name}] sedang merumput tenang di kawasan peternakan/ladang.`, ...prev.slice(0, 9)]);
                          }}
                          className="absolute flex flex-col items-center justify-center cursor-pointer hover:scale-125 transition-transform group"
                          style={{ left: animal.x * CELL_SIZE, top: animal.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, zIndex: 12 }}
                        >
                          <span className="text-[8px] font-black bg-emerald-100 text-emerald-900 border border-emerald-500 px-1 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap shadow-sm">
                            {animal.name}
                          </span>
                          <img 
                            src={animal.image} 
                            alt={animal.name} 
                            className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-bounce" 
                            style={{ animationDuration: animal.type === 'cow' ? '3.2s' : '1.8s' }} 
                            draggable={false} 
                          />
                        </div>
                      ))}

                      {/* Buildings */}
                      {activeMaps.find(m => m.name === currentMap)?.buildings?.map((b: any, idx: number) => {
                        const buildingLabel = b.image === NAMED_BUILDINGS.RUMAH_PETANI ? '🏠 Rumah Petani' :
                                              b.image === NAMED_BUILDINGS.KANTOR_AMIL ? '🏢 Baitul Mal / Kantor' :
                                              b.image === NAMED_BUILDINGS.GUDANG_PASAR ? '🏬 Pasar Pusat / Gudang' :
                                              b.image === NAMED_BUILDINGS.SEKOLAH_MADRASAH ? '🏫 Sekolah / Madrasah' :
                                              b.image === NAMED_BUILDINGS.LADANG_PAKAN ? '🌾 Ladang Pakan' : `🏠 Bangunan Desa #${idx + 1}`;
                        return (
                          <div key={b.id} 
                               draggable={isHost}
                               onDragStart={(e) => handleDragStart(e, b, 'building')}
                               className="absolute flex flex-col items-center justify-center cursor-move group" 
                               style={{ left: b.x * CELL_SIZE, top: b.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, zIndex: 10 }}>
                              <span className="text-[8px] font-black bg-slate-800 text-amber-200 px-1.5 py-0.5 rounded border border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap shadow-md -mt-4">
                                 {buildingLabel}
                              </span>
                              <img src={b.image} alt="building" className="w-[125%] h-[125%] max-w-none object-contain opacity-95 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" draggable={false} />
                          </div>
                        );
                      })}

                      {/* NPCs */}
                      {activeMaps.find(m => m.name === currentMap)?.npcs.map((npc: any) => {
                          const isDone = isMultiplayer ? completedThisMonth.includes(npc.id) : completedThisMonth.includes(`${npc.id}_${month}`);
                          return (
                            <div key={npc.id} 
                                 draggable={isHost}
                                 onDragStart={(e) => handleDragStart(e, npc, 'npc')}
                                 onClick={(e) => { e.stopPropagation(); checkInteraction(npc.x, npc.y, currentMap, activeMaps, completedThisMonth); }}
                                 className={`absolute flex flex-col items-center justify-center transition-all ${isDone ? 'opacity-40 grayscale pointer-events-none' : npc.isWandering ? 'cursor-pointer hover:scale-110' : 'animate-pulse cursor-pointer'}`} 
                                 style={{ left: npc.x * CELL_SIZE, top: npc.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, zIndex: 20 }}>
                               <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border-2 border-[#3D405B] mb-0.5 text-center shadow-sm z-10 whitespace-nowrap ${npc.isWandering ? 'bg-amber-100 text-amber-900 border-amber-500' : 'bg-white/90 text-[#3D405B]'}`}>
                                  {npc.isWandering ? '💬 ' + npc.name : npc.name}
                               </span>
                               {npc.avatar ? (
                                 <img src={npc.avatar} alt="avatar" className="w-10 h-10 object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform" draggable={false} />
                               ) : (
                                 <div className={`relative w-8 h-8 rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] flex items-center justify-center ${getSpriteClass(npc.type)} overflow-hidden`}>
                                   {npc.type === 'MUZAKKI' ? <Package size={14} className="text-white"/> : <Heart size={14} className="text-white"/>}
                                 </div>
                               )}
                            </div>
                          )
                      })}

                      {/* Other Players (Multiplayer) */}
                      {isMultiplayer && (
                        Array.from(new Map(
                          otherPlayers
                            .filter((p: any) => p && p.id && p.id !== playerId && p.mapName === currentMap && p.pos)
                            .map((p: any) => [p.id, p])
                        ).values()).map((p: any) => (
                          <div key={p.id} className="absolute flex flex-col items-center justify-center transition-all duration-300 opacity-90 z-25 pointer-events-none" style={{ left: p.pos.x * CELL_SIZE, top: p.pos.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }}>
                            <span className="text-[9px] font-black bg-white/95 text-[#3D405B] px-2 py-0.5 rounded-md border-2 border-[#3D405B] mb-0.5 z-10 shadow-sm whitespace-nowrap flex items-center gap-1">
                              {p.isHost ? '👑 Admin' : '👤'} {p.name || 'Pemain'}
                            </span>
                            {p.avatar ? (
                              <img 
                                src={p.avatar} 
                                alt="avatar" 
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                  const fallback = e.currentTarget.parentElement?.querySelector('.other-avatar-fallback');
                                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                }}
                                className="w-10 h-10 object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform" 
                              />
                            ) : null}
                            <div 
                              className="other-avatar-fallback w-9 h-9 rounded-xl bg-indigo-400 border-2 border-[#3D405B] shadow-sm flex items-center justify-center text-lg"
                              style={{ display: p.avatar ? 'none' : 'flex' }}
                            >
                              {p.isHost ? '👑' : '👤'}
                            </div>
                          </div>
                        ))
                      )}

                      {/* Main Active Player Character (Admin or Participant) */}
                      <div className="absolute flex flex-col items-center justify-center transition-all duration-300 z-30 pointer-events-none" style={{ left: playerPos.x * CELL_SIZE, top: playerPos.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }}>
                             {/* Camera target focus indicator ring */}
                             <div className="absolute w-16 h-16 border-2 border-dashed border-amber-400 rounded-full animate-spin opacity-75" />

                             {/* Foot aura & location ring */}
                             <div className="absolute bottom-1 w-12 h-3 bg-amber-400/60 rounded-full blur-[2px] animate-ping" />
                             <div className="absolute bottom-1 w-10 h-2 bg-[#3D405B]/50 rounded-full" />

                             {/* Name badge */}
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-[#3D405B] mb-0.5 z-10 shadow-md whitespace-nowrap flex items-center gap-1 ${isHost ? 'bg-amber-300 text-[#3D405B]' : 'bg-[#F2CC8F] text-[#3D405B]'}`}>
                                {isHost ? '👑 Admin:' : '🧭'} {playerName || 'Kamu'}
                             </span>

                             {/* Character Avatar with automatic fallback */}
                             {playerAvatar ? (
                               <img 
                                 src={playerAvatar} 
                                 alt="avatar" 
                                 onError={(e) => {
                                   (e.currentTarget as HTMLElement).style.display = 'none';
                                   const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                                   if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                 }}
                                 className="w-12 h-12 object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.5)] animate-bounce z-20" 
                               />
                             ) : null}

                             {/* Fallback character badge */}
                             <div 
                               className="avatar-fallback w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-[#3D405B] shadow-[2px_2px_0px_#000000] flex items-center justify-center text-xl z-20 animate-bounce"
                               style={{ display: playerAvatar ? 'none' : 'flex' }}
                             >
                               {isHost ? '👑' : '🧔'}
                             </div>
                      </div>
                  </div>
              </div>
              
              <div className="flex gap-2 mt-4 w-full overflow-x-auto pb-2 custom-scrollbar">
                  {activeMaps.map(m => {
                    const questNpcs = m.npcs.filter((n: any) => !n.isWandering);
                    const doneCount = questNpcs.filter((n: any) => isNpcCompleted(n.id)).length;
                    const isAllDone = questNpcs.length > 0 && doneCount === questNpcs.length;

                    return (
                      <button key={m.name} onClick={() => { soundEffects.playClick(); setCurrentMap(m.name); setPlayerPos({x:2, y:2}); }} 
                        className={`flex-1 min-w-[130px] p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center ${currentMap === m.name ? 'bg-[#FDFCF0] border-emerald-500 shadow-[2px_2px_0px_#10b981]' : 'bg-[#FDFCF0]/50 border-[#3D405B]/30 text-[#3D405B]/60 hover:bg-[#FDFCF0]'}`}>
                        <span className="text-[11px] font-black uppercase leading-none mt-1">{m.name}</span>
                        <span className={`text-[9px] font-bold mt-1.5 px-2 py-0.5 rounded-full border ${isAllDone ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-black' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                          {isAllDone ? `✅ 100% Selesai` : `📍 Misi: ${doneCount}/${questNpcs.length}`}
                        </span>
                      </button>
                    );
                  })}
              </div>

              {/* Walking & Movement Controls Panel */}
              <div className="w-full bg-[#FDFCF0] p-4 rounded-3xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B] mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-[#3D405B] bg-amber-300 px-2.5 py-1 rounded-lg border-2 border-[#3D405B]">
                      🎮 Pergerakan Karakter {isHost ? '(Admin)' : '(Peserta)'}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      📍 Posisi: ({playerPos.x}, {playerPos.y})
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3D405B]/80 font-bold">
                    👉 <strong>Ketuk mana saja di peta</strong>, gunakan <strong>D-Pad</strong>, atau tombol <strong>panah keyboard (⬆️ ⬇️ ⬅️ ➡️)</strong> untuk berjalan.
                  </p>
                </div>

                {/* D-Pad Buttons */}
                <div className="grid grid-cols-3 gap-1.5 w-36 shrink-0">
                  <div></div>
                  <button 
                    onClick={() => move(0, -1)} 
                    className="p-2.5 bg-[#3D405B] text-white hover:bg-emerald-600 border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_#000000] flex justify-center items-center active:scale-90 transition-all"
                    title="Jalan Ke Atas"
                  >
                    <ChevronRight size={18} className="-rotate-90"/>
                  </button>
                  <div></div>
                  <button 
                    onClick={() => move(-1, 0)} 
                    className="p-2.5 bg-[#3D405B] text-white hover:bg-emerald-600 border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_#000000] flex justify-center items-center active:scale-90 transition-all"
                    title="Jalan Ke Kiri"
                  >
                    <ChevronRight size={18} className="rotate-180"/>
                  </button>
                  <button 
                    onClick={() => move(0, 1)} 
                    className="p-2.5 bg-[#3D405B] text-white hover:bg-emerald-600 border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_#000000] flex justify-center items-center active:scale-90 transition-all"
                    title="Jalan Ke Bawah"
                  >
                    <ChevronRight size={18} className="rotate-90"/>
                  </button>
                  <button 
                    onClick={() => move(1, 0)} 
                    className="p-2.5 bg-[#3D405B] text-white hover:bg-emerald-600 border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_#000000] flex justify-center items-center active:scale-90 transition-all"
                    title="Jalan Ke Kanan"
                  >
                    <ChevronRight size={18}/>
                  </button>
                </div>
              </div>
          </div>

          <div className="w-full lg:w-80 flex flex-col gap-4">
              {/* Status Misi Per Kota Widget */}
              <div className="bg-[#FDFCF0] p-5 rounded-3xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B]">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-black text-xs text-[#3D405B] uppercase tracking-widest flex items-center gap-1.5">
                    <ListChecks size={16} className="text-amber-500" /> Status Misi Per Kota
                  </h3>
                  <button 
                    onClick={() => setModalState({ isOpen: true, type: 'QUEST_STATUS', data: null })}
                    className="text-[10px] font-bold text-indigo-600 hover:underline"
                  >
                    Detail ↗
                  </button>
                </div>

                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                  {activeMaps.map(m => {
                    const questNpcs = m.npcs.filter((n: any) => !n.isWandering);
                    const doneNpcs = questNpcs.filter((n: any) => isNpcCompleted(n.id));
                    const pendingNpcs = questNpcs.filter((n: any) => !isNpcCompleted(n.id));
                    const isAllDone = questNpcs.length > 0 && doneNpcs.length === questNpcs.length;

                    return (
                      <div 
                        key={m.name} 
                        className={`p-3 rounded-2xl border-2 transition-all ${currentMap === m.name ? 'bg-amber-50 border-amber-400' : 'bg-[#F4F1DE] border-[#3D405B]/20'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs text-[#3D405B] flex items-center gap-1">
                            <MapPin size={12} className="text-emerald-600" /> {m.name}
                          </span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${isAllDone ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                            {doneNpcs.length}/{questNpcs.length} Selesai
                          </span>
                        </div>

                        {/* List of pending & completed quests */}
                        <div className="space-y-1 text-[10px] font-bold mt-2">
                          {doneNpcs.map((n: any) => (
                            <div key={n.id} className="flex items-center justify-between text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-lg border border-emerald-200">
                              <span className="truncate max-w-[130px] flex items-center gap-1">
                                <CheckCircle2 size={10} className="text-emerald-600 shrink-0" /> {n.name}
                              </span>
                              <span className="text-[8px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-black uppercase">SELESAI</span>
                            </div>
                          ))}

                          {pendingNpcs.map((n: any) => (
                            <div key={n.id} className="flex items-center justify-between text-amber-900 bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-200">
                              <span className="truncate max-w-[130px] flex items-center gap-1">
                                <Clock size={10} className="text-amber-600 shrink-0" /> {n.name}
                              </span>
                              <span className="text-[8px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-black uppercase">BELUM</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-[#FDFCF0] p-5 rounded-3xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B]">
                  <h3 className="font-black text-xs text-[#3D405B] uppercase tracking-widest mb-4 flex items-center gap-2"><ShoppingCart size={16} /> Gudang & Pasar</h3>
                  <div className="space-y-3">
                      <div className="flex items-center justify-between bg-[#F4F1DE] border-2 border-[#3D405B]/20 p-3 rounded-2xl">
                        <div><p className="text-[10px] font-bold text-[#3D405B] uppercase">Beras ({stats.rice}kg)</p><p className="text-[9px] text-emerald-600 font-bold">Rp {PRICES.rice}/kg</p></div>
                        <button onClick={() => liquidate('rice')} disabled={stats.rice <= 0} className="bg-emerald-600 text-white text-[11px] font-bold px-4 py-3 rounded-xl disabled:opacity-30 border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] active:scale-95 transition-transform shrink-0">UANGKAN</button>
                      </div>
                      <div className="flex items-center justify-between bg-[#F4F1DE] border-2 border-[#3D405B]/20 p-3 rounded-2xl">
                        <div><p className="text-[10px] font-bold text-[#3D405B] uppercase">Emas ({stats.gold}gr)</p><p className="text-[9px] text-amber-600 font-bold">Rp {PRICES.gold.toLocaleString()}/gr</p></div>
                        <button onClick={() => liquidate('gold')} disabled={stats.gold <= 0} className="bg-amber-600 text-white text-[11px] font-bold px-4 py-3 rounded-xl disabled:opacity-30 border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] active:scale-95 transition-transform shrink-0">UANGKAN</button>
                      </div>
                  </div>
              </div>
              <div className="bg-[#FDFCF0] p-5 rounded-3xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B]">
                <h3 className="font-black text-xs text-[#3D405B] uppercase tracking-widest mb-4 text-center">Pencapaian</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-black mb-1"><span>KEPERCAYAAN</span><span>{stats.trust}%</span></div>
                    <div className="h-2.5 bg-[#F4F1DE] border-2 border-[#3D405B] rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width:`${stats.trust}%`}}></div></div>
                  </div>
                  <div className="flex justify-between items-center"><span className="text-xs font-black">Warga Mandiri</span><span className="font-black text-emerald-600">{stats.population_saved} Jiwa</span></div>
                </div>
              </div>
              
              {isMultiplayer && adventureState && adventureState.playerStats && (
                 <div className="bg-[#FDFCF0] p-5 rounded-3xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B]">
                    <h3 className="font-black text-xs text-[#3D405B] uppercase tracking-widest mb-4 flex items-center gap-2"><Trophy size={16} /> Skor Live</h3>
                    <div className="space-y-3">
                        {Array.from(new Map([{id: playerId, name: playerName || 'Kamu', avatar: playerAvatar}, ...otherPlayers].map((p: any) => [p.id, p])).values())
                          .sort((a, b) => (adventureState.playerStats[b.id]?.score || 0) - (adventureState.playerStats[a.id]?.score || 0))
                          .map((p: any, idx: number) => (
                           <div key={`live_score_${p.id}_${idx}`} className={`flex justify-between items-center bg-[#F4F1DE] border border-[#3D405B]/20 p-2 rounded-xl ${p.id === playerId ? 'border-emerald-500 bg-emerald-50' : ''}`}>
                              <div className="flex items-center gap-2">
                                 {p.avatar && (p.avatar.startsWith('http') || p.avatar.startsWith('/') || p.avatar.startsWith('data:')) ? (
                                   <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover border border-[#3D405B]/30 shrink-0" />
                                 ) : (
                                   <span className="text-xs">{p.avatar || '👤'}</span>
                                 )}
                                 <span className="text-[10px] font-bold text-[#3D405B]">{p.name} {p.id === playerId ? '(Kamu)' : ''}</span>
                              </div>
                              <span className="font-black text-[11px] text-emerald-600">{(adventureState.playerStats[p.id]?.score || 0).toLocaleString()}</span>
                           </div>
                        ))}
                    </div>
                 </div>
              )}

              {/* Chat & Notifikasi Misi Box */}
              <div className="bg-[#FDFCF0] p-4 rounded-3xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B] flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-[#3D405B]/20 pb-2">
                  <h3 className="font-black text-xs text-[#3D405B] uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-emerald-600" /> Chat & Notifikasi Misi
                  </h3>
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    {isMultiplayer ? 'Live Room' : 'Lokal'}
                  </span>
                </div>

                {/* Messages Container */}
                <div ref={chatScrollRef} className="h-52 overflow-y-auto pr-1 space-y-2 custom-scrollbar text-xs">
                  {displayChats.length === 0 ? (
                    <div className="text-center text-[#3D405B]/50 font-bold py-8 text-[11px] italic">
                      Belum ada obrolan. Ketik pesan atau selesaikan misi!
                    </div>
                  ) : (
                    displayChats.map((msg: any, idx: number) => {
                      const isSystem = msg.type === 'system' || msg.sender === 'Notifikasi Misi' || msg.sender === 'Sistem Zakat';
                      const isMe = msg.sender === playerName || msg.sender === 'Kamu';
                      return (
                        <div 
                          key={msg.id || `chat_${idx}`} 
                          className={`p-2 rounded-2xl text-[11px] font-bold ${
                            isSystem 
                              ? 'bg-amber-100/90 border-2 border-amber-300 text-amber-950 shadow-sm' 
                              : isMe 
                                ? 'bg-emerald-100 border border-emerald-300 text-emerald-950 ml-2' 
                                : 'bg-[#F4F1DE] border border-[#3D405B]/20 text-[#3D405B] mr-2'
                          }`}
                        >
                          {isSystem ? (
                            <div className="flex items-start gap-1.5 leading-snug">
                              <span className="text-sm shrink-0">🕌</span>
                              <div>
                                <span className="font-black text-[9px] text-amber-800 uppercase tracking-wider block">Notifikasi Misi Zakat</span>
                                <span className="text-[11px]">{msg.text}</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="font-black text-[10px] text-[#3D405B] flex items-center gap-1.5">
                                  {msg.avatar && (msg.avatar.startsWith('http') || msg.avatar.startsWith('/') || msg.avatar.startsWith('data:')) ? (
                                    <img src={msg.avatar} alt={msg.sender} className="w-5 h-5 rounded-full object-cover border border-[#3D405B]/30 shrink-0" />
                                  ) : msg.avatar ? (
                                    <span className="text-xs shrink-0">{msg.avatar}</span>
                                  ) : null}
                                  <span className="truncate max-w-[120px]">{msg.sender}</span>
                                  {isMe && <span className="text-[8px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-black shrink-0">(Kamu)</span>}
                                </span>
                                <span className="text-[8px] text-[#3D405B]/50 font-normal">
                                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#3D405B]/90 leading-tight font-medium">{msg.text}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send Chat Form */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 pt-1 border-t border-[#3D405B]/20">
                  <input 
                    type="text" 
                    value={chatInputText}
                    onChange={e => setChatInputText(e.target.value)}
                    placeholder="Ketik pesan untuk pemain & admin..."
                    className="flex-1 bg-[#F4F1DE] text-[#3D405B] font-bold text-xs p-2.5 rounded-xl border border-[#3D405B]/40 outline-none focus:border-emerald-500 shadow-inner"
                  />
                  <button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] flex items-center justify-center shrink-0 transition-all"
                    title="Kirim Pesan"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
              
              {!isMultiplayer && <button onClick={nextMonth} className="bg-[#E07A5F] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B] hover:-translate-y-1 transition-transform">LANJUT BULAN <ChevronRight size={18} /></button>}
          </div>
        </div>
      )}

      {gameState === 'ENDING' && (() => {
        const finalPts = calculateAdventureScore(stats.trust, stats.population_saved);
        const predikat = getPredikatScore(finalPts, 3500);
        return (
          <div className="bg-[#FDFCF0] p-8 sm:p-12 rounded-[3rem] text-center border-4 border-[#3D405B] shadow-[8px_8px_0px_#3D405B] max-w-xl mx-auto animate-fade-in space-y-4">
              <div className="w-20 h-20 bg-[#F2CC8F] text-[#3D405B] border-2 border-[#3D405B] rounded-3xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_#3D405B]"><Trophy size={40} /></div>
              <h1 className="text-3xl font-black text-[#3D405B] font-serif">Misi Zakat Adventure Selesai!</h1>
              
              <div className="bg-[#F2CC8F]/80 p-4 rounded-2xl border-2 border-[#3D405B] max-w-md mx-auto shadow-[2px_2px_0px_#3D405B]">
                <span className="text-[10px] font-black text-[#3D405B]/80 uppercase tracking-widest block">NILAI AKHIR KONVERSI (MAX 3.500)</span>
                <p className="text-2xl sm:text-3xl font-black text-[#E07A5F] font-mono tracking-wider">
                  {finalPts.toLocaleString('id-ID')} / 3.500 POIN
                </p>
                <span className="text-xs font-black text-[#3D405B] block pt-1">{predikat}</span>
              </div>

              <p className="text-[#3D405B]/70 italic font-bold text-xs max-w-md mx-auto">
                "Dedikasi dan ketepatan penyaluran zakat Anda telah membimbing umat menuju kemandirian ekonomi."
              </p>

              <div className="bg-[#F4F1DE] border-2 border-[#3D405B] rounded-2xl p-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-black text-[#E07A5F]">{stats.population_saved} Orang</p>
                    <p className="text-[10px] text-[#3D405B] font-bold uppercase tracking-widest">Jiwa / Warga Mandiri</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-600">{stats.trust}%</p>
                    <p className="text-[10px] text-[#3D405B] font-bold uppercase tracking-widest">Tingkat Kepercayaan</p>
                  </div>
              </div>
              
              {isMultiplayer && adventureState && adventureState.playerStats && (
                   <div className="p-4 bg-[#F4F1DE] border-2 border-[#3D405B] rounded-2xl">
                      <h3 className="font-black text-sm text-[#3D405B] uppercase tracking-widest mb-3">Klasemen Sesi Adventure</h3>
                      <div className="space-y-2">
                          {Array.from(new Map([{id: playerId, name: playerName || 'Kamu', avatar: playerAvatar}, ...otherPlayers].map((p: any) => [p.id, p])).values())
                            .sort((a, b) => (adventureState.playerStats[b.id]?.score || 0) - (adventureState.playerStats[a.id]?.score || 0))
                            .map((p: any, idx: number) => {
                               const pScore = adventureState.playerStats[p.id]?.score || 0;
                               const pTrust = adventureState.playerStats[p.id]?.trust || 0;
                               const pSaved = adventureState.playerStats[p.id]?.population_saved || 0;
                               const pConv = calculateAdventureScore(pTrust, pSaved);
                               return (
                                 <div key={`ending_rank_${p.id}_${idx}`} className="flex justify-between items-center bg-white border border-[#3D405B]/20 p-2 rounded-xl">
                                    <div className="flex items-center gap-2">
                                       <span className="font-black text-[#3D405B]/50 w-4">#{idx + 1}</span>
                                       <img src={p.avatar} alt="avatar" className="w-7 h-7 object-contain" />
                                       <span className="text-xs font-bold text-[#3D405B]">{p.name}</span>
                                    </div>
                                    <span className="font-black text-emerald-600 text-xs">{pConv.toLocaleString('id-ID')} / 3.500 Poin</span>
                                 </div>
                               );
                            })}
                      </div>
                   </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    downloadScoreReportExcel({
                      playerName: playerName || 'Pahlawan Zakat',
                      gameMode: 'Zakat Adventure',
                      trustPercent: stats.trust,
                      wargaMandiriCount: stats.population_saved,
                      convertedScore: finalPts,
                      maxScore: 3500,
                      gradePredikat: predikat
                    });
                  }}
                  className="w-full sm:w-auto flex-1 bg-[#81B29A] hover:bg-[#F2CC8F] text-[#3D405B] font-black py-3 px-3 rounded-xl border-2 border-[#3D405B] shadow-[3px_3px_0px_#3D405B] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                >
                  <FileSpreadsheet size={16} className="text-[#E07A5F]" /> Export Excel (.XLSX)
                </button>

                <button
                  onClick={() => {
                    downloadScoreReportTXT({
                      playerName: playerName || 'Pahlawan Zakat',
                      gameMode: 'Zakat Adventure',
                      trustPercent: stats.trust,
                      wargaMandiriCount: stats.population_saved,
                      convertedScore: finalPts,
                      maxScore: 3500,
                      gradePredikat: predikat
                    });
                  }}
                  className="w-full sm:w-auto flex-1 bg-[#E07A5F] hover:bg-[#F2CC8F] text-white hover:text-[#3D405B] font-black py-3 px-3 rounded-xl border-2 border-[#3D405B] shadow-[3px_3px_0px_#3D405B] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                >
                  <FileText size={16} /> Export TXT
                </button>

                <button
                  onClick={onGoHome}
                  className="w-full sm:w-auto flex-1 bg-[#F2CC8F] hover:bg-[#81B29A] text-[#3D405B] font-black py-3 px-3 rounded-xl border-2 border-[#3D405B] shadow-[3px_3px_0px_#3D405B] transition-all cursor-pointer text-xs"
                >
                  Main Lagi (Home)
                </button>
              </div>
          </div>
        );
      })()}

      {/* Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#3D405B]/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="w-full max-w-md bg-[#FDFCF0] border-4 border-[#3D405B] rounded-3xl p-6 shadow-[8px_8px_0px_#000000] animate-fade-in text-center">
              {modalState.type === 'NPC' && modalState.data && (() => {
                 const npc = modalState.data;
                 const isMuzakki = npc.type === 'MUZAKKI';
                 const quest = isMuzakki ? QUESTS[npc.quest as keyof typeof QUESTS] : null;
                 const assistance = LEVELS[level].assistance;
                 return (
                   <>
                      {npc.avatar ? (
                        <img src={npc.avatar} alt="avatar" className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
                      ) : (
                        <div className={`relative w-20 h-20 ${isMuzakki ? 'bg-[#F2CC8F]' : 'bg-[#E07A5F]'} text-[#3D405B] border-2 border-[#3D405B] rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden`}>
                          {isMuzakki ? <Package size={30} /> : <Heart size={30} />}
                        </div>
                      )}
                      <h3 className="text-xl font-black text-[#3D405B]">{npc.name}</h3>
                      <p className="text-sm text-[#3D405B]/80 mt-2 font-bold mb-6">"{isMuzakki ? quest?.dialog : `Membutuhkan bantuan modal untuk mandiri: Rp ${npc.cost.toLocaleString()}`}"</p>
                      
                      {isMuzakki ? (
                         <div className="mb-6 space-y-3">
                            <input 
                              type="number" 
                              value={questInput} 
                              onChange={e => setQuestInput(e.target.value)} 
                              className="w-full bg-[#F4F1DE] p-4 rounded-2xl text-xl font-black text-center border-2 border-[#3D405B] outline-none" 
                              placeholder="Ketik Hasil Hitungan Zakat" 
                              autoFocus 
                            />
                            <div className="bg-amber-100 border-2 border-amber-400 p-3 rounded-xl text-amber-900 text-xs font-bold flex items-center gap-2">
                               <span className="text-base">💡</span>
                               <p className="text-left text-[11px] leading-tight">
                                  <strong>Petunjuk:</strong> NPC Misi ini tidak memberikan rumus zakat! Temui & tanya NPC mondar-mandir (💬) di sekitar kota untuk mengetahui rumusnya.
                               </p>
                            </div>
                         </div>
                      ) : (
                         <div className="bg-[#F4F1DE] border-2 border-[#3D405B] p-4 rounded-2xl mb-6">
                            <p className="text-xs font-black text-[#E07A5F]">Biaya Penyaluran: Rp {npc.cost.toLocaleString()}</p>
                         </div>
                      )}

                      <div className="flex flex-col gap-2">
                          <button onClick={handleNPCAction} className="w-full bg-[#81B29A] text-[#3D405B] font-black py-4 rounded-2xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B] hover:-translate-y-1 transition-transform">
                             {isMuzakki ? 'TERIMA ZAKAT' : 'SALURKAN BANTUAN'}
                          </button>
                          <button onClick={() => setModalState({isOpen: false, type: 'NPC', data: null})} className="w-full py-3 text-[#3D405B]/60 font-black text-xs uppercase hover:text-[#3D405B]">Batalkan</button>
                      </div>
                   </>
                 );
              })()}

              {modalState.type === 'CRISIS' && modalState.data && (
                <>
                   <div className="w-20 h-20 bg-rose-100 border-2 border-[#3D405B] text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <AlertTriangle size={40} />
                   </div>
                   <h2 className="text-2xl font-black text-rose-600 mb-2 uppercase">Krisis Ekonomi!</h2>
                   <div className="bg-[#F4F1DE] border-2 border-[#3D405B] p-6 rounded-2xl mb-6 text-left">
                       <p className="text-[#3D405B] font-black text-lg mb-1">{modalState.data.name}</p>
                       <p className="text-[#3D405B]/70 font-bold text-sm italic">"{modalState.reason}"</p>
                   </div>
                   <button onClick={() => setModalState({isOpen: false, type: 'NPC', data: null})} className="w-full bg-[#3D405B] text-[#FDFCF0] font-black py-4 rounded-2xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-transform">SAYA MENGERTI</button>
                </>
              )}

              {modalState.type === 'WANDERING_CHAT' && modalState.data && (
                <div className="text-center animate-fade-in">
                   {modalState.data.avatar && (
                     <img src={modalState.data.avatar} alt={modalState.data.name} className="w-28 h-28 object-contain mx-auto mb-3 drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] animate-bounce" />
                   )}
                   <span className="inline-block bg-[#F2CC8F] text-[#3D405B] text-xs font-black px-3 py-1 rounded-full border-2 border-[#3D405B] mb-2 shadow-sm">
                      💬 NPC Keliling • Warga Desa
                   </span>
                   <h3 className="text-2xl font-black text-[#3D405B]">{modalState.data.name}</h3>
                   
                   <div className="bg-[#F4F1DE] border-2 border-[#3D405B] rounded-2xl p-4 my-4 text-left space-y-2">
                      <p className="text-[#3D405B] font-bold text-sm leading-relaxed">
                        "{modalState.data.dialogue}"
                      </p>
                      {modalState.data.formulaHint && (
                         <div className="mt-3 bg-amber-100 border-2 border-amber-500 rounded-xl p-3 text-amber-900 font-bold text-xs space-y-1 shadow-inner">
                            <p className="font-black flex items-center gap-1 text-amber-800 uppercase tracking-wider">
                               💡 Rumus Zakat Amil Master:
                            </p>
                            <p className="text-xs">{modalState.data.formulaHint}</p>
                         </div>
                      )}
                   </div>

                   <button 
                     onClick={() => setModalState({ isOpen: false, type: 'NPC', data: null })}
                     className="w-full bg-[#81B29A] text-[#3D405B] font-black py-3 rounded-2xl border-2 border-[#3D405B] shadow-[4px_4px_0px_#3D405B] hover:-translate-y-1 transition-transform"
                   >
                     Terima Kasih Rumusnya!
                   </button>
                </div>
              )}

              {modalState.type === 'ADMIN_EDIT' && (
                <div className="text-left space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex justify-between items-center border-b border-[#3D405B]/20 pb-2">
                    <h3 className="text-lg font-black text-[#3D405B]">⚙️ Edit Posisi Objek ({currentMap})</h3>
                    <button onClick={autoSpreadBuildings} className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded font-bold">📍 Ratakan Spasi</button>
                  </div>

                  <p className="text-xs text-[#3D405B]/80 font-bold">Atur posisi koordinat X (0-19) dan Y (0-14) bangunan & NPC di peta ini:</p>

                  <div className="space-y-3">
                    <p className="font-black text-xs uppercase text-emerald-700">🏛️ Gedung / Kawasan:</p>
                    {activeMaps.find(m => m.name === currentMap)?.buildings.map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between bg-[#F4F1DE] p-2 rounded-xl border border-[#3D405B]/20 text-xs font-bold">
                        <span className="truncate max-w-[120px]">{b.name || b.id}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px]">X:</label>
                          <input 
                            type="number" min="0" max="19" value={b.x} 
                            onChange={(e) => {
                              const nx = parseInt(e.target.value) || 0;
                              b.x = nx;
                              setActiveMaps([...activeMaps]);
                              if (socket) socket.send(JSON.stringify({ type: 'ADVENTURE_MOVE_ITEM', payload: { mapName: currentMap, type: 'building', id: b.id, x: nx, y: b.y } }));
                            }}
                            className="w-12 bg-white p-1 rounded border border-[#3D405B] text-center"
                          />
                          <label className="text-[10px]">Y:</label>
                          <input 
                            type="number" min="0" max="14" value={b.y} 
                            onChange={(e) => {
                              const ny = parseInt(e.target.value) || 0;
                              b.y = ny;
                              setActiveMaps([...activeMaps]);
                              if (socket) socket.send(JSON.stringify({ type: 'ADVENTURE_MOVE_ITEM', payload: { mapName: currentMap, type: 'building', id: b.id, x: b.x, y: ny } }));
                            }}
                            className="w-12 bg-white p-1 rounded border border-[#3D405B] text-center"
                          />
                        </div>
                      </div>
                    ))}

                    <p className="font-black text-xs uppercase text-amber-700 mt-4">👤 NPC Misi & Wandering:</p>
                    {activeMaps.find(m => m.name === currentMap)?.npcs.map((n: any) => (
                      <div key={n.id} className="flex items-center justify-between bg-[#F4F1DE] p-2 rounded-xl border border-[#3D405B]/20 text-xs font-bold">
                        <span className="truncate max-w-[120px]">{n.isWandering ? '💬 ' + n.name : '📌 ' + n.name}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px]">X:</label>
                          <input 
                            type="number" min="0" max="19" value={n.x} 
                            onChange={(e) => {
                              const nx = parseInt(e.target.value) || 0;
                              n.x = nx;
                              setActiveMaps([...activeMaps]);
                              if (socket) socket.send(JSON.stringify({ type: 'ADVENTURE_MOVE_ITEM', payload: { mapName: currentMap, type: 'npc', id: n.id, x: nx, y: n.y } }));
                            }}
                            className="w-12 bg-white p-1 rounded border border-[#3D405B] text-center"
                          />
                          <label className="text-[10px]">Y:</label>
                          <input 
                            type="number" min="0" max="14" value={n.y} 
                            onChange={(e) => {
                              const ny = parseInt(e.target.value) || 0;
                              n.y = ny;
                              setActiveMaps([...activeMaps]);
                              if (socket) socket.send(JSON.stringify({ type: 'ADVENTURE_MOVE_ITEM', payload: { mapName: currentMap, type: 'npc', id: n.id, x: n.x, y: ny } }));
                            }}
                            className="w-12 bg-white p-1 rounded border border-[#3D405B] text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setModalState({ isOpen: false, type: 'NPC', data: null })}
                    className="w-full bg-[#3D405B] text-white font-black py-3 rounded-2xl border-2 border-[#3D405B] mt-4"
                  >
                    Selesai Edit
                  </button>
                </div>
              )}

              {modalState.type === 'QUEST_STATUS' && (
                <div className="text-left space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex justify-between items-center border-b border-[#3D405B]/20 pb-3">
                    <div>
                      <h3 className="text-xl font-black text-[#3D405B] flex items-center gap-2">
                        <ListChecks className="text-amber-500" /> Status Misi Per Kota
                      </h3>
                      <p className="text-xs text-[#3D405B]/70 font-bold">Daftar lengkap misi zakat yang selesai & belum selesai di tiap wilayah</p>
                    </div>
                    <button 
                      onClick={() => setModalState({ isOpen: false, type: 'NPC', data: null })}
                      className="bg-[#3D405B] text-white text-xs px-3 py-1.5 rounded-xl font-black"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activeMaps.map(m => {
                      const questNpcs = m.npcs.filter((n: any) => !n.isWandering);
                      const doneNpcs = questNpcs.filter((n: any) => isNpcCompleted(n.id));
                      const pendingNpcs = questNpcs.filter((n: any) => !isNpcCompleted(n.id));
                      const percent = questNpcs.length > 0 ? Math.round((doneNpcs.length / questNpcs.length) * 100) : 0;

                      return (
                        <div key={m.name} className="bg-[#F4F1DE] border-2 border-[#3D405B] rounded-2xl p-4 space-y-3 shadow-[2px_2px_0px_#3D405B]">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3D405B]/10 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-base text-[#3D405B] flex items-center gap-1.5">
                                <MapPin className="text-emerald-600" size={18} /> {m.name}
                              </span>
                              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${percent === 100 ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                                {doneNpcs.length} / {questNpcs.length} Selesai ({percent}%)
                              </span>
                            </div>
                            <button 
                              onClick={() => {
                                soundEffects.playClick();
                                setCurrentMap(m.name);
                                setPlayerPos({ x: 2, y: 2 });
                                setModalState({ isOpen: false, type: 'NPC', data: null });
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 py-1.5 rounded-xl border border-[#3D405B] flex items-center gap-1 shadow-sm"
                            >
                              🚀 Pergi Ke Kota
                            </button>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-white/80 rounded-full border border-[#3D405B]/20 overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {/* Completed List */}
                            <div className="bg-emerald-50/90 border border-emerald-300 rounded-xl p-3 space-y-2">
                              <span className="text-xs font-black text-emerald-900 flex items-center gap-1 uppercase tracking-wider">
                                <CheckCircle2 size={14} className="text-emerald-600" /> Misi Selesai ({doneNpcs.length})
                              </span>
                              {doneNpcs.length === 0 ? (
                                <p className="text-[11px] text-emerald-800/60 italic font-bold">Belum ada misi selesai di kota ini.</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {doneNpcs.map((n: any) => (
                                    <div key={n.id} className="bg-white border border-emerald-200 p-2 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                                      <div className="flex items-center gap-2">
                                        {n.avatar && <img src={n.avatar} alt={n.name} className="w-6 h-6 object-contain" />}
                                        <div>
                                          <p className="text-[#3D405B] font-black leading-tight">{n.name}</p>
                                          <p className="text-[9px] text-emerald-700">{n.type === 'MUZAKKI' ? `Muzakki • ${n.quest || 'Zakat'}` : `Mustahik • Rp ${n.cost?.toLocaleString() || '0'}`}</p>
                                        </div>
                                      </div>
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black">
                                        ✅ Selesai
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Pending List */}
                            <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 space-y-2">
                              <span className="text-xs font-black text-amber-900 flex items-center gap-1 uppercase tracking-wider">
                                <Clock size={14} className="text-amber-600" /> Misi Belum Selesai ({pendingNpcs.length})
                              </span>
                              {pendingNpcs.length === 0 ? (
                                <p className="text-[11px] text-emerald-800 font-bold italic">🎉 Semua misi di kota ini sudah tuntas!</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {pendingNpcs.map((n: any) => (
                                    <div key={n.id} className="bg-white border border-amber-200 p-2 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                                      <div className="flex items-center gap-2">
                                        {n.avatar && <img src={n.avatar} alt={n.name} className="w-6 h-6 object-contain" />}
                                        <div>
                                          <p className="text-[#3D405B] font-black leading-tight">{n.name}</p>
                                          <p className="text-[9px] text-amber-800">{n.type === 'MUZAKKI' ? `Muzakki • ${n.quest || 'Zakat'}` : `Mustahik • Rp ${n.cost?.toLocaleString() || '0'}`}</p>
                                        </div>
                                      </div>
                                      <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-black">
                                        ⏳ Belum
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => setModalState({ isOpen: false, type: 'NPC', data: null })}
                    className="w-full bg-[#3D405B] text-white font-black py-3 rounded-2xl border-2 border-[#3D405B] mt-2 shadow-[4px_4px_0px_#000000]"
                  >
                    Tutup
                  </button>
                </div>
              )}
              {modalState.type === 'HELP_HOW_TO_PLAY' && (
                <div className="text-left space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex justify-between items-center border-b border-[#3D405B]/20 pb-3">
                    <div>
                      <h3 className="text-xl font-black text-[#3D405B] flex items-center gap-2">
                        <HelpCircle className="text-sky-500" /> Cara Bermain
                      </h3>
                      <p className="text-xs text-[#3D405B]/70 font-bold">Panduan menjalankan tugas sebagai Amil Muda</p>
                    </div>
                    <button 
                      onClick={() => setModalState({ isOpen: false, type: 'NPC', data: null })}
                      className="bg-[#3D405B] text-white text-xs px-3 py-1.5 rounded-xl font-black"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-sm font-medium text-[#3D405B]/90">
                    <div className="bg-sky-50 border-2 border-sky-200 p-4 rounded-xl">
                      <h4 className="font-black text-sky-900 mb-2">1. Jelajahi Peta 🗺️</h4>
                      <p>Gunakan tombol arah panah di pojok kiri bawah (kiri, atas, bawah, kanan) untuk menggerakkan Amil Muda dan menjelajahi 4 kota utama.</p>
                    </div>
                    
                    <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl">
                      <h4 className="font-black text-emerald-900 mb-2">2. Kumpulkan Zakat Muzakki 📦</h4>
                      <p>Hampiri <strong>Muzakki (Kotak Kuning/Emas)</strong> di setiap area. Klik pada Muzakki untuk menghitung dan mengambil zakatnya. Pastikan kamu mengetahui nishab yang benar!</p>
                    </div>

                    <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-xl">
                      <h4 className="font-black text-amber-900 mb-2">3. Salurkan Bantuan Mustahik ❤️</h4>
                      <p>Setelah mengumpulkan zakat (Rupiah/Emas/Beras), hampiri <strong>Mustahik (Hati Merah)</strong>. Salurkan bantuan agar mereka bisa mandiri dan tingkat kepercayaan warga meningkat.</p>
                    </div>

                    <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl">
                      <h4 className="font-black text-indigo-900 mb-2">4. Siklus Waktu ⏳</h4>
                      <p>Permainan terdiri dari 3 Siklus/Bulan. Waktu terus berjalan, jika sudah habis maka otomatis masuk ke siklus berikutnya. Beberapa Mustahik yang telah dibantu bisa menjadi Muzakki di bulan berikutnya!</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setModalState({ isOpen: false, type: 'NPC', data: null })}
                    className="w-full bg-[#3D405B] text-white font-black py-3 rounded-2xl border-2 border-[#3D405B] mt-4"
                  >
                    Tutup Panduan
                  </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Story Prologue Overlay Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 bg-[#3D405B]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FDFCF0] border-4 border-[#3D405B] rounded-[2.5rem] p-6 shadow-[10px_10px_0px_#000000] animate-in fade-in zoom-in-95 text-center relative flex flex-col max-h-[90vh]">
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4">
              {/* Header Badge */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-1.5 px-4 rounded-2xl border-2 border-[#3D405B] shadow-sm inline-flex items-center gap-2 mb-3 mt-2">
                <Sparkles size={16} className="animate-spin text-amber-300" />
                <span className="font-black text-xs uppercase tracking-widest">Kisah & Tugas Amil Muda</span>
              </div>

              {storySlide === 0 && (
                <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="relative w-28 h-28 mx-auto mb-3 mt-4">
                    <div className="absolute inset-0 bg-amber-300 rounded-3xl border-2 border-[#3D405B] rotate-6 shadow-[4px_4px_0px_#3D405B]"></div>
                    <div className="relative w-full h-full bg-emerald-100 border-2 border-[#3D405B] rounded-3xl flex items-center justify-center overflow-hidden shadow-inner">
                      {playerAvatar ? (
                        <img src={playerAvatar} alt="Amil Muda" className="w-20 h-20 object-contain drop-shadow-md animate-bounce" />
                      ) : (
                        <span className="text-5xl animate-bounce">👳‍♂️</span>
                      )}
                    </div>
                    <span className="absolute -bottom-2 -right-2 bg-amber-400 text-[#3D405B] font-black text-[9px] px-2 py-0.5 rounded-lg border-2 border-[#3D405B] uppercase shadow-sm">
                      Amil Zakat
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-[#3D405B] uppercase mb-1">
                    Panggilan Tugas!
                  </h2>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-6">
                    Kemandirian Umat di 4 Kota
                  </p>
                  <div className="bg-[#F4F1DE] border-2 border-[#3D405B] rounded-2xl p-4 text-left space-y-3 shadow-inner">
                    <p className="text-xs text-[#3D405B] font-bold leading-relaxed">
                      <strong>Assalamu'alaikum Warahmatullahi Wabarakatuh, Amil Muda!</strong>
                    </p>
                    <p className="text-xs text-[#3D405B]/90 font-medium leading-relaxed">
                      Anda terpilih sebagai pengelola zakat yang bertanggung jawab mengemban amanah suci. Wilayah binaan Anda mencakup <strong>4 Kota Utama</strong> dengan warga yang membutuhkan bimbingan dan bantuan modal usaha.
                    </p>
                  </div>
                </div>
              )}

              {storySlide === 1 && (
                <div className="animate-in slide-in-from-right-4 fade-in duration-300 mt-6">
                  <div className="w-20 h-20 mx-auto bg-emerald-100 border-2 border-[#3D405B] rounded-3xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_#3D405B]">
                     <span className="text-4xl">🌾</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#3D405B] uppercase mb-2">1. Kumpulkan Zakat</h2>
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-left shadow-inner">
                     <p className="text-sm font-bold text-emerald-900 leading-relaxed text-center">
                        Temui para Muzakki (Pertanian, Perdagangan, Peternakan, Emas, Madu, Perikanan) & hitung kadar nishab zakatnya secara tepat.
                     </p>
                  </div>
                </div>
              )}

              {storySlide === 2 && (
                <div className="animate-in slide-in-from-right-4 fade-in duration-300 mt-6">
                  <div className="w-20 h-20 mx-auto bg-amber-100 border-2 border-[#3D405B] rounded-3xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_#3D405B]">
                     <span className="text-4xl">🤝</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#3D405B] uppercase mb-2">2. Salurkan Modal</h2>
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 text-left shadow-inner">
                     <p className="text-sm font-bold text-amber-900 leading-relaxed text-center">
                        Salurkan bantuan modal zakat kepada Mustahik (Fakir, Miskin, Yatim, Guru) agar mereka berdaya dan menjadi mandiri!
                     </p>
                  </div>
                </div>
              )}

              {storySlide === 3 && (
                <div className="animate-in slide-in-from-right-4 fade-in duration-300 mt-6">
                  <div className="w-20 h-20 mx-auto bg-indigo-100 border-2 border-[#3D405B] rounded-3xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_#3D405B]">
                     <span className="text-4xl">⏳</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#3D405B] uppercase mb-2">3. Tiga Siklus</h2>
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5 text-left shadow-inner">
                     <p className="text-sm font-bold text-indigo-900 leading-relaxed text-center">
                        Selesaikan misi di 3 Siklus Musim Penyaluran, hadapi tantangan krisis, dan tingkatkan Kepercayaan Umat!
                     </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons (Sticky at bottom of modal) */}
            <div className="flex gap-3 shrink-0 mt-2">
               {storySlide > 0 && (
                 <button 
                   onClick={() => setStorySlide(s => s - 1)} 
                   className="flex-1 bg-[#F4F1DE] hover:bg-[#E0E0E0] text-[#3D405B] font-black py-3 rounded-xl border-2 border-[#3D405B] shadow-[3px_3px_0px_#3D405B] active:translate-y-0.5 active:shadow-[1px_1px_0px_#3D405B] transition-all text-xs uppercase"
                 >
                   Kembali
                 </button>
               )}
               {storySlide < 3 ? (
                 <button 
                   onClick={() => setStorySlide(s => s + 1)} 
                   className="flex-[2] bg-emerald-400 hover:bg-emerald-500 text-[#3D405B] font-black py-3 rounded-xl border-2 border-[#3D405B] shadow-[3px_3px_0px_#3D405B] active:translate-y-0.5 active:shadow-[1px_1px_0px_#3D405B] transition-all text-xs uppercase flex items-center justify-center gap-2"
                 >
                   Lanjut <ChevronRight size={16} />
                 </button>
               ) : (
                 <button 
                   onClick={() => {
                     soundEffects.playVictoryFanfare();
                     setShowStoryModal(false);
                     setHasSeenStory(true);
                     setStorySlide(0);
                   }}
                   className="flex-[2] bg-amber-400 hover:bg-amber-500 text-[#3D405B] font-black py-3 rounded-xl border-2 border-[#3D405B] shadow-[3px_3px_0px_#3D405B] active:translate-y-0.5 active:shadow-[1px_1px_0px_#3D405B] transition-all text-xs uppercase flex items-center justify-center gap-2"
                 >
                   <CheckCircle2 size={18} /> MULAI TUGAS AMIL!
                 </button>
               )}
            </div>

            {/* Slide Dots */}
            <div className="flex justify-center gap-2 mt-4 shrink-0">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`transition-all duration-300 rounded-full ${storySlide === i ? 'w-6 h-2 bg-emerald-500' : 'w-2 h-2 bg-[#3D405B]/20'}`} />
                ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
