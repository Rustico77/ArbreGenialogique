import prisma from '../../../lib/prisma';
import Project from './projectApi';
import User from './userApi';


class Person {
    // GET: Récupérer toutes les personnes par projet
    static async findAllByProject(projectId) {
        try {
            const persons = await prisma.person.findMany({
                where: { projectId },
            });
            return { message: "", data: persons };
        } catch (error) {
            return { message: 'Erreur lors de la récupération des projets', data: [] };
        }
    };

    // GET: Récupérer toutes les personnes
    static async AllPersonCount() {
        try {
            return await prisma.person.count();
        } catch (error) {
            return 0;
        }
    };

    // GET: Récupérer une personne par ID
    static async findById (id) {
        const person = await prisma.person.findUnique({
            where: { id },
        });
            
        return person;
    };

    // find by first and last name
    static async findByFirstLastNameAndProjectId(firstName, lastName, projectId) {
        return await prisma.person.findUnique({
            where: {
            firstName_lastName_projectId: {
                firstName,
                lastName,
                projectId,
            },
            },
        });
    }


    // POST: Créer une personne
    static async create (data) {
        try {
            const project = await Project.findById(data.projectId);
            const person = await this.findByFirstLastNameAndProjectId(data.firstName, data.lastName, data.projectId);
            console.log("person : ", person);
            if(!project){
                return {message: "Le projet dans lequel cette personne va être créée n'existe plus.", data: null}
            }else if(person){
                return {message: "Le nom et prénoms de cette personne existe déjà.", data: null}
            }else{
                const res = await prisma.person.create({
                    data: data,
                });

                return {message: "Personne créée avec succès", data: res};
            }
        } catch (error) {
            console.log("error : ", error);
            return {message: `Création échouée ${error}`, data: null};
        }
    };

    // Mettre à jour la position d'une personne
    static async updatePosition (id, positionX, positionY) {
    try {
        const person = await this.findById(id);
        if(!person){
            return {message: "Cette personne n'existe pas !", isSuccess: false};
        }

        person.positionX = positionX;
        person.positionY = positionY;

        await prisma.person.update({
            where: { id },
            data: person,
        });
        return {message: "Personne mise à jour avec succès", isSuccess: true};
    } catch (error) {
        return {message: "Mise à jour échoué", isSuccess: false};
    }
    };

    // Mettre à jour une personne
    static async updatePerson (id, data) {
        try {
            const project = await Project.findById(data.projectId);
            const person = await this.findById(id);
            const personByName = await this.findByFirstLastNameAndProjectId(data.firstName, data.lastName, data.projectId);
            if(!project){
                return {message: "Le projet dans lequel cette personne va être créée n'existe plus.", data: null}
            }else if(!person){
                return {message: "La personne à modifier n'existe plus.", data: null}
            }else if(personByName && personByName.id !== id){
                return {message: "Le nom et prénoms de cette personne existe déjà.", data: null}
            }else{
                const res = await prisma.person.update({
                    where: { id },
                    data: data,
                });

                return {message: "Personne modifiée avec succès", data: res};
            }
        } catch (error) {
            console.log("error : ", error);
            return {message: `Modification échouée ${error}`, data: null};
        }
    };

    // DELETE: Supprimer une personne
    static async deletePerson (id) {
        try {
            const person = await this.findById(id);
            if(!person){
                return {message: "Cette personne n'existe pas. Suppression impossible !", isSuccess: false};
            }

            // delete relations
            // await prisma.relationship.deleteMany({
            //     where: {
            //         OR: [
            //             { parentId: id },
            //             { childId: id },
            //         ],
            //     },
            // });

            // delete person
            await prisma.person.delete({
                where: { id },
            });

            return { message: "Personne supprimée avec succès", isSuccess: true };
        } catch (error) {
            console.log("erreur : ", error);
            return { message: 'Erreur lors de la suppression', isSuccess: false };
        }
    };





    ////--------------------- Relationship -------------------


    // find all relationship
    static async findAllRelationship (projectId) {
        const relations = await prisma.relationship.findMany({
            where: { projectId },
        });
            
        return relations;
    };

    // update Relation list
    static async updateRelationList (projectId, data) {
    try {
        const actualRelations = await this.findAllRelationship(projectId);
        
        if(actualRelations.length > 0){
            var relationsToRemove = [];
            var relationsAlwaysExist = [];
            for (const rel of actualRelations) {
                if (data.some(d => d.id === rel.id)) {
                    relationsAlwaysExist.push(rel);
                } else {
                    relationsToRemove.push(rel);
                }
            }

            for (const rel of relationsToRemove) {
                await this.deleteRelation(rel.id);
            }

            data = data.filter(d => !relationsAlwaysExist.some(r => r.id === d.id));
        }
        
        for (const item of data) {
            await prisma.relationship.create({
                data: item,
            });
        }
        return {message: "Relation mise à jour avec succès", isSuccess: true};
    } catch (error) {
        return {message: "Mise à jour échoué", isSuccess: false};
    }
    };



    // DELETE: Supprimer une relation
    static async deleteRelation (id) {
    try {
        await prisma.relationship.delete({
            where: { id },
        });
        return { message: "Projet supprimé avec succès", isSuccess: true };
    } catch (error) {
        return { message: 'Erreur lors de la suppression', isSuccess: false };
    }
    };



}

export default Person;