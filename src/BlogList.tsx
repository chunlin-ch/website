import { Link, useSearchParams } from 'react-router-dom';
import postsData from './data/posts.json';
import { ArrowLeft, X } from 'lucide-react';

function BlogList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTag = searchParams.get('tag');

    // Collect all unique tags
    const allTags = [...new Set(postsData.flatMap(post => post.tags))].sort();

    // Filter posts by tag if one is selected
    const filteredPosts = activeTag
        ? postsData.filter(post => post.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()))
        : postsData;

    const handleTagClick = (tag: string) => {
        if (activeTag?.toLowerCase() === tag.toLowerCase()) {
            setSearchParams({});
        } else {
            setSearchParams({ tag: tag.toLowerCase() });
        }
    };

    const clearFilter = () => setSearchParams({});

    return (
        <div className="min-h-screen bg-bg text-text font-sans flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-2xl">
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center text-muted hover:text-primary mb-6 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-serif font-bold text-text">Blog</h1>
                    <p className="text-muted mt-2">Thoughts, notes, and research updates.</p>
                </div>

                {/* Tag Filter Bar */}
                <div className="mb-8 space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${activeTag?.toLowerCase() === tag.toLowerCase()
                                        ? 'bg-primary/20 text-primary border-primary/50'
                                        : 'bg-white/5 text-muted border-white/10 hover:text-primary hover:border-primary/30'
                                    }`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                    {activeTag && (
                        <button
                            onClick={clearFilter}
                            className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors cursor-pointer"
                        >
                            <X size={12} />
                            Clear filter · Showing {filteredPosts.length} of {postsData.length} posts
                        </button>
                    )}
                </div>

                <div className="space-y-8">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-16 text-muted">
                            <p className="text-lg mb-2">No posts found with tag "{activeTag}"</p>
                            <button onClick={clearFilter} className="text-primary hover:underline cursor-pointer">
                                Show all posts
                            </button>
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <Link to={`/blog/${post.slug}`} key={post.slug} className="block group">
                                <article className="p-6 bg-surface/30 rounded-lg border border-border hover:bg-surface hover:border-primary/50 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold font-serif group-hover:text-primary transition-colors">{post.title}</h2>
                                        <span className="text-xs text-muted font-mono">{post.date}</span>
                                    </div>
                                    <p className="text-muted mb-4">{post.description}</p>
                                    <div className="flex gap-2">
                                        {post.tags.map(tag => (
                                            <span key={tag} className={`text-xs px-2 py-1 rounded-full border ${activeTag?.toLowerCase() === tag.toLowerCase()
                                                    ? 'bg-primary/20 text-primary border-primary/50'
                                                    : 'bg-white/5 text-primary/80 border-white/5'
                                                }`}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default BlogList;
