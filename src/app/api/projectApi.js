import prisma from '../../../lib/prisma';
import User from './userApi';


class Project {
    // GET: Récupérer tous les projets
    static async findAllById(id) {
        try {
            const projects = await prisma.project.findMany({
                where: { userId : id },
                orderBy: {
                    updatedAt: 'desc'
                },
                include: {
                    _count: {
                        select: { persons: true },
                    },
                },
                
            });
            return { message: "", data: projects };
        } catch (error) {
            return { message: 'Erreur lors de la récupération des projets', data: [] };
        }
    };

    // GET: Récupérer tous les projets
    static async findAll() {
        try {
            return await prisma.project.findMany({
                orderBy: {
                    updatedAt: 'desc'
                },
                include: {
                    _count: {
                        select: { persons: true },
                    },
                },
                
            });
        } catch (error) {
            return { message: 'Erreur lors de la récupération des projets', data: [] };
        }
    };

    // GET: Récupérer un projet par ID
    static async findById (id) {
        const project = await prisma.project.findUnique({
            where: { id },
        });
            
        return project;
    };

    // GET: find by name
    static async findByNameAndUserId (name, userId) {
        const project = await prisma.project.findFirst({
            where: { name, userId },
        });
            
        return project;
    };

    // POST: Créer un nouveau projet
    static async create (data) {
        try {
            const user = await User.findById(data.userId);
            const project = await this.findByNameAndUserId(data.name, data.userId);
            if(!user){
                return {message: "L'utilisateur de ce projet n'existe plus.", data: null}
            }else if(project){
                // console.log("projet exist : ", project);
                return {message: "Ce projet existe déjà.", data: null};
            }else{
                const res = await prisma.project.create({
                    data: data,
                });

                return {message: "Projet créé avec succès", data: res};
            }
        } catch (error) {
            return {message: `Création échouée ${error}`, data: null};
        }
    };

    // PUT: Mettre à jour un project
    static async update (id, data) {
    try {
        const project = await this.findById(id);
        const projectNameExist = await this.findByNameAndUserId(data.name, data.userId);
        if(!project){
            return {message: "Ce projet n'existe pas. Modification impossible !", isSuccess: false};
        }else if(projectNameExist && project.name !== data.name){
            return {message: "Ce projet existe déjà.", isSuccess: false};
        }
        await prisma.project.update({
            where: { id },
            data: data,
        });
        return {message: "Projet mise à jour avec succès", isSuccess: true};
    } catch (error) {
        return {message: "Mise à jour échoué", isSuccess: false};
    }
    };

    // DELETE: Supprimer un project
    static async delete (id) {
    try {
        const project = await this.findById(id);
        if(!project){
            return {message: "Ce projet n'existe pas. Suppression impossible !", isSuccess: false};
        }
        await prisma.project.delete({
            where: { id },
        });
        return { message: "Projet supprimé avec succès", isSuccess: true };
    } catch (error) {
        return { message: 'Erreur lors de la suppression', isSuccess: false };
    }
    };
}

export default Project;