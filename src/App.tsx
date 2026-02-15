
import { Github, Mail, ArrowUpRight, Book, Code, Camera, Database, MapPin, Award } from 'lucide-react';

function App() {
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'research', label: 'Research' },
    { id: 'projects', label: 'Projects' },
    { id: 'timeline', label: 'Experience' },
  ];

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-primary selection:text-bg">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-[300px_1fr] gap-12 lg:gap-24">

        {/* Left Column: Fixed Profile (Sticky on Desktop) */}
        <header className="md:sticky md:top-24 h-fit space-y-8">
          <div className="space-y-4">
            <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center text-3xl font-serif text-primary">
              CC
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Chen Chunlin</h1>
              <div className="text-lg text-secondary font-medium">陈春林</div>
            </div>
            <p className="text-muted leading-relaxed">
              Senior Experimentalist & Financial Tech Researcher. <br />
              Bridging Economics, Data Science, and AI.
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-primary/80">
              <span className="flex items-center gap-1"><MapPin size={14} /> Chengdu, China</span>
              <span className="flex items-center gap-1"><Database size={14} /> Jiusan Society</span>
            </div>
          </div>

          <nav className="hidden md:block space-y-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-muted hover:text-primary transition-colors py-1"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-4 pt-4 border-t border-border">
            <a href="https://github.com/chunlin-ch" className="text-muted hover:text-white transition-colors" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="mailto:hi@chunlin.ch" className="text-muted hover:text-white transition-colors" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </header>

        {/* Right Column: Scrollable Content */}
        <main className="space-y-24">

          {/* About Section */}
          <section id="about" className="space-y-6">
            <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Introduction</h2>
            <div className="prose prose-invert max-w-none text-lg leading-relaxed font-serif text-text/90">
              <p>
                I am a Senior Experimentalist and a member of the Jiusan Society.
                With a background in Economics and a Master's in Financial Project Management,
                my work sits at the intersection of traditional finance and modern technology.
              </p>
              <p>
                My current focus is on <span className="text-primary">Large Language Models (LLMs)</span> application in Law and Science (AI4Science),
                as well as the concept of <span className="text-primary">Data Capsules</span> for secure data governance.
              </p>
            </div>
          </section>

          {/* Research Section */}
          <section id="research" className="space-y-8">
            <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Research Interests</h2>
            <div className="grid gap-6">
              {[
                { title: "LLM Applications", desc: "AI4Science, Legal Tech, Agents Farm", icon: <Code size={20} /> },
                { title: "Data Capsules", desc: "Secure data encapsulation & sharing protocols", icon: <Database size={20} /> },
                { title: "FinTech Education", desc: "Innovative teaching platforms & Experimental AI", icon: <Book size={20} /> }
              ].map((item, i) => (
                <div key={i} className="group flex gap-4 p-6 bg-surface/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="text-primary mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium">Selected Publications</h3>
              <ul className="space-y-4 border-l-2 border-border pl-6">
                <li>
                  <h4 className="font-medium text-text">An In-Depth Exploration of Jupyter's Software Ecosystem and Its Impact on Pedagogy and Scientific Research</h4>
                  <span className="text-sm text-muted">Independent Publication (EN)</span>
                </li>
                <li>
                  <h4 className="font-medium text-text">GPU Virtualization on Enhancing AI Teaching Environments</h4>
                  <span className="text-sm text-muted">Independent Publication (EN)</span>
                </li>
                <li>
                  <h4 className="font-medium text-text">基于传统机房构建AI实验平台的实践研究</h4>
                  <span className="text-sm text-muted">中文核心期刊论文 (B)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Projects</h2>
              <a href="https://github.com/chunlin-ch" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all on GitHub <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "AgentOS", role: "Research", desc: "Orchestration platform for AI Agents." },
                { name: "DSLAB", role: "Work", desc: "Digital Science Lab project development & management." },
                { name: "jupyterpro", role: "Open Source", desc: "Enhanced Jupyter Notebook environment." },
                { name: "website", role: "Open Source", desc: "This personal website source code." },
              ].map((project, i) => (
                <a key={i} href="https://github.com/chunlin-ch" className="block p-5 bg-surface/30 rounded border border-border hover:bg-surface hover:border-muted transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold font-mono text-lg">{project.name}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-muted">{project.role}</span>
                  </div>
                  <p className="text-sm text-muted">{project.desc}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Experience / Hobbies */}
          <section id="timeline" className="space-y-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Teaching & Awards</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Award className="text-secondary shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium">National 1st Prize</h4>
                    <p className="text-sm text-muted">"Innovation, Creativity & Entrepreneurship" Challenge</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Award className="text-secondary shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium">Teaching: FinTech</h4>
                    <p className="text-sm text-muted">Financial Institute (2018-2024)</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Personal Interests</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-surface rounded-lg flex flex-col items-center justify-center gap-2 p-4 text-center border border-border">
                  <Camera size={24} className="text-accent" />
                  <span className="text-sm font-medium">Travel & Photography</span>
                </div>
                <div className="aspect-square bg-surface rounded-lg flex flex-col items-center justify-center gap-2 p-4 text-center border border-border">
                  <span className="text-2xl">⚾️</span>
                  <span className="text-sm font-medium">Baseball</span>
                </div>
                <div className="col-span-2 p-4 bg-surface rounded-lg border border-border">
                  <h4 className="font-bold text-sm mb-1">History Research</h4>
                  <p className="text-xs text-muted">Exploring historical depths and humanities.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-24 pb-12 text-sm text-muted border-t border-border">
            <p>
              © {new Date().getFullYear()} Chen Chunlin. <br />
              Built with React, Tailwind & Cloudflare.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
