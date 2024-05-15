import React, { useEffect, useRef, useState } from 'react';
import { lato } from '@/styles/font';
import anime from 'animejs'; // Import anime.js library

const AnimatedTitle = () => {
    const titleRef = useRef<HTMLDivElement>(null);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const text = [
        "Greenstone Packaging Corporation",
        "Greenkraft Corporation",
        "Lamitek Systems Incorporated",
        "Green Siam Resources Corporation"
    ];

    useEffect(() => {
        const textWrapper = titleRef.current;

        if (textWrapper) {
            // Function to update text content with animation
            const animateText = (text: string) => {
                textWrapper.innerHTML = text.replace(/\S/g, "<span class='letter'>$&</span>");
                anime.timeline({ loop: true })
                    .add({
                        targets: '.letter',
                        translateX: [0, 40],
                        translateZ: 0,
                        opacity: [0, 1],
                        easing: "easeOutExpo",
                        duration: 1200,
                        delay: (el, i) => 500 + 30 * i
                    })
                    .add({
                        targets: '.letter',
                        translateX: [-30, 0],
                        opacity: [1, 0],
                        easing: "easeInExpo",
                        duration: 1100,
                        delay: (el, i) => 100 + 30 * i
                    });
            };

            // Initial animation with first text
            animateText(text[currentTextIndex]);

            // Update text and restart animation on text change
            const interval = setInterval(() => {
                setCurrentTextIndex((prevIndex) => (prevIndex + 1) % text.length);
                animateText(text[currentTextIndex]);
            }, 3000); // Change text every 3 seconds

            return () => clearInterval(interval); // Cleanup interval on component unmount
        }
    }, [currentTextIndex, text]); // Re-run effect when currentTextIndex changes

    return (
        <div ref={titleRef} className={` text-black font-extrabold md:text-xl ${lato.className}`}>
            {text[currentTextIndex]}
        </div>
    );
};

export default AnimatedTitle;
