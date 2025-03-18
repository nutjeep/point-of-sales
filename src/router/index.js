import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import IndexProfileView from "@/views/pages/profile/ProfileView.vue";
import DashboardView from "@/views/pages/DashboardView.vue";
// import OrderListView from "@/views/pages/OrderListView.vue";
// import AttendanceView from "@/views/pages/attendance/AttendanceView.vue";
// import AttendanceDetailView from "@/views/pages/attendance/AttendanceDetailView.vue";
import EmployeeView from "@/views/pages/employee/EmployeeView.vue";
// import CommissionView from "@/views/pages/employee/CommissionView.vue";
import AddEditEmployee from "@/views/pages/employee/AddEditEmployee.vue";
import CustomerView from "@/views/pages/customer/CustomerView.vue";
import AddCustomer from "@/views/pages/customer/AddCustomer.vue";
import EditCustomer from "@/views/pages/customer/EditCustomer.vue";
import OutletView from "@/views/pages/outlet/OutletView.vue";
import AddEditOutlet from "@/views/pages/outlet/AddEditOutlet.vue";
import ProductManagementView from "@/views/pages/product/ProductManagementView.vue";
import AddEditProduct from "@/views/pages/product/AddEditProduct.vue";
// import InventoryView from "@/views/pages/inventory/InventoryView.vue";
// import AddEditInventory from "@/views/pages/inventory/AddEditInventory.vue";
// import AttributeView from "@/views/pages/attribute/AttributeView.vue";
// import AttributeListView from "@/views/pages/attribute/AttributeListView.vue";
import CategoryView from "@/views/pages/category/CategoryView.vue";
import PaymentMethodView from "@/views/pages/setting/PaymentMethodView.vue";
import CheckoutView from "@/views/pages/transaction/CheckoutView.vue";
import OrderSummary from "@/views/pages/transaction/OrderSummary.vue";
import SalesMainView from "@/views/pages/sales/SalesMainView.vue";
import DetailInvoice from "@/views/pages/sales/DetailInvoice.vue";
import CalendarView from "@/views/pages/calendar/CalendarView.vue";
import AppointmentView from "@/views/pages/transaction/AppointmentView.vue"
import ReportView from "@/views/pages/report/ReportMainView.vue"
import { requireAuth } from '@/middleware/auth';
import SendEmail from "@/views/pages/forget_password/SendEmail.vue";
import ResetPassword from "@/views/pages/forget_password/ResetPassword.vue";

const routes = 
[
    {
        path:'/',
        name: 'LoginView',
        component: LoginView,
    },
    {
        path:'/forget_password',
        name: 'SendEmail',
        component: SendEmail,
    },
    {
        path:'/auth/reset',
        name: 'ResetPassword',
        component: ResetPassword,
    },
    {
        path:'/dashboard',
        name:'Dashboard',
        component: DashboardView,
        beforeEnter: requireAuth
    },
    {
        path:'/pelanggan',
        name: 'CustomerView',
        component: CustomerView,
        beforeEnter: requireAuth
    },
    {
        path:'/pelanggan/tambah-pelanggan',
        name: 'AddCustomer',
        component: AddCustomer,
        beforeEnter: requireAuth
    },
    {
        path:'/pelanggan/detail-pelanggan/:id',
        name: 'EditCustomer',
        props:true,
        component: EditCustomer,
        beforeEnter: requireAuth
    },
    {
        path:'/staff',
        name: 'EmployeeView',
        component: EmployeeView,
        beforeEnter: requireAuth
    },
    {
        path:'/staff/tambah-staff',
        name: 'AddEmployee',
        component: AddEditEmployee,
        beforeEnter:requireAuth
    },
    {
        path:'/staff/edit-staff/:id',
        name: 'EditEmployee',
        component: AddEditEmployee,
        props:true,
        beforeEnter: requireAuth
    },
    {
        path:'/kalender',
        name: 'CalendarView',
        component: CalendarView,
        beforeEnter: requireAuth
    },
    {
        path:'/penjualan',
        name: 'SalesView',
        component: SalesMainView,
        beforeEnter: requireAuth
    },
    {
        path:'/detail-invoice/:id',
        name: 'DetailInvoice',
        props:true,
        component: DetailInvoice,
        beforeEnter: requireAuth
    },
    {
        path:'/produk',
        name: 'ProductManagementView',
        component: ProductManagementView,
        beforeEnter: requireAuth
    },
    {
        path:'/produk/tambah-produk',
        name: 'AddProduct',
        component: AddEditProduct,
        beforeEnter: requireAuth
    },
    {
        path:'/produk/edit-produk/:id',
        name: 'EditProduct',
        props:true,
        component: AddEditProduct,
        beforeEnter: requireAuth
    },
    {
        path:'/kategori',
        name: 'CategoryView',
        component: CategoryView,
        beforeEnter: requireAuth
    },
    {
        path:'/outlet',
        name: 'OutletView',
        component: OutletView,
        beforeEnter: requireAuth
    },
    {
        path:'/outlet/tambah-outlet/',
        name: 'AddOutlet',
        component: AddEditOutlet,
        beforeEnter: requireAuth,
    },
    {
        path:'/outlet/tambah-outlet/:id',
        name: 'EditOutlet',
        component: AddEditOutlet,
        beforeEnter: requireAuth,
        props: true
    },
    {
        path:'/appointment/add-new',
        name: 'AddAppoinment',
        component: AppointmentView,
        beforeEnter: requireAuth
    },
    {
        path:'/appointment/add-new/pelanggan/:props_customer_id',
        name: 'AddAppoinmentWithCustomer',
        props: true,
        component: AppointmentView,
        beforeEnter: requireAuth
    },
    {
        path:'/appointment/edit-transaksi/:transaction_id',
        name: 'EditAppointment',
        props: true,
        component: AppointmentView,
        beforeEnter: requireAuth
    },
    {
        path:'/checkout/transaksi/:id',
        name:'CheckoutView',
        props: true,
        component: CheckoutView,
        beforeEnter: requireAuth
    },
    {
        path:'/checkout/order-summary/:id',
        name:'OrderSummary',
        props: true,
        component: OrderSummary,
        beforeEnter: requireAuth
    },
    {
        path:'/metode-pembayaran',
        name:'PaymentMethodView',
        component: PaymentMethodView,
        beforeEnter: requireAuth
    },
    {
        path:'/laporan',
        name:'ReportView',
        component: ReportView,
        beforeEnter: requireAuth
    },

// =========================================================================================================

    { path:'/profil', component: IndexProfileView, beforeEnter: requireAuth },

    // {
    //     path:'/order_list',
    //     component: OrderListView,
    //     beforeEnter: requireAuth
    // },
    // {
    //     path:'/absensi',
    //     component: AttendanceView,
    //     beforeEnter: requireAuth
    // },
    // {
    //     path:'/absensi/detail',
    //     component: AttendanceDetailView,
    //     beforeEnter: requireAuth
    // },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;