<template>
  <aside class="z-[99999] shadow-xl h-full absolute bg-white w-72 transition-all duration-300 ease-in-out" :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full']">
    <div class="sidebar-top bg-white shadow-md px-4 py-5 flex justify-between">
        <div class="flex items-center">
            <div class="logo me-3 rounded-full bg-red-900 w-[50px] h-[50px] flex justify-center items-center overflow-hidden">
                <img class="object-cover w-full h-full" src="/images/jeju_logo.webp" alt="logo jeju">
            </div>
            <div class="profile-info">
                <h3 class="text-[14px] font-semibold">Jeju Studio</h3>
                <p class="text-[12px]">
                    {{ userLogin.name ?? 'Admin Jeju'}}
                </p>
            </div>
        </div>
        <span id="close-sidebar" class="cursor-pointer" @click="closeSidebar">
            <ArrowLeftIcon class="h-6 w-6 text-primary-1 text-bold" />
        </span>
    </div>
    <div id="sidebar_main" class="flex flex-col items-start px-4 py-7">
        <template v-for="item in filteredMenuItems" :key="item.path">
            <RouterLink 
                :to="item.path" 
                :id="item.id" 
                :class="['flex w-full rounded-md py-2 ps-2 hover:text-white hover:bg-primary-color-1', { 'bg-primary-color-1 text-white': isActive(item.path) }]">
                <component :is="item.icon" class="h-5 w-5 me-2 text-bold" />
                {{ item.name }}
            </RouterLink>
        </template>
    </div>
  </aside>
</template>

<script>
import { ArrowLeftIcon, HomeIcon, UserGroupIcon, IdentificationIcon, CubeIcon, CalendarIcon, PresentationChartBarIcon, CurrencyDollarIcon, QueueListIcon, WalletIcon, ClipboardDocumentIcon, CubeTransparentIcon } from '@heroicons/vue/24/solid';

export default {
    name: 'SideBar',
    components: { CubeTransparentIcon, WalletIcon, ArrowLeftIcon, HomeIcon, UserGroupIcon, IdentificationIcon, CubeIcon, CalendarIcon, PresentationChartBarIcon, CurrencyDollarIcon, QueueListIcon },
    data() {
        return {
            isSidebarOpen: false,
            menuItems: [
                { path: '/dashboard', name: 'Beranda', id: 'url-beranda', icon: HomeIcon, permission: ['1'] },
                { path: '/kalender', name: 'Kalender', id: 'url-kalender', icon: CalendarIcon, permission: ['1'] },
                { path: '/penjualan', name: 'Penjualan', id: 'url-penjualan', icon: PresentationChartBarIcon, permission: ['1'] },
                { path: '/pelanggan', name: 'Pelanggan', id: 'url-pelanggan', icon: UserGroupIcon, permission: ['1'] },
                { path: '/staff', name: 'Staff', id: 'url-staff', icon: IdentificationIcon, permission: ['1'] },
                { path: '/produk', name: 'Produk Layanan', id: 'url-produk', icon: CubeIcon, permission: [ '1'] },
                { path: '/kategori', name: 'Kategori', id: 'url-kategori', icon: QueueListIcon, permission: [ '1'] },
                { path: '/outlet', name: 'Outlet', id: 'url-outlet', icon: CubeTransparentIcon, permission: [ '1'] },
                { path: '/metode-pembayaran', name: 'Metode Pembayaran', id: 'url-payment-method', icon: WalletIcon, permission: [ '1'] },
                { path: '/laporan', name: 'Laporan', id: 'url-Laporan', icon: ClipboardDocumentIcon, permission: [ '1'] },
            ]
        }
    },
    computed: {
        userLogin() {
            const user = this.$store.state.detail_user.detail_user;
            return user;
        },

        filteredMenuItems() {
            if (this.userLogin.outlet_id) {
                return this.menuItems.filter(item =>
                    item.path !== '/outlet' &&
                    item.path !== '/metode-pembayaran'
                );
            }
            return this.menuItems;
        }
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        closeSidebar() {
            this.isSidebarOpen = false;
            this.$emit('toggleBlur');
        },
        isActive(path) {
            return this.$route.path === path;
        }
    }
}
</script>