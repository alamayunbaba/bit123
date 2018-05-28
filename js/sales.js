$(document).ready(function(){

var dappAddress = "n1ijrrcSM8Q8JtZpHg3FLWUhQhVCDZh6Y19";
	var NebPay = require("nebpay");
    var nebPay = new NebPay();

	var nebulas = require("nebulas"),
        Account = nebulas.Account,
        neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

getAllListSales();

getAllSellTiebaList();
function getTiebainfo(){
var from = Account.NewAccount().getAddressString();
        var value = "0";
        var nonce = "0"
        var gas_price = "1000000"
        var gas_limit = "2000000"
        var callFunction = "ListTieba";
        var callArgs = '[0,"max"]';
        var contract = {
            "function": callFunction,
            "args": callArgs
        }

        neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
            cbSearchindex(resp)
        }).catch(function (err) {
            console.log("error:" + err.message)
        });
	var intervalTime;
	var intervalTimeout=360;
	function runtimedis(tsecond){
		var theTime = parseInt(tsecond);
			var theTime1 = 0;
			var theTime2 = 0;// 小时 
			if(theTime > 60) { 
				theTime1 = parseInt(theTime/60); 
				theTime = parseInt(theTime%60); 
			if(theTime1 > 60) { 
				theTime2 = parseInt(theTime1/60); 
				theTime1 = parseInt(theTime1%60); 
			} 
			} 
			var result = ""; 
			if(theTime<10){
				result = result+"0"+parseInt(theTime);
			}else{
				result = result+parseInt(theTime);
			}
				
				if(theTime1<10){
					result = "0"+parseInt(theTime1)+"&nbsp;:&nbsp;"+result; 
				}else{
					result = ""+parseInt(theTime1)+"&nbsp;:&nbsp;"+result; 
				}
			$('#disdrowtime').html(result);
			intervalTimeout--;
			if(intervalTimeout==0){
				clearInterval(intervalTime);
				$('#usertakeno').text('领取下一个号码');
				$('#disdrowtime').html('<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div>');
				$('#witecontxt').html('正在等待智能合约抽签...');
				getDrawresult();
			}
}

    function cbSearchindex(resp) {
        var result = resp.result;
		if(result!=null && result!="" && result!="null"){
			var tbobj=jQuery.parseJSON(result);
			var tbtimeout=tbobj.tbtimeout;
			var tbinfo=tbobj.tbinfo;
			var tbid=tbinfo.tbId;
			var tbowner=tbinfo.tbOwner;
			if(tbtimeout>360 || tbowner.length>5){
					tbid++;
			}else{
					intervalTimeout=360-tbtimeout;
			}
			$('#currdrowno').text(tbid);
			intervalTime = setInterval(function(){
				runtimedis(intervalTimeout);
			},1000);
			getMydrowno(tbid);
		}
	}

}
function getDrawresult(){
	var intervalDrawTime;
	intervalDrawTime = setInterval(function(){
				queryCurDrawRes();
			},20000);
	function queryCurDrawRes(){
			var from = Account.NewAccount().getAddressString();
			var value = "0";
			var nonce = "0"
			var gas_price = "1000000"
			var gas_limit = "2000000"
			var callFunction = "ListTieba";
			var callArgs = '['+$('#currdrowno').text()+',""]';
			var contract = {
				"function": callFunction,
				"args": callArgs
			}

			neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
				cbdrawSearchindex(resp)
			}).catch(function (err) {
				console.log("error:" + err.message)
			});
				function cbdrawSearchindex(resp) {
						var result = resp.result;
						if(result!=null && result!="" && result!="null"){
							var tbobj=jQuery.parseJSON(result);
							var tbinfo=tbobj.tbinfo;
							var tbowner=tbinfo.tbOwner;
							var drawno=tbinfo.drawNo;
							var disdrawnook='';
							var mydrawnum=parseInt($('#mydrownospantxt').text());
							if(drawno>0 && tbowner.length>5){
									clearInterval(intervalDrawTime);
									if(mydrawnum==drawno){disdrawnook='恭喜！';getAllMyTiebaList();}
									$('#disdrowtime').html(disdrawnook+'本次中签号码：'+drawno);
									$('#witecontxt').html('<br>');
									$('#usertakeno').css('display','block');
									getAllUserTiebaList();
							}
							
							
						}
				}

	}
}
function getMydrowno(tbid){
			var to = dappAddress;
			var value = "0";
			var callFunction = "QueryMyDrawNo";
			var callArgs = '['+tbid+']'; 
			nebPay.simulateCall(to, value, callFunction, callArgs, { 
				listener: cbdSearch 
			});

			function cbdSearch(resp) {
				var result = resp.result;
				if(result=="null" || result==null || result=="" || result.indexOf("rror:")!=-1){
						$('#usertakeno').css('display','block');
						$('#mydrownospan').css('display','none');
						$('#mydrownospantxt').text("0");
					
				}else{
					var reobj=jQuery.parseJSON(result);
					if(reobj.mydrawnum>0){
						$('#usertakeno').css('display','none');
						$('#mydrownospan').css('display','block');
						$('#mydrownospantxt').text(reobj.mydrawnum);
						
					}else{
						$('#usertakeno').css('display','block');
						$('#mydrownospan').css('display','none');
						$('#mydrownospantxt').text("0");
					}
					$('#alldrawnudis').text(reobj.alldrawnum);
				}
			}

}
function getAllMyTiebaList(){
		var to = dappAddress;
			var value = "0";
			var callFunction = "ListTieba";
			var callArgs = '[0,"my"]'; 
			nebPay.simulateCall(to, value, callFunction, callArgs, { 
				listener: cbdmySearch 
			});

			function cbdmySearch(resp) {
				var result = resp.result;
				if(result=="null" || result==null || result=="" || result.indexOf("rror:")!=-1){
						
					
				}else{
					var tbobj=jQuery.parseJSON(result);
					var mytbhtml='';
					var ti=0;
					tbobj.forEach(function(value,index){
						var tbinfo=value.tbinfo;
						var tbId=tbinfo.tbId;
						var tbName=unescape(tbinfo.tbName);
						var tbPrice=tbinfo.tbPrice;
						var tbSell=tbinfo.tbSell;
						var tbIntroduce=unescape(tbinfo.tbIntroduce);
						var dissellprice='';
						var distbname='#'+tbId+'&nbsp;贴吧';
						var distbmanagntxt='创建';
						if(tbName.length>0){distbname=tbName;distbmanagntxt='管理';}
						var dissellhref='<a  data-tbname="'+tbName+'" data-tbprice="'+tbPrice+'" data-tbid="'+tbId+'" id="selltieba-'+tbId+'" href="javascript:void(0);" >出售</a>';
						if(tbSell==1){
							dissellhref='<a  data-tbprice="'+tbPrice+'" data-tbid="'+tbId+'" id="cancleselltieba-'+tbId+'" href="javascript:void(0);" >下架</a>';
							dissellprice='&nbsp;&nbsp;<span style="font-size:0.6em;color:#0090c5;">售:'+tbPrice+'NAS</span>'
						}
						mytbhtml=mytbhtml+'<p>'+distbname+dissellprice+'<span style="float:right;"><a data-tbname="'+tbName+'" data-tbIntroduce="'+tbIntroduce+'" data-tbid="'+tbId+'" id="tiebamanag-'+tbId+'" href="javascript:void(0);" >'+distbmanagntxt+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+dissellhref+'</span></p>';
						ti++;
					});
					for(var vi=ti;vi<20;vi++){
						mytbhtml=mytbhtml+'<p>&nbsp;</p>';
					}
					$('#mytblist').html(mytbhtml);
					$("a[id^='tiebamanag']").unbind('click').click(function () {
							$('#jq-alert').css('display','flex');
							$('#tiebmoditbid').text($(this).attr('data-tbid'));
							$('#tiebmodiname').val($(this).attr('data-tbname'));
							$('#tiebmodiintr').val($(this).attr('data-tbIntroduce'));

					});
					

					$("a[id^='selltieba']").unbind('click').click(function () {
						$('#jq-alert-sell').css('display','flex');
							$('#tiebselltbid').text($(this).attr('data-tbid'));
							$('#tiebsellname').text($(this).attr('data-tbname'));
							$('#tiebsellprice').text($(this).attr('data-tbprice'));
					});

					$("a[id^='cancleselltieba']").unbind('click').click(function () {
						ExeConstract("SellTieba","0",'['+$(this).attr('data-tbid')+','+$(this).attr('data-tbprice')+',0]');
					});
					
				}
			}
}

					$('#no_btn').click(function(){
						$('#jq-alert').css('display','none');
					});

					$('#yes_btn').click(function(){
						var tiebmodiname=$('#tiebmodiname').val();
						var tiebmodiintr=$('#tiebmodiintr').val();
						if(tiebmodiname.length>20){
							alert('吧名太长了，不要超过20个字');
							return;
						}
						if(tiebmodiname.length<1){
							alert('吧名不要少于1个字');
							return;
						}
						if(tiebmodiintr.length>50){
							alert('简介太长了，不要超过50个字');
							return;
						}
						ExeConstract("TiebaManage","0",'['+$('#tiebmoditbid').text()+',"'+escape(tiebmodiname)+'","'+escape(tiebmodiintr)+'"]');
					});

					$('#sellno_btn').click(function(){
						$('#jq-alert-sell').css('display','none');
					});
					$('#sellyes_btn').click(function(){
						var tiebsellprice=$('#tiebsellprice').val();
						if(!isNaN(tiebsellprice) && parseFloat(tiebsellprice)>0){
									ExeConstract("SellTieba","0",'['+$('#tiebselltbid').text()+','+tiebsellprice+',1]');
						}else{
									alert('出售价格必须是大于0的数字');
									return;
						}
						
					});


