import * as React from 'react';
import * as dom from 'react-dom';
import { ActivationFunction } from 'vscode-notebook-renderer';
import { Button } from 'antd';
import './style.css';

export const activate: ActivationFunction = (_context) => ({
	renderOutputItem(_, element) {
		dom.render(<Button type={'primary'}>Button</Button>, element);
	}
});