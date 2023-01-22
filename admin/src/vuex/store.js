import { createStore } from "vuex"
 
export default createStore({
    state() {
        return {
            admin: null,
            login: false,
            unReadOrderNotifications: 0
        }
    },
 
    mutations: {
        setUnReadOrderNotifications (state, newValue) {
            state.unReadOrderNotifications = newValue
        },

        setAdmin (state, newAdmin) {
            state.admin = newAdmin
        },

        setLogin (state, newValue) {
            state.login = newValue
        }
    },
 
    getters: {
        getUnReadOrderNotifications (state) {
            return state.unReadOrderNotifications
        },

        getAdmin (state) {
            return state.admin
        },

        getLogin (state) {
            return state.login
        }
    }
})