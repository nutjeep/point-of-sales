<template>
  <div class="sidebar-profile bg-white shadow-md p-10">
    <div class="sidebar-profile-header">
      <div class="sidebar-profile-header-avatar flex justify-center">
        <div class="avatar bg-gray-300 rounded-full w-28 h-28">
          <UserCircleIcon class="w-full h-auto" />
        </div>
      </div>
      <div class="sidebar-profile-name">
        <h4 class="mt-4 text-xl font-semibold text-center">Nama Karyawan</h4>
        <p class="text-center">nama@karyawan.com</p>
      </div>
    </div>
    <hr class="my-5">
    <div class="sidebar-profile-body flex flex-col justify-start hover:text-color-2">
        <RouterLink to="#" class="text-left hover:font-medium hover:text-color-4 hover:bg-color-1 py-2 px-3 rounded-md">Profile</RouterLink>
    </div>
  </div>
</template>

<script>
import { UserCircleIcon } from '@heroicons/vue/24/solid';

export default {
    name: 'SideBarProfile',
    components: { UserCircleIcon }
}
</script>