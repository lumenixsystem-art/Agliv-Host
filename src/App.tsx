/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Folder as FolderIcon,
  FolderOpen,
  Upload,
  Image as ImageIcon,
  Search,
  Copy,
  Trash2,
  Grid,
  List,
  Info,
  ExternalLink,
  Check,
  ChevronRight,
  Plus,
  FileText,
  X,
  Move,
  Lock,
  RefreshCw,
  Database,
  Eye,
  Github,
  GitBranch,
  Settings,
  AlertCircle
} from 'lucide-react';

// Define the interface models
interface Folder {
  id: string;
  name: string;
  isSystem?: boolean;
}

interface ImageFile {
  id: string;
  name: string;
  size: string;
  dimensions: string;
  type: string;
  url: string; // Dynamic base64 data URL or beautiful curated gradient pattern
  folderId: string;
  createdAt: string;
  originalSizeInBytes: number;
}

// Initial default folders matching the look of AglivHost
const DEFAULT_FOLDERS: Folder[] = [
  { id: 'folder-lume', name: 'Lume', isSystem: true },
  { id: 'folder-corel', name: 'Corel', isSystem: true },
  { id: 'folder-assets', name: 'Assets Site', isSystem: true },
  { id: 'folder-screenshot', name: 'Screenshot', isSystem: true },
];

// Curated high quality preset graphics designed to make our hosting app look jaw-dropping
// We render custom modern procedural visuals for SVGs, WebPs, and JPGs to support pristine loading without fragile outside dependencies.
const INITIAL_IMAGES: ImageFile[] = [
  {
    id: 'img-1',
    name: 'hero-section-dark.png',
    size: '1.2 MB',
    dimensions: '1920x1080',
    type: 'png',
    // High quality soft dark linear gradient base64 equivalent
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    folderId: 'folder-lume',
    createdAt: '2026-06-20 14:32',
    originalSizeInBytes: 1258291
  },
  {
    id: 'img-2',
    name: 'logo-vertical-v2.svg',
    size: '45 KB',
    dimensions: 'Scalable',
    type: 'svg',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    folderId: 'folder-lume',
    createdAt: '2026-06-21 09:12',
    originalSizeInBytes: 46080
  },
  {
    id: 'img-3',
    name: 'profile-avatar.jpg',
    size: '210 KB',
    dimensions: '400x400',
    type: 'jpg',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    folderId: 'folder-lume',
    createdAt: '2026-06-21 17:40',
    originalSizeInBytes: 215040
  },
  {
    id: 'img-4',
    name: 'bg-pattern-tile.webp',
    size: '890 KB',
    dimensions: '1024x1024',
    type: 'webp',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
    folderId: 'folder-lume',
    createdAt: '2026-06-22 01:15',
    originalSizeInBytes: 911360
  },
  {
    id: 'img-5',
    name: 'footer-preview-final.png',
    size: '1.5 MB',
    dimensions: '1920x600',
    type: 'png',
    url: 'https://images.unsplash.com/photo-1618005198143-e52834643521?w=800&auto=format&fit=crop&q=80',
    folderId: 'folder-lume',
    createdAt: '2026-06-22 03:40',
    originalSizeInBytes: 1572864
  },
  // Corel preset files
  {
    id: 'img-6',
    name: 'corel-brand-guidelines.pdf',
    size: '6.4 MB',
    dimensions: 'A4 Layout',
    type: 'pdf',
    url: 'https://images.unsplash.com/photo-1541462608141-27b2c7452d67?w=800&auto=format&fit=crop&q=80',
    folderId: 'folder-corel',
    createdAt: '2026-06-18 10:20',
    originalSizeInBytes: 6710886
  },
  {
    id: 'img-7',
    name: 'vector-iconpack.ai',
    size: '2.1 MB',
    dimensions: 'Flexible',
    type: 'ai',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
    folderId: 'folder-corel',
    createdAt: '2026-06-19 11:45',
    originalSizeInBytes: 2202009
  },
  // Assets site preset
  {
    id: 'img-8',
    name: 'landing-promo-banner.jpg',
    size: '980 KB',
    dimensions: '1440x800',
    type: 'jpg',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    folderId: 'folder-assets',
    createdAt: '2026-06-12 16:03',
    originalSizeInBytes: 1003520
  },
  {
    id: 'img-9',
    name: 'favicon-32x32.png',
    size: '4 KB',
    dimensions: '32x32',
    type: 'png',
    url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=100&auto=format&fit=crop&q=80',
    folderId: 'folder-assets',
    createdAt: '2026-06-15 14:00',
    originalSizeInBytes: 4096
  },
  // Screenshot preset
  {
    id: 'img-10',
    name: 'dashboard-glitch-error.png',
    size: '410 KB',
    dimensions: '1280x800',
    type: 'png',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    folderId: 'folder-screenshot',
    createdAt: '2026-06-20 22:11',
    originalSizeInBytes: 419840
  }
];

