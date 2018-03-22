// 密码登录
function login(typ){

	var params = WST.getParams('.ipt');
	if(!$('#loginName').isValid())return;
	if(!$('#loginPwd').isValid())return;
	if(!$('#verifyCode').isValid())return;
	var ll = WST.load({msg:'正在处理数据，请稍后...'});
	$.post(WST.U('home/users/checkLogin'),params,function(data,textStatus){
		var json = WST.toJson(data);
		
		if(json.status=='1'){
			WST.msg(json.msg, {icon: 1});
			if(typ == 2){
				location.href=WST.U('home/shops/index');
			}else if(typ == 1){
				location.href=WST.U('home/users/index');
			}else{
                parent.location.reload();
            }
		}else{

			layer.close(ll);
			WST.msg(json.msg, {icon: 5});
			WST.getVerify('#verifyImg');
		}

	});
	return true;
}

// 手机验证码登录
function login1(typ){
    if(!$('#loginName1').isValid())return;
    if(!$('#mobileCode1').isValid())return;
    if(!$('#verifyCode1').isValid())return;
    var params={};
    params.loginName1 = $('#loginName1').val();
    params.rememberPwd = $('#rememberPwd1').val();
    params.mobileCode = $('#mobileCode1').val();
    params.verifyCode = $('#verifyCode1').val();
	params.typ = $('#typ').val();
    var ll = WST.load({msg:'正在处理数据，请稍后...'});
    $.post(WST.U('home/users/checkLogin'),params,function(data,textStatus){
        var json = WST.toJson(data);
        if(json.status=='1'){
            WST.msg(json.msg, {icon: 1});
            if(typ==2){
                location.href=WST.U('home/shops/index');
            }else if(typ==1){
                location.href=WST.U('home/users/index');
            }else{
                parent.location.reload();
            }
        }else{

            layer.close(ll);
            WST.msg(json.msg, {icon: 5});
            WST.getVerify('#verifyImg');
        }

    });
    return true;
}


function showProtocol1(){
	
	layer.open({
	    type: 2,
	    title: '用户注册协议',
	    shadeClose: true,
	    shade: 0.8,
	    area: ['1000px', ($(window).height() - 50) +'px'],
	    content: [WST.U('home/shopapplys/protocol')],
	    btn: ['同意并注册'],
	    yes: function(index, layero){
	    	layer.close(index);
	    }
	});
}

var time = 0;
var isSend = false;
var isUse = false;
var index2 = null;
function getVerifyCode(){
	var params = {};
		params.userPhone = $.trim($("#loginName").val());
	if(params.userPhone==''){
		WST.msg('请输入手机号码!', {icon: 5});
		return;
	}
	if(isSend )return;
	isSend = true;
	if(window.conf.SMS_VERFY=='1'){
		var html = [];
			/***img标签增加 ondragstart="return false" 禁止图片拖动****/
			html.push('<table class="wst-smsverfy"><tr><td width="80" align="right">');
			html.push('验证码：</td><td><input type="text" id="smsVerfyl" size="12" class="wst-text" maxLength="8">');
			html.push('<img style="vertical-align:middle;cursor:pointer;height:39px;" class="verifyImgd" src="'+WST.DOMAIN+'/wstmart/Home/View/default/images/clickForVerify.png" ondragstart="return false" title="刷新验证码" onclick="javascript:WST.getVerify(\'.verifyImgd\')"/>');
           /***img标签增加 ondragstart="return false" 禁止图片拖动****/
		   html.push('</td></tr></table>');
		index2 = layer.open({
			title:'请输入验证码',
			type: 1,
			area: ['420px', '150px'], //宽高
			content: html.join(''),
			btn: ['发送验证码'],
			success: function(layero, index){
				WST.getVerify('.verifyImgd');
			},
			yes: function(index, layero){
				isSend = true;
				params.smsVerfy = $.trim($('#smsVerfyl').val());
			 	if(params.smsVerfy==''){
   			  		WST.msg('请输入验证码!', {icon: 5});
   			   		return;
   			 	}
				getPhoneVerifyCode(params);
			},
			cancel:function(){
				isSend = false;
			}
		});
	}else{
		isSend = true;
		getPhoneVerifyCode(params);
	}
}

