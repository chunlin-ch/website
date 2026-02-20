import { Github, Mail, ArrowUpRight, Database, MapPin, Camera, CircleDot, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';

const INTERESTS = [
    {
        label: 'Travel & Photography',
        hint: '→ gallery',
        icon: 'camera' as const,
        href: '/travel',
        external: false,
    },
    {
        label: 'Baseball',
        suffix: '(Pitcher)',
        hint: '小红书',
        icon: 'baseball' as const,
        href: 'https://www.xiaohongshu.com/user/profile/62d1a1da000000001501fd57',
        external: true,
    },
    {
        label: 'History Research',
        suffix: '(Humanities)',
        hint: '→ blog',
        icon: 'book' as const,
        href: '/blog?tag=history',
        external: false,
    },
];

function Home() {
    const navigate = useNavigate();
    const sections = [
        { id: 'about', label: 'About' },
        { id: 'research', label: 'Research' },
        { id: 'projects', label: 'Projects' },
        { id: 'timeline', label: 'Experience' },
        { id: 'blog', label: 'Blog', href: '/blog' }, // Added Blog link
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
                                href={section.href || `#${section.id}`}
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
                        <h2 className="text-xs font-bold tracking-widest text-primary uppercase font-mono">&gt; whoami</h2>
                        <div className="prose prose-invert max-w-none text-lg leading-relaxed font-serif text-text/90 space-y-4">
                            <p>
                                <span className="font-bold text-white">Senior Experimentalist. Member of Jiusan Society.</span>
                            </p>
                            <p>
                                Decrypting the intersection of <span className="text-white">Finance</span> & <span className="text-white">Technology</span>.
                            </p>
                            <div className="font-mono text-sm text-muted pt-4 border-l-2 border-primary pl-4">
                                <span className="text-secondary">Current_Focus</span> = <span className="text-primary">["AI4Science", "Legal LLMs", "Data Capsules"]</span>;
                            </div>
                        </div>
                    </section>

                    {/* Research Section */}
                    <section id="research" className="space-y-8">
                        <h2 className="text-xs font-bold tracking-widest text-primary uppercase font-mono">&gt; research --list</h2>
                        <div className="grid gap-4">
                            {[
                                { id: "01", key: "LLM_Apps", val: "AI4Science, Legal Tech, Agents Farm" },
                                { id: "02", key: "Data_Capsules", val: "Secure data encapsulation protocols" },
                                { id: "03", key: "FinTech_Edu", val: "Innovative teaching platforms" }
                            ].map((item) => (
                                <div key={item.id} className="group flex items-baseline gap-4 p-4 bg-surface/30 rounded border border-border/50 hover:border-primary/50 transition-colors font-mono text-sm">
                                    <span className="text-muted/50 select-none">{item.id}</span>
                                    <span className="text-primary font-bold min-w-[140px]">{item.key}</span>
                                    <span className="text-muted group-hover:text-text transition-colors">
                                        <span className="text-muted/50 mr-2">=&gt;</span>
                                        "{item.val}"
                                    </span>
                                </div>
                            ))}
                        </div>


                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold tracking-widest text-primary uppercase font-mono">&gt; projects --all</h2>
                            <a href="https://github.com/chunlin-ch" className="text-xs font-mono text-muted hover:text-primary flex items-center gap-1">
                                ~/github/chunlin-ch <ArrowUpRight size={12} />
                            </a>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { name: "AgentOS", status: "active", desc: "Orchestration platform for AI Agents." },
                                { name: "DSLAB", status: "stable", desc: "Digital Science Lab project." },
                                { name: "jupyterpro", status: "public", desc: "Enhanced Jupyter environment." },
                                { name: "website", status: "live", desc: "Personal website source." },
                            ].map((project, i) => (
                                <a key={i} href="https://github.com/chunlin-ch" className="block p-5 bg-surface/20 rounded border border-border hover:bg-surface hover:border-primary/30 transition-all font-mono">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-lg text-text">{project.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-muted'}`}></span>
                                            <span className="text-xs text-muted uppercase">[{project.status}]</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted leading-relaxed">// {project.desc}</p>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Experience / Hobbies */}
                    <section id="timeline" className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-xs font-bold tracking-widest text-primary uppercase font-mono">&gt; history | tail -n 5</h2>
                            <ul className="space-y-6 font-mono text-sm">
                                <li className="flex gap-4">
                                    <div className="text-secondary">[2023]</div>
                                    <div>
                                        <h4 className="font-bold text-text">National 1st Prize</h4>
                                        <p className="text-muted text-xs">"Innovation, Creativity & Entrepreneurship"</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="text-secondary">[2018]</div>
                                    <div>
                                        <h4 className="font-bold text-text">Teaching: FinTech</h4>
                                        <p className="text-muted text-xs">Financial Institute (to 2024)</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <InterestsSelector navigate={navigate} />
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

// Terminal-style keyboard selector for interests
function InterestsSelector({ navigate }: { navigate: (path: string) => void }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSelect = useCallback((index: number) => {
        const item = INTERESTS[index];
        if (item.external) {
            window.open(item.href, '_blank', 'noopener,noreferrer');
        } else {
            navigate(item.href);
        }
    }, [navigate]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isActive) return;
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + INTERESTS.length) % INTERESTS.length);
                break;
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % INTERESTS.length);
                break;
            case 'Enter':
                e.preventDefault();
                handleSelect(selectedIndex);
                break;
        }
    }, [isActive, selectedIndex, handleSelect]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const IconMap = { camera: Camera, baseball: CircleDot, book: BookOpen };

    return (
        <div className="space-y-6">
            <h2 className="text-xs font-bold tracking-widest text-primary uppercase font-mono">&gt; cat interests.txt</h2>
            <div
                ref={containerRef}
                className={`font-mono text-sm bg-surface/30 p-4 rounded border transition-colors ${isActive ? 'border-primary/50' : 'border-border'}`}
                tabIndex={0}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                onClick={() => setIsActive(true)}
            >
                <span className="text-secondary">user@chunlin.ch:~$</span> select hobby<br />
                <div className="pl-2 pt-3 space-y-1">
                    {INTERESTS.map((item, index) => {
                        const isSelected = selectedIndex === index;
                        const IconComponent = IconMap[item.icon];
                        return (
                            <button
                                key={index}
                                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-all text-left cursor-pointer ${isSelected
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted hover:text-text hover:bg-white/5'
                                    }`}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onClick={(e) => { e.stopPropagation(); handleSelect(index); }}
                            >
                                {/* Cursor */}
                                <span className={`w-4 text-primary font-bold ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                    ❯
                                </span>
                                {/* Icon */}
                                <IconComponent size={14} className={isSelected ? 'text-primary' : 'text-secondary'} />
                                {/* Label */}
                                <span>
                                    {index + 1}. <span className={`font-bold ${isSelected ? 'text-primary' : 'text-text'}`}>{item.label}</span>
                                    {item.suffix && <span className={isSelected ? 'text-primary/70' : 'text-muted'}> {item.suffix}</span>}
                                </span>
                                {/* Hint */}
                                <span className={`text-xs ml-auto flex items-center gap-1 ${isSelected ? 'text-primary/60' : 'text-muted/30'}`}>
                                    {item.hint}
                                    {item.external && <ArrowUpRight size={10} />}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {/* Keyboard hint */}
                <div className={`mt-3 pt-2 border-t border-border/50 text-xs transition-colors ${isActive ? 'text-muted' : 'text-muted/30'}`}>
                    <span className="text-secondary/60">hint:</span> [↑/↓ 选择 · ↵ 进入]
                    {isActive && <span className="animate-pulse text-primary ml-2">●</span>}
                </div>
            </div>
        </div>
    );
}

export default Home;
