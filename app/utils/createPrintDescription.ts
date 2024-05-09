export const createPrintDescription = (canvas: HTMLCanvasElement | null, image: HTMLImageElement | undefined, imageX: number, imageY: number) => ({
    canvas: {
        width: canvas?.width,
        height: canvas?.height,
        photo: {
            id: "string",
            src: image?.src,
            width: image?.naturalWidth,
            height: image?.naturalHeight,
            x: imageX,
            y: imageY
        }
    }
});
