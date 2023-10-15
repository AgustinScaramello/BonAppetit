const { User } = require("../db");

const changeTypeUser = async (req, res) => {
  try {
    const { id, role } = req.body;
    const user = await User.findByPk(id);
    console.log(user);
    if (!user) {
      return res.status(404).json("El usuario no fue encontrado");
    }
    user.role = role;

    await user.save();
    const users = await User.findAll();
    console.log("El tipo de usuario ha sido cambiado correctamente");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = changeTypeUser;
