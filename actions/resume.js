"use client";

// Helper functions to interact with resume-related API endpoints
const JSON_HEADERS = {
  "Content-Type": "application/json",
};

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const data =
    contentType.includes("application/json")
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.error || "Request failed";
    throw new Error(message);
  }

  return data;
}

export const saveResumeToDb = async (payload) => {
  const response = await fetch("/api/resume", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const getUserResumesFromDb = async () => {
  const response = await fetch("/api/resume", {
    method: "GET",
    cache: "no-store",
  });

  return handleResponse(response);
};

export const getResumeFromDb = async (_id) => {
  const response = await fetch(`/api/resume/${_id}`, {
    method: "GET",
    cache: "no-store",
  });

  return handleResponse(response);
};

export const updateResumeFromDb = async ({ _id, ...rest }) => {
  const response = await fetch(`/api/resume/${_id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(rest),
  });

  return handleResponse(response);
};

export const updateExperienceToDb = async ({ _id, experience }) => {
  const response = await fetch(`/api/resume/${_id}/experience`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify({ experience }),
  });

  return handleResponse(response);
};

export const updateEducationToDb = async ({ _id, education }) => {
  const response = await fetch(`/api/resume/${_id}/education`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify({ education }),
  });

  return handleResponse(response);
};

export const updateSkillsToDb = async ({ _id, skills, template, themeColor }) => {
  const response = await fetch(`/api/resume/${_id}/skills`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify({ skills, template, themeColor }),
  });

  return handleResponse(response);
};

export const deleteResumeFromDb = async (_id) => {
  const response = await fetch(`/api/resume/${_id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
};
