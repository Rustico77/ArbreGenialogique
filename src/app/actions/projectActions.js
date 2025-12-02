"use server";

import Project from "../api/projectApi";


export async function createProject(data) {
  return await Project.create(data);
}

export async function getAllProjectById(id) {
  return await Project.findAllById(id);
}

export async function getAllProject() {
  return await Project.findAll();
}

export async function deleteProject(id) {
  return await Project.delete(id);
}

export async function updateProject(id, data) {
  return await Project.update(id, data);
}