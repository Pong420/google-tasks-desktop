const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const useTypescript = (pkg['devDependencies'] || {}).typescript || (pkg['dependencies'] || {}).typescript;

const componentName = process.argv[2].replace(/^\w/, function(chr) {
  return chr.toUpperCase();
});
const dir = path.join(__dirname, `../src/components/${componentName}`);

const write = (path, content) => {
  fs.writeFileSync(path, content.replace(/^ {2}/gm, '').replace(/^ *\n/, ''), 'utf-8');
};

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const index = `
  import './${componentName}.scss';
  
  export * from './${componentName}';
  export { ${componentName} as default } from './${componentName}';
  `;

const reactComponent = `
import React from 'react';
  
  export function ${componentName}() {
    return (
      <div className="${componentName
        .split(/(?=[A-Z])/)
        .map(str => str.toLocaleLowerCase())
        .join('-')}"></div>
    );
  }
  `;

const scss = '';

write(`${dir}/index.${useTypescript ? 'ts' : 'js'}`, index);
write(`${dir}/${componentName}.${useTypescript ? 'tsx' : 'jsx'}`, reactComponent);
write(`${dir}/${componentName}.scss`, scss);
