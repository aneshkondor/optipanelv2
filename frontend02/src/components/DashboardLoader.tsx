import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Activity,
  Zap,
  Database,
  LineChart,
  PieChart,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function DashboardLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Phase changes
    const phaseTimer = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % 3);
    }, 1000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(phaseTimer);
    };
  }, []);

  const orbitIcons = [
    { Icon: BarChart3, color: 'from-blue-500 to-cyan-500', delay: 0, radius: 100 },
    { Icon: TrendingUp, color: 'from-green-500 to-emerald-500', delay: 0.5, radius: 100 },
    { Icon: Users, color: 'from-purple-500 to-pink-500', delay: 1, radius: 100 },
    { Icon: DollarSign, color: 'from-orange-500 to-red-500', delay: 1.5, radius: 100 },
    { Icon: Target, color: 'from-yellow-500 to-amber-500', delay: 2, radius: 100 },
    { Icon: Activity, color: 'from-indigo-500 to-violet-500', delay: 2.5, radius: 100 },
    { Icon: LineChart, color: 'from-teal-500 to-cyan-500', delay: 3, radius: 100 },
    { Icon: PieChart, color: 'from-pink-500 to-rose-500', delay: 3.5, radius: 100 },
  ];

  const dataPoints = [
    { label: 'Events', value: 'Syncing', icon: <Activity className="h-3 w-3" /> },
    { label: 'Metrics', value: 'Calculating', icon: <BarChart3 className="h-3 w-3" /> },
    { label: 'Insights', value: 'Loading', icon: <Zap className="h-3 w-3" /> },
  ];

  const loadingMessages = [
    'Initializing analytics engine...',
    'Loading your data...',
    'Preparing insights...',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rotating gradients */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-pink-500/10 via-transparent to-purple-500/10 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-primary/50 rounded-full"
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto px-4">
        {/* Main orbital animation */}
        <div className="relative w-64 h-64 mb-12">
          {/* Center core */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              type: 'spring',
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: 360,
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
              className="relative"
            >
              {/* Core glow */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur-2xl"
              />
              
              {/* Core icon */}
              <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/50 border-2 border-white/10">
                <Database className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          </motion.div>

          {/* Orbiting icons */}
          {orbitIcons.map(({ Icon, color, delay, radius }, index) => {
            const angle = (index / orbitIcons.length) * 2 * Math.PI;
            return (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 360,
                }}
                transition={{
                  scale: { delay: delay * 0.1, duration: 0.5 },
                  opacity: { delay: delay * 0.1, duration: 0.5 },
                  rotate: {
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: delay * 0.1,
                  },
                }}
                className="absolute top-1/2 left-1/2"
                style={{
                  transformOrigin: '0 0',
                }}
              >
                <motion.div
                  animate={{
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                  }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    {/* Icon glow */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                      className={`absolute inset-0 bg-gradient-to-r ${color} rounded-xl blur-lg -z-10`}
                    />
                    
                    {/* Icon container */}
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl border border-white/20`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}

          {/* Orbital rings */}
          {[1, 1.2, 1.4].map((scale, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale,
                opacity: [0.1, 0.2, 0.1],
                rotate: i % 2 === 0 ? 360 : -360,
              }}
              transition={{
                scale: { duration: 0.5, delay: i * 0.1 },
                opacity: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                },
                rotate: {
                  duration: 20 + i * 5,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
              className="absolute inset-0 border-2 border-primary/20 rounded-full"
              style={{
                width: `${100 * scale}%`,
                height: `${100 * scale}%`,
                left: `${50 - 50 * scale}%`,
                top: `${50 - 50 * scale}%`,
              }}
            />
          ))}
        </div>

        {/* Loading message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={loadingPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {loadingMessages[loadingPhase]}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full max-w-md mb-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 relative"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">Loading...</span>
            <span className="text-sm font-semibold text-primary">{progress}%</span>
          </div>
        </div>

        {/* Data points */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-md">
          {dataPoints.map((point, i) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="text-primary"
              >
                {point.icon}
              </motion.div>
              <div className="text-xs font-medium text-center">{point.label}</div>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: dot * 0.2 + i * 0.1,
                    }}
                    className="w-1 h-1 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-sm text-muted-foreground text-center"
        >
          Setting up your analytics workspace
        </motion.div>
      </div>
    </div>
  );
}
