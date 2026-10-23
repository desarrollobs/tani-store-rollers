# Tani Store Rollers — catálogo inicial

Catálogo responsive hecho con HTML, CSS y JavaScript. Incluye tarjetas de productos, precios en guaraníes, buscador, orden por precio/nombre y botones de WhatsApp con el producto precargado.

## Antes de publicar
- Los nombres, precios, descripciones y fotos del archivo son ejemplos. Reemplazalos por los datos y las fotos reales de Tani Store Rollers.
- El WhatsApp configurado es `595961241109`, equivalente a `+595 961 241109`. Verificá que ese número tenga una cuenta activa de WhatsApp.
- Las fotos de muestra son imágenes remotas de ejemplo; para una tienda real, es preferible usar fotos propias y cambiar `image` y `alt` en cada producto.

## Probar en tu computadora
1. Descomprimí la carpeta.
2. Abrí `index.html` en Chrome, Safari o Firefox.
3. Probá el buscador, el selector de orden y los botones de WhatsApp.
4. Si el navegador restringe algo al abrir el archivo directamente, abrilo con la extensión Live Server de Visual Studio Code.

## Agregar o editar productos
Dentro de `index.html`, buscá `const products = [` y editá cada objeto. `price` debe ser un número sin puntos ni comas (por ejemplo, `450000`). En `image`, colocá la URL pública de la foto. Duplicá un objeto para añadir otro producto y asignale un `id` único.

## Publicar gratis con GitHub Pages
1. Creá una cuenta en https://github.com/ si no tenés.
2. Creá un repositorio nuevo, por ejemplo `tani-store-rollers`.
3. Subí `index.html` a la raíz del repositorio.
4. Entrá en Settings → Pages.
5. En Build and deployment, elegí Deploy from a branch, seleccioná `main` y `/ (root)`, y guardá.
6. GitHub te mostrará una URL pública cuando termine de publicar.

También podés importar el repositorio en https://vercel.com/ y desplegarlo como proyecto estático.

## Integrarlo en Google Sites
- Publicá primero la página y copiá su URL HTTPS.
- En Google Sites, usá Insertar → Incorporar/Insertar URL si está disponible, o agregá un botón/enlace hacia el catálogo.
- Si la web no se puede mostrar dentro de un bloque, dejala como sitio externo y enlazala desde Sites. Google Sites puede limitar scripts incrustados; no pegues el archivo entero en un bloque de código esperando que funcione como un hosting completo.

## Importante
Este catálogo no procesa pagos, no reserva stock ni guarda pedidos. El cliente consulta por WhatsApp y ustedes coordinan la venta manualmente. Para usarlo comercialmente, confirmá precios, disponibilidad, talles, condiciones de entrega y derechos de uso de las imágenes.
