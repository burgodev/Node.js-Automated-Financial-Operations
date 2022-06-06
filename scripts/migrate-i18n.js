const fs = require('fs')

const json = JSON.parse(fs.readFileSync(`${__dirname}/../src/i18n/en.json`))

const path = []

const format = obj => {
    return Object.entries(obj).map(([k, v]) => {
        path.push(k)
        if (typeof v == 'object') {
            v = format(v).reduce((p, c) => { 
                return {...p, ...c}
            }, v)
        } else if (typeof v == 'string') {
            v = path.join('.')
    }
        path.pop()
        
        return {[k]: v}
    })
}

const result = format(json).reduce((p, c) => { 
    return {...p, ...c}
}, {})

const var_name = 't_schema'

fs.writeFileSync(`${__dirname}/../src/i18n/mock.ts`, `const ${var_name} = ${JSON.stringify(result)}; export default ${var_name};`)