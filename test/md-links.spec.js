const functions = require('./../functions'); 
const path = require('path');
const axios = require ('axios');
const mdLinks = require('./../index.js');

jest.mock('fs', () => ({
  mdLinks: jest.fn(() => true),
  existsSync: jest.fn(() => true),
  extractMDFilesFromDir: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn(),
  readFileSync: jest.fn(),
  stat:jest.fn()
}));

jest.mock('axios');

describe('extractorDeLinksMarkdown', () => {
  it('debería ser una función', () => {
    expect(typeof functions.extractorDeLinksMarkdown).toBe('function');
  });
  it('debería extraer un solo enlace', () => {
    const markdown = '[Google](https://www.google.com)';
    const expected = [{ text: 'Google', url: 'https://www.google.com' }];
    expect(functions.extractorDeLinksMarkdown(markdown)).toEqual(expected);
  });

 });

describe('mdLinks', () => {
  test('debería resolver correctamente si la ruta es un archivo existente', async () => {
    const result = await functions.mdLinks('docs/test/testing-md.md');

    expect(result.type).toBe('file');
    expect(result.path).toBe(path.resolve('docs/test/testing-md.md'));
  },20000);

  test('debería resolver correctamente si la ruta es un directorio existente', async () => {
    const result = await functions.mdLinks('./ruta/b');

    expect(result.type).toBe('directory');
    expect(result.path).toBe(path.resolve('./ruta/b'));
  },20000);

  test('debería rechazar la promesa si la ruta no existe', async () => {
    await expect(functions.mdLinks('/home/carlos/code/DEV011-md-links/docs.js')).rejects.toThrowError('La ruta no existe');
  },20000);

  test('debería rechazar la promesa si la ruta no es ni archivo ni directorio', async () => {
    await expect(functions.mdLinks('/home/carlos/code/DEV011-md-links/prueba.js')).rejects.toThrowError('Ruta desconocida');
  },20000);

});
