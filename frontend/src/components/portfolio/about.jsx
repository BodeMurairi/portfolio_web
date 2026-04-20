import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchAbout } from "../../services/about";
import Spinner from "../Spinner";

function About() {
    const dispatch = useAppDispatch();

    const { content, status, error } = useAppSelector(
        (state) => state.about
    );
     useEffect(() => {
        dispatch(fetchAbout());
    }, [dispatch]);
    return (
        <div className="mx-4 sm:mx-8 my-6 px-4 sm:px-8 py-6 border border-gray-200 text-left">
            <p
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: '#1E3A8A' }}
            >
                Hello!
            </p>

            {status === "loading" && <Spinner />}
            {status === "failed" && <p className="text-sm text-red-500">{error}</p>}

            <p
                className="text-sm leading-relaxed tracking-wide"
                style={{ color: '#1E3A8A' }}
                id="about"
            >
                {content}
            </p>
        </div>
    );
}
export default About;
