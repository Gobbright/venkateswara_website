import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroImg from "../assets/Images/Home/hero.png"; // update path as needed
import heroImg2 from "../assets/Images/Home/hero2.png"; // update path as needed
import heroImg3 from "../assets/Images/Home/hero3.png"; // update path as needed

const heroSlides = [
    {
        image: heroImg,
        alt: "Family textile collection",
        eyebrow: "",
        title: "Premium Textile",
        highlight: "Collections",
        suffix: "for Every Occasion",
        description: "Discover timeless fashion with high-quality fabrics crafted for comfort, style, and elegance - woven by master artisans of South India.",
        align: "left",
        position: "center center",
    },
    {
        image: heroImg3,
        alt: "Women's textile collection",
        eyebrow: "Women's Collection",
        title: "Graceful Wear",
        highlight: "for Her",
        suffix: "Every Beautiful Moment",
        description: "Explore elegant sarees, kurtis, and festive styles designed with rich colors, soft textures, and a confident feminine finish.",
        align: "right",
        position: "center center",
    },
    {
        image: heroImg2,
        alt: "Men's textile collection",
        eyebrow: "Men's Collection",
        title: "Sharp Styles",
        highlight: "for Him",
        suffix: "Built for Comfort",
        description: "Find crisp shirts, smart casuals, and everyday essentials made for clean looks, easy movement, and lasting confidence.",
        align: "left",
        position: "center center",
    },
];

const getSlidePosition = (index, activeSlide) => {
    if (index === activeSlide) {
        return "translate-x-0 opacity-100";
    }

    return index < activeSlide ? "-translate-x-full opacity-0" : "translate-x-full opacity-0";
};

const Hero = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 4500);

        return () => clearInterval(timer);
    }, []);

    const showPreviousSlide = () => {
        setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
    };

    const showNextSlide = () => {
        setActiveSlide((current) => (current + 1) % heroSlides.length);
    };

    const currentSlide = heroSlides[activeSlide];
    const isRightAligned = currentSlide.align === "right";

    return (
        <div className="relative h-[clamp(520px,78vh,760px)] w-full overflow-hidden">

            {/* Background Slides */}
            {heroSlides.map((slide, index) => (
                <img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.alt}
                    style={{ objectPosition: slide.position }}
                    className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-700 ease-in-out ${getSlidePosition(index, activeSlide)}`}
                />
            ))}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/10" />
            <div className={`absolute inset-0 ${isRightAligned ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-black/35 via-black/10 to-transparent`} />

            {/* Content */}
            <div
                className={`relative z-10 flex h-full flex-col justify-end px-6 pt-14 pb-16 md:px-20 md:pt-32 md:pb-24 ${isRightAligned ? "ml-auto items-end text-right" : "items-start text-left"}`}
            >
                <div
                    key={activeSlide}
                    className="max-w-2xl animate-[fadeIn_0.6s_ease-in-out]"
                >
                    {currentSlide.eyebrow && (
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-yellow-300 md:text-sm">
                            {currentSlide.eyebrow}
                        </p>
                    )}

                    {/* Heading */}
                    <h1
                        className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight mb-3 md:mb-4 drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]"
                        style={{ fontFamily: "'Rowdies', sans-serif" }}
                    >
                        {currentSlide.title}{" "}
                        <span className="text-yellow-400">{currentSlide.highlight}</span>{" "}
                        {currentSlide.suffix}
                    </h1>

                    {/* Subtext */}
                    <p className={`text-xs sm:text-sm md:text-base text-white mb-6 md:mb-8 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] ${isRightAligned ? "ml-auto" : ""}`}>
                        {currentSlide.description}
                    </p>

                    {/* Buttons */}
                    <div className={`flex flex-wrap items-center gap-3 md:gap-4 ${isRightAligned ? "justify-end" : "justify-start"}`}>
                        <Link to="/categories" className="!no-underline bg-orange-600 text-white px-5 md:px-6 py-2.5 md:py-4 rounded-full text-sm font-extrabold flex items-center gap-2 transition hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF]">
                            Shop Now <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

            </div>

            {/* Arrow Controls */}
            <button
                type="button"
                onClick={showPreviousSlide}
                aria-label="Previous hero slide"
                className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/20 text-white transition hover:bg-black/35 md:left-6 md:h-12 md:w-12"
            >
                <ChevronLeft size={26} />
            </button>

            <button
                type="button"
                onClick={showNextSlide}
                aria-label="Next hero slide"
                className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/20 text-white transition hover:bg-black/35 md:right-6 md:h-12 md:w-12"
            >
                <ChevronRight size={26} />
            </button>

            {/* Slide Dots */}
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-7">
                {heroSlides.map((slide, index) => (
                    <button
                        key={slide.alt}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Show hero slide ${index + 1}`}
                        className={`h-2 rounded-full transition-all ${activeSlide === index ? "w-5 bg-white" : "w-2 bg-white/55 hover:bg-white"}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
