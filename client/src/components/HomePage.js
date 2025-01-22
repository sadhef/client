import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  FaRocket, 
  FaShieldAlt, 
  FaChartLine,
  FaBolt,
  FaUsersCog,
  FaDatabase,
  FaArrowRight
} from 'react-icons/fa';

// Drone SVG Components
const DroneTypeA = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full rotate-45">
    <path 
      fill="currentColor"
      d="M12,2L14,6H10L12,2M8,7L6,11H18L16,7H8M7,12L4.5,16.5C3.8,17.5 4.1,19 5.4,19.5C6.7,20 8.1,19.5 8.5,18.5L10,15H14L15.5,18.5C15.9,19.5 17.3,20 18.6,19.5C19.9,19 20.2,17.5 19.5,16.5L17,12H7M12,17A1,1 0 0,0 11,18A1,1 0 0,0 12,19A1,1 0 0,0 13,18A1,1 0 0,0 12,17Z"
    />
  </svg>
);

const DroneTypeB = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path 
      fill="currentColor"
      d="M22 16V14L20 13.5V11.5L22 11V9L20 8.5V6.5L22 6V4L20 3.5V2H18V3.5L16 4V6L18 6.5V8.5L16 9V11L18 11.5V13.5L16 14V16L18 16.5V18H20V16.5L22 16M4 17L2 16.5V14.5L4 14V12L2 11.5V9.5L4 9V7L2 6.5V4.5L4 4V2H6V4L8 4.5V6.5L6 7V9L8 9.5V11.5L6 12V14L8 14.5V16.5L6 17V19H4V17M13 10.5L12 10L11 10.5V11.5L12 12L13 11.5V10.5Z"
    />
  </svg>
);

// Enhanced Animated Drone Component
const AnimatedDrone = ({ initialPosition, pathType, droneType = 'A', scale = 1 }) => {
  const [position, setPosition] = useState(initialPosition);
  const [rotation, setRotation] = useState(0);
  
  const pathFunction = useMemo(() => {
    switch (pathType) {
      case 'circular':
        return (time) => ({
          x: initialPosition.x + Math.cos(time / 2000) * 100,
          y: initialPosition.y + Math.sin(time / 2000) * 100
        });
      case 'figure8':
        return (time) => ({
          x: initialPosition.x + Math.sin(time / 2000) * 100,
          y: initialPosition.y + Math.sin(time / 1000) * 50
        });
      case 'patrol':
        return (time) => ({
          x: initialPosition.x + Math.sin(time / 3000) * 200,
          y: initialPosition.y + Math.cos(time / 6000) * 30
        });
      default:
        return (time) => ({
          x: initialPosition.x + Math.sin(time / 2000) * 50,
          y: initialPosition.y + Math.cos(time / 2000) * 50
        });
    }
  }, [initialPosition, pathType]);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      const time = Date.now();
      const newPosition = pathFunction(time);
      setPosition(newPosition);
      
      // Calculate rotation based on movement direction
      const angle = Math.atan2(
        newPosition.y - position.y,
        newPosition.x - position.x
      ) * (180 / Math.PI);
      setRotation(angle);
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [pathFunction, position]);

  const DroneComponent = droneType === 'A' ? DroneTypeA : DroneTypeB;

  return (
    <div 
      className="absolute transition-all duration-300"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
        width: '48px',
        height: '48px'
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 animate-pulse opacity-30 text-blue-500">
          <DroneComponent />
        </div>
        <div className="absolute inset-0 text-black">
          <DroneComponent />
        </div>
      </div>
    </div>
  );
};

// Enhanced Background Animation Container
const AnimatedBackground = () => {
  const droneConfigs = [
    { pos: { x: 100, y: 100 }, type: 'A', path: 'circular', scale: 1 },
    { pos: { x: 300, y: 200 }, type: 'B', path: 'figure8', scale: 1.2 },
    { pos: { x: 700, y: 300 }, type: 'A', path: 'patrol', scale: 0.8 },
    { pos: { x: 900, y: 150 }, type: 'B', path: 'circular', scale: 1.1 },
    { pos: { x: 500, y: 400 }, type: 'A', path: 'figure8', scale: 0.9 }
  ];

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(v => !v);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/Background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '1'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, 0.2) 25%, rgba(0, 0, 0, 0.2) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.2) 75%, rgba(0, 0, 0, 0.2) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, 0.2) 25%, rgba(0, 0, 0, 0.2) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.2) 75%, rgba(0, 0, 0, 0.2) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}
      />

      {droneConfigs.map((config, index) => (
        <div key={index} className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <AnimatedDrone
            initialPosition={config.pos}
            droneType={config.type}
            pathType={config.path}
            scale={config.scale}
          />
        </div>
      ))}
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group bg-white/95 backdrop-blur-lg rounded-xl p-8 shadow-lg 
                  hover:shadow-xl transition-all duration-500 hover:scale-[1.02] 
                  border border-gray-100">
    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6 
                    shadow-lg group-hover:scale-110 transition-all duration-500">
      <Icon className="text-2xl text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-black 
                   transition-colors duration-300">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <div className="mt-4 flex items-center text-black font-medium opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300">
      Learn more <FaArrowRight className="ml-2" />
    </div>
  </div>
);

