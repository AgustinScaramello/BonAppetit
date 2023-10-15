const {
  findAllNotifications,
  changeToOld,
} = require("../controllers/notificationController");

//-----------------------------------------------------------------------------------------

const getNotification = async (req, res) => {
  try {
    const allNotifications = await findAllNotifications();
    if (allNotifications.length < 1) {
      res.status(200).json({ message: "No hay notificaciones" });
    } else {
      res.status(200).json(allNotifications);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//-----------------------------------------------------------------------------------------

const updateNew = async (req, res) => {
  const { id } = req.params;

  try {
    const notifications = await changeToOld(id);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//-----------------------------------------------------------------------------------------

module.exports = { getNotification, updateNew };
