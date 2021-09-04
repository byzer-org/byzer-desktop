import React from 'react';
import { MLSQLExecuteResponse } from '../common/data'
import { Table } from 'antd';
interface IProps {
    data: MLSQLExecuteResponse
}

const getDefaultRender = (item: { name: string, type: string }) => {
    const { name, type } = item
    if (type === "object" || type === "array") {
        return (value: any, _: any) => {
            const v = JSON.stringify(value)
            return v
        }
    }

    switch (type) {
        case "string": return (value: any, _: any) => {
            return value
        }
        default:
            return (value: any, _: any) => { return String(value) }

    }
}

export const TableView: React.FC<IProps> = (props) => {

    const columns = props.data.schema.fields.map(item => {
        return {
            title: item.name,
            dataIndex: item.name,
            key: item.name,
            render: getDefaultRender(item),
        }
    })

    return (
        <div>
            <Table columns={columns} dataSource={props.data.data} />
        </div>
    )
}