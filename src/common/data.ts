export interface MLSQLExecuteResponse {
    schema: { fields: Array<{ name: string,type:string }> },
    data: Array<Object>
}