function getAllSellTiebaList(){
		var from = Account.NewAccount().getAddressString();
			var value = "0";
			var nonce = "0"
			var gas_price = "1000000"
			var gas_limit = "2000000"
			var callFunction = "ListTieba";
			var callArgs = '[0,"",12300]';
			var contract = {
				"function": callFunction,
				"args": callArgs
			}

			neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
				cbdsellSearch(resp)
			}).catch(function (err) {
				console.log("error:" + err.message)
			});

			function cbdsellSearch(resp) {
				var result = resp.result;
				if(result=="null" || result==null || result=="" || result.indexOf("rror:")!=-1){
						
					
				}else{
					var tbobj=jQuery.parseJSON(result);
					var mytbhtml='';
					var tti=0;
					var ttis=0;
					tbobj.forEach(function(value,index){
						var tbinfo=value.tbinfo;
						var tbId=tbinfo.tbId;
						var tbName=unescape(tbinfo.tbName);
						var tbPrice=tbinfo.tbPrice;
						var tbSell=tbinfo.tbSell;
						var dissellprice='';
						var distbname='#'+tbId+'&nbsp;贴吧';
						if(tbName.length>0){distbname=tbName;}
						if(tbSell==1){
							tti++;
							ttis++;
								mytbhtml=mytbhtml+'<p>'+distbname+'<span style="float:right;">'+tbPrice+'&nbsp;NAS&nbsp;&nbsp;&nbsp;&nbsp;<a data-tbprice="'+tbPrice+'" data-tbid="'+tbId+'" id="buytieb-'+tbId+'" href="javascript:void(0);" >购买</a></span></p>';
						}
						
					});
					$('#allselltbnum').text(ttis);
					$('#allselltblist').html(mytbhtml);
					$("a[id^='buytieb']").unbind('click').click(function () {
						ExeConstract("BuyTieba",$(this).attr('data-tbprice'),'['+$(this).attr('data-tbid')+','+$(this).attr('data-tbprice')+']');
					});
					
				}
			}
}
function getAllUserTiebaList(){
		var from = Account.NewAccount().getAddressString();
			var value = "0";
			var nonce = "0"
			var gas_price = "1000000"
			var gas_limit = "2000000"
			var callFunction = "ListTieba";
			var callArgs = '[0,"",20]';
			var contract = {
				"function": callFunction,
				"args": callArgs
			}

			neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
				cbduserSearch(resp)
			}).catch(function (err) {
				console.log("error:" + err.message)
			});

			function cbduserSearch(resp) {
				var result = resp.result;
				if(result=="null" || result==null || result=="" || result.indexOf("rror:")!=-1){
						
					
				}else{
					var tbobj=jQuery.parseJSON(result);
					var mytbhtml='';
					tbobj.forEach(function(value,index){
						var tbinfo=value.tbinfo;
						var tbId=tbinfo.tbId;
						var drawNo=tbinfo.drawNo;
						var dissptxt='';			
						if(drawNo>0){
							dissptxt='中签号码：'+drawNo;
						}else{
							dissptxt='等待抽签';
						}
						mytbhtml=mytbhtml+'<p>#'+tbId+'&nbsp;贴吧<span style="float:right;">'+dissptxt+'</span></p>';
					});
					$('#allusertblist').html(mytbhtml);
					
				}
			}
}

