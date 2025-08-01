import { toast } from "react-toastify";

const users = [
    {
        "_id": "67385106067a6f93f20d8643",
        "name": "Kartik Kushwaha",
        "email": "kartikkushwaha@gmail.com",
        "password": "$2a$10$1eogyG5R2s17XLRnoQMDMObi4Z9SILLrMHRXLG78zvzIsxyB3F.Aq",
        "img": "./profiles/profile19.png",
        "isAdmin": false,
        "createdAt": "2024-11-16T08:00:06.607Z",
        "updatedAt": "2024-11-16T08:00:06.607Z",
        "__v": 0,
        "id": "67385106067a6f93f20d8643"
    },
    {
        "_id": "673ae6ef03ba261cdd7171a8",
        "name": "Hridayesh Ojha",
        "email": "hridayeshojha@gmail.com",
        "password": "$2a$10$4DtvL.lOl46xCtsbJwV4lOthalYkLex6r.zRFSMg2kjoMSOdv/LrK",
        "img": "./profiles/profile26.png",
        "isAdmin": false,
        "createdAt": "2024-11-18T07:04:15.230Z",
        "updatedAt": "2024-11-18T07:04:15.230Z",
        "__v": 0,
        "id": "673ae6ef03ba261cdd7171a8"
    },
    {
        "_id": "674ae3212da3e0c81c5122e0",
        "name": "Admin",
        "email": "admin@artcorner.com",
        "password": "$2a$10$/DIkAZIHZuHDUJJtkIqIKOCpqrBiXenQhz5/V2xzskURzeEktXNhy",
        "img": "./profiles/profile29.png",
        "isAdmin": true,
        "createdAt": "2024-11-30T10:04:17.302Z",
        "updatedAt": "2024-11-30T10:04:17.302Z",
        "__v": 0,
        "id": "674ae3212da3e0c81c5122e0"
    },
    {
        "_id": "67385177067a6f93f20d8653",
        "name": "Ishan Dwivedi",
        "email": "ishandwivedi@gmail.com",
        "password": "$2a$10$qk8kbiIj85nI1APrkDxzge7i58loHpMwc2uP8PFKItKycmF7XARwi",
        "img": "./profiles/profile22.png",
        "isAdmin": false,
        "createdAt": "2024-11-16T08:01:59.666Z",
        "updatedAt": "2024-11-16T08:01:59.666Z",
        "__v": 0,
        "id": "67385177067a6f93f20d8653"
    },
    {
        "_id": "67385138067a6f93f20d8649",
        "name": "Kaushiki Jaiswal",
        "email": "kaushikijaiswal@gmail.com",
        "password": "$2a$10$mQVMXFOanJ6k9haOf3mJEeVCzPeuFA1Whp.jL0YNesFDI8OIsfbrK",
        "img": "./profiles/profile20.png",
        "isAdmin": false,
        "createdAt": "2024-11-16T08:00:56.232Z",
        "updatedAt": "2024-11-16T08:00:56.232Z",
        "__v": 0,
        "id": "67385138067a6f93f20d8649"
    },
    {
        "_id": "6762f259dfd43955398bec8a",
        "name": "Shakti Vardhan Singh",
        "email": "shakti1012@gmail.com",
        "password": "$2a$10$hjeuzm1IxJPPUiO.7MsrhOjtCEN/8mu08QRW8td6ix905GOOKSTWe",
        "img": "./profiles/profile29.png",
        "isAdmin": false,
        "createdAt": "2024-12-18T16:03:37.158Z",
        "updatedAt": "2024-12-18T16:03:37.158Z",
        "__v": 0,
        "id": "6762f259dfd43955398bec8a"
    },
    {
        "_id": "677662b1b12fd534933c8279",
        "name": "Aditi Dwivedi",
        "email": "aditidwivedi@gmail.com",
        "password": "$2a$10$0Fu/Qi28qmli5R4HgjDWyeyaCNCLkwbpH1eK3Uqkkvzy1HYXN4JOy",
        "img": "./profiles/profile23.png",
        "isAdmin": false,
        "createdAt": "2025-01-02T09:56:01.106Z",
        "updatedAt": "2025-01-02T09:56:01.106Z",
        "__v": 0,
        "id": "677662b1b12fd534933c8279"
    },
    {
        "_id": "6873ce2492f6af7e3bf52464",
        "name": "Divyanshu Kumar ",
        "email": "technicaltws2006@gmail.com",
        "password": "$2a$10$RWaZ5D4aOKskTaUYi47nauSTyKds90LxZRVKgK1vHpUjUBXwVtR5a",
        "img": "./profiles/profile5.png",
        "isAdmin": false,
        "createdAt": "2025-07-13T15:17:56.738Z",
        "updatedAt": "2025-07-13T15:17:56.738Z",
        "__v": 0,
        "id": "6873ce2492f6af7e3bf52464"
    }
];

export function getAllUsers(adminId, adminPass) {
    const getUser = users.find(item => item._id === adminId && item.password === adminPass);

    if(!getUser) {
        toast.error('User does not exist');
        return;
    }

    if(getUser.isAdmin) {
        toast.error('Given user is not an admin!');
        return;
    }
    
    return users;
}

export function getUser(userForm) {
    const [email, password] = [userForm.email, userForm.password];

    if(!userForm.email || !userForm.password) {
        toast.error('Error is receiving the user values');
        return;
    }
    
    return users.find(item => item.email === email && item.password === password);
}