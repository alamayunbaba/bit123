$(document).ready(function(){

var dappAddress = "n1ijrrcSM8Q8JtZpHg3FLWUhQhVCDZh6Y19";
	var NebPay = require("nebpay");
    var nebPay = new NebPay();

	var nebulas = require("nebulas"),
        Account = nebulas.Account,
        neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

getAllUserTiebaList();

function getAllUserTiebaList(){
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
				cbduserSearch(resp)
			}).catch(function (err) {
				console.log("error:" + err.message)
			});

			function cbduserSearch(resp) {
				var result = resp.result;
				if(result=="null" || result==null || result=="" || result.indexOf("rror:")!=-1){
						
					
				}else{
					var tbobj=jQuery.parseJSON(result);
					var careatetbArr=new Array();
					var mytbhtml='<div class="3u 6u(medium) 12u$(small)"><div id="sidebar"><section><ul class="style2">';
					tbobj.forEach(function(value,index){
						var tbinfo=value.tbinfo;
						var tbId=tbinfo.tbId;
						var tbName=tbinfo.tbName;
						if(tbName.length>0){
							careatetbArr.push(tbinfo);
						}
					});
					var totaltb=careatetbArr.length;
					var pagesize = totaltb % 4 == 0 ? totaltb / 4 : Math.ceil(totaltb / 4);
					var pi=0;
					careatetbArr.forEach(function(value,index){
						var tbId=value.tbId;
						var tbName=unescape(value.tbName);
						if(pi<pagesize){
							mytbhtml=mytbhtml+'<li><a href="javascript:void(0);">'+tbName+'</a></li>';
						}
						if(pi==pagesize){
							mytbhtml=mytbhtml+'</ul></section></div></div><div class="3u 6u(medium) 12u$(small)"><div id="sidebar"><section><ul class="style2"><li><a href="javascript:void(0);">'+tbName+'</a></li>';
							pi=0;
						}
						pi++;
					});
					mytbhtml=mytbhtml+'</ul></section></div></div>';
					$('#alltiebadiv').html(mytbhtml);
					
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



function ExeConstract(callfun,sendvalue,cargs){
	if(typeof(webExtensionWallet) === "undefined"){
		alert('温馨提醒：您还未安装NAS钱包插件！');
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
										getAllMyTiebaList();
										getAllSellTiebaList();
										$('#jq-alert-sell').css('display','none');
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



})