function getAllListSales(){
		var from = Account.NewAccount().getAddressString();
			var value = "0";
			var nonce = "0"
			var gas_price = "1000000"
			var gas_limit = "2000000"
			var callFunction = "ListSales";
			var callArgs = '[]';
			var contract = {
				"function": callFunction,
				"args": callArgs
			}

			neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
				cbdsalesSearch(resp)
			}).catch(function (err) {
				console.log("error:" + err.message)
			});

			function cbdsalesSearch(resp) {
				var result = resp.result;
				if(result=="null" || result==null || result=="" || result.indexOf("rror:")!=-1){
						
					
				}else{
					var tbobj=jQuery.parseJSON(result);
					var mytbhtml='';
					tbobj=tbobj.sort(compare('tbPrice')).reverse();
					tbobj.forEach(function(value,index){
							var tbId=value.tbId;
							var tbName=unescape(value.tbName);
							var tbPrice=value.tbPrice;
							var distbname='#'+tbId+'&nbsp;贴吧';
							if(tbName.length>0){distbname=tbName;}
							var subprice=tbPrice-0.00001;
							var subpbai=Math.round(subprice/0.01)*100.00;
							mytbhtml=mytbhtml+'<p>'+distbname+'&nbsp;<span style="font-size:0.6em;color:#0090c5;"><b>&uarr;</b>&nbsp;'+subpbai+'%</span><span style="float:right;">'+tbPrice+'&nbsp;NAS</span></p>';
						
					});
					
					$('#dragonlist').html(mytbhtml);
					
					
				}
			}
}
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}
function getAllMyinfo(){
			var to = dappAddress;
			var value = "0";
			var callFunction = "AccountManageGet";
			var callArgs = '[""]'; 
			nebPay.simulateCall(to, value, callFunction, callArgs, {    //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
				listener: cbSearch      //指定回调函数
			});

			function cbSearch(resp) {
				var result = resp.result;
				
				if(result=="null" || result==null || result=="" || result.indexOf("rror:")!=-1){
					
				}else{
						var reobj=jQuery.parseJSON(result);
						$('#ownaddr').text(reobj.uAddress);
						$('#ownickname').val(unescape(reobj.nickName));
						
				}
			}

}


