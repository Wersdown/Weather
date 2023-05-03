import { createStore } from "vuex";

function convertBool(val: string) {
    return ["true", "True"].filter((v) => { return v == val }).length == 1;
}

export default createStore({
    state: {
        story: false as boolean,
    },
    mutations: {
        safeLoadValues(state) {
            try {
                let story = localStorage.getItem("story");
                state.story = story ? convertBool(story) : state.story;
            }
            catch (e) {
                if (e) {
                    localStorage.clear();
                    window.location.reload();
                }
            }
        },
        saveValues(state) {
            localStorage.setItem("story", state.story + '');
        }
    }
})