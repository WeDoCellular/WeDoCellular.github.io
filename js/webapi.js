// function isObject(obj){
//    return obj && (typeof obj === "object");
// }

// function ajax(url,opts){
// 	if (opts.type==undefined) opts.type=opts.data?'POST':'GET';
// 	opts._success = opts.success;
// 	delete opts.success;
// 	return $.ajax(url,opts).
// 		done(function(xml,textStatus,jqXHR){
// 			var code=$(xml).find('data result code');
// 			if (code.length) {
// 				var code=code.text();
// 				if (code==0){
// 					if (opts._success instanceof Function)
// 						opts._success(this,$(xml).find('data html').text(),xml);
// 				} else {
// 					if (opts.fail instanceof Function) {
// 						opts.fail(this,$(xml).find('data result msg').text(),xml,jqXHR);
// 					}
// 					else {
// 						if (typeof bootbox != "undefined")
// 							bootbox.alert('<h3 class="text-red">Request Failed</h3><p>ERROR: '+$(xml).find('data result msg').text()+'</p>');
// 						else
// 							alert('ERROR: ' + $(xml).find('data result msg').text());
// 					}	
// 				}
// 			} else {
// 				//alert('Invalid Response:\n-------------------------------\n'+jqXHR.responseText);
// 			}}
// 		).fail(function(jqXHR,textStatus,errorThrown){
// 			if (opts.error instanceof Function) opts.error(this,jqXHR);
// 			else if (opts.fail instanceof Function) 
// 				opts.fail(this,jqXHR.status+': '+jqXHR.statusText,null,jqXHR);
// 			//else alert('Request failed!\nStatus: '+textStatus+'\nError: '+errorThrown);
// 		});
// }

// function post(url,data,opts){
// 	if (!isObject(opts)) opts={};
// 	if (!isObject(opts.context)) opts.context={};
// 	opts.method='POST';
// 	opts.data=data;
// 	return ajax(url,opts);
// }


// var RC = RC || {
// 	Utils: {
// 		isString: function(v){ return v && (typeof v === 'string'); },
// 		isObject: function(v){ return v && (typeof v === 'object'); },
// 		isFunction: function(v){ return v && (typeof v === 'function'); },
		
// 		clickOnEnter: function(k,t){ $(k).keyup(function(event){if(event.keyCode == 13){$(t).click();}});},
// 		scrollIntoView: function(s,o){ $('html,body').animate({ scrollTop: $(s).offset().top}, 'slow'); }
// 	},
// 	Form: {
// 		displayErrors: function(c,h,x,jqXHR) { formError(c,h,x,jqXHR); },
// 		clearErrors: function(f) { f.find('.auto-error').remove(); },
// 		serialize: function(f) { return f.serialize(); },
// 	},
// 	Server: {
// 		State: {
// 			get: function(o) {
// 				ajax('/state/ops/get',{context:o.context,success:function(c,h,x){ if(c.options.success) c.options.success(c,x); },fail:o.failure});
// 			}	
// 		},
// 		Cart: {
// 			// params
// 			// - productId
// 			// - quantity
// 			// - variantId
// 			// - customizationId
// 			// - kitId
// 			// options
// 			// - success
// 			// - failure
// 			add: function(p,o) {
// 				var req='/webapi/cart/add/'+p.productId;
// 				var data = '';
// 				if("post" in o) data=o.post;
// 				if("quantity" in p) req+='/quantity/'+p.quantity;
// 				if("variantId" in p) req+='/variant/'+p.variantId;
// 				if("customizationId" in p) req+='/customization/'+p.customizationId;
// 				if("kitId" in p) req+='/kit/'+p.kitId;
// 				post(req,data,{context:o.context,success:o.success,fail:o.failure});
// 			},
// 			update: function(p,o) {
// 				var req='/webapi/cart/update';
// 				if("itemId" in p) req+='/'+p.itemId;
// 				if("quantity" in p) req+='/quantity/'+p.quantity;
// 				var data = '';
// 				if("post" in o) data=o.post;
// 				post(req,data,{context:o.context,success:o.success,fail:o.failure});
// 			},
// 			remove: function(p,o) {
// 				post('/webapi/cart/remove/'+p.itemId,'',{context:o.context,success:o.success,fail:o.failure});
// 			},
// 			clear: function(p,o) {
// 				post('/webapi/cart/clear','',{context:o.context,success:o.success,fail:o.failure});
// 			},
// 			addCoupon: function(p,o) {
// 				function processResponse(success,c,h,x) {
// 					var r=null;
// 					var m=null;
// 					var e=null;
// 					if(success==0){
// 						r = -1;
// 						m = 'Failed to add coupon.';
// 					} else {
// 						r=$(x).find('data operation result').text(); 
// 						m=$(x).find('data operation message').text(); 
// 						e=$(x).find('data operation elegibility').text(); 
// 					}
// 					if((r==0) && c.options.success) c.options.success(r,m,{});
// 					else if (c.options.failure) c.options.failure(r,m,e,{});
// 				}

