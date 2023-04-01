// 该文件主要用于集中管理api接口

import request from './request'

// 登录
export const loginApi=(params)=>request.post("/api/log",params)
// 注册
export const registApi=(params)=>request.post("/api/reg",params)
// 修改密码
export const setPasswordApi=(params)=>request.post("/password",params)
// 更改用户信息
export const setUserInfoApi=(params)=>request.post("/setUserInfo",params)
// 获取七牛云上传文件的token
export const UpLoadTokenApi=()=>request.get("/uploadToken")
// 获取图书可用分类
export const BooksTypeApi=()=>request.post("/getType")
// 获取图书禁用分类
export const BookForbidenTypeApi=()=>request.post('/getForbidType')
// 修改图书的分类状态
export const SetBooksTypeStatusApi=(params)=>request.post('/setBooksType',params)
// 删除图书分类
export const DeleteBooksTypeApi=(params)=>request.post('/deleteBooksType',params)
// 添加图书分类
export const AddBooksTypeApi=(params)=>request.post('/addBooksType',params)
// 添加新图书
export const AddNewBookApi=(params)=>request.post("/addNewBook",params)
// 添加图书数量
export const AddBookNumApi=(params)=>request.post("/addBookNum",params)
// 输入框搜索图书信息
export const GetBooksByInputApi=(params)=>request.post("bookInfo",params)
// 通过分页符获取图书信息
export const GetBooksByPageApi=(params)=>request.post("/bookInfoByPage",params)
// 设置图书状态（上架/下架）
export const SetBookStatusApi=(params)=>request.post("/bookStatus",params)
// 删除图书
export const DeleteBookApi=(params)=>request.post("/deleteBook",params)
// 更新图书价格
export const SetBookPriceApi=(params)=>request.post("/setPrice",params)
// 更新图书位置
export const SetBookLocationApi=(params)=>request.post("/setLocation",params)
// 添加管理员
export const AddAdminApi=(params)=>request.post("/addAdmin",params)
// 借书
export const BorrowBookApi=(params)=>request.post("/borrowBook",params)
// 还书
export const ReturnBookApi=(params)=>request.post("/returnBook",params)
// 获取功能权限
export const GetAuthorityApi=(params)=>request.post("/getAuthority",params)
// 设置功能权限
export const SetAuthorityApi=(params)=>request.post("/setAuthority",params)
// 重置功能权限
export const ResetAuthorityApi=(params)=>request.post("/resetAuthority",params)
// 通过搜索框获取借阅信息
export const GetBorrowInfoApi=(params)=>request.post("/borrowInfo",params)
// 通过分页符获取借阅信息
export const GetBorrowInfoByPageApi=(params)=>request.post("/borrowInfoByPage",params)
// 获取用户信息
export const GetUserInfoApi=(params)=>request.post("/getUserInfo",params)
// 获取账户禁用的用户信息
export const GetForbidenAcccountApi=(params)=>request.post("/getForbidenAccount",params)
// 获取借阅权限禁用的用户信息
export const GetBorrowForbidenAccountApi=(params)=>request.post("/getBorrowForbidenAccount",params)
// 修改账户信息或权限
export const SetAccountInfpApi=(params)=>request.post("/setAccountInfo",params)