const HomePage = () => {
  const history = useHistory();

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Navigation/Logo Area with backdrop blur */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg">
          <img 
            src="/Greenjets.webp" 
            alt="Greenjets Logo" 
            className="h-12 mx-auto"
          />
        </div>

        {/* Hero Section with enhanced backdrop blur */}
        <div className="relative py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl inline-block mb-8 
                          shadow-xl transition-all duration-500 hover:shadow-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 tracking-tight">
                Welcome to{' '}
                <span className="relative inline-block">
                  <span className="text-black">
                    BladeRunner
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-black rounded-full 
                                opacity-50 animate-pulse" />
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Your comprehensive engine analysis solution with advanced monitoring capabilities.
              </p>

              <div className="flex flex-wrap gap-6 justify-center">
                <button
                  onClick={() => history.push('/login')}
                  className="px-8 py-4 bg-black text-white rounded-xl font-semibold 
                           min-w-[160px] shadow-lg hover:bg-gray-900 transition-all 
                           duration-300 hover:scale-105 flex items-center justify-center 
                           gap-2 group"
                >
                  Get Started
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => history.push('/signup')}
                  className="px-8 py-4 bg-white text-black rounded-xl font-semibold 
                           min-w-[160px] hover:bg-gray-50 transition-all duration-300 
                           border-2 border-black hover:scale-105"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 relative bg-white/80 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <span className="text-gray-600 font-semibold text-lg block mb-4">
                Powerful Features
              </span>
              <h2 className="text-4xl font-bold text-black mb-6">
                Advanced Analysis Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience advanced engine analysis with our comprehensive suite of tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={FaRocket}
                title="High Performance"
                description="Advanced analysis tools delivering optimal results in real-time"
              />
              <FeatureCard
                icon={FaShieldAlt}
                title="Secure Access"
                description="Enterprise-grade security with protected data and authentication"
              />
              <FeatureCard
                icon={FaChartLine}
                title="Real-time Analytics"
                description="Live monitoring and visualization of critical engine parameters"
              />
              <FeatureCard
                icon={FaBolt}
                title="Fast Processing"
                description="Lightning-fast data processing and analysis capabilities"
              />
              <FeatureCard
                icon={FaUsersCog}
                title="User Management"
                description="Comprehensive user control and permission management"
              />
              <FeatureCard
                icon={FaDatabase}
                title="Data Storage"
                description="Secure and efficient storage of all your engine data"
              />
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-black/90 backdrop-blur-lg rounded-3xl p-16 relative overflow-hidden
                          shadow-2xl transform hover:scale-[1.01] transition-all duration-500">
              <div className="relative z-10 text-center">
                <span className="text-gray-300 font-semibold text-lg block mb-4">
                  Get Started Today
                </span>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to transform your analysis?
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Join thousands of users who trust BladeRunner for their engine analysis needs
                </p>
                <div className="flex flex-wrap gap-6 justify-center">
                  <button
                    onClick={() => history.push('/login')}
                    className="px-8 py-4 bg-white text-black rounded-xl font-semibold 
                             hover:bg-gray-100 transition-all duration-300 shadow-lg
                             hover:scale-105 min-w-[180px]"
                  >
                    Get Started Now
                  </button>
                  <button
                    onClick={() => history.push('/admin-login')}
                    className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold 
                             hover:bg-gray-700 transition-all duration-300 
                             flex items-center justify-center gap-2 hover:scale-105
                             shadow-lg min-w-[180px] border border-gray-700"
                  >
                    <FaShieldAlt />
                    Admin Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200 bg-white/90 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-gray-600 hover:text-gray-900 transition-colors 
                          duration-300 text-center">
              <p>© {new Date().getFullYear()} BladeRunner. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;