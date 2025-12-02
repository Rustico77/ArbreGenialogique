import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class User {
  // Créer un nouvel utilisateur
  static async create(data) {
    try {
      const userNameExist = (await this.findByUserName(data.userName)) != null;
      const nameExist =
        (await this.findByFirstAndLastName(data.firstName, data.lastName)) !=
        null;

      if (userNameExist || nameExist) {
        return { message: "Cet utilisateur existe déjà.", data: null };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const res = await prisma.user.create({
        data: {
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          readOnly: data.readOnly,
          password: hashedPassword,
        },
      });

      const token = jwt.sign(
        { id: res.id, userName: res.userName },
        process.env.JWT_SECRET
      );

      res.token = token;

      const userUpdate = await this.update(res.id, res);

      return {
        message: `Bienvenue Mme/M. ${userUpdate.data.lastName}`,
        data: userUpdate.data,
      };
    } catch (error) {
      console.log(`Erreur User : ${error.message}`);
      return { message: `Création échouée ${error}`, data: null };
    }
  }

  // Login user
  static async login(data) {
    try {
      const user = await this.findByUserNameAndPassword(
        data.userName,
        data.password
      );

      if (!user) {
        return {
          message:
            "Les identifiants saisis ne correspondent pas à nos enrégistrements.",
          data: null,
        };
      }

      const token = jwt.sign(
        { id: user.id, userName: user.userName },
        process.env.JWT_SECRET
      );

      user.token = token;

      const userUpdate = await this.update(user.id, user);

      return {
        message: `Bienvenue Mme/M. ${userUpdate.data.lastName}`,
        data: userUpdate.data,
      };
    } catch (error) {
      console.log(`Erreur User : ${error.message}`);
      return { message: "Login échoué", data: null };
    }
  }

  // find by Id
  static async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  static async findByToken(token) {
    const user = await prisma.user.findUnique({
      where: { token },
    });
    return user;
  }

  // find by userName
  static async findByUserName(userName) {
    const user = await prisma.user.findUnique({
      where: { userName },
    });

    return user;
  }

  // find by userName
  static async findByUserNameAndPassword(userName, password) {
    const user = await this.findByUserName(userName);

    console.log("user : ", user);

    if (user) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      console.log("password : ", isCorrectPassword);
      if (!isCorrectPassword) {
        return null;
      }
    }

    return user;
  }

  // find by first and last name
  static async findByFirstAndLastName(firstName, lastName) {
    const user = await prisma.user.findUnique({
      where: {
        firstName_lastName: { firstName, lastName },
      },
    });

    return user;
  }

  // Vérifier le mot de passe
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  // Récupérer tous les utilisateurs
  static async findAll() {
    try {
      return await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
          role: true,
          readOnly: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { projects: true },
          },
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  // update user
  static async update(id, data) {
    try {
      const res = await prisma.user.update({
        where: { id: id },
        data: data,
      });

      return { message: "Modification effectuée avec succès.", data: res };
    } catch (error) {
      return { message: "Modification échoué.", data: null };
    }
  }

  /// update user info
  static async updateUserInfo(id, data) {
    try {
      const user = await this.findByFirstAndLastName(
        data.firstName,
        data.lastName
      );

      const userByUserName = await this.findByUserName(data.userName);

      if (user && user.id !== id) {
        return {
          message: "Le nom et prénoms de ce utilisateur existe déjà !",
          data: null,
        };
      }

      if (userByUserName && userByUserName.id !== id) {
        return {
          message: "Ce nom d'utilisateur existe déjà !",
          data: null,
        };
      }

      const res = await prisma.user.update({
        where: { id: id },
        data: data,
      });

      return { message: "Modification effectuée avec succès.", data: res };
    } catch (error) {
      return { message: `Modification échoué. ${error}`, data: null };
    }
  }

  // update user password
  static async updatePassword(id, data) {
    try {
      const user = await this.findById(id);

      if (!user) {
        return { message: "Cet utilisateur n'existe plus.", data: res };
      }

      const isCorrectPassword = await bcrypt.compare(
        data.oldPassword,
        user.password
      );

      if (isCorrectPassword) {
        user.password = await bcrypt.hash(data.password, 10);
        const res = await this.update(id, user);
        return {
          message:
            "Mot de passe modifier avec succès. Veuillez vous reconnecter.",
          data: res,
        };
      } else {
        return {
          message: "Votre ancien mot de passe est incorrect.",
          data: null,
        };
      }
    } catch (error) {
      return { message: "Modification échoué.", data: null };
    }
  }

  // Supprimer un utilisateur
  static async delete(id) {
    try {
      await prisma.user.delete({
        where: { id: id },
      });
      return { success: true };
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
}

export default User;
