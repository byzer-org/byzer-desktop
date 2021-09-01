import * as React from 'react';
import * as dom from 'react-dom';
import { ActivationFunction } from 'vscode-notebook-renderer';
import { Table } from 'antd';
import { MLSQLExecuteResponse } from '../common/data'
import './style.css';

export const activate: ActivationFunction = (_context) => ({
	renderOutputItem(_data, element) {
		const data = _data.json() as MLSQLExecuteResponse
		const columns = data.schema.fields.map(item => {
			return {
				title: item.name,
				dataIndex: item.name,
				key: item.name
			}
		})
		dom.render(<Table columns={columns} dataSource={data.data} />, element);
	}
});