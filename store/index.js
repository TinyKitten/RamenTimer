import Vuex from 'vuex';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

const store = () =>
  new Vuex.Store({
    state: {
      audio: null,
      counter: 0,
      started: false,
      subscription: null,
    },
    getters: {
      audio: state => state.audio,
      counter: state => state.counter,
      started: state => state.started,
      subscription: state => state.subscription,
    },
    mutations: {
      setAudio(state, audio) {
        state.audio = audio;
      },
      setStarted(state, flag) {
        state.started = flag;
      },
      setCompleted(state, flag) {
        state.completed = flag;
      },
      increment(state) {
        state.counter++;
      },
      reset(state) {
        state.counter = 0;
      },
      setSubscription(state, sub) {
        state.subscription = sub;
      },
    },
    actions: {
      start({ commit }) {
        commit('setStarted', true);
        const numbers = interval(1000);
        const obs = numbers.pipe(take(180));
        const sub = obs.subscribe(n => {
          commit('increment');
          if (n === 179) {
            commit('setStarted', false);
            commit('reset');
          }
        });
        commit('setSubscription', sub);
      },
      stop({ commit, getters }) {
        const sub = getters.subscription;
        sub.unsubscribe();
        commit('setStarted', false);
        commit('reset');
      },
    },
  });

export default store;
