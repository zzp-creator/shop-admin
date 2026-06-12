import axios from "~/axios";

export function getLevelList(page){
    return axios.get(`/admin/user_level/${page}`);
}

export function updateLevelStatus(id, status) {
    return axios.post(`/admin/user_level/${id}/update_status`, {
        status
    });
}

export function createLevel(data) {
    return axios.post('/admin/user_level', data);
}

export function updateLevel(id, data) {
    return axios.post(`/admin/user_level/${id}`, data);
}

export function deleteLevel(id) {
    return axios.post(`/admin/user_level/${id}/delete`);
}