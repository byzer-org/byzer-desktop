import React, { useEffect, useState, useCallback } from 'react';
import { MLSQLExecuteResponse } from '../common/data'
import { Table } from 'antd';
interface IProps {
    data:MLSQLExecuteResponse
  }
export const TableView:React.FC<IProps> = (props) => {

    const columns = props.data.schema.fields.map(item => {
        return {
            title: item.name,
            dataIndex: item.name,
            key: item.name
        }
    })

    return (
        <div>
            <Table columns={columns} dataSource={props.data.data} />
        </div>
    )
}