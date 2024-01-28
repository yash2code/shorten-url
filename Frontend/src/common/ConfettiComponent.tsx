import React from 'react';
import { Particles } from '@tsparticles/react';
import { Container, Engine, ISourceOptions } from '@tsparticles/engine';

interface ConfettiComponentProps {
    show: boolean;
}

const ConfettiComponent: React.FC<ConfettiComponentProps> = ({ show }) => {

    if (!show) return

    const particlesLoaded = async (container: Container | undefined): Promise<void> => {
        console.log(container);
    };

    const particlesOptions: ISourceOptions = {
        fullScreen: {
            enable: true,
            zIndex: -1
        },
        particles: {
            number: {
                value: 50,
            },
            color: {
                value: ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff"],
            },
            shape: {
                type: "circle",
            },
            opacity: {
                value: 1,
            },
            size: {
                value: { min: 1, max: 5 },
            },
            move: {
                enable: true,
                speed: { min: 1, max: 6 },
                direction: 'outside',
                outModes: {
                    default: "destroy",
                },
            },
        },
        detectRetina: true,
    }

    return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={particlesOptions} />;
};

export default ConfettiComponent;
