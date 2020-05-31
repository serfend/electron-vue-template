import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const {
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  title
} = defaultSettings

const state = {
  title: title,
  version: 'beta',
  theme: variables.theme,
  variables: variables,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, {
    key,
    value
  }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({
    commit
  }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
