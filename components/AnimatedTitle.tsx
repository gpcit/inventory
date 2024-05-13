import React, { useEffect, useRef } from 'react';
import { lato } from '@/styles/font';
const AnimatedTitle = () => {
    const titleRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const spanElement = titleRef.current;

        if(!spanElement) return;
        const text = [
            "Greenstone Packaging Corporation", 
            "Greenkraft Corporation", 
            "Lamitek Systems Incorporated", 
            "Green Siam Resources Corporation"]
        let currentIndex = 0;
        let charIndex = 0;
        let eraseTimeout;
        
        // function that handle show text animation
        const typeText = () => {
            const currentText = text[currentIndex]
            if(charIndex <= currentText.length) {
                spanElement.textContent = currentText.slice(0, charIndex);
                charIndex++;
                setTimeout(typeText, 75)
            } else {
                eraseTimeout = setTimeout(eraseText, 2000)
            }
        };
        // function that handle delete text animation
        const eraseText = () => {
            const currentText = text[currentIndex]
            if(charIndex >= 0) {
                spanElement.textContent = currentText.slice(0, charIndex);
                charIndex--;
                setTimeout(eraseText, 75);
            } else {
                currentIndex = (currentIndex + 1) % text.length
                charIndex = 0;
                setTimeout(typeText, 1000);
            }
        };
        typeText()
    }, [])

    return (
        <span ref={titleRef} className={`text-black font-extrabold md:text-xl ${lato.className}` } />
    )
}

export default AnimatedTitle;