import React, { Dispatch, SetStateAction, RefObject } from 'react';

export const useExport = (
    canvasRef: RefObject<HTMLCanvasElement>,
    image: HTMLImageElement | undefined,
    imageX: number,
    imageY: number,
    downloadLinkRef: RefObject<HTMLAnchorElement>,
    createPrintDescription: (canvas: HTMLCanvasElement | null, image: HTMLImageElement | undefined, imageX: number, imageY: number) => any
) => {
    return () => {
        if(downloadLinkRef.current) {
            const canvas = canvasRef.current;
            const printDescription = createPrintDescription(canvas, image, imageX, imageY);

            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(printDescription));
            const link = downloadLinkRef.current;
            link.setAttribute('href', dataStr);
            link.setAttribute('download', 'image_print_description.json');
            link.click();
        }
    };
};
