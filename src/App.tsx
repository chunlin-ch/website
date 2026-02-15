import React from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, ArrowRight, Code } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-void text-starlight selection:bg-electric selection:text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tight text-white"
          >
            chunlin.ch
          </motion.div>
          <div className="flex gap-6">
            {['Projects', 'About', 'Contact'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="text-subtle hover:text-white transition-colors text-sm font-medium"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="min-h-[60vh] flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-subtle">
                Building Digital <br />
                <span className="text-gradient">Experiences.</span>
              </h1>
              <p className="text-xl text-subtle max-w-2xl leading-relaxed mb-10">
                Hi, I'm Chunlin. I craft modern web applications with a focus on
                performance, aesthetics, and user experience.
              </p>

              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://github.com/chunlin-ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-void font-semibold rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <Github size={20} />
                  GitHub
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:hello@chunlin.ch"
                  className="px-6 py-3 glass rounded-full font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <Mail size={20} />
                  Contact
                </motion.a>
              </div>
            </motion.div>
          </section>

          {/* Featured Sections (Coming Soon) */}
          <section id="projects" className="py-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-subtle text-sm uppercase tracking-widest">Selected Works</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="glass p-8 rounded-2xl group cursor-pointer"
                >
                  <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg group-hover:bg-electric/20 transition-colors">
                    <Code className="text-electric" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-electric transition-colors">
                    Project {i}
                  </h3>
                  <p className="text-subtle mb-4">
                    A brief description of this project will go here. Focusing on the tech stack and impact.
                  </p>
                  <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                    View Project <ArrowRight size={16} className="ml-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-subtle text-sm">
          <div>© {new Date().getFullYear()} Chunlin.ch</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
