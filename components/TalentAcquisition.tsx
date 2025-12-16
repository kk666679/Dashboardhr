"use client";

import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Zap,
  Brain,
  Globe,
  Award,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Send,
  Edit,
  Trash2,
  ExternalLink,
  FileCheck,
  UserCheck,
  Shield,
  Flag,
  LayoutDashboard,
} from 'lucide-react';
import {
  GlassmorphicCard,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  GlassButton,
  AnimatedCounter,
  GlassInput,
} from './GlassmorphicCard';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  FunnelChart,
  Funnel,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ViewMode = 'dashboard' | 'jobs' | 'candidates' | 'pipeline' | 'analytics' | 'compliance';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  salary: string;
  posted: string;
  applicants: number;
  status: 'active' | 'paused' | 'closed';
  bumiputeraQuota?: number;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  score: number;
  experience: string;
  nationality: string;
  languages: string[];
  source: 'JobStreet' | 'LinkedIn' | 'Direct' | 'Referral';
  culturalFit: number;
  technicalScore: number;
  requiresWorkPermit: boolean;
  bumiputera: boolean;
  appliedDate: string;
}

export function TalentAcquisition() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [showResumeParser, setShowResumeParser] = useState(false);

  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Kuala Lumpur',
      type: 'full-time',
      salary: 'RM 8,000 - 12,000',
      posted: '2024-12-01',
      applicants: 45,
      status: 'active',
      bumiputeraQuota: 30,
    },
    {
      id: '2',
      title: 'Sales Manager',
      department: 'Sales',
      location: 'Penang',
      type: 'full-time',
      salary: 'RM 6,000 - 9,000',
      posted: '2024-12-05',
      applicants: 32,
      status: 'active',
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Johor Bahru',
      type: 'full-time',
      salary: 'RM 5,000 - 7,500',
      posted: '2024-12-08',
      applicants: 28,
      status: 'active',
    },
    {
      id: '4',
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Remote',
      type: 'contract',
      salary: 'RM 4,500 - 6,500',
      posted: '2024-12-10',
      applicants: 18,
      status: 'active',
    },
  ];

  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Ahmad Syafiq bin Hassan',
      position: 'Senior Software Engineer',
      email: 'ahmad.syafiq@email.com',
      phone: '+60 12-345 6789',
      stage: 'interview',
      score: 92,
      experience: '6 years',
      nationality: 'Malaysian',
      languages: ['English', 'Bahasa Malaysia', 'Mandarin'],
      source: 'LinkedIn',
      culturalFit: 88,
      technicalScore: 95,
      requiresWorkPermit: false,
      bumiputera: true,
      appliedDate: '2024-12-02',
    },
    {
      id: '2',
      name: 'Sarah Lee Mei Ling',
      position: 'Senior Software Engineer',
      email: 'sarah.lee@email.com',
      phone: '+60 16-234 5678',
      stage: 'offer',
      score: 88,
      experience: '5 years',
      nationality: 'Malaysian',
      languages: ['English', 'Mandarin', 'Bahasa Malaysia'],
      source: 'JobStreet',
      culturalFit: 85,
      technicalScore: 90,
      requiresWorkPermit: false,
      bumiputera: false,
      appliedDate: '2024-12-01',
    },
    {
      id: '3',
      name: 'Raj Kumar Patel',
      position: 'Sales Manager',
      email: 'raj.kumar@email.com',
      phone: '+60 17-345 6789',
      stage: 'screening',
      score: 85,
      experience: '7 years',
      nationality: 'Malaysian',
      languages: ['English', 'Tamil', 'Bahasa Malaysia'],
      source: 'Direct',
      culturalFit: 82,
      technicalScore: 87,
      requiresWorkPermit: false,
      bumiputera: false,
      appliedDate: '2024-12-06',
    },
    {
      id: '4',
      name: 'Nurul Ain binti Ibrahim',
      position: 'UI/UX Designer',
      email: 'nurul.ain@email.com',
      phone: '+60 19-456 7890',
      stage: 'interview',
      score: 90,
      experience: '4 years',
      nationality: 'Malaysian',
      languages: ['English', 'Bahasa Malaysia'],
      source: 'Referral',
      culturalFit: 92,
      technicalScore: 88,
      requiresWorkPermit: false,
      bumiputera: true,
      appliedDate: '2024-12-09',
    },
    {
      id: '5',
      name: 'David Tan Wei Jian',
      position: 'Data Analyst',
      email: 'david.tan@email.com',
      phone: '+60 12-567 8901',
      stage: 'applied',
      score: 78,
      experience: '3 years',
      nationality: 'Malaysian',
      languages: ['English', 'Mandarin'],
      source: 'JobStreet',
      culturalFit: 75,
      technicalScore: 80,
      requiresWorkPermit: false,
      bumiputera: false,
      appliedDate: '2024-12-11',
    },
    {
      id: '6',
      name: 'Michael Chen',
      position: 'Senior Software Engineer',
      email: 'michael.chen@email.com',
      phone: '+65 9123 4567',
      stage: 'screening',
      score: 86,
      experience: '8 years',
      nationality: 'Singaporean',
      languages: ['English', 'Mandarin'],
      source: 'LinkedIn',
      culturalFit: 70,
      technicalScore: 93,
      requiresWorkPermit: true,
      bumiputera: false,
      appliedDate: '2024-12-03',
    },
  ];

  const totalApplicants = candidates.length;
  const activeJobs = jobPostings.filter(j => j.status === 'active').length;
  const averageScore = Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length);
  const interviewScheduled = candidates.filter(c => c.stage === 'interview').length;

  const stats = [
    {
      label: 'Active Job Posts',
      value: activeJobs,
      change: '+2 this week',
      icon: Briefcase,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Total Candidates',
      value: totalApplicants,
      change: '+12 this week',
      icon: Users,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
    {
      label: 'Avg AI Score',
      value: averageScore,
      suffix: '/100',
      change: '+3 pts',
      icon: Brain,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Interviews Scheduled',
      value: interviewScheduled,
      change: '3 this week',
      icon: Calendar,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
  ];

  const pipelineData = [
    { stage: 'Applied', count: candidates.filter(c => c.stage === 'applied').length },
    { stage: 'Screening', count: candidates.filter(c => c.stage === 'screening').length },
    { stage: 'Interview', count: candidates.filter(c => c.stage === 'interview').length },
    { stage: 'Offer', count: candidates.filter(c => c.stage === 'offer').length },
    { stage: 'Hired', count: candidates.filter(c => c.stage === 'hired').length },
  ];

  const sourceDistributionData = [
    { name: 'JobStreet', value: candidates.filter(c => c.source === 'JobStreet').length },
    { name: 'LinkedIn', value: candidates.filter(c => c.source === 'LinkedIn').length },
    { name: 'Direct', value: candidates.filter(c => c.source === 'Direct').length },
    { name: 'Referral', value: candidates.filter(c => c.source === 'Referral').length },
  ];

  const hiringTrendData = [
    { month: 'Jul', hired: 8, applicants: 45 },
    { month: 'Aug', hired: 10, applicants: 52 },
    { month: 'Sep', hired: 7, applicants: 38 },
    { month: 'Oct', hired: 12, applicants: 60 },
    { month: 'Nov', hired: 9, applicants: 48 },
    { month: 'Dec', hired: 6, applicants: totalApplicants },
  ];

  const complianceData = [
    { category: 'Bumiputera', current: 45, target: 30 },
    { category: 'Work Permit', current: 85, target: 100 },
    { category: 'MYWorkID', current: 92, target: 100 },
    { category: 'Cultural Fit', current: 82, target: 80 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'applied':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'screening':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'interview':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'offer':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'hired':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'all' || candidate.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={index}>
              <GlassmorphicCard
                gradient={`${stat.gradient.replace('/80', '/10')} backdrop-blur-xl`}
                animation="scale"
                delay={index * 0.1}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <motion.p
                        className="text-3xl font-bold text-gray-900"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                      >
                        <AnimatedCounter value={stat.value} duration={2} />
                        {stat.suffix}
                      </motion.p>
                    </div>
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{stat.change}</p>
                </div>
              </GlassmorphicCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* AI Features Banner */}
      <SlideIn direction="up" delay={0.2}>
        <GlassmorphicCard gradient="from-purple-500/10 to-violet-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">AI-Powered Recruitment Intelligence</h4>
                <p className="text-sm text-purple-700">
                  Advanced AI screening with Bahasa Malaysia support, cultural fit analysis, and bias detection
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-900">Resume Parser</p>
                <p className="text-xs text-gray-600">BM + EN</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                <Zap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-900">AI Screening</p>
                <p className="text-xs text-gray-600">Auto-rank</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-900">Bias Detection</p>
                <p className="text-xs text-gray-600">Fair hiring</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-900">Cultural Fit</p>
                <p className="text-xs text-gray-600">MY Context</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlideIn direction="left" delay={0.3}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recruitment Pipeline</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="stage" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.3}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Candidate Sources</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <PieChart>
                    <Pie
                      data={sourceDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {sourceDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="left" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hiring Trends</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <LineChart data={hiringTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="hired" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
                    <Line type="monotone" dataKey="applicants" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance Status</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <RadarChart data={complianceData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="category" stroke="#6B7280" />
                    <PolarRadiusAxis stroke="#6B7280" />
                    <Radar name="Current" dataKey="current" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>

      {/* Quick Actions */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { icon: Plus, title: 'Post New Job', desc: 'Create job posting', color: 'from-blue-500 to-cyan-500' },
          { icon: Upload, title: 'Parse Resume', desc: 'AI resume analysis', color: 'from-purple-500 to-violet-500' },
          { icon: Calendar, title: 'Schedule Interview', desc: 'Book candidate meeting', color: 'from-orange-500 to-amber-500' },
          { icon: Download, title: 'Export Report', desc: 'Download analytics', color: 'from-green-500 to-emerald-500' },
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <StaggerItem key={index}>
              <GlassmorphicCard
                gradient="from-white/80 to-white/60"
                blur="xl"
                animation="scale"
                delay={index * 0.1}
              >
                <button
                  onClick={() => action.title === 'Parse Resume' && setShowResumeParser(true)}
                  className="w-full p-6 text-center hover:bg-white/30 rounded-xl transition-all"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-xs text-gray-600">{action.desc}</p>
                </button>
              </GlassmorphicCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Job Postings</h3>
        <GlassButton variant="primary" onClick={() => {}}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobPostings.map((job, index) => (
          <div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs border ${
                        job.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                        job.status === 'paused' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {job.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      {job.bumiputeraQuota && (
                        <div className="flex items-center gap-1">
                          <Flag className="w-4 h-4 text-green-600" />
                          <span>{job.bumiputeraQuota}% Bumiputera quota</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <ExternalLink className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Posted: {job.posted}</span>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Candidates</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <GlassInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search candidates..."
            icon={<Search className="w-5 h-5" />}
          />
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCandidates.map((candidate, index) => (
          <div
            key={candidate.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{candidate.name}</h4>
                        {candidate.bumiputera && (
                          <Flag className="w-4 h-4 text-green-600" />
                        )}
                        {candidate.requiresWorkPermit && (
                          <Globe className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{candidate.position}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">AI Score</p>
                          <p className={`font-semibold ${getScoreColor(candidate.score)}`}>
                            {candidate.score}/100
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Experience</p>
                          <p className="font-semibold text-gray-900">{candidate.experience}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cultural Fit</p>
                          <p className={`font-semibold ${getScoreColor(candidate.culturalFit)}`}>
                            {candidate.culturalFit}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Source</p>
                          <p className="font-semibold text-gray-900">{candidate.source}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {candidate.languages.map((lang, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStageColor(candidate.stage)}`}>
                      {candidate.stage.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Malaysian Recruitment Compliance</h3>

      {/* Bumiputera Hiring */}
      <SlideIn direction="up">
        <GlassmorphicCard gradient="from-green-500/10 to-emerald-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Flag className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Bumiputera Hiring Compliance</h4>
                <p className="text-sm text-green-700">
                  Track and maintain Bumiputera employment quotas as per government requirements
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Current Status</p>
                <p className="text-2xl font-bold text-green-600">45%</p>
                <p className="text-xs text-gray-600 mt-1">Above 30% target</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Total Bumiputera</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-600 mt-1">Out of 6 candidates</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Compliance</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-600">Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>

      {/* Work Permit */}
      <SlideIn direction="up" delay={0.1}>
        <GlassmorphicCard gradient="from-blue-500/10 to-cyan-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Employment Pass Processing</h4>
                <p className="text-sm text-blue-700">
                  Automated tracking and processing of foreign worker employment passes
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {candidates.filter(c => c.requiresWorkPermit).map((candidate, idx) => (
                <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{candidate.name}</p>
                      <p className="text-sm text-gray-600">{candidate.nationality}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200">
                        EP Required
                      </span>
                      <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>

      {/* MYWorkID */}
      <SlideIn direction="up" delay={0.2}>
        <GlassmorphicCard gradient="from-purple-500/10 to-violet-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">MYWorkID Verification</h4>
                <p className="text-sm text-purple-700">
                  Verify candidates through Malaysia's national employment verification system
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Verified</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-xs text-gray-600 mt-1">5 of 6 candidates</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Pending</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
                <p className="text-xs text-gray-600 mt-1">Awaiting verification</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>

      {/* Integration Status */}
      <SlideIn direction="up" delay={0.3}>
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Platform Integrations</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                    <p className="font-semibold text-gray-900">JobStreet</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Connected • Auto-sync enabled</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-purple-600" />
                    <p className="font-semibold text-gray-900">LinkedIn</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Connected • Recruiter access</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <SlideIn direction="down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Talent Acquisition Suite
              </motion.h1>
              <p className="text-gray-600 mt-2">AI-powered recruitment with Malaysian compliance</p>
            </div>
          </div>
        </SlideIn>

        {/* Navigation Tabs */}
        <SlideIn direction="down" delay={0.1}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
                  { id: 'jobs', name: 'Job Posts', icon: Briefcase },
                  { id: 'candidates', name: 'Candidates', icon: Users },
                  { id: 'pipeline', name: 'Pipeline', icon: Activity },
                  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
                  { id: 'compliance', name: 'Compliance', icon: Shield },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white/30 text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Content */}
          <div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'dashboard' && renderDashboard()}
            {viewMode === 'jobs' && renderJobs()}
            {viewMode === 'candidates' && renderCandidates()}
            {viewMode === 'compliance' && renderCompliance()}
            {viewMode === 'pipeline' && renderDashboard()}
            {viewMode === 'analytics' && renderDashboard()}
          </div>
      </div>

      {/* Resume Parser Modal */}
        {showResumeParser && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResumeParser(false)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Resume Parser</h3>
                    <p className="text-sm text-gray-600">Bahasa Malaysia + English support</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResumeParser(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center mb-6 hover:border-purple-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold mb-2">Drop resume file here or click to browse</p>
                <p className="text-sm text-gray-600">Supports PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">AI Features:</h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Auto-extract name, contact, experience
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Bahasa Malaysia text recognition
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Skills matching & scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Cultural fit analysis for MY workplace
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default TalentAcquisition;
