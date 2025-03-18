<template>
    <ModalAttendance
        v-if="modalShowAttendance"
        @closeModal="closeModal"
        @checkInOut="handleCheckInOut"
        :employee="selectedEmployee"
        :isCheckingOut="isCheckingOut" />
    <div
        id="overlay"
        class="fixed inset-0 bg-black bg-opacity-30 z-30"
        :class="{ 'hidden': !isBlur }"
    ></div>
    <IndexView />
    <section class="p-6 w-full">
        <PageTitle title="Absensi"/>
        <div class="bg-white rounded-lg py-6 px-5 shadow-lg">
            <table class="table-auto w-full">
                <thead class="bg-color-1">
                    <tr>
                        <th class="p-3 border-b text-color-4 text-left">No</th>
                        <th class="p-3 border-b text-color-4 text-left">Nama Karyawan</th>
                        <th class="p-3 border-b text-color-4 text-left">Role</th>
                        <th class="p-3 border-b text-color-4 text-center`">In</th>
                        <th class="p-3 border-b text-color-4 text-center`">Out</th>
                        <th class="p-3 border-b text-color-4 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(employee, index) in allEmployees" :key="employee.id" :class="{'bg-blue-50' : index % 2 == 1}" class="hover:bg-blue-100">
                        <td class="py-3 px-3 text-gray-500">{{ index + 1 }}</td>
                        <td class="py-3 px-3 text-gray-500">{{ employee.name }}</td>
                        <td class="py-3 px-3 text-gray-500">{{ employee.Role ? employee.Role.name : '' }}</td>
                        <td class="py-3 px-3 text-gray-500 text-center">{{ getAttendance(employee.id) ? formatTime(getAttendance(employee.id).start_time) : '' }}</td>
                        <td class="py-3 px-3 text-gray-500 text-center">{{ getAttendance(employee.id) && getAttendance(employee.id).end_time ? formatTime(getAttendance(employee.id).end_time) : '' }}</td>
                        <td class="py-3 px-3 text-gray-500">
                            <button @click="checkInOutEmployee(employee)" :class="buttonClass(employee)" class="rounded-md text-white py-1 px-2">
                                {{ getAttendance(employee.id) && !getAttendance(employee.id).end_time ? 'CHECK OUT' : 'CHECK IN' }} 
                            </button>
                            <!-- <button @click="checkOutEmployee(employee)" class="bg-red-500 rounded-md hover:bg-red-400 text-white py-1 px-2">CHECK OUT</button> -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import PageTitle from '@/components/PageTitle.vue';
import ModalAttendance from '@/components/modals/ModalAttendance.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'AttendanceView',
    components: {
        IndexView, PageTitle, ModalAttendance
    },
    data() {
        return {
            modalShowAttendance: false,
            isBlur: false,
            selectedEmployee: null,
            isCheckingOut: false,
        }
    },
    methods: {
        closeModal() {
            setTimeout(() => {
                this.modalShowAttendance = false;
                this.isBlur = false;
                this.$store.dispatch('employees/fetchEmployees');
                this.$store.dispatch('attendances/fetchAttendances');
            }, 200);
        },
        getAttendance(userId) {
            return this.allAttendances.find(attendance => attendance.user_id == userId);
        },
        checkInOutEmployee(employee) {
            this.modalShowAttendance = true;
            this.isBlur = true;
            this.selectedEmployee = employee;
            const attendance = this.getAttendance(employee.id);
            this.isCheckingOut = attendance && !attendance.end_time; //kalau `end_time` = null ATAU sudah checkin dan belum checkout, (false)
        },
        handleCheckInOut() {
            this.closeModal();
        },
        formatTime(time) {
            return new Date(time).toLocaleString();
        },
        buttonClass(employee) {
            const attendance = this.getAttendance(employee.id);
            return attendance && !attendance.end_time ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400';
        },
    },
    computed: {
    ...mapGetters('employees', ['allEmployees']),
    ...mapGetters('attendances', ['allAttendances']),
    },
    created() {
        this.$store.dispatch('employees/fetchEmployees');
        this.$store.dispatch('attendances/fetchAttendances');
    },
}
</script>