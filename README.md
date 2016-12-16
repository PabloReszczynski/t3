# Tarea 3 de lenguajes de programación
### por Pablo Reszczynski

Este intérprete está escrito en javascript. Usando la libreria pun.js para
tener pattern matching y ADTs, haciendo más fácil poder escribir el intérprete
de manera funcional.

## Instrucciones para correr el programa

### Requerimientos:
Node 6.2.2 con npm
[Se puede instalar usando nvm](https://github.com/creationix/nvm)
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
nvm install 6.2.2
```

Para instalar las dependencias debes correr:
```bash
npm install
```

Para correr los tests:
```bash
npm test
```

Para ejecutar un programa:
```bash
node main.js "{+ 1 2}"
3
```
o bien, ejecutando sin un argumento lleva a un prompt del interprete.
