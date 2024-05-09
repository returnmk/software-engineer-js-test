import React from "react";
import { createRoot } from 'react-dom/client';
import { PhotoEditor } from './components/PhotoEditor/PhotoEditor';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<PhotoEditor />);