// 				post('/webapi/cart/voucher/add/'+p.code,'',{ context:{options:o},
// 					success:function(c,h,x){ processResponse(1,c,h,x); },
// 					fail:function(c,h,x){ processResponse(0,c,h,x); }});
// 			},
// 			removeCoupon: function(p,o) {
// 				post('/webapi/cart/voucher/remove/'+p.code,'',{context:o.context,success:o.success,fail:o.failure});
// 			},
// 			viewBlock: function(p,o) {
// 				var req='/webapi/cart/view/block/'+p.template;
// 				if("action" in p) 
// 				{
// 					req+='/'+p.action;
// 					if(p.action=='add') req+='/'+p.productId;
// 					if(p.action=='update' || p.action=='remove') req+='/'+p.itemId;
// 					if("quantity" in p) req+='/quantity/'+p.quantity;
// 					if("variantId" in p) req+='/variant/'+p.variantId;
// 					if("customizationId" in p) req+='/customization/'+p.customizationId;
// 					if("kitId" in p) req+='/kit/'+p.kitId;
// 				}	
// 				get(req,_arContainer,{context:{target:o.target,scrollIntoView:true}});
// 			},
// 			checkout: function(p,o) {
// 				post('/webapi/checkout/cart','',{context:{options:o},success:function(c,h,x){ var key=$(x).find('data unique_key'); if(c.options.success) c.options.success(key.text()); }, fail:o.failure});
// 			},
// 		},
// 		Wishlist: {
// 			create: function(p,o) {
// 				post('/webapi/wishlist/create',p,{context:o.context, success:o.success, fail:o.failure});
// 			},
// 			update: function(ref,p,o) {
// 				post('/webapi/wishlist/update/'+ref,p,{context:o.context, success:o.success, fail:o.failure});
// 			},
// 			remove: function(ref,p,o) {
// 				post('/webapi/wishlist/remove/'+ref,p,{context:o.context, success:o.success, fail:o.failure});
// 			},
// 			copyToCart: function(ref,p,o) {
// 				post('/webapi/wishlist/copy/'+ref+'/cart',p,{context:o.context, success:o.success, fail:o.failure});
// 			},
// 			copyToWishlist: function(ref,target,p,o) {
// 				post('/webapi/wishlist/copy/'+ref+'/wishlist/'+target,p,{context:o.context, success:o.success, fail:o.failure});
// 			},
// 			email: function(ref,tpl,p,o) {
// 				post('/webapi/wishlist/email/'+ref+(tpl ? '/'+tpl : '' ),p,{context:o.context, success:o.success, fail:o.failure});
// 			},
// 			clear: function(ref,p,o) {
// 				post('/webapi/wishlist/clear/'+ref,p,{context:o.context, success:o.success, fail:o.failure});
// 			},
// 			Item: {				
// 				add: function(ref,p,o){
// 					var req='/webapi/wishlist/item/add/'+ref+'/'+p.productId;
// 					var data = '';
// 					if("post" in o) data=o.post;
// 					if("quantity" in p) req+='/quantity/'+p.quantity;
// 					if("variantId" in p) req+='/variant/'+p.variantId;
// 					if("customizationId" in p) req+='/customization/'+p.customizationId;
// 					if("kitId" in p) req+='/kit/'+p.kitId;
// 					post(req,data,{context:o.context,success:function(c,h,x){ var wlId=$(x).find('data wishlist_id'); var iid=$(x).find('data item_id'); if(o.success) o.success(wlId.text(), iid.text()); },fail:o.failure});
// 				},
// 				update: function(ref,p,o){
// 					var req='/webapi/wishlist/item/update/'+ref;
// 					if("itemId" in p) req+='/'+p.itemId;
// 					if("quantity" in p) req+='/quantity/'+p.quantity;
// 					var data = '';
// 					if("post" in o) data=o.post;
// 					post(req,data,{context:o.context,success:o.success,fail:o.failure});
// 				},
// 				remove: function(ref,p,o){
// 					post('/webapi/wishlist/item/remove/'+ref+'/'+p.itemId,'',{context:o.context,success:o.success,fail:o.failure});
// 				},
// 			},
// 			checkout: function(ref,p,o) {
// 				post('/webapi/checkout/wishlist/'+ref,'',{context:{options:o},success:function(c,h,x){ var key=$(x).find('data unique_key'); if(c.options.success) c.options.success(key.text()); }, fail:o.failure});
// 			},
// 	  	},
// 		Enquiry: {
// 			// m - mode
// 			// - contact
// 			// - cart
// 			// - product
// 			create: function(m,p,o){
// 				post('/webapi/account/enquiry/create/'+m,p,{success:o.success, fail:o.failure});
// 			},
// 			postMessage: function(id,p,o){
// 				post('/webapi/account/enquiry/post/'+id,p,{context:o.context,success:o.success,fail:o.failure});
// 			},
// 			checkout: function(id,p,o) {
// 				var url=id;
// 				if("parentId" in p) url+='/'+p.parentId;
// 				var data = '';
// 				if("post" in o) data=o.post;
// 				post('/webapi/checkout/enquiry/'+url,data,{context:{options:o},success:function(c,h,x){ var key=$(x).find('data unique_key'); if(c.options.success) c.options.success(key.text()); }});
// 			},
// 			Documents: {
// 				add: function(id,file,o){
// 					var xhr = new XMLHttpRequest();
// 					var fd = new FormData();
// 					xhr.open("POST", '/webapi/account/enquiry/documents/add/'+id, true);
// 					xhr.onreadystatechange = function() {
// 						if (xhr.readyState == 4) 
// 						{
// 							if( xhr.status != 200 )
// 							{
// 								if( o.failure )
// 									o.failure( id, file, xhr, xhr.responseText == null ? null : JSON.parse(xhr.responseText) );
// 							}	
// 							else
// 							{
// 								if( o.success )
// 									o.success( id, file, xhr, xhr.responseText == null ? null : JSON.parse(xhr.responseText) );
// 							}
// 						}
// 					}
// 					fd.append("upload_file", file);
// 					xhr.send(fd);
// 				},
// 			},
// 		},
// 		SalesOrder: {				 
// 			postMessage: function(id,p,o){
// 				post('/webapi/account/order/post/'+id,p,{context:o.context,success:o.success,fail:o.failure});
// 			},
// 			setPaymentOption: function(id,p,o){
// 				post('/webapi/account/order/setpaymenttype/'+id,p,{context:o.context,success:o.success,fail:o.failure});
// 			},
// 			Documents: {
// 				add: function(id,file,o){
// 					var xhr = new XMLHttpRequest();
// 					var fd = new FormData();
// 					xhr.open("POST", '/webapi/account/order/documents/add/'+id, true);
// 					xhr.onreadystatechange = function() {
// 						if (xhr.readyState == 4) 
// 						{
// 							if( xhr.status != 200 )
// 							{
// 								if( o.failure )
// 									o.failure( id, file, xhr, xhr.responseText == null ? null : JSON.parse(xhr.responseText) );
// 							}	
// 							else
// 							{
// 								if( o.success )
// 									o.success( id, file, xhr, xhr.responseText == null ? null : JSON.parse(xhr.responseText) );
// 							}
// 						}
// 					}
// 					fd.append("upload_file", file);
// 					xhr.send(fd);
// 				},
// 			},
// 		},
// 		Account: {
// 			create: function(p,o){
// 				post('/auth/register',p,{success:o.success, fail:o.failure});
// 			},
// 			// params:
// 			// - username (string)
// 			// - password (string)
// 			// opts:
// 			// - success (callback)
// 			// - failure (callback)
// 			login: function(p,o){
// 				post('/auth/login',p,{success:o.success, fail:o.failure});
// 			},
// 			logout: function(p,o){
// 				post('/auth/logout',p,{success:o.success, fail:o.failure});
// 			},
// 			passwordReset: function(p,o){
// 				post('/webapi/account/password/reset',p,{success:o.success, fail:o.failure});
// 			},
// 			passwordChange: function(p,o){
// 				post('/webapi/account/password/change',p,{success:o.success, fail:o.failure});
// 			},
// 			subscribe: function(p,o){
// 				post('/webapi/account/subscription/subscribe',p,{success:o.success, fail:o.failure});
// 			},
// 			unsubscribe: function(p,o){
// 				post('/webapi/account/subscription/unsubscribe/'+p.id,'',{success:o.success, fail:o.failure});
// 			},
// 			update: function(p,o){
// 				post('/webapi/account/update/general',p,{success:o.success, fail:o.failure});
// 			},
// 			Notification: {				
// 				add: function(p,o){
// 					post('/webapi/account/notification/add',p,{context:{options:o},success:o.success, fail:o.failure});
// 				},
// 				update: function(id,p,o){
// 					post('/webapi/account/notification/update/'+id,p,{context:{options:o},success:o.success, fail:o.failure});
// 				},
// 				remove: function(id,p,o){
// 					post('/webapi/account/notification/remove/'+id,p,{context:{options:o},success:o.success, fail:o.failure});
// 				},
// 			},
// 			Address: {				
// 				add: function(p,o){
// 					post('/webapi/account/update/address/add',o.post,{success:o.success, fail:o.failure});
// 				},
// 				update: function(p,o){
// 					post('/webapi/account/update/address/update/'+p.addressId,o.post,{success:o.success, fail:o.failure});
// 				},
// 				remove: function(p,o){
// 					post('/webapi/account/update/address/remove/'+p.addressId,{},{success:o.success, fail:o.failure});
// 				},
// 			},
// 			addPhone: function(){
// 			},
// 			updatePhone: function(){
// 			},
// 			removePhone: function(){
// 			},
// 			addEmailAddress: function(){
// 			},
// 			updateEmailAddress: function(){
// 			},
// 			removeEmailAddress: function(){
// 			},
// 			Verification: {
// 				request: function(p,o){
// 					post('/webapi/account/verification/request/'+encodeURIComponent(p.type)+'/'+encodeURIComponent(p.value),{},{success:o.success, fail:o.failure});
// 				},
// 				complete: function(uid,p,o){
// 					post('/webapi/account/verification/complete/'+encodeURIComponent(uid),p,{success:o.success, fail:o.failure});
// 				},
// 			},
// 			Documents: {
// 				add: function(file,o){
// 					var xhr = new XMLHttpRequest();
// 					var fd = new FormData();
// 					xhr.open("POST", '/webapi/account/documents/add', true);
// 					xhr.onreadystatechange = function() {
// 						if (xhr.readyState == 4) 
// 						{
// 							if( xhr.status != 200 )
// 							{
// 								if( o.failure )
// 									o.failure( file, xhr, xhr.responseText == null ? null : JSON.parse(xhr.responseText) );
// 							}	
// 							else
// 							{
// 								if( o.success )
// 									o.success( file, xhr, xhr.responseText == null ? null : JSON.parse(xhr.responseText) );
// 							}
// 						}
// 					}
// 					fd.append("upload_file", file);
// 					if( 'data' in o ) {
// 						for( const key in o.data ) {
// 							fd.append( key, o.data[key] );
// 						}
// 					}
// 					xhr.send(fd);
// 				},
// 			},
// 			// RC.Server.Account.paymentForm(100.0,null,{target:'#paymentform-div'});
// 			paymentForm: function(amount,paymentType,o){
// 				post('/webapi/account/payment/gettoken','payment_amount='+amount+'&payment_type_id='+paymentType,{success:function(c,h,x){ 
// 					var token=$(x).find('data payment_token').text(); 
// 					var code=$(x).find('data payment_code').text();
// 					var amount=$(x).find('data payment_amount').text();

