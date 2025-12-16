'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Target,
  Award,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  Star,
  Play,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Brain,
  Zap,
  Trophy,
  Activity,
  UserCheck,
  Briefcase,
  Share2,
  MessageSquare,
  ArrowRight,
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

type ViewMode = 'dashboard' | 'courses' | 'employees' | 'certifications' | 'analytics';

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled: number;
  completed: number;
  rating: number;
  type: 'Video' | 'Reading' | 'Interactive' | 'Workshop';
  status: 'active' | 'draft' | 'archived';
  thumbnail: string;
  skills: string[];
}

interface EmployeeProgress {
  id: string;
  name: string;
  department: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  certificationsEarned: number;
  hoursLearned: number;
  averageScore: number;
  currentCourses: string[];
  skillsAcquired: string[];
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  category: string;
  validityPeriod: string;
  employeesEarned: number;
  icon: string;
}

export function LearningDevelopment() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Advanced React & TypeScript',
      category: 'Technical',
      instructor: 'Ahmad Zulkifli',
      duration: '12 hours',
      level: 'Advanced',
      enrolled: 45,
      completed: 32,
      rating: 4.8,
      type: 'Video',
      status: 'active',
      thumbnail: '🎯',
      skills: ['React', 'TypeScript', 'Hooks'],
    },
    {
      id: '2',
      title: 'Leadership Excellence Program',
      category: 'Leadership',
      instructor: 'Dr. Siti Aminah',
      duration: '20 hours',
      level: 'Intermediate',
      enrolled: 28,
      completed: 15,
      rating: 4.9,
      type: 'Workshop',
      status: 'active',
      thumbnail: '👑',
      skills: ['Leadership', 'Communication', 'Strategy'],
    },
    {
      id: '3',
      title: 'Data Analytics Fundamentals',
      category: 'Technical',
      instructor: 'Raj Kumar',
      duration: '15 hours',
      level: 'Beginner',
      enrolled: 52,
      completed: 40,
      rating: 4.7,
      type: 'Interactive',
      status: 'active',
      thumbnail: '📊',
      skills: ['Data Analysis', 'Excel', 'SQL'],
    },
    {
      id: '4',
      title: 'Effective Communication in Bahasa Malaysia',
      category: 'Soft Skills',
      instructor: 'Nurul Huda',
      duration: '8 hours',
      level: 'Intermediate',
      enrolled: 35,
      completed: 28,
      rating: 4.6,
      type: 'Video',
      status: 'active',
      thumbnail: '💬',
      skills: ['Communication', 'Bahasa Malaysia', 'Presentation'],
    },
    {
      id: '5',
      title: 'Malaysian Employment Law & Compliance',
      category: 'Compliance',
      instructor: 'Lee Wei Ming',
      duration: '10 hours',
      level: 'Intermediate',
      enrolled: 42,
      completed: 38,
      rating: 4.9,
      type: 'Reading',
      status: 'active',
      thumbnail: '⚖️',
      skills: ['Employment Act', 'Compliance', 'HR Law'],
    },
    {
      id: '6',
      title: 'Agile Project Management',
      category: 'Management',
      instructor: 'David Tan',
      duration: '18 hours',
      level: 'Advanced',
      enrolled: 30,
      completed: 20,
      rating: 4.8,
      type: 'Workshop',
      status: 'active',
      thumbnail: '🚀',
      skills: ['Agile', 'Scrum', 'Project Management'],
    },
  ];

  const employeeProgress: EmployeeProgress[] = [
    {
      id: '1',
      name: 'Ahmad Syafiq bin Hassan',
      department: 'Engineering',
      coursesEnrolled: 5,
      coursesCompleted: 3,
      certificationsEarned: 2,
      hoursLearned: 45,
      averageScore: 92,
      currentCourses: ['Advanced React & TypeScript', 'Agile Project Management'],
      skillsAcquired: ['React', 'TypeScript', 'Leadership', 'Agile'],
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      department: 'Sales',
      coursesEnrolled: 4,
      coursesCompleted: 4,
      certificationsEarned: 3,
      hoursLearned: 38,
      averageScore: 95,
      currentCourses: [],
      skillsAcquired: ['Leadership', 'Communication', 'Sales Strategy'],
    },
    {
      id: '3',
      name: 'Raj Kumar Patel',
      department: 'Marketing',
      coursesEnrolled: 3,
      coursesCompleted: 2,
      certificationsEarned: 1,
      hoursLearned: 28,
      averageScore: 88,
      currentCourses: ['Data Analytics Fundamentals'],
      skillsAcquired: ['Data Analysis', 'Marketing'],
    },
    {
      id: '4',
      name: 'Lee Mei Ling',
      department: 'HR',
      coursesEnrolled: 6,
      coursesCompleted: 5,
      certificationsEarned: 4,
      hoursLearned: 52,
      averageScore: 94,
      currentCourses: ['Malaysian Employment Law & Compliance'],
      skillsAcquired: ['HR Law', 'Compliance', 'Leadership', 'Communication'],
    },
  ];

  const certifications: Certification[] = [
    {
      id: '1',
      name: 'Certified Agile Practitioner',
      issuer: 'International Agile Institute',
      category: 'Project Management',
      validityPeriod: '3 years',
      employeesEarned: 12,
      icon: '🏆',
    },
    {
      id: '2',
      name: 'Malaysian HR Compliance Specialist',
      issuer: 'Malaysia HR Institute',
      category: 'Compliance',
      validityPeriod: '2 years',
      employeesEarned: 8,
      icon: '⚖️',
    },
    {
      id: '3',
      name: 'Advanced Data Analytics Certificate',
      issuer: 'Data Science Academy',
      category: 'Technical',
      validityPeriod: 'Lifetime',
      employeesEarned: 15,
      icon: '📊',
    },
    {
      id: '4',
      name: 'Leadership Excellence Certification',
      issuer: 'Asia Leadership Center',
      category: 'Leadership',
      validityPeriod: '5 years',
      employeesEarned: 10,
      icon: '👑',
    },
  ];

  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrolled, 0);
  const averageCompletion = Math.round(
    (courses.reduce((sum, c) => sum + c.completed, 0) / totalEnrollments) * 100
  );
  const totalCertifications = certifications.reduce((sum, c) => sum + c.employeesEarned, 0);

  const stats = [
    {
      label: 'Active Courses',
      value: totalCourses,
      change: '+2 this month',
      icon: BookOpen,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Total Enrollments',
      value: totalEnrollments,
      change: '+18% this quarter',
      icon: Users,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
    {
      label: 'Completion Rate',
      value: averageCompletion,
      suffix: '%',
      change: '+5% vs last month',
      icon: Target,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Certifications Earned',
      value: totalCertifications,
      change: '+12 this quarter',
      icon: Award,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
  ];

  const categoryDistributionData = [
    { name: 'Technical', value: courses.filter(c => c.category === 'Technical').length },
    { name: 'Leadership', value: courses.filter(c => c.category === 'Leadership').length },
    { name: 'Soft Skills', value: courses.filter(c => c.category === 'Soft Skills').length },
    { name: 'Compliance', value: courses.filter(c => c.category === 'Compliance').length },
    { name: 'Management', value: courses.filter(c => c.category === 'Management').length },
  ];

  const monthlyEnrollmentData = [
    { month: 'Jul', enrollments: 45, completions: 32 },
    { month: 'Aug', enrollments: 52, completions: 40 },
    { month: 'Sep', enrollments: 48, completions: 38 },
    { month: 'Oct', enrollments: 58, completions: 45 },
    { month: 'Nov', enrollments: 62, completions: 50 },
    { month: 'Dec', enrollments: totalEnrollments, completions: courses.reduce((sum, c) => sum + c.completed, 0) },
  ];

  const skillsDevelopmentData = [
    { skill: 'React', employees: 15 },
    { skill: 'Leadership', employees: 22 },
    { skill: 'Data Analysis', employees: 18 },
    { skill: 'Communication', employees: 25 },
    { skill: 'Agile', employees: 12 },
  ];

  const learningPathData = [
    { category: 'Technical', score: 85 },
    { category: 'Leadership', score: 78 },
    { category: 'Soft Skills', score: 82 },
    { category: 'Compliance', score: 92 },
    { category: 'Management', score: 75 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

      {/* AI Learning Features */}
      <SlideIn direction="up" delay={0.2}>
        <GlassmorphicCard gradient="from-blue-500/10 to-cyan-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">AI-Powered Learning Platform</h4>
                <p className="text-sm text-blue-700">
                  Personalized learning paths, skill gap analysis, and intelligent course recommendations
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-900">Smart Recommendations</p>
                <p className="text-xs text-gray-600">AI-powered</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-900">Skill Gap Analysis</p>
                <p className="text-xs text-gray-600">Auto-detect</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-900">Progress Tracking</p>
                <p className="text-xs text-gray-600">Real-time</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                <Award className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-900">Certifications</p>
                <p className="text-xs text-gray-600">Verified</p>
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Categories</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryDistributionData.map((entry, index) => (
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

        <SlideIn direction="right" delay={0.3}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Trends</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <LineChart data={monthlyEnrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="enrollments" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
                    <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="left" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Skills Developed</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <BarChart data={skillsDevelopmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#6B7280" />
                    <YAxis type="category" dataKey="skill" stroke="#6B7280" width={100} />
                    <Tooltip />
                    <Bar dataKey="employees" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Path Performance</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <RadarChart data={learningPathData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="category" stroke="#6B7280" />
                    <PolarRadiusAxis stroke="#6B7280" />
                    <Radar name="Performance" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>

      {/* Featured Courses */}
      <SlideIn direction="up" delay={0.5}>
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Featured Courses</h3>
              <button
                onClick={() => setViewMode('courses')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 3).map((course, index) => (
                <div
                  key={course.id}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-blue-300 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-4xl mb-3">{course.thumbnail}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{course.rating}</span>
                    </div>
                    <span className="text-gray-600">{course.duration}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className="text-xs text-gray-600">{course.enrolled} enrolled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Course Library</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <GlassInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search courses..."
            icon={<Search className="w-5 h-5" />}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Leadership">Leadership</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Compliance">Compliance</option>
            <option value="Management">Management</option>
          </select>
          <GlassButton variant="primary" onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course, index) => (
          <div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-5xl">{course.thumbnail}</div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{course.enrolled} enrolled</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((course.completed / course.enrolled) * 100)}% completed
                    </span>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Employee Learning Progress</h3>

      <div className="grid grid-cols-1 gap-4">
        {employeeProgress.map((employee, index) => (
          <div
            key={employee.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{employee.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{employee.department}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Courses</p>
                          <p className="font-semibold text-gray-900">
                            {employee.coursesCompleted}/{employee.coursesEnrolled}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Certifications</p>
                          <p className="font-semibold text-gray-900">{employee.certificationsEarned}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Hours Learned</p>
                          <p className="font-semibold text-gray-900">{employee.hoursLearned}h</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg Score</p>
                          <p className="font-semibold text-green-600">{employee.averageScore}%</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Skills Acquired:</p>
                        <div className="flex flex-wrap gap-2">
                          {employee.skillsAcquired.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      {employee.currentCourses.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Current Courses:</p>
                          <div className="flex flex-wrap gap-2">
                            {employee.currentCourses.map((course, idx) => (
                              <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Trophy className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
        <GlassButton variant="primary" onClick={() => {}}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{cert.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{cert.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{cert.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{cert.validityPeriod}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {cert.employeesEarned} employees earned
                        </span>
                      </div>
                      <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5 text-gray-600" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Learning & Development
              </motion.h1>
              <p className="text-gray-600 mt-2">Empower your team with continuous learning</p>
            </div>
          </div>
        </SlideIn>

        {/* Navigation Tabs */}
        <SlideIn direction="down" delay={0.1}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                  { id: 'courses', name: 'Courses', icon: BookOpen },
                  { id: 'employees', name: 'Employee Progress', icon: Users },
                  { id: 'certifications', name: 'Certifications', icon: Award },
                  { id: 'analytics', name: 'Analytics', icon: TrendingUp },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
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
            {viewMode === 'courses' && renderCourses()}
            {viewMode === 'employees' && renderEmployees()}
            {viewMode === 'certifications' && renderCertifications()}
            {viewMode === 'analytics' && renderDashboard()}
          </div>
      </div>
    </div>
  );
}
