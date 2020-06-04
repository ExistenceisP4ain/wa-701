import axios from 'axios';
import store from "@/store"
import $router from '@/router'; // ovako importamo router izvan VUE componente

// instanca axios-a za potrebe Fipugram backenda
let Service = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000,
});

// prije svakog poslanog requesta na backend izvrši:
Service.interceptors.request.use((request) => {
    try {
    request.headers['Authorization'] = 'Bearer ' + Auth.getToken();
    } catch (e) {
    console.error(e);
    }
    return request;
   });

   // nakon svakog odgovora s backenda izvrši:
Service.interceptors.response.use(
    (response) => {
        console.log('Interceptor', response);
        return response;
    },
    (error) => {
        if (error.response.status == 401) {
            Auth.logout();
            $router.go();
        }
        // console.error('Interceptor', error.response);
    }
);

let Auth = {
    // primamo user/pass, šaljemo upit na backend i ako dobijemo token
    // spremimao ga u "localStorage" - JavaScript memoriju koja OSTAJE
    // i nakon što zatvorimo preglednik ili osvježimo stranicu
    async login(username, password, tipProfila) {
    let response = await Service.post('/auth', {
    username,
    password,
    tipProfila
    });
    let user = response.data;
    // localStorage može sačuvati samo string, boolean ili number
    // pa moramo pretvoriti objekt u string (JSON je string)
    localStorage.setItem('user', JSON.stringify(user));
    },
    // logout znači brisanje tokena
    logout() {
    localStorage.removeItem('user');
    },
    async signup(a) {
        return Service.post('/user', a);
},
    // dohvat tokena
    getToken() {
    let user = Auth.getUser();
    if (user && user.token) {
    return user.token;
    }
    },
    // dohvat spremljenog korisnika
    getUser() {
    return JSON.parse(localStorage.getItem('user'));
    },
    // provjera jesmo li autentificiraregisterUserni
    authenticated() {
    let user = Auth.getUser();
    if (user && user.username) {
        store.tipProfila = user.tipProfila
    return true;
    }
    return false;
    },
    // state će nam služiti da ove varijable budu dostupne u vue.js
 // radi se o "getter" funkcijama koje dopuštaju da ih čitamo
 // kao da su varijable (slično kao Vue computed, ali na razini JS-a)
 state: {
    get user() {
        return Auth.getUser();
    },
    get authenticated() {
        return Auth.authenticated();
    },
    },
   };

// naš objekt za sve pozive koji se dotiču `Post`ova
let Posts = {
    Comments: {
        async add(postId, comment) {
            await Service.post(`/posts/${postId}/comments/`, comment);
        },
        async delete(postId, commentId) {
            await Service.delete(`/posts/${postId}/comments/${commentId}`);
        },
    },
    add(post) {
        return Service.post('/posts', post);
    },
    async getOne(id) {
        let response = await Service.get(`/posts/${id}`);

        let doc = response.data;

        return {
            id: doc._id,
            url: doc.source,
            email: doc.createdBy,
            title: doc.title,
            posted_at: Number(doc.postedAt),
            comments: (doc.comments || []).map((c) => {
                c.id = c._id;
                delete c._id;
                return c;
            }),
        };
    },
    async getAll(searchTerm) {
        let options = {};

        if (searchTerm) {
            options.params = {
                _any: searchTerm,
            };
        }

        let response = await Service.get('/posts', options);
        return response.data.map((doc) => {
            return {
                id: doc._id,
                url: doc.source,
                email: doc.createdBy,
                title: doc.title,
                posted_at: Number(doc.postedAt),
            };
        });
    },
};

export { Service, Posts, Auth }; // exportamo Service za ručne pozive ili Posts za metode.
