import axios from "~/axios";

export function getUserList(page, query = {}){
    let q = [];
    for (const key in query) {
        if(query[key]) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }

    let r = q.join('&');
    r = r ? ('?' + r) : '';
    return axios.get(`/admin/user/${page}${r}`);
}

export function updateUserStatus(id, status) {
    return axios.post(`/admin/user/${id}/update_status`, {
        status
    });
}

export function createUser(data) {
    return axios.post('/admin/user', data);
}

export function updateUser(id, data) {
    return axios.post(`/admin/user/${id}`, data);
}

export function deleteUser(id) {
    return axios.post(`/admin/user/${id}/delete`);
}