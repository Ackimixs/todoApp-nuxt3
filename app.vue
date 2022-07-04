<template>
  <div class="w-full min-h-screen bg-gray-100">
    <section class="text-center pt-7">
      <h1 class="text-5xl text-gray-700">What are we doing today !</h1>
    </section>
    <section class="w-9/12 max-w-lg mx-auto flex items-center justify-center mt-7 bg-white shadow p-5 rounded">
      <form @submit.prevent>
        <input type="text" class="py-2 px-4 border border-blue-200 focus:outline-blue-300 rounded" placeholder="Add a todo"/>
        <button class="transition-all duration-200 border border-blue-200 py-2 px-4 ml-3 hover:bg-blue-200 rounded">Add todo</button>
      </form>
    </section>
  </div>
</template>
