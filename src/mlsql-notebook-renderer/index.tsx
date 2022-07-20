import * as React from 'react';
import * as dom from 'react-dom';
import { ActivationFunction } from 'vscode-notebook-renderer';
import { Table } from 'antd';
import { MLSQLExecuteResponse,ToContent } from '../common/data'
import './style.css';


interface TableColumn {
	title: string,
	dataIndex: string,
	key: string,
	tpl: string,
	render: (value:string)=>string|React.ReactElement<any>
}

const setRender = (column:TableColumn) => {		
	if (column.key === "html") {            
		column.render = value => <pre>{value.substring(0,300)}</pre>
		return
	}


	if (column.key === "fileSystem" || column.key === "message" || column.key === "info") {
		column.render = value => <pre>{value.toString()}</pre>
		return
	}

	if(typeof(column.tpl) === "object"){
		column.tpl as {type:string,elementType:string,}
		column.render = value => <span>{                
			(JSON.stringify(value) || "").substring(0, 300) 
		}</span>
	    return
	}
	

	
	if(column.tpl==="string" || column.tpl === "double"
	|| column.tpl === "integer"
	|| column.tpl === "long"
	|| column.tpl === "float"
	|| column.tpl === "short"
	|| column.tpl === "timestamp"
	|| column.tpl === "date"
	|| column.tpl === "boolean"
	){
		column.render = value => <span>{value}</span>
		return	
	}

	column.render = _ => <span>No Suitable View....</span>
	return	
	
}

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

		let  data = c.content as MLSQLExecuteResponse || []
		let columns:any[] = []
		
		if(data.schema != null) {
			columns = data.schema.fields.map(item => {
				const newItem =  {
					title: item.name,
					dataIndex: item.name,
					key: item.name,
					tpl: item.type,
					render: (value:any):string|React.ReactElement<any>=>{ return value}				
				}
	
				setRender(newItem)
				return newItem
	
			})
		}
		dom.render(<Table columns={columns} dataSource={data.data} />, element);

	}
});