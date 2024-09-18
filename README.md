<h1>Travel App</h1>

<h2>Proceso de instalacion</h2>

<h3>Requisitos</h3>
<ol>
  <li>NodeJS</li>
  <li>VS Code</li>
  <li>Expo CLI</li>
  <li>Aplicacion movil Expo Go</li>
</ol>

<h4>Instalacion Expo CLI</h4>
<p>Abrir un CMD y ejecutar el siguiente comando: npm install -g expo-cli</p>
![image](https://github.com/user-attachments/assets/ba808c26-ab32-43c9-b187-a7d89b602e2b)

<h4>Instalacion aplicacion Expo GO</h4>
<p>Dirigirse a PlayStore o AppStore y buscar ExpoGo, esta aplicacion es necesaria para probar la aplicacion en un dispositivo movil. Ademas, incluye herramientas de testeo, para evaluar el rendimiento</p>
![image](https://github.com/user-attachments/assets/0a5331f5-338d-4053-8d0b-788ed08ba5a5)

<p>Con los requisitos instalados, se procede a abrir la carpeta de proyecto en VS Code, con el proyecto abierto abrimos una consola e instalamos las siguientes dependencias bajo los comandos npm:</p>

<h3>Dependencias de proyecto</h3>
<ol>
  <li>npm i react-native-url-polyfill base64-arraybuffer react-native-loading-spinner-overlayr</li>
  <li> npm i @supabase/supabase-js</li>
  <li>npx expo install expo-file-system</li>
  <li>npx expo install expo-image-picker</li>
  <li>npm install @react-native-async-storage/async-storage@1.23.1</li>
</ol>

<p>Para confirmar que las dependencias se instalaron con exito, se puede ejecutar el comando npm install</p>

<h3>Descripcion de proyecto</h3>
<p>El proyecto esta desarollado en React Native Expo. Usa una base de datos de tipo SQL alojada en Supabase para almacenar los datos, un storage de supabase para almacenar las imagenes, e igualmente se usa Supabase para el proceso de autentificacion. La estrucutura de proyecto, se cuenta con una carpeta app donde se encuentran los layouts con las pantallas de la aplicacion, una carpeta components donde se ubican algunos componentes necesarios para las pantallas. Se cuenta con un archivo config y authprovider donde se inicia el entorno de Supabase y se engloba la apliacion con el proveedor de autentificacion.</p>
![image](https://github.com/user-attachments/assets/119d7313-cbe7-4fbc-8fc9-8ae58a212285)

<h3>Inicio de aplicacion</h3>
<p>Para ejecutar la aplicacion, nos ubicamos dentro de la carpeta raiz de proyecto, abrimos una terminal y ejecutamos el comando npx expo. Este comando iniciara la aplicacion en modo desarollador y nos permitira abrirla en un simulador android o un telefono movil con la aplicacion ExpoGO. Al ejecutarse el comando, se crea un codigo QR, con el cual podemos abrir nuestra aplicacion en nuestro telefono movil</p>
![image](https://github.com/user-attachments/assets/e3424500-5c07-450d-a57e-3b029952cb52)
