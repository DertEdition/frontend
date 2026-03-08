import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface UploadMRIRequest {
  file: File;
  bodyPart: string;
}

export interface UploadMRIResponse {
  success: boolean;
  fileUrl: string;
  bodyPart: string;
  uploadDate: string;
  message?: string;
}

export const uploadMRIImage = async (request: UploadMRIRequest): Promise<UploadMRIResponse> => {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('bodyPart', request.bodyPart);

  try {
  const response = await apiClient.post('/mri/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.message || 'Dosya yüklenirken bir hata oluştu');
  }
};

export const getMRIImages = async (bodyPart?: string): Promise<any[]> => {
  try {
    const response = await apiClient.get('/mri', {
    params: bodyPart ? { bodyPart } : undefined,
  });

  return response.data;
  } catch (error: any) {
    console.error('Get MRI images error:', error);
    console.error('Request URL:', error.config?.url);
    console.error('Base URL:', apiClient.defaults.baseURL);
    throw new Error(error.response?.data?.message || 'MR görüntüleri alınırken bir hata oluştu');
  }
};

export interface HealthProfileData {
  weight: number;
  height: number;
  waist: number;
  age: number;
  gender: 'male' | 'female';
}

export interface HealthProfileResponse {
  id?: number;
  weight: number;
  height: number;
  waist: number;
  age: number;
  gender: 'male' | 'female';
  bmi: number;
  bodyFatPercentage: number;
  lastUpdated?: string;
}

export const saveHealthProfile = async (data: HealthProfileData): Promise<HealthProfileResponse> => {
  const response = await apiClient.post('/health-profile', data);
  return response.data;
};

export const getHealthProfile = async (): Promise<HealthProfileResponse | null> => {
  try {
    const response = await apiClient.get('/health-profile');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Blood Test API

export interface BloodTestRecord {
  id: number;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  status: string;
  message: string;
  anormallikler: string[];
  rapor: string;
  tablo_sayisi: number;
}

export const uploadBloodTest = async (file: File): Promise<BloodTestRecord> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/blood-test/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getBloodTests = async (): Promise<BloodTestRecord[]> => {
  const response = await apiClient.get('/blood-test');
  return response.data;
};

export const deleteBloodTest = async (id: number): Promise<void> => {
  await apiClient.delete(`/blood-test/${id}`);
};

