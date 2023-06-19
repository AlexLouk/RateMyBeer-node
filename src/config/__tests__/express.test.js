import app from '../../index'; // Überprüfen Sie den Pfad zum index.js-Modul

describe('App', () => {
    test('should create an instance of the app', () => {
        expect(app).toBeDefined();
    });
});

describe('Example Test Suite', () => {
    test('should pass', () => {
        expect(true).toBeTruthy();
    });
});
