import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Calendar, 
  Brain,
  Filter,
  FileText,
  Share2,
  Eye,
  Target,
  DollarSign,
  Clock,
  Award,
  TrendingDown,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Treemap,
  Funnel,
  FunnelChart,
  LabelList
} from 'recharts';

export function ReportsAnalytics() {
  const [reportType, setReportType] = useState('overview');

  // Headcount Trend
  const headcountTrend = [
    { month: 'Jan', headcount: 220, newHires: 8, terminations: 3, contractors: 15 },
    { month: 'Feb', headcount: 225, newHires: 10, terminations: 5, contractors: 18 },
    { month: 'Mar', headcount: 232, newHires: 12, terminations: 5, contractors: 20 },
    { month: 'Apr', headcount: 238, newHires: 9, terminations: 3, contractors: 22 },
    { month: 'May', headcount: 242, newHires: 11, terminations: 7, contractors: 19 },
    { month: 'Jun', headcount: 247, newHires: 13, terminations: 8, contractors: 21 },
  ];

  // Turnover Analysis
  const turnoverData = [
    { quarter: 'Q1 2023', rate: 8.2, voluntary: 6.5, involuntary: 1.7 },
    { quarter: 'Q2 2023', rate: 7.5, voluntary: 5.8, involuntary: 1.7 },
    { quarter: 'Q3 2023', rate: 6.8, voluntary: 5.2, involuntary: 1.6 },
    { quarter: 'Q4 2023', rate: 5.9, voluntary: 4.5, involuntary: 1.4 },
    { quarter: 'Q1 2024', rate: 5.2, voluntary: 4.0, involuntary: 1.2 },
    { quarter: 'Q2 2024', rate: 4.2, voluntary: 3.2, involuntary: 1.0 },
  ];

  // Department Performance
  const departmentPerformance = [
    { department: 'Engineering', productivity: 92, satisfaction: 88, retention: 95 },
    { department: 'Sales', productivity: 87, satisfaction: 82, retention: 88 },
    { department: 'Marketing', productivity: 85, satisfaction: 86, retention: 92 },
    { department: 'Operations', productivity: 90, satisfaction: 84, retention: 90 },
    { department: 'HR', productivity: 88, satisfaction: 90, retention: 96 },
    { department: 'Finance', productivity: 89, satisfaction: 87, retention: 94 },
  ];

  // Age & Tenure Distribution
  const ageDistribution = [
    { range: '20-29', value: 62 },
    { range: '30-39', value: 98 },
    { range: '40-49', value: 65 },
    { range: '50-59', value: 18 },
    { range: '60+', value: 4 },
  ];

  const tenureDistribution = [
    { range: '0-1 year', value: 45 },
    { range: '1-3 years', value: 78 },
    { range: '3-5 years', value: 64 },
    { range: '5-10 years', value: 42 },
    { range: '10+ years', value: 18 },
  ];

  // Compensation Analysis
  const compensationTrend = [
    { month: 'Jan', avgSalary: 7850, median: 7200, benefits: 1200 },
    { month: 'Feb', avgSalary: 7920, median: 7280, benefits: 1220 },
    { month: 'Mar', avgSalary: 8050, median: 7350, benefits: 1240 },
    { month: 'Apr', avgSalary: 8180, median: 7420, benefits: 1260 },
    { month: 'May', avgSalary: 8320, median: 7500, benefits: 1280 },
    { month: 'Jun', avgSalary: 8450, median: 7580, benefits: 1300 },
  ];

  // Recruitment Funnel
  const recruitmentFunnel = [
    { name: 'Applications', value: 1250, fill: '#8B5CF6' },
    { name: 'Screening', value: 480, fill: '#A855F7' },
    { name: 'Interviews', value: 156, fill: '#C084FC' },
    { name: 'Offers', value: 68, fill: '#D8B4FE' },
    { name: 'Hired', value: 52, fill: '#E9D5FF' },
  ];

  // Training ROI
  const trainingROIData = [
    { category: 'Technical', investment: 180000, productivity: 92, roi: 245 },
    { category: 'Leadership', investment: 125000, productivity: 88, roi: 198 },
    { category: 'Soft Skills', investment: 95000, productivity: 85, roi: 165 },
    { category: 'Compliance', investment: 68000, productivity: 78, roi: 142 },
  ];

  // Performance Distribution
  const performanceDistribution = [
    { rating: 'Outstanding', value: 18 },
    { rating: 'Exceeds', value: 32 },
    { rating: 'Meets', value: 58 },
    { rating: 'Needs Improvement', value: 10 },
    { rating: 'Unsatisfactory', value: 2 },
  ];

  // Diversity Metrics
  const diversityData = [
    { name: 'Male', value: 152 },
    { name: 'Female', value: 95 },
  ];

  // Department Headcount Treemap
  const departmentTreemap = [
    { name: 'Engineering', size: 85, children: [] },
    { name: 'Sales', size: 62, children: [] },
    { name: 'Operations', size: 42, children: [] },
    { name: 'Marketing', size: 38, children: [] },
    { name: 'HR', size: 20, children: [] },
  ];

  // Productivity vs Satisfaction Scatter
  const productivitySatisfactionData = [
    { productivity: 92, satisfaction: 88, department: 'Engineering' },
    { productivity: 87, satisfaction: 82, department: 'Sales' },
    { productivity: 85, satisfaction: 86, department: 'Marketing' },
    { productivity: 90, satisfaction: 84, department: 'Operations' },
    { productivity: 88, satisfaction: 90, department: 'HR' },
    { productivity: 89, satisfaction: 87, department: 'Finance' },
  ];

  // Skills Assessment Radar
  const skillsAssessmentData = [
    { skill: 'Technical', current: 85, target: 90, industry: 82 },
    { skill: 'Leadership', current: 78, target: 85, industry: 75 },
    { skill: 'Communication', current: 88, target: 90, industry: 80 },
    { skill: 'Problem Solving', current: 82, target: 88, industry: 78 },
    { skill: 'Collaboration', current: 90, target: 92, industry: 85 },
    { skill: 'Innovation', current: 75, target: 85, industry: 72 },
  ];

  // Radial Performance
  const radialPerformanceData = [
    { name: 'Engagement', value: 87, fill: '#8B5CF6' },
    { name: 'Productivity', value: 90, fill: '#EC4899' },
    { name: 'Quality', value: 85, fill: '#10B981' },
    { name: 'Innovation', value: 78, fill: '#F59E0B' },
  ];

  const aiPredictions = [
    {
      title: 'Hiring Forecast',
      prediction: '15-18 new hires needed in Q3 2024',
      confidence: '87%',
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-100 to-cyan-100'
    },
    {
      title: 'Turnover Risk',
      prediction: 'Low risk detected (3.8% predicted)',
      confidence: '92%',
      icon: TrendingDown,
      color: 'green',
      gradient: 'from-green-100 to-emerald-100'
    },
    {
      title: 'Leave Pattern',
      prediction: 'Peak leave period expected in August',
      confidence: '84%',
      icon: Calendar,
      color: 'orange',
      gradient: 'from-orange-100 to-amber-100'
    },
    {
      title: 'Training Needs',
      prediction: 'AI/ML skills gap requires attention',
      confidence: '89%',
      icon: Brain,
      color: 'purple',
      gradient: 'from-purple-100 to-violet-100'
    },
  ];

  const keyMetrics = [
    { label: 'Employee Retention', value: '95.8%', change: '+2.3%', trend: 'up', icon: Users },
    { label: 'Time to Hire', value: '28 days', change: '-5 days', trend: 'down', icon: Clock },
    { label: 'Training Hours', value: '42 hrs', change: '+8 hrs', trend: 'up', icon: Award },
    { label: 'Satisfaction Score', value: '4.2/5', change: '+0.3', trend: 'up', icon: Activity },
    { label: 'Cost per Hire', value: 'RM 8,450', change: '-12%', trend: 'down', icon: DollarSign },
    { label: 'Productivity Index', value: '89.5', change: '+4.2', trend: 'up', icon: Target },
  ];

  const COLORS = {
    primary: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
    gradient: ['#EC4899', '#F472B6', '#FB7185', '#FDA4AF', '#FECDD3'],
  };

  const CustomContent = (props: any) => {
    const { x, y, width, height, index, name, size } = props;
    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: '#fff',
            strokeWidth: 2,
          }}
        />
        {width > 50 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 7}
              textAnchor="middle"
              fill="#fff"
              fontSize={14}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
            >
              {size}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive HR insights and predictive analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'workforce', label: 'Workforce', icon: Users },
            { id: 'performance', label: 'Performance', icon: Target },
            { id: 'compensation', label: 'Compensation', icon: DollarSign },
            { id: 'training', label: 'Training ROI', icon: Award },
          ].map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  reportType === type.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <Icon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex items-center gap-2">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                )}
                <span className="text-sm font-semibold text-green-600">{metric.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analytics */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Headcount Trend</h3>
              <ComposedChart
                width={500}
                height={300}
                data={headcountTrend}
                margin={{
                  top: 20, right: 20, bottom: 20, left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="newHires" fill="#10B981" />
                <Bar dataKey="terminations" fill="#EF4444" />
                <Line type="monotone" dataKey="headcount" stroke="#8B5CF6" />
              </ComposedChart>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Turnover Analysis</h3>
              <AreaChart
                width={500}
                height={300}
                data={turnoverData}
                margin={{
                  top: 20, right: 20, bottom: 20, left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="voluntary" stackId="1" fill="#F59E0B" />
                <Area type="monotone" dataKey="involuntary" stackId="1" fill="#EF4444" />
              </AreaChart>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Age Distribution</h3>
              <PieChart width={400} height={400}>
                <Pie
                  data={ageDistribution}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {ageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tenure Distribution</h3>
              <PieChart width={400} height={400}>
                <Pie
                  data={tenureDistribution}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {tenureDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.gradient[index % COLORS.gradient.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Gender Diversity</h3>
              <PieChart width={400} height={400}>
                <Pie
                  data={diversityData}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {diversityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8B5CF6', '#EC4899'][index % 2]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>

          {/* Row 3 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Department Performance Comparison</h3>
            <BarChart
              width={500}
              height={350}
              data={departmentPerformance}
              margin={{
                top: 20, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="productivity" fill="#8B5CF6" />
              <Bar dataKey="satisfaction" fill="#10B981" />
              <Bar dataKey="retention" fill="#F59E0B" />
            </BarChart>
          </div>
        </div>
      )}

      {reportType === 'workforce' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Department Headcount</h3>
              <Treemap
                data={departmentTreemap}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomContent />}
              />
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recruitment Funnel</h3>
              <FunnelChart
                width={500}
                height={350}
                data={recruitmentFunnel}
                isAnimationActive={false}
              >
                <Funnel
                  dataKey="value"
                  isAnimationActive={false}
                />
                <LabelList
                  dataKey="name"
                  position="right"
                  fill="#000"
                />
              </FunnelChart>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Department Performance Matrix</h3>
            <ScatterChart
              width={500}
              height={350}
              margin={{
                top: 20, right: 20, bottom: 20, left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="productivity" name="Productivity" />
              <YAxis type="number" dataKey="satisfaction" name="Satisfaction" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter
                name="A school"
                data={productivitySatisfactionData}
                fill="#8B5CF6"
              />
            </ScatterChart>
          </div>
        </div>
      )}

      {reportType === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Assessment</h3>
              <RadarChart
                cx={300}
                cy={250}
                outerRadius={150}
                width={500}
                height={500}
                data={skillsAssessmentData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Industry Avg"
                  dataKey="industry"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Distribution</h3>
              <BarChart
                width={500}
                height={350}
                data={performanceDistribution}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Performance Indicators</h3>
            <RadialBarChart
              width={500}
              height={350}
              cx={250}
              cy={150}
              innerRadius={20}
              outerRadius={140}
              barSize={10}
              data={radialPerformanceData}
            >
              <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                clockWise
                dataKey="value"
              />
              <Legend iconSize={10} width={120} height={140} layout="vertical" />
              <Tooltip />
            </RadialBarChart>
          </div>
        </div>
      )}

      {reportType === 'compensation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Compensation Trends</h3>
            <LineChart
              width={500}
              height={400}
              data={compensationTrend}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgSalary" stroke="#8B5CF6" />
              <Line type="monotone" dataKey="median" stroke="#10B981" />
              <Line type="monotone" dataKey="benefits" stroke="#F59E0B" />
            </LineChart>
          </div>
        </div>
      )}

      {reportType === 'training' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Training Investment vs ROI</h3>
            <ComposedChart
              width={500}
              height={400}
              data={trainingROIData}
              margin={{
                top: 20, right: 20, bottom: 20, left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="investment" fill="#8B5CF6" />
              <Line type="monotone" dataKey="roi" stroke="#10B981" />
              <Line type="monotone" dataKey="productivity" stroke="#F59E0B" />
            </ComposedChart>
          </div>
        </div>
      )}

      {/* AI Predictions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Predictions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiPredictions.map((pred, index) => {
            const Icon = pred.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${pred.gradient} border-2 border-gray-200 rounded-xl p-6`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{pred.title}</h3>
                    <p className="text-sm text-gray-600">{pred.prediction}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Confidence</span>
                  <span className="text-sm font-bold text-purple-600">{pred.confidence}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}