function ExeConstract(callfun,sendvalue,cargs){
	if(typeof(webExtensionWallet) === "undefined"){
		alert('温馨提醒：您还未安装NAS钱包插件！目前只支持PC端chrome浏览器上使用！');
}else{
	var to = dappAddress;
			var value = sendvalue;
			var callFunction = callfun;
			var callArgs = cargs; 
			nebPay.call(to, value, callFunction, callArgs, {
				listener: returnNuoNuo
			});
				var intervalQuery;
				var intervalNumber=1;
				
					   function funcIntervalQueryHash(shash) {
						var nebjs=neb.api;
						nebjs.getTransactionReceipt({
							hash:shash})
							.then(function (resp) {
								intervalNumber++;
								var progwith=intervalNumber*20;
								if(progwith>100){progwith=100;}
								$('#modalprogwidth').css('width',progwith.toString()+'%');
								if(resp.status==1){
									clearInterval(intervalQuery);
									$('#modalprog').css('display','none');
									if(callfun=="AccountManageModi"){
										alert("昵称修改成功");
									}
									if(callfun=="TakeNo"){
										$('#usertakeno').css('display','none');
										$('#mydrownospan').css('display','block');
										$('#mydrownospantxt').text(resp.execute_result);
										getTiebainfo();
									}
									if(callfun=="TiebaManage"){
										getAllMyTiebaList();
										$('#jq-alert').css('display','none');
									}
									if(callfun=="SellTieba"){
										getAllListSales();
										getAllSellTiebaList();
										$('#jq-alert-sell').css('display','none');
										alert('购买成功，请回到“贴吧广场”，在“我的贴吧”里查看');
									}
									if(callfun=="BuyTieba"){
										getAllMyTiebaList();
										getAllSellTiebaList();
										$('#jq-alert-sell').css('display','none');
									}
																							
								}
								if(resp.status==0){
									clearInterval(intervalQuery);
											$('#modalprog').css('display','none');
											$('#modaltext').text('正在进行区块打包确认，请稍候...');
											alert(resp.execute_error);
								}
							})
							.catch(function (err) {
								console.log(err);
							});
						}
					

			function returnNuoNuo(resp) {
				var strresp=JSON.stringify(resp);
				if(strresp.indexOf("txhash")!=-1){
					$('#modalprog').css('display','block');
					if(callfun=="TakeNo"){
						$('#modaltext').text('正在链上领取号码，请稍候...');
					}
					if(callfun=="AccountManageModi"){
						$('#modaltext').text('正在修改昵称，请稍候...');
					}
					if(callfun=="TiebaManage"){
						$('#modaltext').text('正在提交贴吧信息，请稍候...');
					}
					if(callfun=="SellTieba"){
						$('#modaltext').text('正在修改出售信息，请稍候...');
					}
					if(callfun=="BuyTieba"){
						$('#modaltext').text('正在进行贴吧交易，请稍候...');
					}
							intervalQuery = setInterval(function(){
								funcIntervalQueryHash(resp.txhash);
								},5000);
				}
			}
}
}


$('#modinickname').click(function(){
	var ownickname=$('#ownickname').val();
	if(ownickname.length>20){
		alert('昵称太长了，不要超过20个字');
		return;
	}
	if(ownickname.length<3){
		alert('昵称太短了，不要少于3个字');
		return;
	}
	ExeConstract("AccountManageModi","0",'["'+escape(ownickname)+'"]');

});

$('#usertakeno').click(function(){
	ExeConstract("TakeNo","0",'[]');
});







})