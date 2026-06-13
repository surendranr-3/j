import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:8080/api' });

const API = axios.create({ baseURL: "https://csms-backend-p68z.onrender.com/api" });

export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const getCustomers = () => API.get('/users/customers');
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const addCar = (userId, data) => API.post(`/cars/user/${userId}`, data);
export const getCarsByUser = (userId) => API.get(`/cars/user/${userId}`);
export const getAllCars = () => API.get('/cars');
export const deleteCar = (carId) => API.delete(`/cars/${carId}`);
export const updateCar = (carId, data) => API.put(`/cars/${carId}`, data);

export const createServiceRequest = (data) => API.post('/service-requests', data);
export const getServiceRequestsByUser = (userId) => API.get(`/service-requests/user/${userId}`);
export const getAllServiceRequests = (status) => API.get('/service-requests', { params: { status } });
export const updateServiceStatus = (id, status) => API.put(`/service-requests/${id}/status`, { status });
export const deleteServiceRequest = (id) => API.delete(`/service-requests/${id}`);

// Guest requests (no login required)
export const submitGuestRequest = (data) => API.post('/guest-requests', data);
export const getAllGuestRequests = (status) => API.get('/guest-requests', { params: { status } });
export const updateGuestRequestStatus = (id, status) => API.put(`/guest-requests/${id}/status`, { status });
export const deleteGuestRequest = (id) => API.delete(`/guest-requests/${id}`);
