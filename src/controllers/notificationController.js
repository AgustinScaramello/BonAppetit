const { Notification } = require("../db");

//-----------------------------------------------------------------------------------------

const findAllNotifications = async () => {
  const allNotifications = await Notification.findAll();
  return allNotifications;
};

//-----------------------------------------------------------------------------------------

const changeToOld = async (id) => {
  await Notification.update({ new: false }, { where: { id: id } });

  const oldNotifications = await Notification.findAll({
    where: { new: false },
  });

  if (oldNotifications.length > 5) {
    await Notification.findOne({
      order: [["createdAt", "ASC"]],
    })
      .then((firstNotification) => {
        if (firstNotification) {
          return firstNotification.destroy();
        } else {
          console.log("No se encontraron elementos en la base de datos.");
        }
      })
      .then(() => {
        console.log("Primer elemento eliminado exitosamente.");
      })
      .catch((error) => {
        console.error("Error al eliminar el primer elemento:", error);
      });
  }

  const allNotification = findAllNotifications();
  return allNotification;
};

//-----------------------------------------------------------------------------------------

module.exports = { findAllNotifications, changeToOld };
