const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const useTypescript =
  (pkg['devDependencies'] || {}).typescript ||
  (pkg['dependencies'] || {}).typescript;

const componentName = process.argv
  .slice(2)
  .find(v => !/-/.test(v))
  .replace(/^\w/, function (chr) {
    return chr.toUpperCase();
  });
const componentOnly = process.argv.find(v => v === '-s');
const dir = path.join(
  __dirname,
  `../src/components/`,
  componentOnly ? '' : componentName
);

const write = (path, content) => {
  fs.writeFileSync(
    path,
    content.replace(/^ {2}/gm, '').replace(/^ *\n/, ''),
    'utf-8'
  );
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

if (!componentOnly) {
  write(`${dir}/index.${useTypescript ? 'ts' : 'js'}`, index);
  write(`${dir}/${componentName}.scss`, scss);
}

write(
  `${dir}/${componentName}.${useTypescript ? 'tsx' : 'jsx'}`,
  reactComponent
);
