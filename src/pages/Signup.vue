<script setup>
import { ref } from 'vue';
import formValidator from '@/utils/formValidator';
import userLogic from '@/logic/userLogic';
import { useTenantStore } from '@/store/tenant';
import { useUserStore } from '@/store/user'

const formData = ref({
    name: '',
    email: '',
    password: '',
    password2: '',
});

async function handleSignUp(e) {
    e.preventDefault();
    const data = formData.value;

    if (!formValidator().arePasswordEqual(data.password, data.password2)) {
        alert('Passwords are not the same');
        return;
    }

    const dataBody = {
        name: data.name,
        email: data.email,
        password: data.password
    };

    let tenant = useTenantStore().getCurrentTenant ?? {};

    const userData = await userLogic().basicSignUp(dataBody, tenant);

    if (loggedIn) {
        router.push('/');
    }
}

</script>

<template>
    <main class="container">
        <div class="row">
            <div class="col-md-6 offset-md-3 mt-5">
                <div class="card">
                    <div class="card-body">
                        <form @submit="handleSignUp">
                            <div class="mb-3">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="name" v-model="formData.name" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" v-model="formData.email" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" v-model="formData.password" required>
                            </div>
                            <div class="mb-3">
                                <label for="password2" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password2" v-model="formData.password2" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>