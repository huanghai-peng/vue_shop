import Vue from 'vue'
import App from './App.vue'
import router from './router'



// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 引入树形表格
import ZkTable from 'vue-table-with-tree-grid'





// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'



Vue.use(VueQuillEditor, /* { default global options } */ )



Vue.use(ZkTable)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm



Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')