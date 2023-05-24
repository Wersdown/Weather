import { createStore } from "vuex";

function convertBool(val: string) {
    return ["true", "True"].filter((v) => { return v == val }).length == 1;
}

export default createStore({
    state: {
        story: false as boolean,
        cities: [] as string[]
    },
    mutations: {
        safeLoadValues(state) {
            try {
                let story = localStorage.getItem("story");
                let cities = localStorage.getItem("cities");
                state.story = story ? convertBool(story) : state.story;
                state.cities = cities ? JSON.parse(cities) : [];
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
            localStorage.setItem("cities", JSON.stringify(state.cities));
        }
    }
})