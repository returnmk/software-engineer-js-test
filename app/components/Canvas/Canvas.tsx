// Canvas.tsx
import React from 'react';
import './Canvas.scss';

interface CanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    width: number;
    height: number;
}

const Canvas: React.FC<CanvasProps> = ({ canvasRef, onMouseDown, onMouseUp, onMouseMove, width, height }) => {
    return (
        <canvas
            data-testid="canvas"
            id={"canvas"}
            ref={canvasRef}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            width={width}
            height={height}
        />
    );
};

export default Canvas;
