import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import postsData from './data/posts.json';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import logo from './assets/logo.svg';
import { useEffect } from 'react';

function BlogPost() {
    const { slug } = useParams();
    const post = postsData.find(p => p.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        return (
            <div className="min-h-screen bg-bg text-text flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Post not found</h1>
                    <Link to="/blog" className="text-primary hover:underline">Return to Blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg text-text font-sans py-12 px-6 flex justify-center">
            <div className="w-full max-w-2xl">
                <Link to="/blog" className="inline-flex items-center text-muted hover:text-primary mb-8 transition-colors group">
                    <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                    <img src={logo} alt="Chunlin.ch" className="h-[28px] md:h-[32px]" />
                </Link>

                <header className="mb-12 pb-8 border-b border-border">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight text-white">{post.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-3">
                            {post.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 text-primary">
                                    <Tag size={14} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </header>

                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-a:text-primary hover:prose-a:text-accent prose-img:rounded-lg">
                    <Markdown>{post.content}</Markdown>
                </article>

                <footer className="mt-16 pt-8 border-t border-border">
                    <Link to="/blog" className="text-muted hover:text-white transition-colors">
                        ← Read more posts
                    </Link>
                </footer>
            </div>
        </div>
    );
}

export default BlogPost;
