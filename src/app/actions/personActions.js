"use server";

import { data } from "autoprefixer";
import Person from "../api/personApi";


export async function createPerson(data) {
  return await Person.create(data);
}

export async function getAllPersonByProject(projectId) {
  return await Person.findAllByProject(projectId);
}

export async function getAllPersonCount() {
  return await Person.AllPersonCount();
}

export async function getSinglePerson(id) {
  return await Person.findById(id);
}

export async function updatePerson(id, data) {
  return await Person.updatePerson(id, data);
}

export async function updatePersonPosition(id, positionX, positionY) {
  return await Person.updatePosition(id, positionX, positionY);
}

export async function updateRelation(projectId, data) {
  return await Person.updateRelationList(projectId, data);
}

export async function getAllRelation(projectId) {
  return await Person.findAllRelationship(projectId);
}

export async function deletePerson(id) {
  return await Person.deletePerson(id);
}