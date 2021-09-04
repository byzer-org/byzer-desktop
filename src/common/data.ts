export interface MLSQLExecuteResponse {
    schema: { fields: Array<{ name: string, type: string }> },
    data: Array<Object>
}


export interface Content {
    mime: string,
    content: any
}

export const ToContent = (res: MLSQLExecuteResponse): Content => {
    const mimeOpt = res.schema.fields.filter(item => item.name === "mime")
    const contentOpt = res.schema.fields.filter(item => item.name === "content")
    if (mimeOpt.length !== 0 && contentOpt.length !== 0) {
        const value = res.data[0] as Content
        return value
    } else {
        return { mime: "json", content: res }
    }

}

