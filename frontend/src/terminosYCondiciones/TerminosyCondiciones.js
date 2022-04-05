import React, {useEffect, useState} from 'react'
import { Container, Button, Spinner } from 'reactstrap';
import logo from '../imgs/camioneta.png'
import Menu from '../Components/inicio/menuInicio/MenuInicio'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const TerminosyCondiciones = () => {
   
    const [contacto, setContacto] = useState([])
    const [loadingContacto, setLoadingContacto] = useState(true)

    const fetchContacto = async() => {
        const contactoRef = collection(db, "contacto")
        const dataContacto =  await getDocs(contactoRef)
        const getDataContacto = dataContacto.docs.map((doc) => ({...doc.data()}))      
        setContacto(getDataContacto.filter(c => c.nombre === "Contacto"))
        setLoadingContacto(false)
    }

    useEffect(() => {
        fetchContacto();
    }, [])

    
    const telefono = loadingContacto ? <Spinner className="gris" size="sm" /> : contacto?.map(c => (c.nombre === "Contacto" && <span className="pizchico">+52 {c.telefono.replace(/\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*/, '$1 $2 $3')}</span>))
    const email =    loadingContacto ? <Spinner className="gris" size="sm" /> : contacto?.map(c => (c.nombre === "Contacto" && <span className="pizchico">{c.email}</span>))
    

    return (
        <React.Fragment>
            <Menu hrefLogo="/" chico soloVolver className="fondoBlanco" blanco />
            <Container>
                <div className="gris pabmediano">
                    <div className="pdechico pizchico">
                    <div className="centro parmediano pabmediano">
                        <img
                        className="logoTerminos"
                        src={logo}
                        alt="logo de Mercado a la Mano chico términos y condiciones"
                        />
                    </div>
                    <div className="wbold tmuygrande parchico pabchico negro centro">
                        TÉRMINOS Y CONDICIONES
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Este contrato describe los términos y condiciones generales
                        (en adelante únicamente "TÉRMINOS Y CONDICIONES") aplicables
                        al uso de los contenidos, productos y servicios ofrecidos a
                        través del sitio{' '}
                        <label className="wbold azul">www.mercadoalamano.com</label> (en
                        adelante, "SITIO WEB"), del cual es titular{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        (en adelante, "TITULAR") quien tiene su domicilio establecido
                        en Puebla, en la siguiente dirección:{' '}
                        <label className="wbold negro">
                        3ra privada de la calle 23 sur #2116, Puebla Puebla 72410
                        </label>
                        .
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Cualquier persona que desee acceder o hacer uso del sitio o
                        los servicios que en él se ofrecen, podrá hacerlo sujetándose
                        a los presentes TÉRMINOS Y CONDICIONES, así como a políticas y
                        principios incorporados al presente documento. En todo caso,
                        cualquier persona que no acepte los presentes términos y
                        condiciones, deberá abstenerse de utilizar el SITIO WEB y/o
                        adquirir los productos y servicios que en su caso sean
                        ofrecidos.
                    </div>
                    <div className="bold">I. DEL OBJETO.</div>
                    <div className="parmuychico pabmuychico justificado">
                        El objeto de los presentes TÉRMINOS Y CONDICIONES es regular
                        el acceso y la utilización del SITIO WEB, entendiendo por éste
                        cualquier tipo de contenido, producto o servicio que se
                        encuentre a disposición del público en general dentro del
                        dominio: <label className="wbold azul">www.mercadoalamano.com</label>.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El TITULAR se reserva la facultad de modificar en cualquier
                        momento y sin previo aviso, la presentación, los contenidos,
                        la funcionalidad, los productos, los servicios, y la
                        configuración que pudiera estar contenida en el SITIO WEB; en
                        este sentido, el USUARIO reconoce y acepta que{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        en cualquier momento podrá interrumpir, desactivar o cancelar
                        cualquiera de los elementos que conforman el SITIO WEB o el
                        acceso a los mismos.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Además del costo de la conexión a internet en virtud de los
                        servicios que el USUARIO tenga contratados con algún proveedor
                        de telecomunicaciones, parte de los contenidos o servicios
                        ofrecidos en el sitio{' '}
                        <label className="wbold azul">www.mercadoalamano.com</label> o, en su
                        caso, por terceros a través del SITIO WEB pueden estar sujetos
                        a la contratación previa del contenido, producto o servicio,
                        en cuyo caso se especificará de forma clara y se pondrá a
                        disposición del USUARIO las condiciones generales o
                        particulares por las que se rija el acceso a dichos
                        contenidos.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El acceso a parte de los contenidos y servicios del SITIO WEB
                        podrá realizarse previa suscripción o registro previo del
                        USUARIO.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El SITIO WEB se encuentra dirigido a toda persona con
                        capacidad de ejercicio, ya sea que la ejercite por sí mismo o
                        mediante representante.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El SITIO WEB está dirigido principalmente a USUARIOS
                        residentes en la República Mexicana, por lo cual, MERCADO A LA MANO S.
                        DE R. L. DE CV no asegura que el SITIO WEB cumpla total o
                        parcialmente con la legislación de otros países, de forma que,
                        si el USUARIO reside o tiene su domicilio establecido en otro
                        país y decide acceder o utilizar el SITIO WEB lo hará bajo su
                        propia responsabilidad y deberá asegurarse de que tal acceso y
                        navegación cumple con la legislación local que le es
                        aplicable, no asumiendo{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        ninguna responsabilidad que se pueda derivar de dicho acto.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Se hace del conocimiento del USUARIO que el TITULAR podrá
                        administrar o gestionar el SITIO WEB de manera directa o a
                        través de un tercero, lo cual no modifica en ningún sentido lo
                        establecido en los presentes TÉRMINOS Y CONDICIONES.
                    </div>
                    <div className="wbold parchico pabchico negro">
                        II. DEL USUARIO.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El acceso o utilización del SITIO WEB, así como de los
                        recursos habilitados para interactuar entre los USUARIOS, o
                        entre el USUARIO y el TITULAR tales como medios para realizar
                        publicaciones o comentarios, confiere la condición de USUARIO
                        del SITIO WEB, por lo que quedará sujeto a los presentes
                        TÉRMINOS Y CONDICIONES, así como a sus ulteriores
                        modificaciones, sin perjuicio de la aplicación de la
                        legislación aplicable, por tanto, se tendrán por aceptados
                        desde el momento en el que se accede al SITIO WEB. Dada la
                        relevancia de lo anterior, se recomienda al USUARIO revisar
                        las actualizaciones que se realicen a los presentes TÉRMINOS Y
                        CONDICIONES.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Es responsabilidad del USUARIO utilizar el SITIO WEB de
                        acuerdo a la forma en la que fue diseñado; en este sentido,
                        queda prohibida la utilización de cualquier tipo de software
                        que automatice la interacción o descarga de los contenidos o
                        servicios proporcionados a través del SITIO WEB. Además, el
                        USUARIO se compromete a utilizar la información, contenidos o
                        servicios ofrecidos a través del SITIO WEB de manera lícita,
                        sin contravenir lo dispuesto en los presentes TÉRMINOS Y
                        CONDICIONES, la moral o el orden público, y se abstendrá de
                        realizar cualquier acto que pueda suponer una afectación a los
                        derechos de terceros, o perjudique de algún modo el
                        funcionamiento del SITIO WEB.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Asimismo, el usuario se compromete a proporcionar información
                        lícita y veraz en los formularios habilitados en el SITIO WEB,
                        en los cuales el usuario tenga que proporcionar ciertos datos
                        o información para el acceso a algún contenido, producto o
                        servicio ofrecido por el propio SITIO WEB. En todo caso, el
                        USUARIO notificará de forma inmediata al TITULAR acerca de
                        cualquier hecho que permita suponer el uso indebido de la
                        información registrada en dichos formularios, tales como,
                        robo, extravío, o acceso no autorizado a cuentas y/o
                        contraseñas, con el fin de proceder a su inmediata
                        cancelación.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        se reserva el derecho de retirar todos aquellos comentarios y
                        aportaciones que vulneren la ley, el respeto a la dignidad de
                        la persona, que sean discriminatorios, atenten contra los
                        derechos de tercero o el orden público, o bien, que a su
                        juicio no resulten adecuados para su publicación.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        En cualquier caso,{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        no será responsable de las opiniones vertidas por los USUARIOS
                        a través de comentarios o publicaciones que estos realicen.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        De igual forma, MERCADO A LA MANO S. DE R. L. DE CV no es responsable
                        de las actividades de los usuarios, ni de mal uso que éstos
                        hagan de este sitio web.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El sólo acceso al SITIO WEB no supone el establecimiento de
                        ningún tipo de relación entre el TITULAR y el USUARIO.
                    </div>
                    <div className="wbold parchico pabchico negro">
                        III. DEL ACCESO Y NAVEGACIÓN EN EL SITIO WEB.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El TITULAR no garantiza de ningún modo la continuidad y
                        disponibilidad de los contenidos, productos o servicios
                        ofrecidos a través del SITIO WEB, no obstante, el TITULAR
                        llevará a cabo las acciones que de acuerdo a sus posibilidades
                        le permitan mantener el buen funcionamiento del SITO WEB, sin
                        que esto suponga alguna responsabilidad de parte de{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>
                        .
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        De igual forma{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        no será responsable ni garantiza que el contenido o software
                        al que pueda accederse a través del SITIO WEB, se encuentre
                        libre de errores, software malicioso, o que pueda causar algún
                        daño a nivel de software o hardware en el equipo a través del
                        cual el USUARIO accede al SITIO WEB.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El TITULAR tampoco se hace responsable de los daños que
                        pudiesen ocasionarse por un uso inadecuado del SITIO WEB. En
                        ningún caso
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        será responsable por las pérdidas, daños o perjuicios, de
                        cualquier tipo, que surjan por el sólo acceso o utilización
                        del SITIO WEB.
                    </div>
                    <div className="wbold parchico pabchico negro">
                        IV. POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        AVISO DE PRIVACIDAD La protección de sus datos personales es
                        muy importante para este sitio web, por la cual, este AVISO DE
                        PRIVACIDAD, cumple con la LEY FEDERAL DE PROTECCIÓN DE DATOS
                        PERSONALES EN POSESIÓN DE LOS PARTICULARES, tiene como
                        finalidad informarle el tipo de datos personales que recabamos
                        de Usted, cómo los usamos, manejamos y aprovechamos, y con
                        quién los compartimos.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        ¿Qué datos personales recabamos de usted?
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Como cliente de alguno de nuestros servicios le podemos
                        solicitar información personal, que varía según el caso,
                        relativa a:
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Su nombre, lugar y fecha de nacimiento, estado civil,
                        domicilio, ocupación, RFC, CURP, correo electrónico y números
                        telefónicos.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Comprobantes oficiales que acrediten su identidad y la
                        información que usted declara.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        ¿Para qué usamos sus datos personales?
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Este sitio web recaba y usa sus datos personales para el
                        cumplimiento de las siguientes finalidades:
                    </div>
                    <ul>
                        <li>Confirmar su identidad.</li>
                        <li>Verificar la información que nos proporciona.</li>
                        <li>Proporcionar un servicio de acuerdo a sus intereses.</li>
                        par
                    </ul>
                    <div className="wbold negro">
                        ¿Con quién compartimos su información y para qué fines?
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Sus datos personales serán tratados por los accionistas,
                        directores, representantes, agentes y empleados de este sitio
                        web, así como por usuarios de éste que requieran de esos datos
                        para realizar sus servicios.
                    </div>
                    <div className="wbold negro">
                        ¿Cómo puede limitar el uso o divulgación de su información
                        personal o acceder, rectificar, cancelar u oponerse al
                        tratamiento de sus datos personales?
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Usted puede limitar el uso y divulgación de su información
                        personal y ejercer sus derechos de acceso, rectificación,
                        cancelación y oposición o la revocación del consentimiento, a
                        través de los siguientes medios que hemos instrumentado:
                    </div>
                    <ul>
                        <li>
                        Presentando su solicitud personalmente en nuestro domicilio,
                        dirigida al responsable del tratamiento de datos personales
                        en esta oficina.
                        </li>
                        <li>
                        Enviando correo electrónico a la siguiente dirección
                        electrónica: {email}
                        </li>
                        <li>Llamando al siguiente número telefónico: {telefono}</li>
                    </ul>
                    <div className="wbold negro">
                        ¿Cómo conocer los cambios al presente aviso de privacidad?
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El presente aviso de privacidad puede sufrir modificaciones,
                        cambios o actualizaciones, por lo cual nos comprometemos a
                        mantenerlo informado de tal situación en nuestro sitio web.
                    </div>
                    <div className="wbold negro">¿Cómo contactarnos?</div>
                    <div className="parmuychico pabmuychico justificado">
                        Si usted tiene alguna duda sobre el presente aviso de
                        privacidad, puede dirigirla a:
                    </div>
                    <ul>
                        <li>La dirección electrónica: {email}</li>
                        <li>Al teléfono: {telefono}.</li>
                        <li>
                        La dirección postal: 3ra privada de la calle 23 sur #2116,
                        codigo postal: 72410, Puebla, Puebla, México.
                        </li>
                    </ul>
                    <div className="parmuychico pabmuychico justificado">
                        Lo anterior cumple con los datos requeridos por el Reglamento
                        General de Protección de Datos (RGPD) que rige la actividad
                        comercial en la Unión Europea.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El SITIO WEB podrá incluir hipervínculos o enlaces que
                        permitan acceder a páginas web de terceros distintos de{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>
                        . Los titulares de dichos sitios web dispondrán de sus propias
                        políticas de privacidad y protección de datos, por lo cual
                        MERCADO A LA MANO S. DE R. L. DE CV no asume ningún tipo de
                        responsabilidad por los datos que san facilitados por el
                        USUARIO a través de cualquier sitio web distinto a{' '}
                        <label className="wbold azul">www.mercadoalamano.com</label>.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        se reserva el derecho a modificar su Política de Privacidad,
                        de acuerdo a sus necesidades o derivado de algún cambio en la
                        legislación. El acceso o utilización del SITIO WEB después de
                        dichos cambios, implicará la aceptación de estos cambios.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Por otra parte, el acceso al SITIO WEB puede implicar la
                        utilización de cookies, las cuales, son pequeñas cantidades de
                        información que se almacenan en el navegador utilizado por el
                        USUARIO. Las cookies facilitan la navegación, la hacen más
                        amigable, y no dañan el dispositivo de navegación, para ello,
                        pueden recabar información para ingresar al SITIO WEB,
                        almacenar las preferencias del USUARIO, así como la
                        interacción que éste tenga con el SITIO WEB, como por ejemplo:
                        la fecha y hora en la que se accede al SITIO WEB, el tiempo
                        que se ha hecho uso de este, los sitios visitados antes y
                        después del mismo, el número de páginas visitadas, la
                        dirección IP de la cual accede el usuario, la frecuencia de
                        visitas, etc.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Este tipo de información será utilizada para mejorar el SITIO
                        WEB, detectar errores, y posibles necesidades que el USUARIO
                        pueda tener, lo anterior a efecto de ofrecer a los USUARIOS
                        servicios y contenidos de mejor calidad. En todo caso, la
                        información que se recopile será anónima y no se identificará
                        a usuarios individuales.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        En caso de que el USUARIO no desee que se recopile este tipo
                        de información deberá deshabilitar, rechazar, restringir y/o
                        eliminar el uso de cookies en su navegador de internet. Los
                        procedimientos para realizar estas acciones pueden diferir de
                        un navegador a otro; en consecuencia, se sugiere revisar las
                        instrucciones facilitadas por el desarrollador del navegador.
                        En el supuesto de que rechace el uso de cookies (total o
                        parcialmente) el USUARIO podrá continuar haciendo uso del
                        SITIO WEB, aunque podrían quedar deshabilitadas algunas de las
                        funciones del mismo.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Es posible que en el futuro estas políticas respecto a las
                        cookies cambien o se actualicen, por ello es recomendable
                        revisar las actualizaciones que se realicen a los presentes
                        TÉRMINOS Y CONDICIONES, con objetivo de estar adecuadamente
                        informado sobre cómo y para qué utilizamos las cookies que se
                        generan al ingresar o hacer uso del SITIO WEB.
                    </div>
                    <div className="wbold parchico pabchico negro">
                        V. POLÍTICA DE ENLACES.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El SITIO WEB puede contener enlaces, contenidos, servicios o
                        funciones, de otros sitios de internet pertenecientes y/o
                        gestionados por terceros, como por ejemplo imágenes, videos,
                        comentarios, motores de búsqueda, etc.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        La utilización de estos enlaces, contenidos, servicios o
                        funciones, tiene por objeto mejorar la experiencia del USUARIO
                        al hacer uso del SITIO WEB, sin que pueda considerarse una
                        sugerencia, recomendación o invitación para hacer uso de
                        sitios externos.{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        en ningún caso revisará o controlará el contenido de los
                        sitios externos, de igual forma, no hace propios los
                        productos, servicios, contenidos, y cualquier otro material
                        existente en los referidos sitios enlazados; por lo cual,
                        tampoco se garantizará la disponibilidad, exactitud,
                        veracidad, validez o legalidad de los sitios externos a los
                        que se pueda tener acceso a través del SITIO WEB. Así mismo,
                        el TITULAR no asume ninguna responsabilidad por los daños y
                        perjuicios que pudieran producirse por el acceso o uso, de los
                        contenidos, productos o servicios disponibles en los sitios
                        web no gestionados por{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        a los que se pueda acceder mediante el SITIO WEB.
                    </div>
                    <div className="wbold parchico pabchico negro">
                        VI. POLÍTICA EN MATERIA DE PROPIEDAD INTELECTUAL E INDUSTRIAL.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        por sí o como parte cesionaria, es titular de todos los
                        derechos de propiedad intelectual e industrial del SITIO WEB,
                        entendiendo por este el código fuente que hace posible su
                        funcionamiento así como las imágenes, archivos de audio o
                        video, logotipos, marcas, combinaciones de colores,
                        estructuras, diseños y demás elementos que lo distinguen.
                        Serán, por consiguiente, protegidas por la legislación
                        mexicana en materia de propiedad intelectual e industrial, así
                        como por los tratados internacionales aplicables. Por
                        consiguiente, queda expresamente prohibida la reproducción,
                        distribución, o difusión de los contenidos del SITIO WEB, con
                        fines comerciales, en cualquier soporte y por cualquier medio,
                        sin la autorización de{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>
                        .
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        El USUARIO se compromete a respetar los derechos de propiedad
                        intelectual e industrial del TITULAR. No obstante, además de
                        poder visualizar los elementos del SITIO WEB podrá
                        imprimirlos, copiarlos o almacenarlos, siempre y cuando sea
                        exclusivamente para su uso estrictamente personal.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        Por otro lado, el USUARIO, se abstendrá de suprimir, alterar,
                        o manipular cualquier elemento, archivo, o contenido, del
                        SITIO WEB, y por ningún motivo realizará actos tendientes a
                        vulnerar la seguridad, los archivos o bases de datos que se
                        encuentren protegidos, ya sea a través de un acceso
                        restringido mediante un usuario y contraseña, o porque no
                        cuente con los permisos para visualizarlos, editarlos o
                        manipularlos.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        En caso de que el USUARIO o algún tercero consideren que
                        cualquiera de los contenidos del SITIO WEB suponga una
                        violación de los derechos de protección de la propiedad
                        industrial o intelectual, deberá comunicarlo inmediatamente a{' '}
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        a través de los datos de contacto disponibles en el propio
                        SITIO WEB y/o a través de los siguientes medios:
                    </div>
                    <ul>
                        <li>Teléfono: {telefono}</li>
                        <li>Correo electrónico: {email}</li>
                    </ul>
                    <div className="wbold parchico pabchico negro">
                        VII. LEGISLACIÓN Y JURISDICCIÓN APLICABLE.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        <label className="wbold azul">
                        MERCADO A LA MANO S. DE R. L. DE CV
                        </label>{' '}
                        se reserva la facultad de presentar las acciones civiles o
                        penales que considere necesarias por la utilización indebida
                        del SITIO WEB, sus contenidos, productos o servicios, o por el
                        incumplimiento de los presentes TÉRMINOS Y CONDICIONES.
                    </div>
                    <div className="parmuychico pabmuychico justificado">
                        La relación entre el USUARIO y MERCADO A LA MANO S. DE R. L. DE CV se
                        regirá por la legislación vigente en México, específicamente
                        en Puebla. De surgir cualquier controversia en relación a la
                        interpretación y/o a la aplicación de los presentes TÉRMINOS Y
                        CONDICIONES, las partes se someterán a la jurisdicción
                        ordinaria de los tribunales que correspondan conforme a
                        derecho en el estado al que se hace referencia.
                    </div>
                    <div className="centro parmediano pabchico">
                        <Button className="botonVerde" href="/">
                            Regresar a inicio
                        </Button>
                    </div>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
}

export default TerminosyCondiciones