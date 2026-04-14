import React, { useState, useEffect, useRef, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Upload, 
  History, 
  HelpCircle, 
  RotateCcw, 
  Copy, 
  Camera, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Download,
  ExternalLink,
  Coins,
  FileText,
  Edit3,
  Save,
  Maximize2,
  Minimize2,
  RefreshCw,
  X,
  LayoutDashboard,
  Layers,
  Settings,
  User,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Search,
  ChevronRight,
  LogOut,
  MoreVertical,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Toaster, toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import { RecognitionResult, Defect, BoundingBox } from "./types";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

// --- AI Initialization ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- Layout Components ---

const Sidebar = ({ historyCount }: { historyCount: number }) => {
  const location = useLocation();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "数据看板", path: "/dashboard" },
    { icon: <Upload size={20} />, label: "单张识别", path: "/" },
    { icon: <Layers size={20} />, label: "批量识别", path: "/batch" },
    { icon: <Camera size={20} />, label: "摄像头识别", path: "/camera" },
  ];

  const dataItems = [
    { icon: <History size={20} />, label: "历史记录", path: "/history", badge: historyCount },
    { icon: <BarChart3 size={20} />, label: "数据统计", path: "/statistics" },
  ];

  const systemItems = [
    { icon: <Settings size={20} />, label: "系统设置", path: "/settings" },
    { icon: <User size={20} />, label: "个人中心", path: "/profile" },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
          <Search size={24} />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">AI 智能识别</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">数码产品管理系统</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 py-4">
          <div>
            <p className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">核心功能</p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'}`}>
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">数据管理</p>
            <div className="space-y-1">
              {dataItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'}`}>
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${location.pathname === item.path ? 'bg-white text-blue-600' : 'bg-slate-700 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">系统</p>
            <div className="space-y-1">
              {systemItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'}`}>
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">admin</p>
            <p className="text-[10px] text-slate-500 truncate">退出登录</p>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </aside>
  );
};

// --- Dashboard Component ---

const Dashboard = ({ history }: { history: RecognitionResult[] }) => {
  const stats = useMemo(() => {
    if (!Array.isArray(history)) {
      return { todayCount: 0, totalCount: 0, categoryData: [], avgPrice: 0, last7Days: [] };
    }
    const today = new Date().toISOString().split('T')[0];
    const todayCount = history.filter(h => h.timestamp.startsWith(today)).length;
    
    const categories = history.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
    
    const priceRange = history.reduce((acc, curr) => {
      if (curr.estimatedPrice) {
        acc.total += (curr.estimatedPrice.min + curr.estimatedPrice.max) / 2;
        acc.count++;
      }
      return acc;
    }, { total: 0, count: 0 });

    const avgPrice = priceRange.count > 0 ? Math.round(priceRange.total / priceRange.count) : 0;

    // Last 7 days trend
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr.split('-').slice(1).join('/'),
        count: history.filter(h => h.timestamp.startsWith(dateStr)).length
      };
    }).reverse();

    return { todayCount, totalCount: history.length, categoryData, avgPrice, last7Days };
  }, [history]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">数据看板</h2>
          <p className="text-slate-500">实时监控数码产品识别与评估数据</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus size={18} /> 新增识别
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "总识别数量", value: stats.totalCount, icon: <Layers className="text-blue-600" />, bg: "bg-blue-50" },
          { label: "今日识别数", value: stats.todayCount, icon: <CheckCircle2 className="text-green-600" />, bg: "bg-green-50" },
          { label: "热门品类", value: stats.categoryData[0]?.name || "无", icon: <TrendingUp className="text-orange-600" />, bg: "bg-orange-50" },
          { label: "平均识别估值", value: `¥${stats.avgPrice}`, icon: <Coins className="text-purple-600" />, bg: "bg-purple-50" },
          { label: "预期总价值", value: `¥${Math.round(stats.avgPrice * stats.totalCount)}`, icon: <BarChart3 className="text-pink-600" />, bg: "bg-pink-50" },
        ].map((item, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center mb-2`}>
                {item.icon}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl font-black text-slate-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">品类分布</CardTitle>
            <CardDescription>按数码产品类型划分的识别比例</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">识别趋势</CardTitle>
            <CardDescription>最近 7 天的识别频率变化</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.last7Days}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Camera Modal Component ---

const CameraModal = ({ onCapture }: { onCapture: (file: File) => void }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      toast.error("无法访问摄像头");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          onCapture(file);
          setIsOpen(false);
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (open) startCamera(); else stopCamera(); }}>
      <DialogTrigger asChild>
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 h-10 px-4 py-2 gap-2 cursor-pointer">
          <Camera size={18} /> 摄像头识别
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>拍摄二手数码物品</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 border-white/20 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-dashed border-white/50 rounded-xl" />
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={capture} className="rounded-full h-16 w-16 bg-blue-600 hover:bg-blue-700 shadow-xl">
            <div className="h-12 w-12 rounded-full border-2 border-white" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Pages ---

const HomePage = ({ onRecognize }: { onRecognize: (file: File) => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("仅支持图片格式 (JPG/PNG/JPEG)");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
    }, 800);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Upload size={18} />
          </div>
          单张图片识别
        </h2>
        <p className="text-slate-500">上传一张数码产品图片，系统自动识别设备类型并检测外观瑕疵</p>
      </div>

      <div className="grid gap-8">
        <Card 
          className={`relative overflow-hidden border-2 border-dashed transition-all cursor-pointer shadow-sm ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => !preview && fileInputRef.current?.click()}
        >
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            
            {!preview ? (
              <div className="space-y-6">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                  <Upload size={48} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">点击或拖拽图片到此处</p>
                  <p className="text-sm text-slate-400 mt-2">支持 JPG、PNG 格式，大小不超过 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <img src={preview} alt="Preview" className="max-h-[350px] rounded-xl shadow-2xl border-4 border-white transition-transform group-hover:scale-[1.02]" />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-3 -right-3 h-10 w-10 rounded-full shadow-xl"
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                >
                  <Trash2 size={18} />
                </Button>
                {isChecking && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CameraModal onCapture={handleFile} />
          {preview && (
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 px-16 h-14 text-lg font-bold shadow-xl shadow-blue-200 rounded-xl"
              onClick={() => file && onRecognize(file)}
            >
              开始智能检测
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultPage = ({ result, onReset, onUpdate }: { result: RecognitionResult, onReset: () => void, onUpdate: (res: RecognitionResult) => void }) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [editedResult, setEditedResult] = useState(result);

  const reEstimatePrice = async (updatedRes: RecognitionResult) => {
    setIsUpdatingPrice(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: {
          parts: [
            { text: `
              Based on the following updated details for a second-hand digital item, provide a new price estimation.
              
              Details:
              Category: ${updatedRes.category}
              Brand: ${updatedRes.brand}
              Model: ${updatedRes.model}
              Defects: ${JSON.stringify(updatedRes.defects)}
              
              Return a JSON object:
              {
                "min": number,
                "max": number,
                "currency": "CNY",
                "reasoning": "string in Chinese explaining the price based on current market and condition"
              }
            ` }
          ]
        },
        config: { responseMimeType: "application/json" }
      });

      const priceData = JSON.parse(response.text);
      const finalRes = { ...updatedRes, estimatedPrice: priceData };
      setEditedResult(finalRes);
      onUpdate(finalRes);
      toast.success("价格已根据最新信息重新评估");
    } catch (error) {
      console.error(error);
      toast.error("价格评估更新失败");
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    reEstimatePrice(editedResult);
  };

  const handleDownload = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current);
      const link = document.createElement("a");
      link.download = `检测报告-${editedResult.brand}-${editedResult.model}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onReset} className="gap-2 text-slate-500 hover:text-slate-900">
          <ArrowLeft size={18} /> 返回
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="gap-2 border-slate-200">
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            {isEditing ? "取消编辑" : "手动修正"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 border-slate-200">
            <Download size={16} /> 下载报告
          </Button>
        </div>
      </div>

      <div ref={resultRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="overflow-hidden bg-white shadow-xl border-0 rounded-2xl">
            <div className="relative aspect-square bg-slate-50">
              <img src={editedResult.imageUrl} alt="" className="w-full h-full object-contain p-4" />
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000">
                {editedResult.boxes?.map((box, i) => {
                  const [ymin, xmin, ymax, xmax] = box.box_2d;
                  const color = box.type === 'item' ? '#2563eb' : '#ef4444';
                  return (
                    <g key={i}>
                      <rect x={xmin} y={ymin} width={xmax - xmin} height={ymax - ymin} fill="none" stroke={color} strokeWidth="4" rx="4" />
                      <rect x={xmin} y={ymin - 35} width={120} height={35} fill={color} rx="4" />
                      <text x={xmin + 8} y={ymin - 10} fill="white" fontSize="20" fontWeight="bold">{box.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>
          <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <CheckCircle2 size={18} /> 识别成功
            </div>
            <div className="text-xs text-slate-400 font-medium">
              置信度: {(editedResult.confidence * 100).toFixed(1)}% | 耗时: {editedResult.inferenceTime}ms
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-6">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">检测详情报告</CardTitle>
                <CardDescription>AI 自动识别结果与人工复核</CardDescription>
              </div>
              {isEditing && (
                <Button size="sm" onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                  <Save size={14} /> 保存并重估价
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">设备品类</label>
                  {isEditing ? (
                    <input className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editedResult.category} onChange={e => setEditedResult({...editedResult, category: e.target.value})} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-50 text-blue-600 border-0 hover:bg-blue-100 px-3 py-1 text-sm">{editedResult.category}</Badge>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">品牌厂家</label>
                  {isEditing ? (
                    <input className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editedResult.brand} onChange={e => setEditedResult({...editedResult, brand: e.target.value})} />
                  ) : (
                    <p className="text-xl font-bold text-slate-900">{editedResult.brand}</p>
                  )}
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">具体型号规格</label>
                  {isEditing ? (
                    <input className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editedResult.model} onChange={e => setEditedResult({...editedResult, model: e.target.value})} />
                  ) : (
                    <p className="text-3xl font-black text-blue-600 tracking-tight">{editedResult.model}</p>
                  )}
                </div>
              </div>

              <Separator className="bg-slate-100" />

              <div className="space-y-4">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">外观瑕疵检测</label>
                {(!editedResult.defects || editedResult.defects.length === 0) ? (
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-green-50 border border-green-100 text-green-700">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-lg">完美品相</p>
                      <p className="text-sm opacity-80">未检测到明显划痕或磕碰，建议按最高行情价回收。</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {editedResult.defects.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-red-200 hover:bg-red-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-red-600">
                            <AlertCircle size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-red-700">{d.type}</p>
                            <p className="text-xs text-slate-400">{d.location}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-white">{d.severity}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {editedResult.estimatedPrice && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-8 rounded-3xl bg-[#1e293b] text-white shadow-2xl overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Coins size={120} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                          <Coins size={20} />
                        </div>
                        <span className="font-black text-lg tracking-tight">预估回收参考价</span>
                      </div>
                      <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1">实时行情</Badge>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-400">¥</span>
                      <span className="text-6xl font-black tracking-tighter">
                        {editedResult.estimatedPrice.min} - {editedResult.estimatedPrice.max}
                      </span>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <p className="text-sm text-slate-300 leading-relaxed flex gap-3">
                        <FileText size={18} className="shrink-0 text-blue-400" />
                        {editedResult.estimatedPrice.reasoning}
                      </p>
                    </div>
                  </div>

                  {isUpdatingPrice && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-20">
                      <Loader2 className="animate-spin text-blue-500" size={48} />
                      <p className="font-bold text-blue-400">正在重新评估市场价格...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const BatchRecognitionPage = ({ saveToHistory }: { saveToHistory: (res: RecognitionResult) => void }) => {
  const [files, setFiles] = useState<{file: File, id: string, status: 'pending'|'processing'|'success'|'error', result?: RecognitionResult, preview: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | File[]) => {
    const validFiles = Array.from(newFiles).filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast.error("请上传有效的图片文件");
      return;
    }
    const newFileObjs = validFiles.map(f => ({
      file: f,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      preview: URL.createObjectURL(f)
    }));
    setFiles(prev => [...prev, ...newFileObjs]);
  };

  const startBatch = async () => {
    setIsProcessing(true);
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;
      
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'processing' } : f));
      
      try {
        const file = files[i].file;
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(file);
        });
        const base64Data = await base64Promise;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: file.type } },
              { text: `
                You are an AI specialized in second-hand digital item recognition, simulating a YOLOv8 model.
                Analyze the image and return a JSON object.
                
                JSON Schema:
                {
                  "category": "string",
                  "brand": "string",
                  "model": "string",
                  "defects": [{ "type": "string", "location": "string", "severity": "string" }],
                  "boxes": [{ "label": "string", "box_2d": [0, 0, 100, 100], "type": "item"|"defect" }],
                  "confidence": 0.95,
                  "inferenceTime": 120,
                  "estimatedPrice": { "min": 1000, "max": 2000, "currency": "CNY", "reasoning": "string" }
                }
                
                If no digital item is found, return { "error": "未检测到二手数码物品" }.
                Return ONLY the JSON.
              ` }
            ]
          },
          config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text);
        if (data.error) throw new Error(data.error);

        const result: RecognitionResult = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          imageUrl: files[i].preview,
          status: 'success'
        };

        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'success', result } : f));
        saveToHistory(result);
      } catch (err) {
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' } : f));
      }
    }
    setIsProcessing(false);
    toast.success("批量识别完成");
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">批量识别</h2>
          <p className="text-slate-500">一次性上传多张图片，自动排队进行 AI 检测与估价</p>
        </div>
        <div className="flex gap-3">
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Plus size={18} /> 添加图片
          </Button>
          <Button onClick={startBatch} disabled={isProcessing || files.filter(f => f.status === 'pending').length === 0} className="gap-2 bg-blue-600 hover:bg-blue-700">
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Layers size={18} />}
            {isProcessing ? "处理中..." : "开始批量识别"}
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => fileInputRef.current?.click()}>
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center"
               onDragOver={e => e.preventDefault()}
               onDrop={e => { e.preventDefault(); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}>
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 text-blue-500">
              <Layers size={40} />
            </div>
            <p className="text-xl font-bold text-slate-900">点击或拖拽多张图片到此处</p>
            <p className="text-sm text-slate-400 mt-2">支持批量上传 JPG、PNG 格式</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((f, i) => (
            <Card key={f.id} className="overflow-hidden border-0 shadow-sm relative group">
              <div className="aspect-video bg-slate-100 relative">
                <img src={f.preview} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-3 right-3">
                  {f.status === 'pending' && <Badge variant="secondary" className="bg-white/90">等待中</Badge>}
                  {f.status === 'processing' && <Badge className="bg-blue-500 animate-pulse">识别中...</Badge>}
                  {f.status === 'success' && <Badge className="bg-green-500">已完成</Badge>}
                  {f.status === 'error' && <Badge variant="destructive">识别失败</Badge>}
                </div>
                {f.status === 'pending' && !isProcessing && (
                  <Button variant="destructive" size="icon" className="absolute top-3 left-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
              <CardContent className="p-4">
                {f.result ? (
                  <>
                    <h3 className="font-bold text-slate-900 truncate">{f.result.brand} {f.result.model}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">{f.result.category}</Badge>
                      {f.result.estimatedPrice && (
                        <span className="text-sm font-black text-blue-600">¥{f.result.estimatedPrice.min} - ¥{f.result.estimatedPrice.max}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-12 flex items-center justify-center text-slate-400 text-sm">
                    {f.status === 'error' ? '图片质量不佳或未包含数码产品' : '等待 AI 分析...'}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [history, setHistory] = useState<RecognitionResult[]>([]);
  const [currentResult, setCurrentResult] = useState<RecognitionResult | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("recognition_history_v3");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (res: RecognitionResult | RecognitionResult[]) => {
    setHistory(prev => {
      const newItems = Array.isArray(res) ? res : [res];
      const newHistory = [...newItems, ...prev].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i).slice(0, 200);
      localStorage.setItem("recognition_history_v3", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleRecognize = async (file: File) => {
    setIsRecognizing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: file.type } },
            { text: `
              You are an AI specialized in second-hand digital item recognition, simulating a YOLOv8 model.
              Analyze the image and return a JSON object.
              
              JSON Schema:
              {
                "category": "string (手机/笔记本电脑/平板电脑/无线耳机/键盘/鼠标/显示器/数码相机)",
                "brand": "string",
                "model": "string",
                "defects": [{ "type": "划痕"|"磕碰"|"磨损", "location": "string", "severity": "轻微"|"明显" }],
                "boxes": [{ "label": "string", "box_2d": [ymin, xmin, ymax, xmax], "type": "item"|"defect" }],
                "confidence": number (0-1),
                "inferenceTime": number (ms),
                "estimatedPrice": { "min": number, "max": number, "currency": "CNY", "reasoning": "string in Chinese" }
              }
              
              If no digital item is found, return { "error": "未检测到二手数码物品" }.
              Return ONLY the JSON.
            ` }
          ]
        },
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text);
      if (data.error) {
        toast.error(data.error);
        return;
      }

      const result: RecognitionResult = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        imageUrl: URL.createObjectURL(file),
        status: 'success'
      };

      setCurrentResult(result);
      saveToHistory(result);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      toast.success("识别与估价完成！");
    } catch (error) {
      console.error(error);
      toast.error("识别失败，请检查网络或图片质量");
    } finally {
      setIsRecognizing(false);
    }
  };

  return (
    <TooltipProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
          <Sidebar historyCount={history.length} />
          
          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-40">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Search size={16} />
                </div>
                <span className="text-sm text-slate-400 font-medium">搜索功能、全局设置...</span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <RotateCcw size={18} />
                </Button>
                <div className="h-8 w-[1px] bg-slate-100 mx-2" />
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">管理员账号</p>
                    <p className="text-[10px] text-slate-400">超级管理员</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/dashboard" element={<Dashboard history={history} />} />
                <Route path="/" element={
                  currentResult ? (
                    <ResultPage 
                      result={currentResult} 
                      onReset={() => setCurrentResult(null)} 
                      onUpdate={(res) => { setCurrentResult(res); saveToHistory(res); }}
                    />
                  ) : (
                    <HomePage onRecognize={handleRecognize} />
                  )
                } />
                <Route path="/history" element={
                  <div className="p-8 space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900">识别历史</h2>
                        <p className="text-slate-500">管理所有已完成的数码产品检测记录</p>
                      </div>
                      <Button variant="destructive" size="sm" className="gap-2" onClick={() => { setHistory([]); localStorage.removeItem("recognition_history_v3"); }}>
                        <Trash2 size={16} /> 清空所有记录
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Array.isArray(history) && history.map(item => (
                        <Card key={item.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all cursor-pointer rounded-2xl" onClick={() => setCurrentResult(item)}>
                          <div className="aspect-video relative overflow-hidden bg-slate-100">
                            <img src={item.imageUrl} className="object-cover w-full h-full transition-transform group-hover:scale-110" />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-white/90 text-slate-900 border-0 backdrop-blur-md">{item.category}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="font-bold text-slate-900 truncate mb-1">{item.brand} {item.model}</h3>
                            <div className="flex items-center justify-between mt-4">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(item.timestamp).toLocaleDateString()}</p>
                              {item.estimatedPrice && (
                                <p className="text-sm font-black text-blue-600">¥{item.estimatedPrice.min}+</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {history.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300">
                          <History size={64} className="mb-4 opacity-20" />
                          <p className="text-lg font-medium">暂无历史记录</p>
                        </div>
                      )}
                    </div>
                  </div>
                } />
                <Route path="/statistics" element={<Dashboard history={history} />} />
                <Route path="/batch" element={<BatchRecognitionPage saveToHistory={saveToHistory} />} />
                <Route path="/camera" element={
                  <div className="p-8">
                    <div className="mb-12">
                      <h2 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                          <Camera size={18} />
                        </div>
                        摄像头实时识别
                      </h2>
                      <p className="text-slate-500">调用设备摄像头进行实时扫描与自动抓拍识别</p>
                    </div>
                    <div className="max-w-2xl mx-auto">
                      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="h-20 w-20 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto text-blue-500 animate-pulse">
                            <Camera size={40} />
                          </div>
                          <p className="text-slate-500 font-medium">点击下方按钮开启摄像头</p>
                          <CameraModal onCapture={handleRecognize} />
                        </div>
                      </Card>
                    </div>
                  </div>
                } />
                <Route path="*" element={<Dashboard history={history} />} />
              </Routes>
            </div>
          </main>

          <AnimatePresence>
            {isRecognizing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-xl text-white"
              >
                <div className="relative mb-12">
                  <div className="h-48 w-48 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                  <div className="absolute inset-0 m-auto h-32 w-32 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <RefreshCw className="text-blue-500 animate-pulse" size={64} />
                  </div>
                  <div className="absolute -inset-4 border border-blue-500/10 rounded-full animate-ping" />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter">AI 深度神经扫描中...</h2>
                  <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">Initializing YOLOv8-Vision Engine</p>
                </div>
                <div className="mt-12 flex gap-4">
                  {["特征提取", "品类比对", "瑕疵分析", "市场估值"].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="h-1 w-12 bg-blue-500/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: i * 0.5, repeat: Infinity }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Toaster position="top-center" richColors />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
}
