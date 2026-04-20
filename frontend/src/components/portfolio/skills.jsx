import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchSkills } from '../../services/skills';
import Spinner from '../Spinner';

// Maps skill names (case-insensitive) to devicon slugs
const DEVICON_MAP = {
    'javascript': 'javascript/javascript-original',
    'typescript': 'typescript/typescript-original',
    'react': 'react/react-original',
    'python': 'python/python-original',
    'fastapi': 'fastapi/fastapi-original',
    'django': 'django/django-plain',
    'flask': 'flask/flask-original',
    'nodejs': 'nodejs/nodejs-original',
    'node': 'nodejs/nodejs-original',
    'postgresql': 'postgresql/postgresql-original',
    'postgres': 'postgresql/postgresql-original',
    'mysql': 'mysql/mysql-original',
    'mongodb': 'mongodb/mongodb-original',
    'redis': 'redis/redis-original',
    'docker': 'docker/docker-original',
    'git': 'git/git-original',
    'nginx': 'nginx/nginx-original',
    'html5': 'html5/html5-original',
    'html': 'html5/html5-original',
    'css3': 'css3/css3-original',
    'css': 'css3/css3-original',
    'linux': 'linux/linux-original',
    'aws': 'amazonwebservices/amazonwebservices-original',
    'graphql': 'graphql/graphql-plain',
    'vuejs': 'vuejs/vuejs-original',
    'vue': 'vuejs/vuejs-original',
    'nextjs': 'nextjs/nextjs-original',
    'next': 'nextjs/nextjs-original',
    'tailwindcss': 'tailwindcss/tailwindcss-original',
    'tailwind': 'tailwindcss/tailwindcss-original',
    'kotlin': 'kotlin/kotlin-original',
    'java': 'java/java-original',
    'go': 'go/go-original',
    'rust': 'rust/rust-original',
    'c++': 'cplusplus/cplusplus-original',
    'c#': 'csharp/csharp-original',
};

function getDeviconUrl(skillName) {
    const key = skillName.toLowerCase().trim();
    const path = DEVICON_MAP[key];
    if (!path) return null;
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}.svg`;
}

function SkillIcon({ skill_name }) {
    const iconUrl = getDeviconUrl(skill_name);

    if (iconUrl) {
        return (
            <div className="flex items-center justify-center bg-white rounded-xl w-20 h-20 shadow-sm flex-shrink-0">
                <img src={iconUrl} alt={skill_name} className="w-12 h-12 object-contain" />
            </div>
        );
    }

    // Fallback: text initials for unrecognised skills
    return (
        <div className="flex items-center justify-center bg-white rounded-xl w-20 h-20 shadow-sm flex-shrink-0">
            <span className="text-xs font-bold text-center px-1 leading-tight" style={{ color: '#1E3A8A' }}>
                {skill_name}
            </span>
        </div>
    );
}

function Skills() {
    const dispatch = useAppDispatch();
    const { items, status } = useAppSelector((state) => state.skills);
    const marqueeItems = useMemo(() => [...items, ...items], [items]);

    useEffect(() => {
        dispatch(fetchSkills());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <section className="py-10 my-6" style={{ backgroundColor: '#e5e7eb' }}>
                <h2 className="text-2xl font-bold text-center tracking-widest mb-4" style={{ color: '#1E3A8A' }}>
                    Professional Skills
                </h2>
                <Spinner />
            </section>
        );
    }

    return (
        <section className="py-10 my-6" style={{ backgroundColor: '#e5e7eb' }}>
            <h2 className="text-2xl font-bold text-center tracking-widest mb-12" style={{ color: '#1E3A8A' }}>
                Professional Skills
            </h2>

            <div className="overflow-hidden relative">
                <div className="flex gap-6 w-max animate-marquee">
                    {marqueeItems.map((skill, i) => (
                        <SkillIcon key={i} skill_name={skill.skill_name} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Skills;
