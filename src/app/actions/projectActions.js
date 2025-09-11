"use server";

import Project from "../api/projectApi";


export async function createProject(data) {
  return await Project.create(data);
}

export async function getAllProject(id) {
  return await Project.findAll(id);
}

export async function deleteProject(id) {
  return await Project.delete(id);
}

export async function updateProject(id, data) {
  return await Project.update(id, data);
}