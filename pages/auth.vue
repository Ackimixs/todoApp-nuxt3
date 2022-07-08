<script lang="ts" setup>
import {useRouter, useState} from "#app";
import {ref, Ref} from "vue";

const router = useRouter();

const email = useState('email', () => "")
const password = ref("");
const passwordConfirm = ref("");
const loading = ref(false);
const error: Ref<null | string> = ref(null);

const loginMode = ref(true);



const login = async () => {
  const url = "/api/users/login";

  const { error: failure } = await $fetch(url, {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
    }
  })

  if (failure) {
    error.value = failure
    return;
  }

  location.replace("/")
}

const register = async () => {
  const url = '/api/users/create'

  const { error: failure } = await $fetch(url, {
    method: 'POST',
    body: {
       email: email.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value
    }
  })

  if (failure) {
    error.value = failure;
    return;
  }

  loginMode.value = true;
  passwordConfirm.value = ""
  password.value = ""
  email.value = ""
}

</script>

<template>
  <main class="min-h-screen pt-18 bg-gray-100">
    <section class="text-center py-10">
      <h1 class="text-5xl font-bold text-gray-700 mb-4">
        {{ loginMode ? "Login to your account" : "Create an account" }}
      </h1>

      <form class="flex flex-col max-w-lg mx-auto" @submit.prevent>
        <input
            v-model="email"
            class="px-2 py-3 mt-3 border-1 border-lime-200"
            placeholder="Email Address"
            type="email"
            name="email"
            id="email"
        />
        <input
            v-model="password"
            class="px-2 py-3 mt-3 border-1 border-lime-200"
            placeholder="Password"
            type="password"
            name="password"
            id="password"
        />

        <input
            v-if="!loginMode"
            v-model="passwordConfirm"
            class="px-2 py-3 mt-3 border-1 border-lime-200"
            placeholder="Re-enter your password"
            type="password"
            name="password-confirm"
            id="password-confirm"
        />

        <button
            class="p-5 bg-blue-500 text-white rounded-sm mt-5 disabled:bg-gray-400 disabled:text-white"
            :disabled="loading"
            @click="() => loginMode ? login() : register()"
        >
          Authorize
        </button>

        <p v-if="error" class="text-red-400 mt-3">
          {{ error }}
        </p>
        <a
            @click="loginMode = !loginMode"
            class="mt-3 underline cursor-pointer"
        >
          Or
          {{ loginMode ? "Register" : "Login" }}
          instead
        </a>
      </form>
    </section>
  </main>
</template>