const fs = require('fs');
const path = require('path');
const colors = require('colors');
const Table = require('cli-table');
const axios = require('axios');


colors.setTheme({
  ok:'green',
  fail: 'red',
  info: 'blue',
  warn: 'yellow',
});

function extractorDeLinksMarkdown(content) {
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const [, text, url] = match;//Las coincidencias se dividen en 2 partes,
    //El texto dentro del array y la URL estaran dentro del link()
    links.push({ text, url });
  }
  return links;
}

function extractorDeArchivosMarkdown(dirPath) { 
const mdFiles = [];

  fs.readdirSync(dirPath).forEach((file) => { // Lee el contenido dentro del directorio y procesa cada archivo y directorio que pueda estar dentro de él.
    const href = path.join(dirPath, file); // Para cada elemento (archivo o directorio) crea la ruta completa.

    if (fs.statSync(href).isFile() && path.extname(href) === '.md') {
      const mdContent = fs.readFileSync(href, 'utf-8');
      if (typeof mdContent === 'string' && mdContent.trim() !== '') {
        const links = extractorDeLinksMarkdown(mdContent); // Extrae enlaces del archivo .md usando expresiones regulares
        mdFiles.push({
          path: href,
          content: mdContent,
          links: links,
        });
      } else {
        console.fail(colors.fail(`El archivo"${href}" tiene contenido invalido`));
      }
    }
  });

  return mdFiles;
}
const mdLinks = (route = process.argv[2], options = {validate: false, stats: false}) => {

  return new Promise((resolve, reject) => {
    const isAbsolute = path.isAbsolute(route);
    const absoluteRoute = isAbsolute ? route : path.resolve(route);

    if (!fs.existsSync(absoluteRoute)) {
      const errorMessage = colors.fail('La ruta no existe');
      console.error(colors.fail(`El archivo en la ruta ${colors.info(absoluteRoute)} no existe.`));
      reject(new Error(errorMessage));
    } else {
      console.log(colors.ok(`El archivo en la ruta ${colors.info(absoluteRoute)} existe.`));

      fs.stat(absoluteRoute, (error, stats) => {
        if (error) {
          console.error(colors.fail(`Error al obtener informacion de la ruta ${absoluteRoute}.`));
          reject(error);
        } else {
          if (stats.isFile()) {
            console.log(`La ruta "${absoluteRoute}" es un archivo.`);
            const mdContent = fs.readFileSync(absoluteRoute, 'utf-8');

            const links = extractorDeLinksMarkdown(mdContent);
            resolve({ type: 'file', path: absoluteRoute, content: mdContent, links: links });
          } else if (stats.isDirectory()) {
            console.log(colors.warn(`La ruta "${absoluteRoute}" es un directorio.`));

            const files = fs.readdirSync(absoluteRoute);
            if (!files.length) {
              console.log(colors.warn(`El directorio "${absoluteRoute}" esta vacio.`));
              resolve({ type: 'directory', path: absoluteRoute, contents: [], links: [] });
            } else {
              const mdFiles = extractorDeArchivosMarkdown(absoluteRoute);
              const allLinks = mdFiles.flatMap((file) => file.links); // Combina enlaces de todos los archivos .md
              resolve({ type: 'directory', path: absoluteRoute, contents: mdFiles, links: allLinks });
            }
          } else {
            console.log(`La ruta "${absoluteRoute}" no es un archivo o un directorio`);
            reject(new Error('Ruta desconocida'));
          }
        }
      });
    }
  });
};
function obtenerCodigoHttp(url) {
  try {
    const response = axios.get(url);
    return { httpCode: response.status, statusMessage: 'OK', response: response.data };
  } catch (error) {
    if (error.response) {
      // Verifique si error.responde está definido antes de acceder a sus propiedades
      return { httpCode: colors.fail(error.response.status), statusMessage: colors.fail('Error'), response: error.response.data };
    } else {
      return { httpCode: colors.fail('404'), statusMessage: colors.fail('ERROR'), response: 'Error sin respuesta' };
    }
  }
}

const tablaDeDatos = (links) => {
  if (links.length === 0) { //Validación en caso de que no se encuentren enlaces 
    return colors.fail('No se encontraron links.');
  }

  const totalLinks = links.length;
  const uniqueValidLinksSet = new Set();
  const brokenLinksSet = new Set();

  for (const link of links) {
    const { httpCode } =  obtenerCodigoHttp(link.url);
    const parsedHttpCode = parseInt(httpCode);

    if (parsedHttpCode >= 200 && parsedHttpCode < 300) {
      uniqueValidLinksSet.add(link.url);
    } else {
      brokenLinksSet.add(link.url);
    }
  }

  const uniqueValidLinks = uniqueValidLinksSet.size;
  const brokenLinks = brokenLinksSet.size;

  // Definir nombres de propiedades y sus valores.
  console.log('Datos encontrados:');
  const statsData = [
    { name: 'Links totales', value: totalLinks },
    { name: 'Links unicos', value: uniqueValidLinks },
    { name: 'Links rotos', value: brokenLinks },
];

const statsTable = new Table(config);

// Agrega cada propiedad y valor a la tabla.
statsData.forEach(({ name, value }) => {
  const styledName = colors.info(name);
  statsTable.push({ [styledName]: value });
});
  return statsTable.toString();
};

module.exports = {
  extractorDeLinksMarkdown, 
  extractorDeArchivosMarkdown,
  obtenerCodigoHttp,
  tablaDeDatos,
  mdLinks
};