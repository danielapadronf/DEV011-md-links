const { mdLinks, tablaDeDatos, obtenerCodigoHttp } = require("./functions.js");
const path = require('path');
const colors = require("colors");
const Table = require('cli-table');


const command = process.argv[2];
const validateOptionIndex = process.argv.indexOf('--validate');
const statsOptionIndex = process.argv.indexOf('--stats');
const hasValidateOption = validateOptionIndex !== -1;
const hasStatsOption = statsOptionIndex !== -1;

colors.setTheme({
  ok:'green',
  fail: 'red',
  info: 'blue',
  warn: 'yellow',
});

if (command) 
  if (!hasValidateOption && !hasStatsOption) {
    console.log(colors.fail(`El comando es invalido o no se proporciono. Debe ser ${colors.info('--validate')}, ${colors.info('--stats')}, ${colors.info('--validate --stats')} o ${colors.info('--stats --validate')}.`));
} else {
  mdLinks(command, { validate: hasValidateOption })
    .then(result => {
      if (hasValidateOption) {
        if(!result.links.length){
          console.log(colors.fail('No se econtro informacion'));
          return
        } else if (result.type === 'file') {
          // Imprime la tabla de enlaces validados
          console.log('Informacion encontrada:');
          const table = new Table({
            head: ['URL'.info, 'Text'.info, 'HTTPcode'.info, 'Status'.info],
            colWidths: [30, 30, 10, 10]
          });

          const linkPromises = result.links.map(link => {
            const linkText = link.text || 'No texto';
            const { httpCode, statusMessage } = obtenerCodigoHttp(link.url);
            return [link.url, linkText, httpCode, statusMessage];
          });

          Promise.all(linkPromises)
            .then(linkData => {
              for (const data of linkData) {
                table.push(data);
              }
              console.log(table.toString());
            })
            .catch(error => console.error(error));
        } else if (result.type === 'directory') {
          // Imprime la tabla de enlaces validados
          console.log('Informacion encontrada:');
          const table = new Table({
            head: ['URL'.info, 'Text'.info, 'HTTPcode'.info, 'Status'.info],
            colWidths: [30, 30, 10, 10]
          });

          const linkPromises = result.links.map(link => {
            const linkText = link.text || 'No texto';
            const linkUrl = link.url || 'No links';
            const { httpCode, statusMessage } = obtenerCodigoHttp(link.url);
            return [
              linkUrl,
              linkText,
              httpCode,
              statusMessage
            ];
          });

          Promise.all(linkPromises)
            .then(linkData => {
              for (const data of linkData) {
                table.push(data);
              }
              console.log(table.toString());
            })
            .catch(error => console.error(error));
        }
      }

      if (hasStatsOption) {
        tablaDeDatos(result.links)
          .then(stats => console.log(stats))
          .catch(error => console.error(error));
      }
    })
    .catch(error => console.error(error));
}