// 					var ok=true;
// 					if ($.isFunction(o.success))
// 						ok=o.success(code,amount,token);
// 					if (code=='pay' && ok && o.target){
// 						var url='/payment/action/'+token+'/pay-input';
// 						ajax(url, {success:function(c,h,x){
// 							$(o.target).html(h);
// 						}});
// 					}
// 				}, fail:o.failure});
// 			},
// 		},
// 		Visitor: {
// 			Address: {				
// 				update: function(p,o){
// 					post('/webapi/visitor/address/update',o.post,{success:o.success, fail:o.failure});
// 				},
// 			},
// 			Data: {
// 				update: function(p,o){
// 					var fields = [];	
// 					var data = {};
// 					$.each( p, function( key, value ) {
// 						fields.push( key );
// 						if(value !== null)
// 							data[ 'data_'+key ] = value;
// 					} );
// 					data.fields = fields.join();
// 					post('/webapi/visitor/data/update',$.param(data),{context:o.context, success:o.success, fail:o.failure});
// 				},	
// 			},
// 	 	},
// 		Checkout: {
// 			save: function(id,p,o){
// 				post('/webapi/checkout/save/'+id,p,{success:o.success, fail:o.failure});
// 			},
// 			complete: function(id,p,o){
// 				post('/webapi/checkout/complete/'+id,p,{
// 					context:{options:o}, 
// 					success:function(c,h,x){ if(c.options.success) c.options.success($(x).find('data orderId').text(),c,x); }, 
// 					fail:function(c,m,x,xhr) { 
// 						var scode = parseInt($(x).find('data result code').text());
// 						if ( scode === 101 && c.options.reject ) {
// 							var gerrs = [];
// 							var ierrs = [];
// 							var global = $(x).find('data errors global');
// 							if (global.size()) {
// 								var ierrors = global.find('errors error');
// 								ierrors.each(function(eix){
// 									var terr = {};
// 									$(this).children().each(function(cix){
// 										terr[this.nodeName] = $(this).text();
// 									});
// 									gerrs.push(terr);
// 								});
// 							}
// 							var items = $(x).find('data errors items');
// 							if (items.size()) {
// 								items.each(function(ix){
// 									var iid = parseInt($(this).find('id').text());
// 									if(!isNaN(iid)) {
// 										var aerr = [];
// 										var ierrors = $(this).find('errors error');
// 										ierrors.each(function(eix){
// 											var terr = {};
// 											$(this).children().each(function(cix){
// 												terr[this.nodeName] = $(this).text();
// 											});
// 											aerr.push(terr);
// 										});
// 										ierrs.push({ id: iid, errors: aerr });
// 									}
// 								});
// 							}
// 							if(c.options.reject) c.options.reject(c,m,gerrs,ierrs); 
// 						}
// 						else
// 							if(c.options.failure) c.options.failure(c,m,x,xhr); 
// 					},
// 				});
// 			},
// 			saveShippingAddress: function(id,p,o) {
// 				post('/webapi/checkout/save_shipping_address/'+id,p,{success:o.success, fail:o.failure});
// 		   	},
// 			addCoupon: function(id,p,o) {
// 				function processResponse(success,c,h,x) {
// 					var r=null;
// 					var m=null;
// 					var e=null;
// 					if(success==0){
// 						r = -1;
// 						m = 'Failed to add coupon.';
// 					} else {
// 						r=$(x).find('data operation result').text(); 
// 						m=$(x).find('data operation message').text(); 
// 						e=$(x).find('data operation elegibility').text(); 
// 					}
// 					if((r==0) && c.options.success) c.options.success(r,m,{});
// 					else if (c.options.failure) c.options.failure(r,m,e,{});
// 				}

