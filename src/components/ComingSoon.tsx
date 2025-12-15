import React from 'react';
import { Sparkles, Rocket, GraduationCap, Target, Users } from 'lucide-react';

interface ComingSoonProps {
  module: string;
}

const moduleDetails: Record<string, {
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
}> = {
  'Talent Acquisition': {
    title: 'Talent Acquisition Suite',
    description: 'AI-powered recruitment and hiring platform with Malaysian context understanding',
    icon: Users,
    features: [
      'Resume parsing with Bahasa Malaysia support',
      'AI-powered candidate screening',
      'Interview analytics & bias detection',
      'Integration with JobStreet & LinkedIn',
      'Automated employment pass processing',
      'MYWorkID verification',
      'Bumiputera hiring compliance tracking',
      'Cultural fit analysis for Malaysian workplace'
    ]
  },
  'Learning & Development': {
    title: 'Learning & Development Platform',
    description: 'Comprehensive training management with HRDF integration and AI-powered learning paths',
    icon: GraduationCap,
    features: [
      'Skills gap identification engine',
      'Personalized learning path creation',
      'Micro-learning recommendations',
      'HRDF claim automation',
      'Training ROI prediction',
      'Certification tracking & expiry alerts',
      'AR/VR competency simulations',
      'Skill Malaysia recognition'
    ]
  },
  'Performance Management': {
    title: 'Performance Management System',
    description: 'AI-enhanced performance tracking with OKR management and bias detection',
    icon: Target,
    features: [
      'OKR tracking with predictive analytics',
      '360° feedback sentiment analysis',
      'Performance-potential matrix (9-box grid)',
      'Career path simulation engine',
      'Bias detection in evaluations',
      'MSC Malaysia performance standards',
      'GLC transformation initiative alignment',
      'Continuous feedback system'
    ]
  }
};

export function ComingSoon({ module }: ComingSoonProps) {
  const details = moduleDetails[module] || {
    title: module,
    description: 'This feature is under development and will be available soon.',
    icon: Rocket,
    features: []
  };

  const Icon = details.icon;

  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-center max-w-2xl px-6">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Icon className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-gray-900 mb-4">{details.title}</h1>
        <p className="text-gray-500 mb-8">{details.description}</p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full mb-8">
          <Sparkles className="w-5 h-5" />
          <span>Coming Soon</span>
        </div>

        {/* Features */}
        {details.features && details.features.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-gray-900 mb-4">Planned Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {details.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Notify Me When Ready
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            View Roadmap
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-gray-400 mt-8">
          Expected release: Q3 2025 • Part of AI-HRMS Premium Features
        </p>
      </div>
    </div>
  );
}