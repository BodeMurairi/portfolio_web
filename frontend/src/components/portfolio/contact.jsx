import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { sendContactEmail, resetContact } from '../../services/contact';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

function Contact() {
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.contact);
    const [form, setForm] = useState(INITIAL_FORM);

    useEffect(() => {
        if (status === 'succeeded') {
            setForm(INITIAL_FORM);
            const timer = setTimeout(() => dispatch(resetContact()), 4000);
            return () => clearTimeout(timer);
        }
    }, [status, dispatch]);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        dispatch(sendContactEmail(form));
    }

    return (
        <section className="mx-4 sm:mx-8 my-6">

            <h2 className="text-2xl font-bold text-center tracking-widest py-4 mb-10"
                style={{color: '#1E3A8A'}}>
                Get In Touch
            </h2>

            <div className="flex justify-center px-8 pb-10">
                <form className="flex flex-col gap-4 w-full max-w-xl" onSubmit={handleSubmit}>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold tracking-widest uppercase" style={{color: '#1E3A8A'}}>
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                                className="border border-blue-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-800 transition-colors"
                                style={{color: '#1E3A8A'}}
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold tracking-widest uppercase" style={{color: '#1E3A8A'}}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Your email"
                                required
                                className="border border-blue-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-800 transition-colors"
                                style={{color: '#1E3A8A'}}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold tracking-widest uppercase" style={{color: '#1E3A8A'}}>
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="What is this about?"
                            required
                            className="border border-blue-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-800 transition-colors"
                            style={{color: '#1E3A8A'}}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold tracking-widest uppercase" style={{color: '#1E3A8A'}}>
                            Message
                        </label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Write your message here..."
                            rows={6}
                            required
                            className="border border-blue-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-800 transition-colors resize-none"
                            style={{color: '#1E3A8A'}}
                        />
                    </div>

                    {status === 'failed' && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}
                    {status === 'succeeded' && (
                        <p className="text-sm text-green-600 text-center">Message sent successfully!</p>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="self-center px-12 py-3 rounded-lg text-sm font-semibold tracking-widest uppercase text-white transition-colors hover:opacity-90 disabled:opacity-50"
                        style={{backgroundColor: '#1E3A8A'}}
                    >
                        {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>

                </form>
            </div>

        </section>
    );
}

export default Contact;
