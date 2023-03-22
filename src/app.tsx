import * as ReactDOM from 'react-dom';
import App from './components';
import "./index.css";

import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<App />);