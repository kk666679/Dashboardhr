import React, { useState } from 'react';
import { 
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Star,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Target,
  BookMarked,
  Lightbulb,
  Briefcase,
  Trophy,
  Brain,
  Rocket,
  MapPin,
  Zap,
  Shield,
  Globe,
  HeartHandshake,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Settings,
  DollarSign,
  MessageSquare,
  UserCheck,
  Layers,
  LineChart,
  PieChart,
  Activity,
  LayoutDashboard
} from 'lucide-react';

type Tab = 
  | 'overview' 
  | 'courses' 
  | 'my-learning' 
  | 'certifications' 
  | 'development-programs'
  | 'upskilling'
  | 'skills-assessment'
  | 'learning-paths'
  | 'training-calendar'
  | 'analytics'
  | 'mentoring'
  | 'budget';

export function LearningDevelopment() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Enhanced Stats
  const stats = [
    { label: 'Total Courses', value: '247', icon: BookOpen, color: 'blue', trend: '+23%', subtext: '52 new this month' },
    { label: 'Active Learners', value: '1,456', icon: Users, color: 'green', trend: '+18%', subtext: '95% engagement rate' },
    { label: 'Certifications', value: '842', icon: Award, color: 'purple', trend: '+31%', subtext: '156 this quarter' },
    { label: 'Completion Rate', value: '87%', icon: TrendingUp, color: 'orange', trend: '+12%', subtext: 'Above industry avg' },
    { label: 'Skill Gaps Closed', value: '156', icon: Target, color: 'pink', trend: '+45%', subtext: '78% target achieved' },
    { label: 'Training Budget', value: 'RM 2.4M', icon: DollarSign, color: 'cyan', trend: '-8%', subtext: '68% utilized' },
  ];

  // Development Programs
  const developmentPrograms = [
    {
      id: 1,
      name: 'Future Leaders Programme',
      type: 'Leadership Development',
      duration: '12 months',
      participants: 24,
      status: 'Active',
      modules: 16,
      completionRate: 78,
      budget: 'RM 240,000',
      startDate: '2024-01-15',
      coordinator: 'Dato\' Ahmad Rahman',
      description: 'Comprehensive leadership development for high-potential managers',
      tracks: ['Strategic Thinking', 'Team Leadership', 'Change Management', 'Executive Communication']
    },
    {
      id: 2,
      name: 'Tech Excellence Program',
      type: 'Technical Upskilling',
      duration: '6 months',
      participants: 45,
      status: 'Active',
      modules: 24,
      completionRate: 92,
      budget: 'RM 180,000',
      startDate: '2024-03-01',
      coordinator: 'Dr. Sarah Chen',
      description: 'Advanced technical training for engineering and IT teams',
      tracks: ['Cloud Architecture', 'AI/ML', 'DevOps', 'Cybersecurity']
    },
    {
      id: 3,
      name: 'Sales Mastery Bootcamp',
      type: 'Sales & Marketing',
      duration: '3 months',
      participants: 32,
      status: 'Enrolling',
      modules: 12,
      completionRate: 0,
      budget: 'RM 95,000',
      startDate: '2025-01-10',
      coordinator: 'Lee Mei Ling',
      description: 'Intensive sales training with real-world simulations',
      tracks: ['Consultative Selling', 'Negotiation', 'Account Management', 'Digital Sales']
    },
    {
      id: 4,
      name: 'HR Professional Certification',
      type: 'Professional Certification',
      duration: '9 months',
      participants: 18,
      status: 'Active',
      modules: 20,
      completionRate: 65,
      budget: 'RM 156,000',
      startDate: '2024-06-01',
      coordinator: 'Siti Nurhaliza',
      description: 'Comprehensive HR certification aligned with CIPD standards',
      tracks: ['Talent Management', 'Employee Relations', 'Compensation', 'Organizational Development']
    }
  ];

  // Upskilling Modules
  const upskillingModules = [
    {
      id: 1,
      title: 'AI for Business Professionals',
      category: 'Emerging Tech',
      level: 'Intermediate',
      duration: '4 weeks',
      format: 'Self-paced + Live Sessions',
      enrolled: 156,
      rating: 4.8,
      skillsGained: ['AI Fundamentals', 'ChatGPT for Productivity', 'AI Strategy', 'Ethical AI'],
      provider: 'Internal + Coursera',
      cost: 'RM 1,200',
      certificationOffered: true,
      trending: true
    },
    {
      id: 2,
      title: 'Data Analytics Essentials',
      category: 'Data Science',
      level: 'Beginner',
      duration: '6 weeks',
      format: 'Hybrid',
      enrolled: 203,
      rating: 4.9,
      skillsGained: ['Excel Advanced', 'SQL Basics', 'Data Visualization', 'Power BI'],
      provider: 'Internal',
      cost: 'RM 800',
      certificationOffered: true,
      trending: true
    },
    {
      id: 3,
      title: 'Agile Project Management',
      category: 'Project Management',
      level: 'Intermediate',
      duration: '3 weeks',
      format: 'Instructor-led',
      enrolled: 89,
      rating: 4.7,
      skillsGained: ['Scrum', 'Kanban', 'Sprint Planning', 'Agile Leadership'],
      provider: 'PMI Partner',
      cost: 'RM 2,400',
      certificationOffered: true,
      trending: false
    },
    {
      id: 4,
      title: 'Cybersecurity Fundamentals',
      category: 'IT Security',
      level: 'Beginner',
      duration: '5 weeks',
      format: 'Online',
      enrolled: 134,
      rating: 4.6,
      skillsGained: ['Network Security', 'Threat Detection', 'Security Protocols', 'Incident Response'],
      provider: 'Udemy Business',
      cost: 'RM 600',
      certificationOffered: false,
      trending: true
    },
    {
      id: 5,
      title: 'Design Thinking Workshop',
      category: 'Innovation',
      level: 'All Levels',
      duration: '2 weeks',
      format: 'Workshop',
      enrolled: 67,
      rating: 4.9,
      skillsGained: ['Creative Problem Solving', 'User Research', 'Prototyping', 'Innovation Strategy'],
      provider: 'IDEO U',
      cost: 'RM 3,200',
      certificationOffered: true,
      trending: true
    },
    {
      id: 6,
      title: 'Emotional Intelligence for Leaders',
      category: 'Soft Skills',
      level: 'Intermediate',
      duration: '4 weeks',
      format: 'Blended',
      enrolled: 112,
      rating: 4.8,
      skillsGained: ['Self-Awareness', 'Empathy', 'Relationship Management', 'Leadership Presence'],
      provider: 'Internal',
      cost: 'RM 1,500',
      certificationOffered: false,
      trending: false
    }
  ];

  // Learning Paths
  const learningPaths = [
    {
      id: 1,
      title: 'Software Engineer Career Path',
      role: 'Software Engineer',
      level: 'Junior → Senior',
      duration: '18-24 months',
      courses: 28,
      participants: 45,
      stages: [
        { name: 'Foundation', courses: 8, duration: '3 months' },
        { name: 'Intermediate', courses: 12, duration: '6 months' },
        { name: 'Advanced', courses: 8, duration: '9 months' }
      ],
      completionRate: 67,
      avgSalaryIncrease: '35%'
    },
    {
      id: 2,
      title: 'Marketing Manager Pathway',
      role: 'Marketing Manager',
      level: 'Specialist → Manager',
      duration: '12 months',
      courses: 18,
      participants: 23,
      stages: [
        { name: 'Core Marketing', courses: 6, duration: '3 months' },
        { name: 'Digital Mastery', courses: 7, duration: '4 months' },
        { name: 'Strategic Leadership', courses: 5, duration: '5 months' }
      ],
      completionRate: 82,
      avgSalaryIncrease: '28%'
    },
    {
      id: 3,
      title: 'Data Analyst to Data Scientist',
      role: 'Data Scientist',
      level: 'Analyst → Scientist',
      duration: '15 months',
      courses: 32,
      participants: 34,
      stages: [
        { name: 'Statistics & Math', courses: 10, duration: '4 months' },
        { name: 'ML & AI', courses: 14, duration: '6 months' },
        { name: 'Advanced Projects', courses: 8, duration: '5 months' }
      ],
      completionRate: 71,
      avgSalaryIncrease: '42%'
    }
  ];

  // Skills Assessment
  const skillsGaps = [
    { skill: 'AI/ML Proficiency', currentLevel: 45, targetLevel: 80, gap: 35, priority: 'High', employees: 89 },
    { skill: 'Cloud Technologies', currentLevel: 62, targetLevel: 85, gap: 23, priority: 'High', employees: 124 },
    { skill: 'Data Analytics', currentLevel: 58, targetLevel: 75, gap: 17, priority: 'Medium', employees: 156 },
    { skill: 'Agile Methodologies', currentLevel: 71, targetLevel: 90, gap: 19, priority: 'Medium', employees: 98 },
    { skill: 'Leadership Skills', currentLevel: 65, targetLevel: 85, gap: 20, priority: 'High', employees: 67 },
    { skill: 'Digital Marketing', currentLevel: 70, targetLevel: 80, gap: 10, priority: 'Low', employees: 45 }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith('+');
          return (
            <div key={idx} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtext}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
                <span className="text-sm text-gray-500">vs last quarter</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">New Development Programs</h3>
              <p className="text-purple-100">Launch custom training initiatives</p>
            </div>
            <Rocket className="w-10 h-10 opacity-80" />
          </div>
          <button className="w-full bg-white text-purple-600 px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Create Program
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Skills Gap Analysis</h3>
              <p className="text-blue-100">Identify and address skill deficiencies</p>
            </div>
            <Target className="w-10 h-10 opacity-80" />
          </div>
          <button className="w-full bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Run Assessment
          </button>
        </div>
      </div>

      {/* Featured Programs & Trending Upskilling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Programs */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Featured Programs</h3>
            <button 
              onClick={() => setActiveTab('development-programs')}
              className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {developmentPrograms.slice(0, 3).map((program) => (
              <div key={program.id} className="border-2 border-gray-100 rounded-lg p-4 hover:border-purple-200 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{program.name}</h4>
                    <p className="text-sm text-gray-500">{program.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    program.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {program.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {program.participants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {program.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {program.modules} modules
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Upskilling */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Trending Upskilling</h3>
            <button 
              onClick={() => setActiveTab('upskilling')}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upskillingModules.filter(m => m.trending).slice(0, 3).map((module) => (
              <div key={module.id} className="border-2 border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{module.title}</h4>
                      <Sparkles className="w-4 h-4 text-orange-500" />
                    </div>
                    <p className="text-sm text-gray-500">{module.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{module.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{module.duration}</span>
                  <span>•</span>
                  <span>{module.enrolled} enrolled</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{module.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDevelopmentPrograms = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Development Programs</h2>
          <p className="text-gray-600">Comprehensive training initiatives for career growth</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {developmentPrograms.map((program) => (
          <div key={program.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{program.name}</h3>
                    <p className="text-sm text-gray-500">{program.type}</p>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full font-semibold ${
                program.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : program.status === 'Enrolling'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {program.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{program.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="font-semibold text-gray-900">{program.duration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Participants</p>
                <p className="font-semibold text-gray-900">{program.participants}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Modules</p>
                <p className="font-semibold text-gray-900">{program.modules}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Budget</p>
                <p className="font-semibold text-gray-900">{program.budget}</p>
              </div>
            </div>

            {/* Progress */}
            {program.completionRate > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-900">{program.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${program.completionRate}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Tracks */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Learning Tracks:</p>
              <div className="flex flex-wrap gap-2">
                {program.tracks.map((track, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                    {track}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold">
                View Details
              </button>
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUpskilling = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upskilling & Reskilling Modules</h2>
          <p className="text-gray-600">Targeted training to close skill gaps and drive growth</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none">
            <option>All Categories</option>
            <option>Emerging Tech</option>
            <option>Data Science</option>
            <option>Project Management</option>
            <option>IT Security</option>
            <option>Soft Skills</option>
          </select>
          <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {upskillingModules.map((module) => (
          <div key={module.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{module.title}</h3>
                  {module.trending && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Trending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-semibold">
                    {module.category}
                  </span>
                  <span className="text-gray-600">{module.level}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">{module.rating}</span>
                </div>
                {module.certificationOffered && (
                  <Award className="w-4 h-4 text-purple-600" title="Certification offered" />
                )}
              </div>
            </div>

            {/* Skills Gained */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Skills You'll Gain:</p>
              <div className="flex flex-wrap gap-2">
                {module.skillsGained.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                {module.duration}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Video className="w-4 h-4" />
                {module.format}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                {module.enrolled} enrolled
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4" />
                {module.provider}
              </div>
            </div>

            {/* Cost & Actions */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Cost per employee</p>
                <p className="text-xl font-bold text-blue-600">{module.cost}</p>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
                Enroll Team
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillsAssessment = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skills Gap Analysis</h2>
          <p className="text-gray-600">Identify and address critical skill deficiencies</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <Target className="w-4 h-4" />
          Run New Assessment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border-2 border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Critical Gaps</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-red-600 mt-1">Immediate action required</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Medium Priority</p>
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-xs text-orange-600 mt-1">Plan within quarter</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-green-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">On Track</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">1</p>
          <p className="text-xs text-green-600 mt-1">Meeting targets</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-blue-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg Gap Size</p>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">21%</p>
          <p className="text-xs text-blue-600 mt-1">Across all skills</p>
        </div>
      </div>

      {/* Skills Gap Details */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Detailed Skills Analysis</h3>
        <div className="space-y-4">
          {skillsGaps.map((skill, idx) => (
            <div key={idx} className="border-2 border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{skill.skill}</h4>
                  <p className="text-sm text-gray-600">{skill.employees} employees assessed</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full font-semibold ${
                  skill.priority === 'High' 
                    ? 'bg-red-100 text-red-700' 
                    : skill.priority === 'Medium'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {skill.priority} Priority
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Current Level</span>
                    <span className="font-semibold text-gray-900">{skill.currentLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${skill.currentLevel}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Target Level</span>
                    <span className="font-semibold text-gray-900">{skill.targetLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${skill.targetLevel}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-semibold text-orange-900">Gap to Close</span>
                  <span className="text-lg font-bold text-orange-600">{skill.gap}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold">
                  View Training Plan
                </button>
                <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all text-sm">
                  Assign Courses
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLearningPaths = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Learning Paths</h2>
          <p className="text-gray-600">Structured progression roadmaps for career advancement</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Path
        </button>
      </div>

      {/* Learning Paths */}
      <div className="space-y-6">
        {learningPaths.map((path) => (
          <div key={path.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{path.title}</h3>
                  <p className="text-gray-600">{path.level}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.courses} courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {path.participants} enrolled
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Avg Salary Increase</p>
                <p className="text-2xl font-bold text-green-600">+{path.avgSalaryIncrease}</p>
              </div>
            </div>

            {/* Stages Timeline */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Learning Journey</h4>
              <div className="relative">
                <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200"></div>
                <div className="grid grid-cols-3 gap-4 relative">
                  {path.stages.map((stage, idx) => (
                    <div key={idx} className="text-center">
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-2 relative z-10">
                        {idx + 1}
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-1">{stage.name}</h5>
                      <p className="text-sm text-gray-600">{stage.courses} courses</p>
                      <p className="text-sm text-gray-500">{stage.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Completion Rate</span>
                <span className="font-semibold text-gray-900">{path.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${path.completionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold">
                View Full Path
              </button>
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-all">
                Enroll Employees
              </button>
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-all">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Path CTA */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 p-8 text-center">
        <Rocket className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Create Custom Learning Path</h3>
        <p className="text-gray-600 mb-4">Design personalized career progression roadmaps for your teams</p>
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
          Get Started
        </button>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Analytics & Insights</h2>
          <p className="text-gray-600">Comprehensive training effectiveness metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
          <p className="text-3xl font-bold text-gray-900">94.5%</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <Trophy className="w-8 h-8 text-purple-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Completion Time</p>
          <p className="text-3xl font-bold text-gray-900">4.2 days</p>
          <p className="text-sm text-green-600 mt-1">-18% faster</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-green-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-green-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Skills Acquired</p>
          <p className="text-3xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-green-600 mt-1">+156 this quarter</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 text-orange-600" />
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Cost per Employee</p>
          <p className="text-3xl font-bold text-gray-900">RM 1,640</p>
          <p className="text-sm text-green-600 mt-1">-8% optimized</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trends */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            Completion Trends (6 Months)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 72, 78, 81, 85, 87].map((value, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${value}%` }}></div>
                <span className="text-xs text-gray-500 mt-2">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Training by Category
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Technical Skills', value: 35, color: 'blue' },
              { name: 'Leadership', value: 25, color: 'purple' },
              { name: 'Soft Skills', value: 20, color: 'green' },
              { name: 'Compliance', value: 12, color: 'orange' },
              { name: 'Other', value: 8, color: 'gray' }
            ].map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-700">{cat.name}</span>
                  <span className="font-semibold text-gray-900">{cat.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${cat.color}-500 h-2 rounded-full`}
                    style={{ width: `${cat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Training ROI Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">RM 2.4M</p>
            <p className="text-sm text-green-600 mt-1">Annual budget</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Productivity Increase</p>
            <p className="text-2xl font-bold text-gray-900">+18.5%</p>
            <p className="text-sm text-green-600 mt-1">Post-training improvement</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Estimated ROI</p>
            <p className="text-2xl font-bold text-green-600">340%</p>
            <p className="text-sm text-gray-600 mt-1">RM 8.2M value generated</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            Learning & Development
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive training, upskilling, and career development platform
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'development-programs', label: 'Development Programs', icon: Rocket },
            { id: 'upskilling', label: 'Upskilling Modules', icon: Zap },
            { id: 'skills-assessment', label: 'Skills Assessment', icon: Target },
            { id: 'learning-paths', label: 'Learning Paths', icon: MapPin },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'development-programs' && renderDevelopmentPrograms()}
        {activeTab === 'upskilling' && renderUpskilling()}
        {activeTab === 'skills-assessment' && renderSkillsAssessment()}
        {activeTab === 'learning-paths' && renderLearningPaths()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
}