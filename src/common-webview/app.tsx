import React, { useEffect, useState, useCallback } from 'react';
import { MLSQLExecuteResponse } from '../common/data'
import { Table } from 'antd';
import { TableView } from './table-view';
export const App = () => {
    const [messagesFromExtension, setMessagesFromExtension] = useState<MLSQLExecuteResponse>({
        schema: { fields: [] },
        data: []
    });
    const handleMessagesFromExtension = useCallback(
        (event: MessageEvent<any>) => {            
            setMessagesFromExtension(event.data);
        },
        [messagesFromExtension]
    );
    useEffect(() => {
        window.addEventListener('message', (event: MessageEvent<any>) => {
            handleMessagesFromExtension(event);
        });

        return () => {
            window.removeEventListener('message', handleMessagesFromExtension);
        };
    }, [handleMessagesFromExtension]);    

    return <div>
        <TableView data={messagesFromExtension}/>
    </div>

}