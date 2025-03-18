import { createStore } from "vuex";
import employees from './modules/employees';
import products from './modules/products';
import categories from './modules/categories';
import customers from './modules/customers';
import payment_methods from './modules/payment_methods';
import outlets from './modules/outlets';
import roles from './modules/roles';
import units from './modules/units';
import attributes from './modules/attributes';
import attribute_lists from './modules/attribute_lists';
import inventories from './modules/inventories';
import detail_user from './modules/detail_user';
import attendances from './modules/attendances';
import transactions from './modules/transactions';
import pos_products from './modules/pos_products';
import pos_services from './modules/pos_services';
import pos_staff_service_item from './modules/pos_staff_service_item';
import pos_payments from './modules/pos_payments';
import invoices from './modules/invoices';
import commissions from './modules/commissions';
import report_products from './modules/report/report_products';
import report_customers from './modules/report/report_customers';
import report_commissions from './modules/report/report_commissions';
import report_payment_methods from './modules/report/report_payment_methods';
import images from './modules/images';
import report_detail_transaksi from "./modules/report/report_detail_transaksi";

const store = createStore({
    modules: {
        employees,
        products,
        categories,
        customers,
        payment_methods,
        outlets,
        roles,
        units,
        attributes,
        attribute_lists,
        inventories,
        detail_user,
        attendances,
        transactions,
        pos_products,
        pos_services,
        pos_staff_service_item,
        pos_payments,
        invoices,
        commissions,
        report_products,
        report_customers,
        report_commissions,
        report_payment_methods,
        report_detail_transaksi,
        images
    }
});

export default store;