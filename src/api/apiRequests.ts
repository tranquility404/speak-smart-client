import { apiClient, authApiClient } from "./apiClient";

export function registerUser(userData: any) {
  return apiClient.post("/users/register", userData);
}

export function loginUser(email: string, password: string) {
  return apiClient.post("/users/login",
    new URLSearchParams({
      username: email,
      password: password,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
}

export function getMyUserInfo() {
  return authApiClient.get("/users/me");
}

export function generateRandomTopics() {
  return authApiClient.post("/generate-random-topics");
}

export function generateSpeechOnTopic(topic: any) {
  return authApiClient.post("/generate-speech", topic);
}

export function uploadAudio(formData: any) {
  return authApiClient.post("/upload-audio", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function loadRecentAnalysis() {
  return authApiClient.get("/recent-analysis");
}

export function getAnalysis(id: string) {
  return authApiClient.get(`/get-analysis/${id}`);
}

export function generateRefinedSpeeches(speech: string) {
  return authApiClient.post("/generate-rephrasals", speech)
}