import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/space-grotesk';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/silkscreen/latin-400.css';
import '@fontsource/caveat/latin-500.css';
import '@fontsource/bagel-fat-one/latin-400.css';
import '@fontsource/rubik-mono-one/latin-400.css';
import '@fontsource/anton/latin-400.css';
import App from './App.jsx';
import './canvas.css';
import './avatar.css';
import './motion.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
