This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
# PIEE Tramitación 

## Instalación

### Requerimientos

- NodeJS >= 16.8
- Yarn 1.22.29. Si se tiene una versión de yarn superior a la 2 se puede setear la versión de esta forma
  ```
  corepack prepare yarn@1.22.29 --activate
  ```

### Desarrollo

1. Instalar las dependencias con

   ```
   yarn add --frozen-lockfile
   ```

   El flag `--frozen-lockfile` evitará que se modifique el `yarn.lock`

2. Correr el proyeto con `yarn dev`

3. Abrir el navegador en http://localhost:3005

### Configurar prettier en VS Code

1. Instalar la extensión de prettier `esbenp.prettier-vscode`. Se puede usar ese nombre en el buscador de extensiones del VS Code.

2. Abrir las configuraciones en JSON del VS Code y agregar las siguientes líneas

   ```json
   "[typescriptreact]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "editor.formatOnSave": true
   },
   ```

   Esto formateará los archivos `.tsx` automáticamente al momento de guardar.

   > Las configuraciones en JSON se encuentran apretando `F1` y escribiendo ">Open User Settings (JSON)"

### Formatear código

Para formatear todo el código dentro de la carpeta `/app` se puede usar el siguiente script

```shell
yarn format:fix
```
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
