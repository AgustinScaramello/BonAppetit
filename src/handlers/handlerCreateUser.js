const admin = require("firebase-admin");
//const { mail_rover, accountTransport } = require("../config/mailer");
const URL_FRONT = process.env.URL_FRONT;
const { User } = require("../db");
const { sendEmail } = require("../config/sendGridConfig");
const { htmlEmailConfirm, linkRecoveryPassword } = require("../utils/msgHTMLEmailConfirm");

/* 
Esta es la posible respuesta de Firebase para un usuario nuevo
{
	"uid": "4rBSpg404eXssGuvAZNx3cyrFrq1",
	"email": "beloqui.cesar@gmail.com",
	"emailVerified": false,
	"displayName": "Cesar",
	"disabled": false,
	"metadata": {
		"lastSignInTime": null,
		"creationTime": "Sun, 03 Sep 2023 01:59:49 GMT",
		"lastRefreshTime": null
	},
	"tokensValidAfterTime": "Sun, 03 Sep 2023 01:59:49 GMT",
	"providerData": [
		{
			"uid": "beloqui.cesar@gmail.com",
			"displayName": "Cesar",
			"email": "beloqui.cesar@gmail.com",
			"providerId": "password"
		}
	]
}

*/

const handlerCreateUser = async (req) => {
  const { email, password, displayName } = req.body;

  // Verifica que la contraseña cumpla con los requisitos mínimos
  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }

  try {
    // Si el correo electrónico no está en uso, crea el usuario
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    // Genera el token de inicio de sesión
    const userToken = await admin.auth().createCustomToken(userRecord.uid);
    const createUserInDB = await User.create({
      id: userRecord.uid,
      displayName: userRecord.displayName,
      email: userRecord.email,
    });
    // Envía el correo de verificación después de crear el usuario
    if (createUserInDB) {
      const actionCodeSettings = {
        url: `https://bonappetite.vercel.app/customer`,
        handleCodeInApp: true,
      };

      const link = await admin
        .auth()
        .generateEmailVerificationLink(userRecord.email, actionCodeSettings);
      const msg = {
        to: `${email}`,
        from: `noreply.bonapptit@gmail.com`,
        subject: "Confirmación de Correo Electrónico para Bon Appétit",
        html: htmlEmailConfirm(link, userRecord.displayName),
      };
      await sendEmail(msg);

      return { userRecord, link, userToken };
    } else {
      throw new Error("Error al registrar el usuario");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendCustomPasswordResetEmail = async (email, link) => {
  const msg = {
    to: `${email}`,
    from: `noreply.bonapptit@gmail.com`, // Use the email address or domain you verified above
    subject: "Restablecer Contraseña para Bon Appétit",
    html: linkRecoveryPassword(link),
  };
  await sendEmail(msg);
};

const changePasswordUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (email == null || email == undefined || email == "") {
      throw new Error("El email es requerido");
    }

    const userEmail = await admin.auth().getUserByEmail(email);
    const actionCodeSettings = {
      url: `https://bonappetite.vercel.app/customer`,
      handleCodeInApp: true,
    };
    const link = await admin
      .auth()
      .generatePasswordResetLink(userEmail.email, actionCodeSettings);
    await sendCustomPasswordResetEmail(userEmail.email, link);

    res.status(200).json({
      message: "Correo de restablecimiento de contraseña enviado con éxito",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  handlerCreateUser,
  changePasswordUser,
};
