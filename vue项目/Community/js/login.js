var vm = new Vue({
    el:"#app",

    data:{
        username:"",
        ifUserName:false,
        phone:"",
        ifPhone:false,
        password:"",
        ifPassword:false,
        ifShowPwd:false,
        wrongPwd:false,
        canLogin:0,
    },

    methods:{
        // 获取焦点切换图标
        changeIcon(i){
            switch(i){
                case 'name':
                    if(!this.ifUserName){
                        this.ifUserName = true;
                        this.canLogin += 1;
                    }
                    break;
                case 'phone':
                    if(!this.ifPhone){
                        this.ifPhone = true;
                        this.canLogin += 1;
                    }
                    break;
                case 'pwd':
                    if(!this.ifPassword){
                        this.ifPassword = true;
                        this.canLogin += 1;
                    }
                    break;
            }
        },
        // 显示密码
        showPwd(){
            this.ifShowPwd = !this.ifShowPwd;
        },
        // 登录
        login(){
            // console.log(this.username,this.phone,this.password)
            this.wrongPwd = true
            setTimeout(() => {
                this.wrongPwd = false 
            }, 2000);
            // 验证手机号
            if(!(/^1[34578]\d{9}$/.test(this.phone))){ 
                console.log("手机号码有误，请重填");  
                return false; 
            } 
        },
    },
})