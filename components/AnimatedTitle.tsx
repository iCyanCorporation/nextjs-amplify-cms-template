'use client';

import { TypeAnimation } from "react-type-animation";
// type Speed = Speed | GranularSpeed | undefined
type Speed = any;

interface AnimatedTitleProps {
    sequences: (string | number)[];
    speed: Speed;
}

export default function AnimatedTitle({ sequences, speed }: AnimatedTitleProps) {
    return (
        <TypeAnimation
            sequence={sequences}
            wrapper="span"
            speed={speed}
            repeat={Infinity}
        />
    );
}