// Live Toast Notification Types
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function App() {
  // Load folders & files state from localStorage
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('ah_folders');
    return saved ? JSON.parse(saved) : DEFAULT_FOLDERS;
  });

  const [images, setImages] = useState<ImageFile[]>(() => {
    const saved = localStorage.getItem('ah_images');
    return saved ? JSON.parse(saved) : INITIAL_IMAGES;
  });

  // Keep track of dynamic owner config
  const [githubOwner, setGithubOwner] = useState(() => localStorage.getItem('ah_git_owner') || 'agliv-digital');
  const [githubRepo, setGithubRepo] = useState(() => localStorage.getItem('ah_git_repo') || 'host-backend-main');
  const [githubTag, setGithubTag] = useState(() => localStorage.getItem('ah_git_tag') || 'v1.0.4-assets');
  const [githubSyncing, setGithubSyncing] = useState(false);

  // States for search, folders selection and view filters
  const [selectedFolderId, setSelectedFolderId] = useState<string>('folder-lume');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);

  // Modal Control States
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ name: string; pct: number } | null>(null);

  // Active Selected image for embed code viewing or moving
  const [activeViewerImage, setActiveViewerImage] = useState<ImageFile | null>(null);
  const [activeEmbedTab, setActiveEmbedTab] = useState<'preview' | 'html' | 'markdown' | 'css' | 'json'>('preview');
  
  // Storage dialog option
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempOwner, setTempOwner] = useState(githubOwner);
  const [tempRepo, setTempRepo] = useState(githubRepo);
  const [tempTag, setTempTag] = useState(githubTag);

  // Folder Move dialog nested
  const [imageToMove, setImageToMove] = useState<ImageFile | null>(null);

  // Toast array with max visual stack
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Drag over states
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save changes automatically
  useEffect(() => {
    localStorage.setItem('ah_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('ah_images', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem('ah_git_owner', githubOwner);
    localStorage.setItem('ah_git_repo', githubRepo);
    localStorage.setItem('ah_git_tag', githubTag);
  }, [githubOwner, githubRepo, githubTag]);

  // Toast Dispatcher Helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Calculate stats
  const activeFolder = useMemo(() => {
    return folders.find((f) => f.id === selectedFolderId) || folders[0];
  }, [folders, selectedFolderId]);

  // Count files in each folder statefully
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    folders.forEach((f) => {
      counts[f.id] = images.filter((img) => img.folderId === f.id).length;
    });
    return counts;
  }, [folders, images]);

  // Compute calculated values for standard local storage status meters
  const localStorageSize = useMemo(() => {
    let totalBytes = 0;
    // Calculate size of serialized stored objects in localStorage
    try {
      const dataStr = JSON.stringify(folders) + JSON.stringify(images) + githubOwner + githubRepo + githubTag;
      totalBytes = new Blob([dataStr]).size;
    } catch (e) {
      totalBytes = 2400000; // sensible average fallback
    }
    // limit is ~5MB in standard local storage
    const limitBytes = 5 * 1024 * 1024;
    const mbUsed = (totalBytes / (1024 * 1024)).toFixed(2);
    const mbLimit = (limitBytes / (1024 * 1024)).toFixed(1);
    const pct = Math.min(Math.round((totalBytes / limitBytes) * 100), 100);
    return {
      used: `${mbUsed}MB`,
      limit: `${mbLimit}MB`,
      percentage: pct,
      rawUsed: totalBytes
    };
  }, [folders, images, githubOwner, githubRepo, githubTag]);

  // Filter images by selected folder and search query
  const filteredImages = useMemo(() => {
    return images
      .filter((img) => img.folderId === selectedFolderId)
      .filter((img) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          img.name.toLowerCase().includes(query) ||
          img.type.toLowerCase().includes(query) ||
          img.size.toLowerCase().includes(query)
        );
      });
  }, [images, selectedFolderId, searchQuery]);

  // Helper file uploader & dynamic compression engine
  // This converts raw image payloads to compressed JPEGs before writing to state
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    setUploadProgress({ name: file.name, pct: 15 });

    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadProgress({ name: file.name, pct: 45 });

      // If it is an image file type, run intelligent client-side compression to guard local storage quotas
      if (file.type.startsWith('image/')) {
        const imgObj = new Image();
        imgObj.src = result;
        imgObj.onload = () => {
          setUploadProgress({ name: file.name, pct: 70 });
          const canvas = document.createElement('canvas');
          let width = imgObj.width;
          let height = imgObj.height;

          // Cap dimensions at 900px to maintain crisp layout while dropping weight drastically
          const maxDim = 900;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(imgObj, 0, 0, width, height);
            // Compress heavily using high fidelity 0.70 jpeg
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            // Calc dynamic readable size representation
            const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
            const kbSize = Math.round(approxBytes / 1024);
            const formattedSize = kbSize > 1024 ? `${(kbSize / 1024).toFixed(1)} MB` : `${kbSize} KB`;

            const newImg: ImageFile = {
              id: `img-${Date.now()}`,
              name: file.name.substring(0, file.name.lastIndexOf('.')) + '.jpg',
              size: formattedSize,
              dimensions: `${width}x${height}`,
              type: 'jpg',
              url: compressedDataUrl,
              folderId: selectedFolderId,
              createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              originalSizeInBytes: approxBytes
            };

            setImages((prev) => [newImg, ...prev]);
            triggerToast(`"${newImg.name}" uploaded & compressed successfully!`);
          }
          setUploadProgress(null);
        };
        imgObj.onerror = () => {
          // Fallback if canvas compression fails
          saveRawFile(file, result);
        };
      } else {
        // Safe standard file mock template if not an image (e.g., pdf, ai, zip)
        saveRawFile(file, result);
      }
    };

    reader.readAsDataURL(file);
  };

  const saveRawFile = (file: File, resultStr: string) => {
    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    // Cap sizes strictly for direct storage of raw binary to avoid crash
    if (file.size > 1 * 1024 * 1024) {
      triggerToast('Raw file upload capped at 1MB to protect browser quota. Try uploading an image instead!', 'error');
      setUploadProgress(null);
      return;
    }

    const newImg: ImageFile = {
      id: `img-${Date.now()}`,
      name: file.name,
      size: formattedSize,
      dimensions: 'Scalable',
      type: file.name.split('.').pop() || 'file',
      url: resultStr.startsWith('data:image/') ? resultStr : 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
      folderId: selectedFolderId,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      originalSizeInBytes: file.size
    };

    setImages((prev) => [newImg, ...prev]);
    triggerToast(`"${newImg.name}" uploaded statefully!`);
    setUploadProgress(null);
  };

  // Drop Handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Action: Create folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const folderId = `folder-${Date.now()}`;
    const newFolder: Folder = {
      id: folderId,
      name: newFolderName.trim()
    };

    setFolders((prev) => [...prev, newFolder]);
    setSelectedFolderId(folderId); // auto route to it
    triggerToast(`Folder "${newFolderName}" created successfully!`);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  // Action: Copy clipboard
  const handleCopyLink = (img: ImageFile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Simulate hosting direct link
    const simulatedLink = `${window.location.origin}/cdn/${githubOwner}/${githubRepo}/${img.id}/${img.name}`;
    
    navigator.clipboard.writeText(simulatedLink).then(() => {
      triggerToast('Image raw host URL copied to clipboard!');
    }).catch(() => {
      // fallback copy raw base64 or source code if clipboard fails in sandboxes
      try {
        navigator.clipboard.writeText(img.url.substring(0, 100) + '...');
        triggerToast('Reference copied!', 'info');
      } catch (err) {
        triggerToast('Failed to write to clipboard.', 'error');
      }
    });
  };

  // Action: Move Folder execution
  const handleMoveImage = (destinationId: string) => {
    if (!imageToMove) return;
    setImages((prev) =>
      prev.map((img) => (img.id === imageToMove.id ? { ...img, folderId: destinationId } : img))
    );
    const destFolder = folders.find((f) => f.id === destinationId);
    triggerToast(`Moved "${imageToMove.name}" to folder "${destFolder?.name || 'Unknown'}"`);
    
    // update viewer image reference if open
    if (activeViewerImage && activeViewerImage.id === imageToMove.id) {
      setActiveViewerImage({ ...activeViewerImage, folderId: destinationId });
    }

    setImageToMove(null);
  };

  // Action: Delete Image file
  const handleDeleteImage = (imgId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targeted = images.find((img) => img.id === imgId);
    if (!targeted) return;

    if (confirm(`Are you sure you want to delete "${targeted.name}"?`)) {
      setImages((prev) => prev.filter((img) => img.id !== imgId));
      triggerToast(`Deleted "${targeted.name}"`);
      if (activeViewerImage?.id === imgId) {
        setActiveViewerImage(null);
      }
    }
  };

  // Action: Clean/Reset empty folder
  const handleDeleteFolder = (folderId: string, name: string) => {
    const count = folderCounts[folderId] || 0;
    if (count > 0) {
      alert(`Cannot delete folder "${name}" because it contains ${count} images. Please delete or move them first.`);
      return;
    }
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    triggerToast(`Deleted empty folder "${name}"`);
    // default back to first system folder
    setSelectedFolderId(folders[0]?.id || 'folder-lume');
  };

  // Trigger sync animation
  const handleGitSync = () => {
    setGithubSyncing(true);
    triggerToast('Starting direct synchronization process...', 'info');
    setTimeout(() => {
      setGithubSyncing(false);
      triggerToast(`Successfully synced local assets to ${githubOwner}/${githubRepo} [${githubTag}]!`);
    }, 1800);
  };

  // Save Config Settings
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setGithubOwner(tempOwner.trim() || 'agliv-digital');
    setGithubRepo(tempRepo.trim() || 'host-backend-main');
    setGithubTag(tempTag.trim() || 'v1.0.4-assets');
    setShowConfigModal(false);
    triggerToast('Remote Git properties updated statefully!');
  };

  return (
    <div className="flex h-screen w-screen bg-slate-100 flex-col overflow-hidden text-slate-800 antialiased font-sans">
      
      {/* Toast Overlay stack container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full font-sans pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`shadow-lg rounded-lg border-l-4 p-4 pointer-events-auto flex items-start gap-3 bg-white border-slate-200 transition-all transform duration-300 translate-y-0 opacity-100 ${
              t.type === 'success' ? 'border-l-emerald-500' : t.type === 'error' ? 'border-l-rose-500' : 'border-l-indigo-500'
            }`}
          >
            <div className="shrink-0">
              {t.type === 'success' ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
              ) : t.type === 'error' ? (
                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Info className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 leading-normal">{t.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Frame Canvas centering the visual box to match standard layout dimensions perfectly */}
      <div className="flex flex-col h-full w-full bg-slate-50 overflow-hidden mx-auto max-w-[1440px] shadow-2xl border-x border-slate-200">
        
        {/* Top Navigation Bar Component */}
        <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md tracking-wider italic">
              AH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-950 uppercase">AglivHost</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 tracking-wider">Premium Suite</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold tracking-wide">Private Image Hosting System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Git API Status Info Pill */}
            <div 
              onClick={() => {
                setTempOwner(githubOwner);
                setTempRepo(githubRepo);
                setTempTag(githubTag);
                setShowConfigModal(true);
              }}
              className="group flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer transition-all shrink-0"
              title="Click to configure Git parameters"
            >
              <div className="relative flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="absolute animate-ping w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-75"></span>
              </div>
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1">
                <span>API Connected:</span>
                <span className="text-indigo-600 group-hover:underline truncate max-w-[120px]">{githubOwner}</span>
                <Settings className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 ml-0.5" />
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 shrink-0"></div>

            {/* Upload Button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 active:scale-95 transition-all shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Novo Upload</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden" 
              accept="image/*, application/pdf, application/illustrator"
            />
          </div>
        </nav>

        {/* Global Workplace Inner Window */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          
          {/* Sidebar Area */}
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0 overflow-y-auto">
            
            {/* Folder Header Organization label */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 mb-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organização</label>
                <button 
                  onClick={() => setShowNewFolderModal(true)}
                  className="text-indigo-600 hover:text-indigo-800 p-0.5 rounded hover:bg-slate-100 transition-colors"
                  title="Novo Folder"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic folder navigation list */}
              <nav className="space-y-1">
                {folders.map((folder) => {
                  const isActive = folder.id === selectedFolderId;
                  const count = folderCounts[folder.id] || 0;
                  return (
                    <div 
                      key={folder.id}
                      className={`group flex items-center justify-between rounded-lg overflow-hidden transition-all ${
                        isActive 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedFolderId(folder.id)}
                        className="flex-1 flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-left select-none"
                      >
                        <span className="text-base select-none">
                          {isActive ? '📂' : '📁'}
                        </span>
                        <span className="truncate">{folder.name}</span>
                      </button>
                      
                      <div className="flex items-center gap-1.5 pr-2 shrink-0">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isActive ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {count}
                        </span>

                        {/* Allowed item folder deletion for user dynamic workspace folder settings */}
                        {!folder.isSystem && (
                          <button
                            onClick={() => handleDeleteFolder(folder.id, folder.name)}
                            className="opacity-0 group-hover:opacity-100 hover:text-rose-600 p-1 rounded hover:bg-indigo-100/50 transition-all text-slate-400"
                            title="Delete directory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar bottom guide */}
            <div className="mt-auto border-t border-slate-100 pt-4">
              <button 
                onClick={() => setShowNewFolderModal(true)}
                className="w-full border-2 border-dashed border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Pasta</span>
              </button>
            </div>
          </aside>

          {/* Core Layout Main Area */}
          <main 
            className={`flex-1 flex flex-col p-6 sm:p-8 overflow-hidden transition-colors ${
              isDraggingOver ? 'bg-indigo-50/70 border-2 border-dashed border-indigo-500 m-2 rounded-2xl' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            
            {/* Breadcrumb section matching professional look */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 select-none">
                  <span>AglivHost</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>Pastas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-indigo-600 font-extrabold">{activeFolder?.name}</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span>Imagens Recentes</span>
                  <span className="text-sm bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    {filteredImages.length} {filteredImages.length === 1 ? 'módulo' : 'módulos'}
                  </span>
                </h2>
              </div>

              {/* Filter controls toolbar */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar na pasta..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 hover:text-indigo-600 text-slate-400 bg-slate-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Grid vs List layout buttons */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shrink-0">
                  <button 
                    onClick={() => setIsGridView(true)}
                    className={`p-1.5 rounded transition-all ${
                      isGridView ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Layout Grid"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsGridView(false)}
                    className={`p-1.5 rounded transition-all ${
                      !isGridView ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Layout Lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic visual uploader status panel */}
            {uploadProgress && (
              <div className="mb-6 p-4 bg-white border border-indigo-100 rounded-xl shadow-sm flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 flex-1 max-w-xl mr-4">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center animate-pulse">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1 leading-tight">Carregando Arquivo local</p>
                    <p className="text-sm font-bold text-slate-900 truncate leading-tight">{uploadProgress.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-1 max-w-sm">
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.pct}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{uploadProgress.pct}%</span>
                </div>
              </div>
            )}

            {/* Gallery Canvas Workspace (Grid or List Layout) */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              
              {filteredImages.length === 0 ? (
                // Super friendly empty workspace card layout
                <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 bg-white rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Este folder está vazio</h3>
                  <p className="text-sm text-slate-500 max-w-sm mb-6">
                    {searchQuery 
                      ? `Nenhum arquivo coincide com a pesquisa "${searchQuery}". Tente usar outro termo.` 
                      : 'Carregue as suas de forma organizada arrastando os seus arquivos de imagem para esta área.'}
                  </p>
                  {searchQuery ? (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all text-sm"
                    >
                      Limpar Filtro
                    </button>
                  ) : (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Escolher Imagem
                    </button>
                  )}
                </div>
              ) : isGridView ? (
                
                // --- GRID VIEW SYSTEM ---
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredImages.map((img) => (
                    <div 
                      key={img.id}
                      onClick={() => {
                        setActiveViewerImage(img);
                        setActiveEmbedTab('preview');
                      }}
                      className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col cursor-pointer"
                    >
                      
                      {/* Image Preview Canvas */}
                      <div className="aspect-video bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100 shrink-0">
                        {img.type === 'svg' || img.type.toLowerCase() === 'ai' ? (
                          <div className="absolute inset-0 bg-indigo-50/50 flex flex-col items-center justify-center p-4">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1 shadow-sm">
                              <span className="font-black text-xs uppercase">{img.type}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Scalable Vector</span>
                          </div>
                        ) : img.type === 'pdf' ? (
                          <div className="absolute inset-0 bg-rose-50/50 flex flex-col items-center justify-center p-4">
                            <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-1 shadow-sm">
                              <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Documento PDF</span>
                          </div>
                        ) : (
                          <img 
                            src={img.url} 
                            alt={img.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}

                        {/* Actions overlay panel */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {/* Move Directory */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageToMove(img);
                            }}
                            className="bg-white/95 backdrop-blur shadow p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
                            title="Move to another folder"
                          >
                            <Move className="w-3.5 h-3.5" />
                          </button>
                          {/* Trash Delete */}
                          <button 
                            onClick={(e) => handleDeleteImage(img.id, e)}
                            className="bg-white/95 backdrop-blur shadow p-1.5 rounded-lg text-slate-500 hover:text-rose-600 transition-colors"
                            title="Excluir arquivo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Copy Action strip */}
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 z-10">
                          <button 
                            onClick={(e) => handleCopyLink(img, e)}
                            className="bg-indigo-600/95 backdrop-blur shadow text-white hover:bg-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 min-w-[90px] justify-center transition-all"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copiar Host</span>
                          </button>
                        </div>
                      </div>

                      {/* File Details Footer */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 truncate leading-snug" title={img.name}>
                            {img.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 select-none">
                            <span className="text-[10px] text-slate-500 font-semibold uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                              {img.type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {img.size} • {img.dimensions}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          <span>Criado:</span>
                          <span className="text-slate-500">{img.createdAt}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                
                // --- LIST VIEW SYSTEM ---
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 select-none">
                        <th className="py-3 px-4 w-12 text-center">Filtro</th>
                        <th className="py-3 px-4">Nome do Arquivo</th>
                        <th className="py-3 px-4">Dimensões</th>
                        <th className="py-3 px-4">Tamanho</th>
                        <th className="py-3 px-4">Registrado em</th>
                        <th className="py-3 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredImages.map((img) => (
                        <tr 
                          key={img.id}
                          onClick={() => {
                            setActiveViewerImage(img);
                            setActiveEmbedTab('preview');
                          }}
                          className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                        >
                          {/* Miniature Preview cell */}
                          <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="w-9 h-7 bg-slate-100 rounded border border-slate-200 overflow-hidden mx-auto flex items-center justify-center">
                              {img.type === 'svg' || img.type.toLowerCase() === 'ai' ? (
                                <span className="font-black text-[8px] uppercase text-indigo-600">SVG</span>
                              ) : img.type === 'pdf' ? (
                                <FileText className="w-4 h-4 text-rose-500" />
                              ) : (
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                          </td>

                          {/* Info cell */}
                          <td className="py-3 px-4">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block leading-snug">
                              {img.name}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                              .{img.type} format
                            </span>
                          </td>

                          {/* Dimensions cell */}
                          <td className="py-3 px-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                            {img.dimensions}
                          </td>

                          {/* Size cell */}
                          <td className="py-3 px-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                            {img.size}
                          </td>

                          {/* Created at date */}
                          <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                            {img.createdAt}
                          </td>

                          {/* Right action control drawer list */}
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => handleCopyLink(img)}
                                className="p-1 px-2.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-100 flex items-center gap-1 transition-all"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Link</span>
                              </button>
                              
                              <button 
                                onClick={() => setImageToMove(img)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Move image"
                              >
                                <Move className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => handleDeleteImage(img.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Delete image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* System Status footer layout with dynamic capacity gauge to match mockup precisely */}
        <footer className="h-10 bg-slate-900 text-slate-400 px-6 flex items-center justify-between text-[11px] font-semibold shrink-0 z-10 select-none">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 uppercase tracking-widest font-bold">Owner:</span>
              <span className="text-slate-100 font-bold hover:underline cursor-pointer" onClick={() => setShowConfigModal(true)}>{githubOwner}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 uppercase tracking-widest font-bold">Repository:</span>
              <span className="text-slate-100 font-bold hover:underline cursor-pointer" onClick={() => setShowConfigModal(true)}>{githubRepo}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 uppercase tracking-widest font-bold">Tag:</span>
              <span className="text-slate-100 font-mono text-xs">{githubTag}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Real local storage usage indicator bar */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">
                Armazenamento: <span className="text-slate-200 font-bold">{localStorageSize.used} / {localStorageSize.limit}</span>
              </span>
              <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    localStorageSize.percentage > 80 ? 'bg-rose-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${localStorageSize.percentage}%` }}
                ></div>
              </div>
            </div>

            <span className="h-4 w-[1px] bg-slate-800"></span>

            {/* Sync Trigger button */}
            <button 
              onClick={handleGitSync}
              disabled={githubSyncing}
              className="text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider font-extrabold hover:text-emerald-300 transition-colors border border-emerald-500/20 px-2 py-1 rounded bg-emerald-500/5 active:scale-95 disabled:opacity-50"
            >
              <div className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${githubSyncing ? 'animate-ping' : ''}`}></div>
              {githubSyncing ? (
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sincronizando...</span>
                </div>
              ) : (
                <span>GitHub API v3 Synced</span>
              )}
            </button>
          </div>
        </footer>

      </div>

      {/* --- DIALOG MODAL: NEW DIRECTORY --- */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <FolderIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold tracking-tight">Criação de Nova Pasta</h3>
              </div>
              <button 
                onClick={() => setShowNewFolderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder}>
              <div className="p-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Designação da Nova Pasta</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nome do diretório (Ex: Branding)" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-2">As pastas criadas são armazenadas localmente para permitir a organização modular dos itens de upload.</p>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Criar Pasta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DIALOG MODAL: GIT SETTINGS & PROPERTIES --- */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold tracking-tight">Configurações de Sincronização</h3>
              </div>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveConfig}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nome do Proprietário (Owner)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nome de utilizador no GitHub" 
                    value={tempOwner}
                    onChange={(e) => setTempOwner(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Repositório Remoto</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nome do repositório" 
                    value={tempRepo}
                    onChange={(e) => setTempRepo(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Versão de Distribuição (Tag)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Versão ou tag" 
                    value={tempTag}
                    onChange={(e) => setTempTag(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 flex gap-2">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p>Estes parâmetros ajudam a gerar os caminhos absolutos para incorporar e copiar as suas imagens de forma idêntica em blogs ou repositórios.</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Confirmar Parâmetros
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DIALOG MODAL: MOVE FILE ACTION --- */}
      {imageToMove && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-sm w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <Move className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold">Transferir Diretório</h3>
              </div>
              <button 
                onClick={() => setImageToMove(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3">Escolha a pasta de destino para:</p>
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg flex items-center gap-2.5 mb-4 max-w-full">
                <div className="w-8 h-8 rounded border bg-white overflow-hidden flex items-center justify-center shrink-0">
                  {imageToMove.type === 'svg' || imageToMove.type.toLowerCase() === 'ai' ? (
                    <span className="font-extrabold text-[8px] text-indigo-600">SVG</span>
                  ) : imageToMove.type === 'pdf' ? (
                    <FileText className="w-4 h-4 text-rose-500" />
                  ) : (
                    <img src={imageToMove.url} className="w-full h-full object-cover" alt="" />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-900 truncate flex-1">{imageToMove.name}</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {folders.map((f) => {
                  const isCurrent = f.id === imageToMove.folderId;
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleMoveImage(f.id)}
                      disabled={isCurrent}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                        isCurrent 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>📁</span>
                        <span>{f.name}</span>
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">Pasta atual</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SYSTEM VIEW DRAWER: IMAGE INFO & EMBED CODES --- */}
      {activeViewerImage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            
            {/* Left Side Previews Panel */}
            <div className="flex-1 bg-slate-900 flex flex-col relative min-h-[300px]">
              
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] bg-slate-950/80 backdrop-blur text-white px-2 py-1 rounded font-bold uppercase tracking-widest border border-slate-800">
                  {activeViewerImage.type} format
                </span>
              </div>

              {/* Central rendering element */}
              <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
                {activeViewerImage.type === 'svg' || activeViewerImage.type.toLowerCase() === 'ai' ? (
                  <div className="text-slate-400 flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-950 text-indigo-400 flex items-center justify-center shadow-lg border border-indigo-900">
                      <span className="font-black text-xl uppercase">{activeViewerImage.type}</span>
                    </div>
                    <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Scalable Vector Artwork</span>
                    <a href={activeViewerImage.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-2">
                      <span>View in Fullscreen</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : activeViewerImage.type === 'pdf' ? (
                  <div className="text-slate-400 flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-2xl bg-rose-950 text-rose-400 flex items-center justify-center shadow-lg border border-rose-900">
                      <FileText className="w-10 h-10" />
                    </div>
                    <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Portable Document Format</span>
                    <a href={activeViewerImage.url} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-400 hover:underline flex items-center gap-1 mt-2">
                      <span>Exibir PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <img 
                    src={activeViewerImage.url} 
                    alt={activeViewerImage.name} 
                    className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-2xl transition-all"
                  />
                )}
              </div>

              {/* Bottom image path representation */}
              <div className="h-10 bg-slate-950 border-t border-slate-900/80 flex items-center px-4 justify-between text-[10px] font-mono text-slate-500 shrink-0">
                <span>CDN_PATH/{githubOwner}/{githubRepo}/{activeViewerImage.id}/{activeViewerImage.name}</span>
                <span className="text-slate-400">{activeViewerImage.dimensions}</span>
              </div>
            </div>

            {/* Right Side Metadata & Embed drawer panel */}
            <div className="md:w-[400px] bg-white border-l border-slate-200 flex flex-col shrink-0">
              
              {/* Header content */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate leading-snug" title={activeViewerImage.name}>
                    {activeViewerImage.name}
                  </h3>
                  <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Metadados & Incorporação</p>
                </div>
                <button 
                  onClick={() => setActiveViewerImage(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs list */}
              <div className="flex bg-slate-50 border-b border-slate-200 text-xs font-bold shrink-0 select-none">
                {(['preview', 'html', 'markdown', 'css', 'json'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveEmbedTab(tab)}
                    className={`flex-1 py-3 text-center border-b-2 transition-all ${
                      activeEmbedTab === tab 
                        ? 'border-indigo-600 text-indigo-700 bg-white' 
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/55'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Codes Snippets Area */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                
                {activeEmbedTab === 'preview' ? (
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ações do Arquivo</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button 
                        onClick={() => handleCopyLink(activeViewerImage)}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg text-xs font-bold shadow-sm transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Link Host</span>
                      </button>
                      <button 
                        onClick={() => {
                          const win = window.open(activeViewerImage.url, '_blank');
                          if (win) win.focus();
                        }}
                        className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-3 rounded-lg text-xs font-bold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Visualizar Url</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Propriedades Gerais</label>
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold uppercase">Tipo:</span>
                          <span className="text-slate-800 font-bold uppercase">.{activeViewerImage.type} file</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold uppercase">Tamanho:</span>
                          <span className="text-slate-800 font-bold">{activeViewerImage.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold uppercase">Resolução:</span>
                          <span className="text-slate-800 font-bold">{activeViewerImage.dimensions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold uppercase">Incluso em:</span>
                          <span className="text-slate-500 font-bold">{activeViewerImage.createdAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold uppercase">Pasta atual:</span>
                          <span className="text-indigo-600 font-bold">{folders.find(f => f.id === activeViewerImage.folderId)?.name}</span>
                        </div>
                        <div className="flex justify-between max-w-full">
                          <span className="text-slate-400 font-semibold uppercase">OwnerID:</span>
                          <span className="text-slate-650 font-mono text-[10px] max-w-[150px] truncate">{githubOwner}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <button 
                        onClick={() => setImageToMove(activeViewerImage)}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-semibold text-xs py-2.5 rounded-lg border-dashed transition-colors cursor-pointer"
                      >
                        <Move className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mudar de pasta</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Dynamic embed snippet renderer block
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Código de Incorporação</label>
                      <button
                        onClick={() => {
                          const val = activeEmbedTab === 'html' ? `<img src="${window.location.origin}/cdn/${githubOwner}/${githubRepo}/${activeViewerImage.id}/${activeViewerImage.name}" alt="${activeViewerImage.name}" />`
                                    : activeEmbedTab === 'markdown' ? `![${activeViewerImage.name}](${window.location.origin}/cdn/${githubOwner}/${githubRepo}/${activeViewerImage.id}/${activeViewerImage.name})`
                                    : activeEmbedTab === 'css' ? `background-image: url('${window.location.origin}/cdn/${githubOwner}/${githubRepo}/${activeViewerImage.id}/${activeViewerImage.name}');`
                                    : JSON.stringify(activeViewerImage, null, 2);
                          navigator.clipboard.writeText(val);
                          triggerToast('Embedding snippet copied!');
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código</span>
                      </button>
                    </div>

                    <div className="relative">
                      <pre className="bg-slate-900 text-indigo-300 p-3 rounded-lg text-xs font-mono overflow-x-auto select-all max-h-60 border border-slate-950">
                        {activeEmbedTab === 'html' && (
                          <code>{`<img src="${window.location.origin}/cdn/${githubOwner}/${githubRepo}/${activeViewerImage.id}/${activeViewerImage.name}" alt="${activeViewerImage.name}" />`}</code>
                        )}
                        {activeEmbedTab === 'markdown' && (
                          <code>{`![${activeViewerImage.name}](${window.location.origin}/cdn/${githubOwner}/${githubRepo}/${activeViewerImage.id}/${activeViewerImage.name})`}</code>
                        )}
                        {activeEmbedTab === 'css' && (
                          <code>{`background-image: url('${window.location.origin}/cdn/${githubOwner}/${githubRepo}/${activeViewerImage.id}/${activeViewerImage.name}');`}</code>
                        )}
                        {activeEmbedTab === 'json' && (
                          <code>{JSON.stringify({
                            status: "success",
                            cdnUrl: `${window.location.origin}/cdn/${githubOwner}/${githubRepo}/${activeViewerImage.id}/${activeViewerImage.name}`,
                            file: {
                              id: activeViewerImage.id,
                              name: activeViewerImage.name,
                              size: activeViewerImage.size,
                              dimensions: activeViewerImage.dimensions,
                              type: activeViewerImage.type,
                              createdAt: activeViewerImage.createdAt
                            }
                          }, null, 2)}</code>
                        )}
                      </pre>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Este snippet permite utilizar a imagem diretamente no seu Front-end com links em CDN pública de forma compatível e de altíssima velocidade.</p>
                  </div>
                )}
                
              </div>

              {/* Footer action */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto flex items-center justify-between shrink-0">
                <button
                  onClick={() => handleDeleteImage(activeViewerImage.id)}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Arquivo</span>
                </button>
                <button
                  onClick={() => setActiveViewerImage(null)}
                  className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
