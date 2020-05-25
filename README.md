# Eva - Eventos Argentinos - EventBrite Clone
Eva es una aplicacion web utilizando NodeJs con RESTful routing.

## Caracteristicas
* Autenticacion: 
  * Los usuarios se registran indicando: username, nombre y apellido, clave, foto avatar, biografia
  * Dos tipos de usuarios: Administradores (que se registran utilizando un codigo unico de identificacion) y los usuarios comunes
  * Ambos tipos de usuarios incian sesion con su username y clave 

* Autorizacion: 
  * Un usuario no puede crear eventos, modificarlos o borrarlos, ni tampoco ver el perfil de otros usuarios sin anter haberse logueado.
  * Un usuario no puede editar o borrar eventos o comentarios creados por otros usuarios
  * El usuario con perfil de Administrador tiene permisos para manejar todos los eventos y comentarios
  * El Administrador conoce y puede generar el codigo secreto para que un usuario, al momento de registrarse, lo haga con perfil de administrador

* Funcionalidades de eventos y comentarios:
  * CRUD: Crear, visualizar, editar y eliminar eventos y comentarios
  * Subir fotos de eventos desde local

* Cada usuario puede crear un perfil en el cual se visualizara su informacion y eventos creados
* Mensajes Flash al momento en que el usuario interactua con la aplicacion (al momento de registrarse, loguarse, crear eventos, crear comentarios, etc)
* Diseño Responsive

## Desarrollado con la siguiente tecnologia:
### Frontend: 
* HTML5
* CSS3
* Google Fonts
* Bootstrap 4

### Backend: 
* javaScript
* nodeJs
* express
* base de datos mongoDB
* mongoose
* ejs
* passport
* passport-local
* passport-local-mongoose
* body-parser
* express-session
* method-override
* connect-flash

## Deployment
* Heroku
