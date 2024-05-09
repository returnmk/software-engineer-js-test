import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {createPrintDescription} from "../../utils/createPrintDescription";
import Canvas from '../Canvas/Canvas';
import {usePhotoUpload} from "../../hooks/handlePhotoUpload";
import {useImport} from "../../hooks/handleImport";
import {useExport} from "../../hooks/handleExport";
import {useMouseHandlers} from "../../hooks/handleMouse";
import {CANVAS_DIMENSIONS} from "../../constants";
import './PhotoEditor.scss';

export const PhotoEditor = () => {
	const [image, setImage] = useState<HTMLImageElement>();
	const [dragging, setDragging] = useState(false);
	const [imageX, setImageX] = useState(0);
	const [imageY, setImageY] = useState(0);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [initialMouseX, setInitialMouseX] = useState(0);
	const [initialMouseY, setInitialMouseY] = useState(0);
	const downloadLinkRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		if (image && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			const canvasAspectRatio = canvas.width / canvas.height;
			const imageAspectRatio = image.naturalWidth / image.naturalHeight;

			let drawWidth, drawHeight, offsetX, offsetY;

			if (imageAspectRatio > canvasAspectRatio) {
				drawHeight = canvas.height;
				drawWidth = image.naturalWidth * (drawHeight / image.naturalHeight);
				offsetX = (canvas.width - drawWidth) / 2;
				offsetY = 0;
			} else {
				drawWidth = canvas.width;
				drawHeight = image.naturalHeight * (drawWidth / image.naturalWidth);
				offsetX = 0;
				offsetY = (canvas.height - drawHeight) / 2;
			}

			ctx?.clearRect(0, 0, canvas.width, canvas.height);
			ctx?.drawImage(image, imageX + offsetX, imageY + offsetY, drawWidth, drawHeight);
		}
	}, [image, imageX, imageY]);

	/** Custom hook for handling photo upload */
	const handlePhotoUpload = usePhotoUpload(setImage, setImageX, setImageY);

	/** Custom hook for handling mouse events within the Canvas */
	const { handleMouseDown, handleMouseUp, handleMouseMove } = useMouseHandlers(setDragging, initialMouseX, initialMouseY, setInitialMouseX, setInitialMouseY, dragging, image, canvasRef, imageX, imageY, setImageX, setImageY);

	/** Custom hooks for handling import and export */
	const handleImport = useImport(setImage, setImageX, setImageY);

	const handleExport = useExport(canvasRef, image, imageX, imageY, downloadLinkRef, createPrintDescription);

	return (
		<>
			<div className={'mb-5 align-center'}>
				<h1>Photo Editor</h1>
				<label htmlFor="imageUpload" className={'button'}>Upload Image</label>
				<input type="file" id="imageUpload" className={'hidden'} onChange={handlePhotoUpload}/>
			</div>
			<div className={'align-center'}>
				<Canvas
					canvasRef={canvasRef}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onMouseMove={handleMouseMove}
					width={CANVAS_DIMENSIONS.width}
					height={CANVAS_DIMENSIONS.height}
				/>
			</div>
			<div className={'align-center'}>
				{image && <span id={"jsonExport"} data-testid="jsonExport" className={'button'}
									   onClick={handleExport}>Export</span>}
				<a ref={downloadLinkRef} data-testid={'jsonDownload'} style={{display: 'none'}}></a>
				<label htmlFor="jsonImport" className={'button'}>Import</label>
				<input type="file" id="jsonImport" data-testid="jsonImport" className={'hidden'}
					   onChange={handleImport}/>
			</div>
		</>
	);
};
