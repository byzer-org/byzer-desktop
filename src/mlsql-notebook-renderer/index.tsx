import * as React from 'react';
import * as dom from 'react-dom';
import { ActivationFunction } from 'vscode-notebook-renderer';
import { Table } from 'antd';
import { MLSQLExecuteResponse,ToContent } from '../common/data'
import './style.css';


export const activate: ActivationFunction = (_context) => ({
	renderOutputItem(_data, element) {
		const c = ToContent(_data.json() as MLSQLExecuteResponse)
		if (c.mime === "html") {
			const htmlContent = c.content as string
			let height = "600px"
			dom.render(<iframe
				sandbox="allow-scripts"
				style={{ width: '100%', height: `${height}`, border: "none", overflow: "hidden" }}
				srcDoc={htmlContent}
			/>, element);
			return
		}

		if (c.mime === "image") {			
			dom.render(<img src={`data:image/png;base64,${c.content}`}/>, element);
			return 
		}

		let  data = c.content as MLSQLExecuteResponse
				
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