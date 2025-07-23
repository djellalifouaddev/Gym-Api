import User from "../models/user.model";
import bcrypt from "bcryptjs";

export async function createUsers() {
  const users = [
    { username: "superadmin", password: "superadmin123", role: "SUPER_ADMIN" },
    { username: "admin", password: "admin123", role: "ADMIN" },
    { username: "user", password: "user123", role: "USER" },
    { username: "user2", password: "user123", role: "USER" }

  ];
  for (const userData of users) {
    const exists = await User.findOne({ username: userData.username });
    if (exists) {
      await User.deleteOne({ username: userData.username });
      console.log(`Utilisateur supprimé: ${userData.username}`);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({ ...userData, password: hashedPassword });
    await user.save();
    console.log(`Utilisateur créé: ${user.username}`);
  }
}