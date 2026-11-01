# Tarea10_Mendez_Alvarez
# MVP Autoservicio · Transparencia financiera

Producto Mínimo Viable (solo frontend, React + Webpack) del rediseño del Portal de Autoservicio
(sección "Mi Estado de Cuenta"), desarrollado para la Tarea 10 de Diseño de Interfaces de Usuario.
Todos los datos son ficticios. Parte del repositorio base
[frontend-sample-app](https://github.com/alexarenasf/frontend-sample-app).

## Metas de usuario implementadas

| Hipótesis | Metas | Pantalla |
|-----------|----------------------------|----------|
| H1 | Confirmar sin dudas que su beca y su CAE llegaron | `/beneficios` |
| H2 | Entender qué significan Cargo, Pago, Saldo y Recibo | `/movimientos` |
| H3 | Encontrar sin confusión lo que pagó el semestre pasado | `/historial` |

## Cómo ejecutarlo

```
npm install
npm run dev     # http://localhost:5050
npm run prod    # build de producción
```

## Estructura

- `src/data/account.js`: datos ficticios (movimientos, cuotas, becas)
- `src/pages/`: una página por meta (+ inicio)
- `src/components/`: layout, barra de navegación, tooltip, etiqueta de estado
- `src/stylesheets/`: estilos SCSS con nomenclatura BEM

