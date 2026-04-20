import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchExperience } from '../../services/experience';
import Spinner from '../Spinner';

function formatRange(start, end) {
    if (!start) return '';
    const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${fmt(start)} – ${end ? fmt(end) : 'Present'}`;
}

function Experience() {
    const dispatch = useAppDispatch();
    const { items, status } = useAppSelector((s) => s.experience);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchExperience());
    }, [dispatch, status]);

    if (status !== 'succeeded' || items.length === 0) return null;

    return (
        <section className="mx-4 sm:mx-8 my-6">
            <h2
                className="text-2xl font-bold text-center tracking-widest py-4"
                style={{ color: '#1E3A8A', backgroundColor: '#e5e7eb' }}
            >
                Experience
            </h2>

            <div className="mt-8 mb-6">
                <div className="inline-block border-2 border-dashed border-blue-300 rounded px-4 py-2">
                    <p className="text-base font-bold underline text-left" style={{ color: '#1E3A8A' }}>
                        Work History
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {items.map((exp) => (
                    <div
                        key={exp.experience_id}
                        className="flex flex-col gap-2 p-5 border border-gray-200 rounded-lg"
                        style={{ borderLeftWidth: '4px', borderLeftColor: '#1E3A8A' }}
                    >
                        <p
                            className="text-xs font-semibold tracking-widest uppercase"
                            style={{ color: '#1E3A8A', opacity: 0.5 }}
                        >
                            {formatRange(exp.start_date, exp.end_date)}
                        </p>

                        <p className="font-bold text-base leading-tight" style={{ color: '#1E3A8A' }}>
                            {exp.role}
                        </p>

                        <p className="text-sm font-semibold" style={{ color: '#1E3A8A', opacity: 0.65 }}>
                            {exp.company_url ? (
                                <a
                                    href={exp.company_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {exp.company}
                                </a>
                            ) : exp.company}
                        </p>

                        {exp.responsabilities && (
                            <>
                                <div className="h-px w-full mt-1" style={{ backgroundColor: '#e5e7eb' }} />
                                <p className="text-sm leading-relaxed" style={{ color: '#1E3A8A', opacity: 0.75 }}>
                                    {exp.responsabilities}
                                </p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Experience;
