<template>
    <div>
        <div class="row">
            <div class="col">
                <h1 class="text-center mb-5">This is a login page</h1>
            </div>
        </div>
        <div class="row">
            <div class="col"></div>
            <div class="col">
                <form @submit.prevent="login">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input
                            v-model="email"
                            type="email"
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                        />
                        <small id="emailHelp" class="form-text text-muted">
                            We'll never share your email with anyone else.
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input
                            v-model="password"
                            type="password"
                            class="form-control"
                            id="exampleInputPassword1"
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit" class="btn btn-primary mt-5">Submit</button>
                </form>
            </div>
            <div class="col"></div>
        </div>
    </div>
</template>

<script>
import { Auth } from '@/services';

export default {
    data() {
        return {
            email: '',
            password: '',
            auth:Auth.state
        };
    },
    methods: {
        /*login() {
            firebase
                .auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .catch(function(error) {
                    console.log(error);
                });
        }*/
        async login() {
            let success = await Auth.login(this.email, this.password);
            console.log('Rezultat prijave', success);
        if (success == true) {
            this.$router.push({ name: 'posts' });
        }
    }
    }
};
</script>
