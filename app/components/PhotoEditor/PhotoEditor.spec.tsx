import React from 'react'
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

import { PhotoEditor } from './PhotoEditor';

describe('PhotoEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders photo editor without crashing', () => {
    render(<PhotoEditor />);
  });

  it('renders the Canvas', () => {
    const { getByTestId } = render(<PhotoEditor />);
    const canvas = getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('handles image upload', async () => {
    const mockReader = {
      onload: jest.fn(),
      readAsDataURL: jest.fn(),
    } as any;
    const mockImage = {
      onload: jest.fn(),
    } as any;
    const drawImageMock = jest.fn();

    const { getByTestId, getByLabelText } = render(<PhotoEditor />);
    const canvas = getByTestId('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const fileInput = getByLabelText('Upload Image') as HTMLInputElement;
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    jest.spyOn(window, "Image").mockImplementation(() => mockImage);
    jest.spyOn(window, "FileReader").mockImplementation(() => mockReader);
    //@ts-ignore
    jest.spyOn(context, 'drawImage').mockImplementation(drawImageMock);

    act(() => {
      fireEvent.change(fileInput, {target: {files: [file]}});
      mockReader.onload();
      mockImage.onload();
    });
  });

  it('handles json import', async () => {
    const mockReader = {
      onload: jest.fn(),
      readAsText: jest.fn(),
    } as any;

    const { getByTestId, getByLabelText } = render(<PhotoEditor />);
    const canvas = getByTestId('canvas') as HTMLCanvasElement;

    jest.spyOn(window, "FileReader").mockImplementation(() => mockReader);

    act(() => {
      mockReader.onload({
        target: {
          result: '{ "Canvas": { "width": 15, "height": 10, "photo" : { "id": "string", "src": "base64-encoded-image", "width": 20, "height": 20, "x": -2.5, "y": -5 } } }'
        }
      });
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = ctx.getImageData(-2.5, -5, 20, 20);
          expect(imageData).not.toBeNull();
        } else
          throw new Error('Canvas context not found');
      } else
        throw new Error('Canvas not found');
    });
  });

  it('handles json export', async () => {
    const mockReader = {
      onload: jest.fn(),
      readAsDataURL: jest.fn(),
    } as any;
    const mockImage = {
      onload: jest.fn(),
    } as any;
    const drawImageMock = jest.fn();

    const { getByTestId, getByLabelText } = render(<PhotoEditor />);
    const canvas = getByTestId('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const fileInput = getByLabelText('Upload Image') as HTMLInputElement;
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const link = getByTestId('jsonDownload') as HTMLAnchorElement;

    jest.spyOn(window, "Image").mockImplementation(() => mockImage);
    jest.spyOn(window, "FileReader").mockImplementation(() => mockReader);
    //@ts-ignore
    jest.spyOn(context, 'drawImage').mockImplementation(drawImageMock);

    act(() => {
      fireEvent.change(fileInput, {target: {files: [file]}});
      mockReader.onload();
      mockImage.onload();
    });

    const button = getByTestId('jsonExport') as HTMLButtonElement;
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    if (link) {
      const href = link.getAttribute('href');

      expect(href).toEqual(expect.stringContaining('data:text/json;charset=utf-8,'))
    } else
      throw new Error('Download link not found');
  });
});
