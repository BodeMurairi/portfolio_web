import bgImage from '../../assets/blog/hero-bg.webp'

function Hero(){
    return(
        <div
            className="w-full py-32 flex flex-col items-center justify-center gap-6"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
        </div>
    )
}
export default Hero;