// 				post('/webapi/checkout/voucher/'+id+'/add/'+p.code,'',{ context:{options:o},
// 					success:function(c,h,x){ processResponse(1,c,h,x); },
// 					fail:function(c,h,x){ processResponse(0,c,h,x); }});
// 			},
// 			removeCoupon: function(id,p,o) {
// 				post('/webapi/checkout/voucher/'+id+'/remove/'+p.code,'',{context:o.context,success:o.success,fail:o.failure});
// 			},
// 		},
// 		Blog: {
// 			Article: {
// 				Comment: {
// 					post: function(aid,rtid,p,o){
// 						var url=aid;
// 						if(rtid) url+='/'+rtid;
// 						post('/webapi/blog/article/comment/post/'+url,p,{
// 							context:{options:o},
// 							success:function(c,h,x){ if(c.options.success) c.options.success($(x).find('data commentId').text()); }, 
// 							fail:o.failure
// 						});
// 					},
// 					update: function(cid,p,o){
// 						post('/webapi/blog/article/comment/update/'+cid,p,{
// 							context:{options:o},
// 							success:o.success, 
// 							fail:o.failure
// 						});
// 					},
// 				},
// 			}
// 		},
// 		Product: {
// 			search: function(q,o){
// 				$.getJSON('/webapi/product/search?q='+encodeURIComponent(q))
// 					.done(function(data){
// 						if(o.success) o.success(data);
// 					})
// 					.fail(function(){
// 						if(o.failure) o.failure();
// 					});
// 			},	
// 			Manage: {
// 				create: function(p,o){
// 					post('/webapi/product/manage/create',p,{
// 						context:{options:o},
// 						success:function(c,h,x){ if(c.options.success) c.options.success($(x).find('data productId').text()); }, 
// 						fail:o.failure
// 					});
// 				},
// 				update: function(id,p,o){
// 					post('/webapi/product/manage/update/'+id,p,{
// 						context:{options:o},
// 						success:o.success, 
// 						fail:o.failure
// 					});
// 				},
// 				Images: {
// 					add: function(id,file,o){
// 						var xhr = new XMLHttpRequest();
// 						var fd = new FormData();
// 						xhr.open("POST", '/webapi/product/manage/image/add/'+id, true);
// 						xhr.onreadystatechange = function() {
// 							if (xhr.readyState == 4) 
// 							{
// 								if( xhr.status != 200 )
// 								{
// 									if( o.failure )
// 										o.failure( id, file, xhr, xhr.responseText );
// 								}	
// 								else
// 								{
// 									if( o.success )
// 										o.success( id, file, xhr, xhr.responseText == null ? null : JSON.parse(xhr.responseText) );
// 								}
// 							}
// 						}
// 						fd.append("upload_file", file);
// 						xhr.send(fd);
// 					},
// 					remove: function(id,iid,o){
// 						post('/webapi/product/manage/image/remove/'+id+'/'+iid,{},{success:o.success, fail:o.failure});
// 					},
// 				},
// 			},
// 			Review: {				
// 				post: function(p,o){
// 					post('/webapi/product/review/post',p,{
// 						context:{options:o},
// 						success:function(c,h,x){ if(c.options.success) c.options.success($(x).find('data reviewId').text()); }, 
// 						fail:o.failure
// 					});
// 				},
// 				update: function(id,p,o){
// 					post('/webapi/product/review/update/'+id,p,{
// 						context:{options:o},
// 						success:o.success, 
// 						fail:o.failure
// 					});
// 				},
// 			},
// 	 	},
// 		Coupon: {
// 			create: function(ref,p,o){
// 				post('/webapi/coupon/create/'+ref,p,{
// 					context:{options:o},
// 					success:function(c,h,x){ if(c.options.success) c.options.success({ code: $(x).find('data coupon code').text() },c,h,x); }, 
// 					fail:o.failure
// 				});
// 			},
// 		},	
// 		Extension: {
// 			post: function(ext,action,p,o){
// 				post('/webapi/extension/post/'+ext+'/'+action,p,{
// 					context:{options:o},
// 					success:o.success, 
// 					fail:o.failure
// 				});
// 			},
// 	 	},
// 		Session: {
// 			Window: {
// 				open: function(p,o){
// 					post('/webapi/session/window/open',p,{context:o.context, success:o.success, fail:o.failure});
// 				},	
// 				close: function(p,o){
// 					post('/webapi/session/window/close',p,{context:o.context, success:o.success, fail:o.failure});
// 				},	
// 			},
// 			Currency: {
// 				set: function(code,o){
// 					post('/webapi/session/set/currency/'+code,{},{context:o.context, success:o.success, fail:o.failure});
// 				},	
// 			},
// 			Locale: {
// 				set: function(code,o){
// 					post('/webapi/session/set/locale/'+code,{},{context:o.context, success:o.success, fail:o.failure});
// 				},	
// 			},
// 			Data: {
// 				update: function(p,o){
// 					var fields = [];	
// 					var data = {};
// 					$.each( p, function( key, value ) {
// 						fields.push( key );
// 						if(value !== null)
// 							data[ 'data_'+key ] = value;
// 					} );
// 					data.fields = fields.join();
// 					post('/webapi/session/data/update',$.param(data),{context:o.context, success:o.success, fail:o.failure});
// 				},	
// 			},
// 		},	
// 		Do: {
// 			post: function(url,p,o){
// 				post(url,p,{success:o.success, fail:o.failure});
// 			},
// 		},
// 	},
// };

