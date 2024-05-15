import React, { useEffect, useRef, useState } from 'react';
import { lato } from '@/styles/font';
import anime from 'animejs'; // Import anime.js library

export default function AnimatedName () {
    useEffect(() => {
        anime.timeline({loop: true})
            .add({
                targets: '.ml15 .word',
                scale: [14,1],
                opacity: [0,1],
                easing: "easeOutCirc",
                duration: 800,
                delay: (el, i) => 800 * i
            }).add({
                targets: '.ml15',
                opacity: 0,
                duration: 1000,
                easing: "easeOutExpo",
                delay: 1000
            });
      }, [])

    return (
        <div className='absolute left-5 top-2 '>
            <h1 className='ml15'>
                  <span className='word font-bold text-slate-50'>Green</span>
                  <span className='word font-bold text-slate-50'>stone</span>
            </h1>
        </div>
    )
}