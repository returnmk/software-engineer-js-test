import React, { Dispatch, SetStateAction, RefObject } from 'react';

export const useImport = (
    setImage: Dispatch<SetStateAction<HTMLImageElement | undefined>>,
    setImageX: Dispatch<SetStateAction<number>>,
    setImageY: Dispatch<SetStateAction<number>>
) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    const data = JSON.parse(result);
                    const img = new Image();
                    img.src = data.canvas.photo.src;
                    img.onload = () => {
                        setImage(img);
                        setImageX(data.canvas.photo.x);
                        setImageY(data.canvas.photo.y);
                    };
                }
            };
            reader.readAsText(file);
            // Reset the file input after reading the file
            e.target.value = '';
        }

    };
};
