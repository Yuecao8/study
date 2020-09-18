var vm = new Vue({
    el:"#app",

    data:{
        username:"",
        ifUserName:false,
        phone:"",
        phoneCode: "",
        ifPhone:false,
        password:"",
        ifPassword:false,
        ifShowPwd:false,
        ifCode:false,
        ifSendCode:false,
        canGetCode:false,
        canLogin:0,
    },

    methods:{
        // 获取焦点更换图标
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
                case 'code':
                    if(!this.ifCode){
                        this.ifCode = true;
                        this.canGetCode = true;
                        this.canLogin += 1;
                    }
                    break;
            }
        },
        // 显示密码
        showPwd(){
            this.ifShowPwd = !this.ifShowPwd;
        },
        // 获取验证码
        getCode(){
            this.canGetCode = false;
            this.ifSendCode = true;
            setTimeout(()=>{
                this.ifSendCode = false;
            },2000)
            setTimeout(()=>{
                this.canGetCode = true
            },5000)
        },
        // 提交
        login(){
            console.log(this.username,this.phone,this.phoneCode,this.password)
        },
    },
})