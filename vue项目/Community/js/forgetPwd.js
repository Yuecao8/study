var vm = new Vue({
    el:"#app",

    data:{
        step:0,
        phone:"",
        code:"",
        ifPhone:false,
        password:"",
        ifPassword:false,
        ifShowPwd:false,
        ifCode:false,
        ifSendCode:false,
        canGetCode:false,
        canLogin:0,
        confirmPwd:false,
    },

    methods:{
        // 获取焦点更换图标
        changeIcon(i){
            switch(i){
                case 'phone':
                    this.ifPhone = true;
                    this.canLogin += 1;
                    break;
                case 'code':
                    this.ifCode = true;
                    this.canGetCode = true;
                    this.canLogin += 1;
                    break;
                case 'pwd':
                    this.ifPassword = true;
                    this.confirmPwd = true;
                    break;
            }
        },
        // 显示密码
        showPwd(){
            this.ifShowPwd = !this.ifShowPwd;
        },
        // 获取验证码
        getCode(){
            if(this.phone){
                this.canGetCode = false;
                this.ifSendCode = true;
                this.canLogin += 1;
                setTimeout(()=>{
                    this.ifSendCode = false;
                },2000)
                setTimeout(()=>{
                    this.canGetCode = true
                },5000)
            }
        },
        // 下一步
        nextStep(){
            this.step += 1
        },
        // 提交
        confirm(){
            console.log('done')
        }
    },
})