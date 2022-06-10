import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 引入树形表格
import ZkTable from 'vue-table-with-tree-grid'





// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'



Vue.use(VueQuillEditor, /* { default global options } */ )

// 按需引入element-ui
import {
    Button,
    Card,
    Input,
    Form,
    FormItem,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    Alert,
    MessageBox,
    Select,
    Option,
    Tag,
    Tree,
    Cascader,
    Timeline,
    TimelineItem,
    Steps,
    Step,
    Tabs,
    TabPane,
    CheckboxGroup,
    Checkbox,
    Upload
}
from 'element-ui';

// Vue.use(ElementUI);
Vue.use(Button)
Vue.use(Card)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Alert)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)


Vue.use(ZkTable)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm



Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')