function getPhoneVerifyCode(params){
	WST.msg('正在发送短信，请稍后...',{time:600000});
	$.post(WST.U('home/users/getPhoneVerifyCode'),params,function(data,textStatus){
		var json = WST.toJson(data);
		if(json.status!=1){
			/******tian 发送短信验证码前 输入验证码错误 刷新验证码  2017/09/12*******/
			WST.msg(json.msg, {icon: 5},function(){			
			WST.getVerify('.verifyImgd');			
			});
			/******tian 发送短信验证码前 输入验证码错误 刷新验证码  2017/09/12*******/	
			time = 0;
			isSend = false;
		}if(json.status==1){
			WST.msg('短信已发送，请注册查收');
			time = 120;
			$('#timeTips').css('width','100px');
			$('#timeTips').html('获取验证码(120)');
			$('#mobileCode').val(json.phoneVerifyCode);
			var task = setInterval(function(){
				time--;
				$('#timeTips').html('获取验证码('+time+")");
				if(time==0){
					isSend = false;						
					clearInterval(task);
					$('#timeTips').html("重新获取验证码");
				}
			},1000);
		}
		if(json.status!=-2)layer.close(index2);
	});
}
function initRegist(){
	$('#reg_form').validator({
	    rules: {
	    	loginName: function(element) {
	    		// if(/^[a-zA-Z]\w{3,}/.test(element.value)){
	    		// 	$("#mobileCodeDiv").hide();
	    		// 	$("#authCodeDiv").show();
	    		// 	$("#nameType").val('2');
	    		// }else 
	    		// console.log(this.test(element,"mobile"));
	    		if(this.test(element, "mobile")===true){
	    			if(window.conf.SMS_OPEN=='1'){
		    			$("#mobileCodeDiv").show();
		    			$("#authCodeDiv").hide();
		    			$("#nameType").val('3');
	    			}else{
		    			$("#nameType").val('2');
	    			}
	    		}else{
	    			
	    			/******tian  用户名如果提示错误不清空******/	    			
	    			/*$("#loginName").val('');*/
	    			return false;
	    			/******tian******/
	    		}
	    		// }else if(this.test(element, "email")===true){
	    		// 	$("#mobileCodeDiv").hide();
	    		// 	$("#authCodeDiv").show();
	    		// 	$("#nameType").val('1');
	    		// }
	            return 
	            		// /^[a-zA-Z]\w{3,}/.test(element.value) ||
	                   this.test(element, "mobile")===true //||
	                   // this.test(element, "email")===true ||
	                    '请填写用户名、手机号或者邮箱';
	        },
	        mobileCode: function(element){
	        	if(window.conf.SMS_OPEN=='1'){
		        	if(this.test(document.getElementById("loginName"), "mobile")===true){
		        		return true;
		    		}
	        	}
	        	return false;
	        },
	        verifyCode: function(element){
	        	if(this.test(document.getElementById("loginName"), "mobile")===false){
	        		return true;
	    		}else{
	    			return false;
	    		}
	        },
	        //自定义remote规则（注意：虽然remote规则已经内置，但这里的remote会优先于内置）
	        remote: function(element){
	        	return $.post(WST.U('home/users/checkLoginKey'),{"loginName":element.value},function(data,textStatus){
	        	
	        	});
	        },
	        /******tian 密码限制 添加自定义规则rePassword*******/
	        rePassword: function(element, params) {
			    return  /^(?!^[0-9]+$)[\x21-x7e]{8,16}$/.test(element.value) || '密码由8-16位数字、字符组成,不能为纯数字';
			}
	        /******tian*******/
	    },
	    fields: {
	        // 'loginName': 'required; loginName; remote;',
	        // 'loginPwd' : '密码:required; password;',
	        // 'reUserPwd': '确认密码:required; match(loginPwd);',
	        // 'mobileCode': {rule:"required(mobileCode)",msg:{required:'请输入短信验证码'}},
	        // 'verifyCode': {rule:"required(verifyCode)",msg:{required:'请输入验证码'}}
	        'loginName': '用户名:required;loginName;remote;',
			'loginPwd' : '密码:required; rePassword;',
			'reUserPwd': '确认密码:required; match(loginPwd);',
			//'mobileCode': {rule:"required(mobileCode)",msg:{required:'请输入短信验证码'}},
			// 'mobileCode': {rule:"required;",msg:{required:'请输入短信验证码'}},
			'verifyCode': {rule:"required(verifyCode)",msg:{required:'请输入验证码'}},
			'protocol':   {rule:"checked",msg:{checked:'请阅读并同意《用户注册协议》'}}
	    },
	    // 表单验证通过后，ajax提交
	    valid: function(form){
	        var me = this;
	        // ajax提交表单之前，先禁用submit
	        me.holdSubmit();
	        var params = WST.getParams('.wst_ipt');
	        $("#reg_butt").css('color', '#999').text('正在提交..');
	        $.post(WST.U('home/users/toRegist'),params,function(data,textStatus){
	    		var json = WST.toJson(data);
	    		if(json.status>0){
	    			WST.msg('注册成功，正在跳转登录!', {icon: 1}, function(){
	    				location.href=WST.U('home/users/index');
	       			});
	    		}else{
	    			me.holdSubmit(false);
	    			WST.getVerify('#verifyImg');
	    			WST.msg(json.msg, {icon: 5});
	    		}
	    		
	    	});
	    }
	});
}

/*刷新验证码*/
$("#loginName").focus(function(){
	 WST.getVerify('#verifyImg');
})
$("#loginName1").focus(function(){
	 WST.getVerify('#verifyImg1');
})