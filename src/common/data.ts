export interface MLSQLExecuteResponse {
    schema: { fields: Array<{ name: string, type: string }> },
    data: Array<Object>
}


export interface Content {
    mime: string,
    content: any
}

export const ToContent = (res: MLSQLExecuteResponse): Content => { 
    if(res.schema == null) {
        return { mime: "json", content: res } 
    }   
    const mimeOpt = res.schema.fields.filter(item => item.name === "mime")
    const contentOpt = res.schema.fields.filter(item => item.name === "content")
    if (mimeOpt.length !== 0 && contentOpt.length !== 0) {
        const value = res.data[0] as Content
        return value
    } else {
        return { mime: "json", content: res }
    }

}

export const filterPythonError = (s:string):string => {
    const res = []
    let start = false
    let shouldBreak = false

    for (let line of s.split(/\r?\n/)) {
        if(shouldBreak) continue

        if(start && line.includes("tech.mlsql")) {
           start = false
           shouldBreak = true
        }
        if(start) {
            res.push(line)
        }
       if(!start && line.trimLeft().startsWith("File")) {
           start = true
           res.push(line)
       }       
    }
    if(res.length === 0) {
        return s
    }
    return res.join("\n")

}