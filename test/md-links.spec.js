const  {extractorDeLinksMarkdown,mdLinks, obtenerCodigoHttp, extractorDeArchivosMarkdown, tablaDeDatos} = require('../functions'); 
const path = require('path');
const axios = require ('axios');
const MockAdapter = require('axios-mock-adapter');
const colors = require('colors');
const { config } = require('process');

jest.mock('axios');

describe ('extractorDeArchivosMarkdown' , () => {
  it ('deberia ser una funcion', ()=> {
    expect (typeof extractorDeArchivosMarkdown).toBe('function')
  })
  it ('deberia retornar un array vacio', ()=> {
    expect (extractorDeArchivosMarkdown('/home/carlos/code/DEV011-md-links/test')).toEqual([])
  })
});

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
    return expect(mdLinks('/home/carlos/code/DEV011-md-links/docs.js')).rejects.toThrowError('La ruta no existe');
  });

  const mock = new MockAdapter(axios);
  
  describe('obtenerCodigoHttp', () => {
    afterEach(() => {

      mock.reset();
    });
    test('debería manejar un error de respuesta HTTP', () => {
      const url = 'https://www.google.com';
  
      mock.onGet(url).reply(404, 'Not Found');
  
      const result = obtenerCodigoHttp(url);
  
      expect(result).toEqual({
        httpCode: colors.fail(404),
        statusMessage: colors.fail('ERROR'),
        response: 'Error sin respuesta',
      });
    });
    });
    describe ('tablaDeDatos' , () => {
      jest.mock('cli-table')
      it ('deberia ser una funcion', ()=> {
        expect (typeof tablaDeDatos).toBe('function')
      })
      it ('deberia retornar una de tabla de datos', ()=> {
        expect (tablaDeDatos(['https://www.google.com'])).toEqual([])
      })
    });

  
