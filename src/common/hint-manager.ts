import * as vscode from 'vscode';
import * as uuid from 'uuid'

interface SQLHeadHint {
    t: string,
    body: string,
    input?: string
    output?: string
    params: Map<string, string>
}

const stripPrefix = (str: string, prefix: string): string => {
    if (str.startsWith(prefix)) {
        return str.slice(prefix.length)
    }
    return str
}

const parse = (code: string): SQLHeadHint => {
    const headers = code.split("\n").
        filter((item) => item.trim().startsWith("#%") || item.trim().startsWith("--%")).
        map(item => stripPrefix(item.trim(), "#%")).
        map(item => stripPrefix(item.trim(), "--%"))

    const body = code

    let t = "mlsql"
    let input: string | undefined = undefined
    let output: string | undefined = undefined
    let headerParams = new Map<string, string>()
    headers.forEach((header, _) => {
        if (!header.includes("=")) {
            t = header
        } else {
            const [k, _v] = header.split(/=(.+)/, 2)
            let v = _v
            switch (k) {
                case "input":
                    input = v
                    break
                case "output":
                    output = v
                    break;
                default:
                    headerParams.set(k, v)
            }
        }
    })
    return {
        t: t,
        body: body,
        input: input,
        output: output,
        params: headerParams
    }

}

const getThenMapOrElse = (container: Map<string, String>, name: string, _map: (_: string) => string, _default: string) => {
    let v = container.get(name)
    if (v) {
        v = _map(v.toString())
    } else {
        v = _default
    }
    return v
}

export const rewriteSQL = (cell: vscode.NotebookCell): string => {
    const header = parse(cell.document.getText())
    if (cell.document.languageId === "python" || header.t === "python") {
        const input = header.input || "command"
        const output = header.output || uuid.v4().replace(/-/g, "")
        const cache = header.params.get("cache") != "false"
        let cacheStr = `
        save overwrite ${output}_0 as parquet.\`/tmp/__python__cache.${output}\`;
        load parquet.\`/tmp/__python__cache.${output}\` as ${output};
        `

        if (!cache) {
            cacheStr = `select * from ${output}_0 as ${output};`
        }

        const confTableOpt = getThenMapOrElse(
            header.params,
            "confTable",
            (item) => ` confTable="${item}" and `, "")

        const model = getThenMapOrElse(
            header.params,
            "model",
            (item) => ` model="${item}" and `, "")

        const schema = getThenMapOrElse(
            header.params,
            "schema",
            (item) => ` !python conf '''schema=${item}'''; `, "")

        const env = getThenMapOrElse(
            header.params,
            "env",
            (item) => ` !python env '''PYTHON_ENV=${item}'''; `, "")

        const dataMode = getThenMapOrElse(
            header.params,
            "dataMode",
            (item) => ` !python conf "dataMode=${item}"; `, "")

        const runIn = getThenMapOrElse(
            header.params,
            "runIn",
            (item) => ` !python conf "runIn=${item}"; `, "")

        const pythonExec = getThenMapOrElse(
            header.params,
            "pythonExec",
            (item) => ` !python conf "pythonExec=${item}"; `, ""
        ) 
        
        const pythonOutputEncoding = getThenMapOrElse(
            header.params,
            "pythonOutputEncoding",
            (item) => ` !python conf "pythonOutputEncoding=${item}"; `, ""
        )

        const userCacheStr = getThenMapOrElse(
            header.params,
            "cacheStr",
            (item) => ` !python conf "cacheStr=${item}"; `, ""
        )

        return `
        ${schema}
        ${env}
        ${dataMode}
        ${runIn}
        ${pythonExec}
        ${pythonOutputEncoding}
        ${userCacheStr}
        run command as Ray.\`\` where
        inputTable="${input}" and
        outputTable="${output}_0" and
        ${confTableOpt}
        ${model}
        code='''${header.body}''';
        ${cacheStr}
          `
    }
    
    if(cell.document.languageId === "yaml" && header.t === "visualize") {
        const input = header.input || "command"
        const output = header.output || uuid.v4().replace(/-/g, "")

        return `
        !visualize ${input} '''
        ${header.body}
        ''';
        `
    }
    return cell.document.getText()
}

