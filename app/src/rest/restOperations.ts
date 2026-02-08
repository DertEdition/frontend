import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token ekle
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Axios interceptor - Token from localStorage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    }
    console.log('Request URL:', config.url);
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
