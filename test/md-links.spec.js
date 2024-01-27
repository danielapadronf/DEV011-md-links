const  {extractorDeLinksMarkdown,mdLinks, obtenerCodigoHttp} = require('../functions'); 
const path = require('path');
const axios = require ('axios');
/*const mdLinks = require('./../index.js');*/
const MockAdapter = require('axios-mock-adapter');
const colors = require('colors');

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
    expect(typeof extractorDeLinksMarkdown).toBe('function');
  });
  it('debería extraer un solo enlace', () => {
    const markdown = '[Google](https://www.google.com)';
    const expected = [{ text: 'Google', url: 'https://www.google.com' }];
    expect(extractorDeLinksMarkdown(markdown)).toEqual(expected);
  });

 });
  test('debería rechazar la promesa si la ruta no existe', () => {
    expect(mdLinks('/home/carlos/code/DEV011-md-links/docs.js')).rejects.toThrowError('La ruta no existe');
  },20000);

  test('debería rechazar la promesa si la ruta no es ni archivo ni directorio', () => {
    expect(mdLinks('/home/carlos/code/DEV011-md-links/prueba.js')).rejects.toThrowError('Ruta desconocida');
  },20000);

  const mock = new MockAdapter(axios);
  
  describe('obtenerCodigoHttp', () => {
    afterEach(() => {

      mock.reset();
    });
    test('debería manejar un error de respuesta HTTP', () => {
      const url = 'https://ejemplo.com';
  
      mock.onGet(url).reply(404, 'Not Found');
  
      const result = obtenerCodigoHttp(url);
  
      expect(result).toEqual({
        httpCode: colors.fail(404),
        statusMessage: colors.fail('ERROR'),
        response: 'Error sin respuesta',
      });
    });
    });
  
