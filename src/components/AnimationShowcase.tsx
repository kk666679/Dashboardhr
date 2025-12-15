import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  Star,
  Heart,
  TrendingUp,
  Award,
  Target,
  Rocket,
} from 'lucide-react';
import {
  GlassmorphicCard,
  AnimatedCounter,
  FloatingElement,
  PulseElement,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  RotateIn,
  GlassButton,
  GlassInput,
  ParallaxCard,
} from './GlassmorphicCard';

export function AnimationShowcase() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl"
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

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <SlideIn direction="down">
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Animation & Glassmorphism Showcase
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore Motion animations and glassmorphic design elements
            </motion.p>
          </div>
        </SlideIn>

        {/* Counter Animation */}
        <SlideIn direction="up" delay={0.2}>
          <GlassmorphicCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Animated Counters
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Employees', value: 247, icon: '👥' },
                  { label: 'Revenue', value: 125000, icon: '💰', prefix: 'RM ' },
                  { label: 'Growth', value: 42, icon: '📈', suffix: '%' },
                  { label: 'Projects', value: 156, icon: '🎯' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter
                        value={item.value}
                        duration={2}
                        prefix={item.prefix}
                        suffix={item.suffix}
                      />
                    </div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Floating & Pulse Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SlideIn direction="left" delay={0.3}>
            <GlassmorphicCard>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  Floating Elements
                </h2>
                <div className="flex justify-around items-center h-40">
                  {[Sparkles, Star, Heart, Award].map((Icon, index) => (
                    <FloatingElement
                      key={index}
                      delay={index * 0.3}
                      duration={3}
                      yOffset={15}
                    >
                      <Icon className="w-12 h-12 text-purple-600" />
                    </FloatingElement>
                  ))}
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>

          <SlideIn direction="right" delay={0.3}>
            <GlassmorphicCard>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-pink-600" />
                  Pulse Elements
                </h2>
                <div className="flex justify-around items-center h-40">
                  {[Rocket, Target, Award, TrendingUp].map((Icon, index) => (
                    <PulseElement key={index} delay={index * 0.3} duration={2}>
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </PulseElement>
                  ))}
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>
        </div>

        {/* Stagger Animation */}
        <SlideIn direction="up" delay={0.4}>
          <GlassmorphicCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Stagger Animation
              </h2>
              <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <StaggerItem key={item}>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {item}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Glass Buttons */}
        <SlideIn direction="up" delay={0.5}>
          <GlassmorphicCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Glass Buttons
              </h2>
              <div className="flex flex-wrap gap-4">
                <GlassButton variant="primary">Primary Button</GlassButton>
                <GlassButton variant="secondary">Secondary Button</GlassButton>
                <GlassButton variant="success">Success Button</GlassButton>
                <GlassButton variant="danger">Danger Button</GlassButton>
                <GlassButton variant="primary" size="sm">
                  Small
                </GlassButton>
                <GlassButton variant="primary" size="lg">
                  Large Button
                </GlassButton>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Glass Input */}
        <SlideIn direction="up" delay={0.6}>
          <GlassmorphicCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Glass Input
              </h2>
              <div className="space-y-4 max-w-md">
                <GlassInput
                  value={inputValue}
                  onChange={setInputValue}
                  placeholder="Enter text here..."
                  icon={<Sparkles className="w-5 h-5" />}
                />
                <GlassInput
                  value=""
                  onChange={() => {}}
                  placeholder="Email address..."
                  type="email"
                />
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Parallax Cards */}
        <SlideIn direction="up" delay={0.7}>
          <GlassmorphicCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                3D Parallax Cards (Hover to interact)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Design', icon: '🎨', color: 'from-purple-500 to-pink-500' },
                  { title: 'Develop', icon: '💻', color: 'from-blue-500 to-cyan-500' },
                  { title: 'Deploy', icon: '🚀', color: 'from-green-500 to-emerald-500' },
                ].map((item, index) => (
                  <ParallaxCard key={index}>
                    <div
                      className={`bg-gradient-to-br ${item.color} rounded-xl p-8 text-white text-center`}
                    >
                      <div className="text-6xl mb-4">{item.icon}</div>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                    </div>
                  </ParallaxCard>
                ))}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Slide & Rotate Animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SlideIn direction="left" delay={0.8}>
            <GlassmorphicCard>
              <div className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900">Slide Left</h3>
              </div>
            </GlassmorphicCard>
          </SlideIn>

          <SlideIn direction="right" delay={0.9}>
            <GlassmorphicCard>
              <div className="p-6 text-center">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900">Slide Right</h3>
              </div>
            </GlassmorphicCard>
          </SlideIn>

          <SlideIn direction="up" delay={1.0}>
            <GlassmorphicCard>
              <div className="p-6 text-center">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900">Slide Up</h3>
              </div>
            </GlassmorphicCard>
          </SlideIn>

          <RotateIn delay={1.1}>
            <GlassmorphicCard>
              <div className="p-6 text-center">
                <Rocket className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900">Rotate In</h3>
              </div>
            </GlassmorphicCard>
          </RotateIn>
        </div>

        {/* Interactive Hover Effects */}
        <SlideIn direction="up" delay={1.2}>
          <GlassmorphicCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Interactive Hover Effects
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Scale', color: 'purple' },
                  { label: 'Rotate', color: 'blue' },
                  { label: 'Shake', color: 'pink' },
                  { label: 'Bounce', color: 'green' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 backdrop-blur-sm rounded-xl p-6 text-center cursor-pointer`}
                    whileHover={{
                      scale: item.label === 'Scale' ? 1.1 : 1,
                      rotate: item.label === 'Rotate' ? 360 : 0,
                      x: item.label === 'Shake' ? [0, -10, 10, -10, 10, 0] : 0,
                      y: item.label === 'Bounce' ? [0, -20, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-2xl font-bold text-gray-900">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>
    </div>
  );
}
