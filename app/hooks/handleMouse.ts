import React, { Dispatch, SetStateAction, RefObject, MouseEvent } from 'react';

export const useMouseHandlers = (
    setDragging: Dispatch<SetStateAction<boolean>>,
    initialMouseX: number,
    initialMouseY: number,
    setInitialMouseX: Dispatch<SetStateAction<number>>,
    setInitialMouseY: Dispatch<SetStateAction<number>>,
    dragging: boolean,
    image: HTMLImageElement | undefined,
    canvasRef: RefObject<HTMLCanvasElement>,
    imageX: number,
    imageY: number,
    setImageX: Dispatch<SetStateAction<number>>,
    setImageY: Dispatch<SetStateAction<number>>
) => {
    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        setDragging(true);
        setInitialMouseX(e.clientX);
        setInitialMouseY(e.clientY);
    };

    const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
        setDragging(false);
        setInitialMouseX(0);
        setInitialMouseY(0);
    };

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (dragging && image && canvasRef.current) {
            const dx = e.clientX - initialMouseX;
            const dy = e.clientY - initialMouseY;

            const newImageX = imageX + dx;
            const newImageY = imageY + dy;

            const canvas = canvasRef.current;
            const imageAspectRatio = image.naturalWidth / image.naturalHeight;
            const canvasAspectRatio = canvas.width / canvas.height;

            let maxImageX, maxImageY;
            if (imageAspectRatio > canvasAspectRatio) {
                maxImageX = (canvas.width - image.naturalWidth * (canvas.height / image.naturalHeight)) / 2;
                maxImageY = 0;
            } else {
                maxImageX = 0;
                maxImageY = (canvas.height - image.naturalHeight * (canvas.width / image.naturalWidth)) / 2;
            }

            setImageX(Math.min(Math.max(newImageX, maxImageX), -maxImageX));
            setImageY(Math.min(Math.max(newImageY, maxImageY), -maxImageY));

            setInitialMouseX(e.clientX);
            setInitialMouseY(e.clientY);
        }
    };

    return { handleMouseDown, handleMouseUp, handleMouseMove };
};
