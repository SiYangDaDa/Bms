import Vue from "vue"
import Router from "vue-router"
import { MessageBox } from 'element-ui'
Vue.use(Router)


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router=new Router({
    routes:[
        {
            path:"/login",
            name:"login",
            component:()=>import('../pages/login/Login.vue'),
        },
        {
            path:"/home",
            name:"home",
            component:()=>import('../pages/home/Home.vue'),
            meta:{isAuth:true},
            children:[
                {
                    path:"userInfo",
                    name:"userInfo",
                    component:()=>import('../pages/user/UserInfo.vue'),
                    meta:{isAuth:true}
                },
                {
                    path:"password",
                    name:"password",
                    component:()=>import('../pages/password/Password.vue'),
                    meta:{isAuth:true}
                },
                {
                    path:"borrowingCerTificate",
                    name:"borrowingCerTificate",
                    component:()=>import('../pages/borrowingCerTificate/BorrowingCerTificate.vue'),
                    meta:{isAuth:true}
                },
                {
                    path:"books",
                    name:"books",
                    component:()=>import('../pages/books/Books.vue'),
                    meta:{isAuth:true}
                },
                {
                    path:"booksSet",
                    name:"booksSet",
                    component:()=>import('../pages/books/BooksSet.vue'),
                    meta:{isAuth:true}
                },
                {
                    path:"adminManage",
                    name:"adminManage",
                    component:()=>import('../pages/user/AdminManage.vue'),
                    meta:{isAuth:true}
                },
                {
                    path:"authoritySet",
                    name:"authoritySet",
                    component:()=>import('../pages/user/AuthoritySet'),
                    meta:{isAuth:true}
                },
                {
                    path:"borrowBook",
                    name:"borrowBook",
                    component:()=>import('../pages/books/BorrowBook.vue'),
                    meta:{isAuth:true}
                },
                {
                    path:"returnBook",
                    name:"returnBook",
                    component:()=>import('../pages/books/ReturnBook.vue'),
                    meta:{isAuth:true}
                },
                {
                    path:"searchBook",
                    name:'searchBook',
                    component:()=>import('../pages/books/SearchBook.vue'),
                    meta:{isAuth:true}
                }
            ]
        },
        
        // // 配置默认路由
        {
            path:"/",
            redirect:'/login',
        },
    ]
})

// 全局前置守卫，初始化的时候执行，每次路由切换前执行，对路由进行权限校验
router.beforeEach((to,from,next)=>{
    if(to.meta.isAuth){
        if(sessionStorage.getItem('token')){
            next()
        }else{
            router.push({name:"login"})
            // alert("暂无权限查看，请先登录！")
            MessageBox.confirm('未授权，请先登录！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
              }).then(() => {
                // 点击确定前往登录页面
                router.push('/login')
              }).catch(() => {
                router.push('/login')    
              })
        }
        next()
    }
    next()
})


export default router