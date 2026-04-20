import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProjects } from '../../services/projects';
import Spinner from '../Spinner';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const VIDEO_EXTS = ['.mp4', '.webm', '.ogg'];
const IMAGE_DOMAINS = ['images.unsplash.com', 'picsum.photos', 'placehold.co', 'r2.dev', 'cloudflare'];

function getMediaType(url) {
    if (!url) return null;
    const lower = url.toLowerCase();
    const path = lower.split('?')[0];
    if (IMAGE_EXTS.some((ext) => path.endsWith(ext))) return 'image';
    if (VIDEO_EXTS.some((ext) => path.endsWith(ext))) return 'video';
    if (IMAGE_DOMAINS.some((domain) => lower.includes(domain))) return 'image';
    return null;
}

function ProjectMedia({ url, title }) {
    const type = getMediaType(url);
    if (type === 'image') return <img src={url} alt={title} className="w-full h-48 object-cover rounded-lg border-2 border-blue-200" />;
    if (type === 'video') return <video src={url} controls className="w-full h-48 rounded-lg border-2 border-blue-200 object-cover" />;
    return null;
}

function Portfolio() {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <section className="mx-4 sm:mx-8 my-6">
            <h2 className="text-2xl font-bold text-center tracking-widest py-4 mb-6" style={{ color: '#1E3A8A', backgroundColor: '#e5e7eb' }}>
                Portfolio
            </h2>

            <div className="mb-6">
                <div className="inline-block border-2 border-dashed border-blue-300 rounded px-4 py-2">
                    <p className="text-base font-bold underline text-left" style={{ color: '#1E3A8A' }}>
                        My Top Projects
                    </p>
                </div>
            </div>

            {status === 'loading' && <Spinner />}
            {status === 'failed'  && <p className="text-sm text-red-500">{error}</p>}

            {status === 'succeeded' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((project) => (
                        <div key={project.project_id} className="flex flex-col items-center gap-3">
                            <p className="text-sm font-semibold text-center" style={{ color: '#1E3A8A' }}>
                                {project.title}
                            </p>

                            {project.demo_url && getMediaType(project.demo_url) ? (
                                <ProjectMedia url={project.demo_url} title={project.title} />
                            ) : project.image_url ? (
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-48 object-cover rounded-lg border-2 border-blue-200"
                                />
                            ) : null}

                            <p className="text-sm text-center" style={{ color: '#1E3A8A' }}>
                                {project.description}
                            </p>

                            {project.demo_url && !getMediaType(project.demo_url) && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs underline"
                                    style={{ color: '#1E3A8A' }}
                                >
                                    View Demo
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Portfolio;
