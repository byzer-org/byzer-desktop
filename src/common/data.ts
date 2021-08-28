export interface MLSQLExecuteResponse {
    schema: { fields: Array<{ name: string }> },
    data: Array<Object>
}
